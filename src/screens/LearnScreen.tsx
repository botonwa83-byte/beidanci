import React, {useState, useCallback, useMemo, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {theme, useAppTheme, ThemeColors} from '../theme';
import {useEntitlement} from '../data/useEntitlement';
import {UserProgress, SessionStep, DailyMission, Word} from '../data/types';
import {
  loadProgress,
  saveProgress,
  getTodayMission,
  buildLearningSession,
  markWordLearned,
  markWordHarvested,
  markRootLearned,
  markQuizDone,
  finishDailySession,
  createStudyPlan,
  getEstimatedDays,
  getOverallStats,
  generateNextBatch,
} from '../data/learningLogic';
import {
  allWords,
  coreRoots,
  getWordsByRoot,
  getFullMeaning,
  levels,
} from '../data/wordDatabase';
import {
  computeDecipherPower,
  getHarvestBatch,
  getKnownMorphemes,
  getMorphemeKey,
  getShowcaseWords,
} from '../data/decipherPower';
import {getFamilyWords} from '../data/wordFamilies';
import {speak} from '../utils/speech';

type AppMode = 'dashboard' | 'setup' | 'session' | 'harvest';

// 非会员免费额度：学完第 1 级「入门」即到顶（其余需解锁完整版）
const FREE_WORD_LIMIT = levels[0].targetWords;

export const LearnScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {colors} = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const {isPremium} = useEntitlement();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [mission, setMission] = useState<DailyMission | null>(null);
  const [mode, setMode] = useState<AppMode>('dashboard');

  // Session state
  const [steps, setSteps] = useState<SessionStep[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizRevealed, setQuizRevealed] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [sessionScore, setSessionScore] = useState(0);
  const [flipReview, setFlipReview] = useState(false);
  // 先猜后揭：当前生词中用户手动翻开的碎片下标 + 含义是否已揭晓
  const [revealedMorphs, setRevealedMorphs] = useState<number[]>([]);
  const [meaningShown, setMeaningShown] = useState(false);
  // 拼词工坊：当前题已选中的碎片瓦片下标
  const [buildSel, setBuildSel] = useState<number[]>([]);
  // 扫荡（收割破译力）：固定一批可破译词快速推流
  const [harvestWords, setHarvestWords] = useState<Word[]>([]);
  const [harvestIdx, setHarvestIdx] = useState(0);
  const [harvestOpen, setHarvestOpen] = useState(false);
  const [harvestGot, setHarvestGot] = useState(0);
  // session 开始时的破译力快照，结算时算"没背就解锁"了多少词
  const sessionPowerRef = useRef<{reach: number; learned: number} | null>(null);
  // Auto-advance timer for a correctly answered quiz question.
  const quizTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearQuizTimer = () => {
    if (quizTimerRef.current) {
      clearTimeout(quizTimerRef.current);
      quizTimerRef.current = null;
    }
  };

  // Setup state
  const [selectedPace, setSelectedPace] = useState(25);

  // 破译力：已知碎片集合 + 可破译词统计（progress 每变一次重算，全量 ~3500 词，开销可忽略）
  const knownMorphs = useMemo(
    () => (progress ? getKnownMorphemes(progress) : new Set<string>()),
    [progress],
  );
  const decipher = useMemo(
    () => (progress ? computeDecipherPower(progress) : null),
    [progress],
  );
  const showcase = useMemo(
    () => (decipher ? getShowcaseWords(decipher, 3) : []),
    [decipher],
  );

  const safeSave = async (p: UserProgress) => {
    try {
      await saveProgress(p);
    } catch {
      Alert.alert('保存失败', '学习进度保存失败，请重试');
    }
  };

  const reload = useCallback(async () => {
    const p = await loadProgress().catch(() => null);
    if (!p) {
      return;
    }
    setProgress(p);
    setMission(getTodayMission(p));
    if (!p.studyPlan) {
      setMode('setup');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  // Start plan
  const handleStartPlan = async () => {
    if (!progress) {
      return;
    }
    const plan = createStudyPlan(selectedPace);
    const p: UserProgress = {...progress, studyPlan: plan};
    await safeSave(p);
    setProgress(p);
    setMission(getTodayMission(p));
    setMode('dashboard');
  };

  // Start session
  const startSession = useCallback(() => {
    if (!progress || !mission) {
      return;
    }
    // 非会员学满第 1 级即拦截（复习仍可在「复习」Tab 进行）
    if (!isPremium && progress.completedWords.length >= FREE_WORD_LIMIT) {
      navigation.navigate('Paywall', {feature: '全部词库与关卡'});
      return;
    }
    const allDone =
      mission.completedNewWords.length >= mission.newWordIds.length &&
      mission.completedReviews.length >= mission.reviewWordIds.length;
    let sessionSteps: SessionStep[];
    if (allDone) {
      const nextMission = generateNextBatch(progress);
      if (
        nextMission.newWordIds.length === 0 &&
        nextMission.reviewWordIds.length === 0
      ) {
        return;
      }
      sessionSteps = buildLearningSession(nextMission, progress);
    } else {
      sessionSteps = buildLearningSession(mission, progress);
    }
    if (sessionSteps.length === 0) {
      return;
    }
    setSteps(sessionSteps);
    setStepIdx(0);
    setQuizAnswer(null);
    setQuizRevealed(false);
    setQuizIdx(0);
    setSessionScore(0);
    setFlipReview(false);
    setRevealedMorphs([]);
    setMeaningShown(false);
    setBuildSel([]);
    sessionPowerRef.current = decipher
      ? {reach: decipher.reachCount, learned: progress.completedWords.length}
      : null;
    setMode('session');
  }, [progress, mission, decipher, isPremium, navigation]);

  const nextStep = () => {
    clearQuizTimer();
    setQuizAnswer(null);
    setQuizRevealed(false);
    setQuizIdx(0);
    setFlipReview(false);
    setRevealedMorphs([]);
    setMeaningShown(false);
    setBuildSel([]);
    setStepIdx(i => i + 1);
  };

  const handleSessionComplete = async () => {
    if (!progress) {
      return;
    }
    const p = finishDailySession(progress, sessionScore);
    await safeSave(p);
    setProgress(p);
    setMission(getTodayMission(p));
    setMode('dashboard');
  };

  // 开始一批扫荡：按词频取 20 个可破译词
  const startHarvest = useCallback(() => {
    if (!decipher || decipher.decodableCount === 0) {
      return;
    }
    const batch = getHarvestBatch(decipher, 20);
    if (batch.length === 0) {
      return;
    }
    setHarvestWords(batch);
    setHarvestIdx(0);
    setHarvestOpen(false);
    setHarvestGot(0);
    setMode('harvest');
  }, [decipher]);

  // ==================== Setup Mode ====================
  if (mode === 'setup') {
    const paces = [
      {num: 15, label: '轻松', desc: '每天15词，适合保持节奏'},
      {num: 25, label: '推荐', desc: '每天25词，高效且可持续'},
      {num: 40, label: '强化', desc: '每天40词，快速突破'},
      {num: 60, label: '冲刺', desc: '每天60词，适合集中备考'},
    ];

    return (
      <View style={[styles.container, {paddingTop: insets.top}]}>
        <View style={styles.setupWrap}>
          <Text style={styles.setupTitle}>制定学习计划</Text>
          <Text style={styles.setupSub}>选择你的学习节奏，随时可以调整</Text>
          <View style={styles.paceList}>
            {paces.map(p => (
              <TouchableOpacity
                key={p.num}
                style={[
                  styles.paceCard,
                  selectedPace === p.num && styles.paceCardActive,
                ]}
                onPress={() => setSelectedPace(p.num)}
                activeOpacity={0.7}
                accessibilityLabel={`${p.label}模式，${p.desc}`}
                accessibilityRole="button"
                accessibilityState={{selected: selectedPace === p.num}}>
                <View style={styles.paceHeader}>
                  <Text
                    style={[
                      styles.paceLabel,
                      selectedPace === p.num && styles.paceLabelActive,
                    ]}>
                    {p.label}
                  </Text>
                  <Text
                    style={[
                      styles.paceNum,
                      selectedPace === p.num && styles.paceNumActive,
                    ]}>
                    {p.num}词/天
                  </Text>
                </View>
                <Text style={styles.paceDesc}>{p.desc}</Text>
                <Text style={styles.paceSub}>
                  约 {getEstimatedDays(p.num)} 天完成全部{allWords.length}词
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={styles.startBtn}
            onPress={handleStartPlan}
            activeOpacity={0.7}
            accessibilityLabel="开始学习"
            accessibilityRole="button">
            <Text style={styles.startBtnText}>开始学习</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ==================== Harvest Mode（扫荡：收割破译力） ====================
  if (mode === 'harvest') {
    const hw = harvestWords[harvestIdx];

    // 一批扫完：结算
    if (!hw) {
      const remaining = decipher?.decodableCount || 0;
      return (
        <View style={[styles.container, {paddingTop: insets.top}]}>
          <View style={styles.completeWrap}>
            <Text style={styles.completeTitle}>⚡ 扫荡完成</Text>
            <View style={styles.completeCircle}>
              <Text style={styles.completeScore}>{harvestGot}</Text>
            </View>
            <Text style={styles.completeLabel}>收进战果的词</Text>
            <Text style={styles.harvestRemainText}>
              {remaining > 0
                ? `还有 ${remaining} 个可破译词等着收割`
                : '可破译词已全部收割，去学新词根解锁更多'}
            </Text>
            {remaining > 0 && (
              <TouchableOpacity
                style={styles.startBtn}
                onPress={startHarvest}
                activeOpacity={0.7}>
                <Text style={styles.startBtnText}>再扫一批</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => setMode('dashboard')}
              activeOpacity={0.7}>
              <Text style={styles.secondaryBtnText}>返回主页</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    const advanceHarvest = () => {
      setHarvestOpen(false);
      setHarvestIdx(i => i + 1);
    };
    const handleHarvestGot = async () => {
      if (!progress) {
        return;
      }
      const p = markWordHarvested(progress, hw.id);
      await safeSave(p);
      setProgress(p);
      setHarvestGot(g => g + 1);
      advanceHarvest();
    };

    return (
      <View style={[styles.container, {paddingTop: insets.top}]}>
        <SessionHeader
          pct={((harvestIdx + 1) / harvestWords.length) * 100}
          step={harvestIdx + 1}
          total={harvestWords.length}
          label="⚡ 扫荡 · 收割破译力"
          onClose={() => setMode('dashboard')}
          styles={styles}
        />
        <ScrollView
          style={styles.sessionBody}
          contentContainerStyle={styles.sessionContent}>
          <TouchableOpacity onPress={() => speak(hw.word)} activeOpacity={0.6}>
            <Text style={styles.wordBig}>
              {hw.word} <Text style={styles.speakerIcon}>{'🔊'}</Text>
            </Text>
          </TouchableOpacity>
          {hw.phonetic ? (
            <Text style={styles.wordPhonetic}>
              {hw.phonetic} {hw.partOfSpeech}
            </Text>
          ) : (
            <Text style={styles.wordPhonetic}>{hw.partOfSpeech}</Text>
          )}

          {harvestOpen ? (
            <Text style={styles.wordMeaningBig}>{getFullMeaning(hw)}</Text>
          ) : (
            <View style={styles.guessPrompt}>
              <Text style={styles.guessPromptTitle}>⚡ 你没背过这个词</Text>
              <Text style={styles.guessPromptText}>
                但碎片你全认识——心里猜出中文，再翻开
              </Text>
            </View>
          )}

          <View style={styles.morphRow}>
            {hw.morphemes.map((m, i) => (
              <View
                key={i}
                style={[styles.morphBlock, {backgroundColor: m.color}]}>
                <Text style={styles.morphText}>{m.text}</Text>
                <Text style={styles.morphSub}>{m.meaning}</Text>
              </View>
            ))}
          </View>

          {harvestOpen && (
            <View style={styles.exCard}>
              <Text style={styles.exText}>{hw.example}</Text>
              <Text style={styles.exTrans}>{hw.translation}</Text>
            </View>
          )}
        </ScrollView>
        {harvestOpen ? (
          <View style={styles.sessionFooterRow}>
            <TouchableOpacity
              style={styles.dontKnowBtn}
              onPress={advanceHarvest}
              activeOpacity={0.7}>
              <Text style={styles.dontKnowText}>没猜到</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.knowBtn}
              onPress={handleHarvestGot}
              activeOpacity={0.7}
              accessibilityLabel="猜对了，收进战果"
              accessibilityRole="button">
              <Text style={styles.knowText}>✓ 猜对了</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.sessionFooter}>
            <TouchableOpacity
              style={styles.nextBtn}
              onPress={() => setHarvestOpen(true)}
              activeOpacity={0.7}>
              <Text style={styles.nextBtnText}>翻开答案</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  // ==================== Session Mode ====================
  if (mode === 'session' && steps.length > 0) {
    const step = steps[stepIdx];
    if (!step) {
      handleSessionComplete();
      return null;
    }
    const totalSteps = steps.length;
    const pct = ((stepIdx + 1) / totalSteps) * 100;

    // --- Word Learn ---
    if (step.type === 'word-learn') {
      const word = allWords.find(w => w.id === step.wordId);
      if (!word) {
        nextStep();
        return null;
      }
      const introRoot = step.introRootId
        ? coreRoots.find(r => r.id === step.introRootId)
        : undefined;

      // When a word introduces a brand-new root, mark that root learned too.
      const applyLearned = async (quality: number, scored: boolean) => {
        if (!progress) {
          return;
        }
        let p = markWordLearned(progress, word.id, quality);
        if (introRoot && !p.learnedRootIds.includes(introRoot.id)) {
          p = markRootLearned(p, introRoot.id);
        }
        await safeSave(p);
        setProgress(p);
        if (scored) {
          setSessionScore(s => s + 1);
        }
        nextStep();
      };
      const handleKnow = () => applyLearned(4, true);
      const handleDontKnow = () => applyLearned(2, false);

      // 先猜后揭：能拆（≥2 碎片）的词先藏住含义，让用户用碎片自己破译。
      // introRoot 的碎片在 banner 里已经教了，直接亮；用户学过的碎片也直接亮。
      const guessable = word.morphemes.length >= 2;
      const revealed = meaningShown || !guessable;
      const introKeys = new Set(
        introRoot
          ? introRoot.root
              .split('/')
              .map(v => getMorphemeKey({type: 'root', text: v.trim()}))
          : [],
      );
      const isAutoKnown = (m: (typeof word.morphemes)[number]) =>
        knownMorphs.has(getMorphemeKey(m)) || introKeys.has(getMorphemeKey(m));
      const autoKnownCount = word.morphemes.filter(isAutoKnown).length;

      return (
        <View style={[styles.container, {paddingTop: insets.top}]}>
          <SessionHeader
            pct={pct}
            step={stepIdx + 1}
            total={totalSteps}
            label={
              introRoot ? '解锁新词根' : revealed ? '学习新词' : '破译新词'
            }
            onClose={() => setMode('dashboard')}
            styles={styles}
          />
          <ScrollView
            style={styles.sessionBody}
            contentContainerStyle={styles.sessionContent}>
            {introRoot && (
              <View
                style={[
                  styles.unlockBanner,
                  {
                    backgroundColor: introRoot.color + '14',
                    borderColor: introRoot.color + '40',
                  },
                ]}>
                <Text style={[styles.unlockTag, {color: introRoot.color}]}>
                  {'🔓 新词根解锁'}
                </Text>
                <View style={styles.unlockHeadRow}>
                  <Text style={[styles.unlockRoot, {color: introRoot.color}]}>
                    {introRoot.root}
                  </Text>
                  <Text style={styles.unlockMeaning}>{introRoot.meaning}</Text>
                </View>
                <Text style={styles.unlockOrigin}>
                  {introRoot.origin} · 家族共{' '}
                  {getWordsByRoot(introRoot.id).length} 词
                </Text>
                <Text style={styles.unlockHint}>
                  下面这个词就带着它，拆开就懂 ↓
                </Text>
              </View>
            )}
            <TouchableOpacity
              onPress={() => speak(word.word)}
              activeOpacity={0.6}>
              <Text style={styles.wordBig}>
                {word.word}{' '}
                <Text style={styles.speakerIcon}>{'\uD83D\uDD0A'}</Text>
              </Text>
            </TouchableOpacity>
            {word.phonetic ? (
              <Text style={styles.wordPhonetic}>
                {word.phonetic} {word.partOfSpeech}
              </Text>
            ) : (
              <Text style={styles.wordPhonetic}>{word.partOfSpeech}</Text>
            )}

            {revealed ? (
              <Text style={styles.wordMeaningBig}>{getFullMeaning(word)}</Text>
            ) : (
              <View style={styles.guessPrompt}>
                <Text style={styles.guessPromptTitle}>🔮 先别看答案</Text>
                <Text style={styles.guessPromptText}>
                  {autoKnownCount > 0
                    ? `你已认识 ${autoKnownCount}/${word.morphemes.length} 块碎片——拼一拼，猜出它的意思`
                    : '点开下面的碎片，自己拼出它的意思'}
                </Text>
              </View>
            )}

            {word.morphemes.length > 0 && (
              <View style={styles.morphRow}>
                {word.morphemes.map((m, i) => {
                  const open =
                    revealed || revealedMorphs.includes(i) || isAutoKnown(m);
                  if (open) {
                    return (
                      <View
                        key={i}
                        style={[styles.morphBlock, {backgroundColor: m.color}]}>
                        <Text style={styles.morphText}>{m.text}</Text>
                        <Text style={styles.morphSub}>{m.meaning}</Text>
                        {!revealed && isAutoKnown(m) && (
                          <Text style={styles.morphKnownTag}>✓ 已识</Text>
                        )}
                      </View>
                    );
                  }
                  return (
                    <TouchableOpacity
                      key={i}
                      style={[styles.morphBlock, styles.morphLocked]}
                      onPress={() => setRevealedMorphs(r => [...r, i])}
                      activeOpacity={0.7}
                      accessibilityLabel={`翻开碎片 ${m.text}`}
                      accessibilityRole="button">
                      <Text style={styles.morphLockedText}>{m.text}</Text>
                      <Text style={styles.morphLockedSub}>？</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {revealed && (
              <>
                <View style={styles.assocCard}>
                  <Text style={styles.assocLabel}>联想记忆</Text>
                  <Text style={styles.assocText}>{word.associationStory}</Text>
                </View>

                <View style={styles.exCard}>
                  <Text style={styles.exText}>{word.example}</Text>
                  <Text style={styles.exTrans}>{word.translation}</Text>
                </View>
              </>
            )}
          </ScrollView>
          {revealed ? (
            <View style={styles.sessionFooterRow}>
              <TouchableOpacity
                style={styles.dontKnowBtn}
                onPress={handleDontKnow}
                activeOpacity={0.7}>
                <Text style={styles.dontKnowText}>不认识</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.knowBtn}
                onPress={handleKnow}
                activeOpacity={0.7}>
                <Text style={styles.knowText}>认识了</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.sessionFooter}>
              <TouchableOpacity
                style={styles.nextBtn}
                onPress={() => setMeaningShown(true)}
                activeOpacity={0.7}
                accessibilityLabel="揭晓含义"
                accessibilityRole="button">
                <Text style={styles.nextBtnText}>🔮 揭晓含义</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
    }

    // --- Word Family（派生带学：后缀只是衣服，一眼记一串） ---
    if (step.type === 'word-family') {
      const anchor = allWords.find(w => w.id === step.anchorId);
      const satellites = step.satelliteIds
        .map(id => allWords.find(w => w.id === id))
        .filter((w): w is Word => !!w);
      if (!anchor || satellites.length === 0) {
        nextStep();
        return null;
      }

      const handleTakeAll = async () => {
        if (!progress) {
          return;
        }
        let p = progress;
        for (const s of satellites) {
          p = markWordLearned(p, s.id, 3);
        }
        await safeSave(p);
        setProgress(p);
        setSessionScore(s => s + satellites.length);
        nextStep();
      };

      return (
        <View style={[styles.container, {paddingTop: insets.top}]}>
          <SessionHeader
            pct={pct}
            step={stepIdx + 1}
            total={totalSteps}
            label="顺手带走全家"
            onClose={() => setMode('dashboard')}
            styles={styles}
          />
          <ScrollView
            style={styles.sessionBody}
            contentContainerStyle={styles.sessionContent}>
            <View style={styles.famBanner}>
              <Text style={styles.famBannerTitle}>
                🧲 {anchor.word} 的派生家族
              </Text>
              <Text style={styles.famBannerText}>
                后缀只是衣服，词义没变——刚记住的词还热着，一眼带走一串
              </Text>
            </View>

            <View style={styles.famAnchorCard}>
              <Text style={styles.famAnchorWord}>{anchor.word}</Text>
              <Text style={styles.famAnchorMeaning}>{anchor.meaning}</Text>
            </View>

            {satellites.map(s => (
              <TouchableOpacity
                key={s.id}
                style={styles.famSatRow}
                onPress={() => speak(s.word)}
                activeOpacity={0.6}
                accessibilityLabel={`${s.word}，${s.meaning}，点击朗读`}
                accessibilityRole="button">
                <View style={styles.famSatLeft}>
                  <Text style={styles.famSatWord}>
                    {s.word} <Text style={styles.speakerIcon}>{'🔊'}</Text>
                  </Text>
                  <Text style={styles.famSatPos}>{s.partOfSpeech}</Text>
                </View>
                <Text style={styles.famSatMeaning}>{s.meaning}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.sessionFooterRow}>
            <TouchableOpacity
              style={styles.dontKnowBtn}
              onPress={nextStep}
              activeOpacity={0.7}>
              <Text style={styles.dontKnowText}>跳过</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.knowBtn}
              onPress={handleTakeAll}
              activeOpacity={0.7}
              accessibilityLabel={`全带走，${satellites.length}个词`}
              accessibilityRole="button">
              <Text style={styles.knowText}>
                全带走 +{satellites.length} 词
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // --- Quiz ---
    if (step.type === 'quiz') {
      const qs = step.questions;
      const q = qs[quizIdx];
      if (!q) {
        nextStep();
        return null;
      }

      // 拼词工坊：多选碎片，选中集合恰好 = 全部正确碎片才算对
      const isBuild = q.type === 'word-build';
      const correctTileCount = q.options.filter(o => o.isCorrect).length;
      const buildIsCorrect =
        buildSel.length === correctTileCount &&
        buildSel.every(i => q.options[i].isCorrect);

      const answeredCorrectly =
        quizRevealed &&
        (isBuild
          ? buildIsCorrect
          : quizAnswer !== null && q.options[quizAnswer].isCorrect);

      const handleQuizSelect = (idx: number) => {
        if (quizRevealed) {
          return;
        }
        if (isBuild) {
          setBuildSel(sel =>
            sel.includes(idx) ? sel.filter(i => i !== idx) : [...sel, idx],
          );
        } else {
          setQuizAnswer(idx);
        }
      };
      const handleQuizNext = async () => {
        clearQuizTimer();
        if (quizIdx < qs.length - 1) {
          setQuizIdx(i => i + 1);
          setQuizAnswer(null);
          setQuizRevealed(false);
          setBuildSel([]);
        } else {
          if (progress) {
            const p = markQuizDone(progress);
            await safeSave(p);
            setProgress(p);
          }
          nextStep();
        }
      };
      const handleQuizConfirm = () => {
        if (isBuild ? buildSel.length === 0 : quizAnswer === null) {
          return;
        }
        setQuizRevealed(true);
        const ok = isBuild
          ? buildIsCorrect
          : q.options[quizAnswer as number].isCorrect;
        if (ok) {
          setSessionScore(s => s + 1);
          // Correct → flash the green confirmation, then auto-advance.
          clearQuizTimer();
          quizTimerRef.current = setTimeout(() => {
            handleQuizNext();
          }, 650);
        }
        // Wrong → stay so the user can read the explanation, then tap 下一题.
      };

      return (
        <View style={[styles.container, {paddingTop: insets.top}]}>
          <SessionHeader
            pct={pct}
            step={stepIdx + 1}
            total={totalSteps}
            label={`测验 ${quizIdx + 1}/${qs.length}`}
            onClose={() => {
              clearQuizTimer();
              setMode('dashboard');
            }}
            styles={styles}
          />
          <ScrollView
            style={styles.sessionBody}
            contentContainerStyle={styles.sessionContent}>
            <View style={styles.quizQCard}>
              <Text style={styles.quizQType}>
                {q.type === 'root-meaning'
                  ? '词根含义'
                  : q.type === 'word-meaning'
                  ? '单词释义'
                  : q.type === 'word-build'
                  ? '拼词工坊'
                  : '词根匹配'}
              </Text>
              <Text style={styles.quizQText}>{q.question}</Text>
              {isBuild && !quizRevealed && (
                <Text style={styles.buildHint}>
                  选出能拼成这个词的全部碎片（已选 {buildSel.length} 块）
                </Text>
              )}
            </View>
            {isBuild ? (
              <View style={styles.buildRow}>
                {q.options.map((opt, idx) => {
                  const selected = buildSel.includes(idx);
                  let bg = colors.surface;
                  let border = colors.cardBorder;
                  let color = colors.textPrimary;
                  if (quizRevealed) {
                    if (opt.isCorrect) {
                      bg = colors.secondaryLight;
                      border = colors.success;
                      color = colors.success;
                    } else if (selected) {
                      bg = colors.errorBg;
                      border = colors.error;
                      color = colors.error;
                    }
                  } else if (selected) {
                    border = colors.primary;
                    color = colors.primary;
                    bg = colors.primaryLight;
                  }
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.buildTile,
                        {backgroundColor: bg, borderColor: border},
                      ]}
                      onPress={() => handleQuizSelect(idx)}
                      disabled={quizRevealed}
                      activeOpacity={0.7}
                      accessibilityLabel={`碎片 ${opt.text}`}
                      accessibilityRole="button"
                      accessibilityState={{selected}}>
                      <Text style={[styles.buildTileText, {color}]}>
                        {opt.text}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              q.options.map((opt, idx) => {
                let bg = colors.surface;
                let border = colors.cardBorder;
                let color = colors.textPrimary;
                if (quizRevealed) {
                  if (opt.isCorrect) {
                    bg = colors.secondaryLight;
                    border = colors.success;
                    color = colors.success;
                  } else if (quizAnswer === idx) {
                    bg = colors.errorBg;
                    border = colors.error;
                    color = colors.error;
                  }
                } else if (quizAnswer === idx) {
                  border = colors.primary;
                  color = colors.primary;
                  bg = colors.primaryLight;
                }
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.quizOpt,
                      {backgroundColor: bg, borderColor: border},
                    ]}
                    onPress={() => handleQuizSelect(idx)}
                    disabled={quizRevealed}
                    activeOpacity={0.7}>
                    <Text style={[styles.quizOptText, {color}]}>
                      {opt.text}
                    </Text>
                  </TouchableOpacity>
                );
              })
            )}
            {quizRevealed && (
              <View style={styles.quizExpl}>
                <Text style={styles.quizExplText}>{q.explanation}</Text>
              </View>
            )}
          </ScrollView>
          <View style={styles.sessionFooter}>
            {!quizRevealed ? (
              <TouchableOpacity
                style={[
                  styles.nextBtn,
                  (isBuild ? buildSel.length === 0 : quizAnswer === null) &&
                    styles.btnDisabled,
                ]}
                onPress={handleQuizConfirm}
                disabled={isBuild ? buildSel.length === 0 : quizAnswer === null}
                activeOpacity={0.7}>
                <Text style={styles.nextBtnText}>确认</Text>
              </TouchableOpacity>
            ) : answeredCorrectly ? (
              <View style={[styles.nextBtn, styles.quizAutoNext]}>
                <Text style={[styles.nextBtnText, {color: colors.success}]}>
                  ✓ 答对了
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.nextBtn}
                onPress={handleQuizNext}
                activeOpacity={0.7}>
                <Text style={styles.nextBtnText}>
                  {quizIdx < qs.length - 1 ? '下一题' : '继续'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    }

    // --- Review Card ---
    if (step.type === 'review-card') {
      const word = allWords.find(w => w.id === step.wordId);
      if (!word) {
        nextStep();
        return null;
      }

      const handleGrade = async (quality: number) => {
        if (!progress) {
          return;
        }
        const p = markWordLearned(progress, word.id, quality);
        await safeSave(p);
        setProgress(p);
        if (quality >= 3) {
          setSessionScore(s => s + 1);
        }
        nextStep();
      };

      return (
        <View style={[styles.container, {paddingTop: insets.top}]}>
          <SessionHeader
            pct={pct}
            step={stepIdx + 1}
            total={totalSteps}
            label="复习"
            onClose={() => setMode('dashboard')}
            styles={styles}
          />
          <View style={styles.sessionBody}>
            <View style={styles.flashCard}>
              <View style={styles.flashCardInner}>
                <TouchableOpacity
                  onPress={() => speak(word.word)}
                  activeOpacity={0.6}>
                  <Text style={styles.flashWord}>
                    {word.word}{' '}
                    <Text style={styles.speakerIcon}>{'\uD83D\uDD0A'}</Text>
                  </Text>
                </TouchableOpacity>
                {flipReview ? (
                  <>
                    <Text style={styles.flashMeaning}>
                      {getFullMeaning(word)}
                    </Text>
                    <View style={styles.flashMorphRow}>
                      {word.morphemes.map((m, i) => (
                        <Text
                          key={i}
                          style={[styles.flashMorph, {color: m.color}]}>
                          {m.text}({m.meaning})
                        </Text>
                      ))}
                    </View>
                    {/* 扩散激活：复习锚点顺带激活全家 */}
                    {getFamilyWords(word.id).length > 0 && (
                      <Text style={styles.flashFamily}>
                        🧲 全家：
                        {getFamilyWords(word.id)
                          .slice(0, 4)
                          .map(f => f.word)
                          .join(' / ')}
                      </Text>
                    )}
                  </>
                ) : (
                  <TouchableOpacity
                    style={styles.flipBtn}
                    onPress={() => setFlipReview(true)}
                    activeOpacity={0.7}>
                    <Text style={styles.flipBtnText}>点击显示释义</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
          {flipReview && (
            <View style={styles.gradeRow}>
              <TouchableOpacity
                style={[styles.gradeBtn, {backgroundColor: colors.errorBg}]}
                onPress={() => handleGrade(1)}>
                <Text style={[styles.gradeText, {color: colors.error}]}>
                  忘了
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.gradeBtn, {backgroundColor: colors.warningBg}]}
                onPress={() => handleGrade(3)}>
                <Text style={[styles.gradeText, {color: colors.warning}]}>
                  模糊
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.gradeBtn,
                  {backgroundColor: colors.secondaryLight},
                ]}
                onPress={() => handleGrade(4)}>
                <Text style={[styles.gradeText, {color: colors.success}]}>
                  记得
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.gradeBtn,
                  {backgroundColor: colors.primaryLight},
                ]}
                onPress={() => handleGrade(5)}>
                <Text style={[styles.gradeText, {color: colors.primary}]}>
                  秒杀
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
    }

    // --- Complete ---
    if (step.type === 'complete') {
      const allDone = progress?.completedWords.length === allWords.length;
      // 破译力增量：这组学习后，有多少"没背过但碎片全认识"的词被免费解锁
      const powerStart = sessionPowerRef.current;
      const directLearned =
        powerStart && progress
          ? progress.completedWords.length - powerStart.learned
          : 0;
      const freeUnlocked =
        powerStart && decipher
          ? Math.max(0, decipher.reachCount - powerStart.reach - directLearned)
          : 0;
      const handleContinue = async () => {
        await handleSessionComplete();
        if (!allDone) {
          setTimeout(() => startSession(), 100);
        }
      };

      return (
        <View style={[styles.container, {paddingTop: insets.top}]}>
          <View style={styles.completeWrap}>
            <Text style={styles.completeTitle}>
              {allDone ? '所有单词已学完!' : '本组学习完成!'}
            </Text>
            <View style={styles.completeCircle}>
              <Text style={styles.completeScore}>{sessionScore}</Text>
            </View>
            <Text style={styles.completeLabel}>掌握词数</Text>
            <View style={styles.completeSummary}>
              <View style={styles.completeStat}>
                <Text style={styles.completeStatNum}>
                  {mission?.completedNewWords.length || 0}
                </Text>
                <Text style={styles.completeStatLabel}>新词</Text>
              </View>
              <View style={styles.completeStat}>
                <Text style={[styles.completeStatNum, {color: colors.accent}]}>
                  {mission?.completedReviews.length || 0}
                </Text>
                <Text style={styles.completeStatLabel}>复习</Text>
              </View>
              <View style={styles.completeStat}>
                <Text
                  style={[styles.completeStatNum, {color: colors.secondary}]}>
                  {progress?.completedWords.length || 0}/{allWords.length}
                </Text>
                <Text style={styles.completeStatLabel}>总进度</Text>
              </View>
            </View>
            {freeUnlocked > 0 && (
              <View style={styles.unlockBonus}>
                <Text style={styles.unlockBonusTitle}>
                  🔮 破译力 +{freeUnlocked}
                </Text>
                <Text style={styles.unlockBonusText}>
                  有 {freeUnlocked} 个词你从没背过，但现在拆开就能看懂
                </Text>
              </View>
            )}
            {!allDone && (
              <TouchableOpacity
                style={styles.startBtn}
                onPress={handleContinue}
                activeOpacity={0.7}>
                <Text style={styles.startBtnText}>继续下一组</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[allDone ? styles.startBtn : styles.secondaryBtn]}
              onPress={handleSessionComplete}
              activeOpacity={0.7}>
              <Text
                style={allDone ? styles.startBtnText : styles.secondaryBtnText}>
                返回主页
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }

  // ==================== Dashboard ====================
  const stats = progress ? getOverallStats(progress) : null;
  const plan = progress?.studyPlan;
  const todayDone = mission
    ? mission.completedNewWords.length >= mission.newWordIds.length &&
      mission.completedReviews.length >= mission.reviewWordIds.length
    : false;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: 120,
        maxWidth: theme.layout.maxContentWidth,
        width: '100%',
        alignSelf: 'center',
      }}>
      {/* Header */}
      <View style={styles.dashHeader}>
        <View>
          <Text style={styles.dashTitle}>语根</Text>
          <Text style={styles.dashTitleSub}>WordRoot</Text>
        </View>
        {plan && (
          <View style={styles.dayBadge}>
            <Text style={styles.dayBadgeText}>Day {plan.currentDay}</Text>
          </View>
        )}
      </View>

      {/* Overall progress bar */}
      {stats && (
        <View style={styles.overallCard}>
          <View style={styles.overallRow}>
            <Text style={styles.overallLabel}>总进度</Text>
            <Text style={styles.overallNum}>
              {stats.learnedWords} / {stats.totalWords}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.round(
                    (stats.learnedWords / stats.totalWords) * 100,
                  )}%` as any,
                },
              ]}
            />
          </View>
          <View style={styles.overallMeta}>
            <Text style={styles.overallMetaText}>
              {stats.learnedRoots}/{stats.totalRoots} 词根
            </Text>
            <Text style={styles.overallMetaText}>{stats.streak} 天连续</Text>
            {stats.daysRemaining > 0 && (
              <Text style={styles.overallMetaText}>
                还需 {stats.daysRemaining} 天
              </Text>
            )}
          </View>
        </View>
      )}

      {/* 破译力：词根记忆法的杠杆，背 X 个词能看懂多少词 */}
      {stats && decipher && (
        <View style={styles.powerCard}>
          <View style={styles.powerHead}>
            <Text style={styles.powerTitle}>🔮 破译力</Text>
            {stats.learnedWords > 0 && decipher.decodableCount > 0 && (
              <View style={styles.powerLeverBadge}>
                <Text style={styles.powerLeverText}>
                  杠杆 ×{(decipher.reachCount / stats.learnedWords).toFixed(1)}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.powerMain}>
            已背 <Text style={styles.powerNum}>{stats.learnedWords}</Text> 词，
            能看懂 <Text style={styles.powerNum}>{decipher.reachCount}</Text> 词
          </Text>
          <Text style={styles.powerSub}>
            {decipher.decodableCount > 0
              ? `其中 ${decipher.decodableCount} 个词你没背过，但碎片全认识，拆开就懂`
              : '每学会一个词根，会有一批没背过的词自动解锁'}
          </Text>
          {showcase.length > 0 && (
            <Text style={styles.powerSample}>
              没背就能懂：{showcase.map(w => w.word).join(' · ')}
            </Text>
          )}
        </View>
      )}

      {/* Today's Mission */}
      {mission && stats && (
        <View style={styles.missionCard}>
          <Text style={styles.missionTitle}>今日任务</Text>

          <View style={styles.missionRow}>
            <View
              style={[styles.missionItem, {borderLeftColor: colors.primary}]}>
              <Text style={styles.missionItemTitle}>新词根</Text>
              <Text style={styles.missionItemNum}>
                {mission.newRoots.length}
              </Text>
              <Text style={styles.missionItemSub}>
                {mission.newRoots
                  .map(id => coreRoots.find(r => r.id === id)?.root)
                  .filter(Boolean)
                  .join(', ') || '-'}
              </Text>
            </View>
            <View
              style={[styles.missionItem, {borderLeftColor: colors.secondary}]}>
              <Text style={styles.missionItemTitle}>新单词</Text>
              <Text style={styles.missionItemNum}>
                {stats.todayNewDone}/{stats.todayNew}
              </Text>
            </View>
            <View
              style={[styles.missionItem, {borderLeftColor: colors.accent}]}>
              <Text style={styles.missionItemTitle}>复习</Text>
              <Text style={styles.missionItemNum}>
                {stats.todayReviewDone}/{stats.todayReview}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* CTA Button */}
      <TouchableOpacity
        style={[styles.ctaBtn, todayDone && styles.ctaDone]}
        onPress={startSession}
        activeOpacity={0.7}>
        <Text style={[styles.ctaText, todayDone && styles.ctaDoneText]}>
          {todayDone ? '继续学习下一组' : '开始今日学习'}
        </Text>
        {!todayDone && stats && stats.todayNew > 0 && (
          <Text style={styles.ctaSub}>
            {mission?.newRoots.length || 0}个词根 + {stats.todayNew}个新词 +{' '}
            {stats.todayReview}个复习
          </Text>
        )}
        {todayDone && stats && (
          <Text style={styles.ctaDoneSub}>
            已学 {stats.learnedWords}/{stats.totalWords} 词，还剩{' '}
            {stats.totalWords - stats.learnedWords} 词
          </Text>
        )}
      </TouchableOpacity>

      {/* 扫荡入口：把可破译词收进战果 */}
      {decipher && decipher.decodableCount > 0 && (
        <TouchableOpacity
          style={styles.harvestBtn}
          onPress={startHarvest}
          activeOpacity={0.7}
          accessibilityLabel={`扫荡，收割${decipher.decodableCount}个可破译词`}
          accessibilityRole="button">
          <Text style={styles.harvestTitle}>⚡ 扫荡 · 收割破译力</Text>
          <Text style={styles.harvestSub}>
            {decipher.decodableCount} 个词没背过但你能看懂，一分钟收一批
          </Text>
        </TouchableOpacity>
      )}

      {/* 非会员学满免费额度的解锁提示 */}
      {!isPremium &&
        progress &&
        progress.completedWords.length >= FREE_WORD_LIMIT && (
          <TouchableOpacity
            style={styles.paywallHint}
            onPress={() =>
              navigation.navigate('Paywall', {feature: '全部词库与关卡'})
            }
            activeOpacity={0.7}
            accessibilityRole="button">
            <Text style={styles.paywallHintText}>
              🔒 免费的「入门」{FREE_WORD_LIMIT} 词已学完，解锁完整版继续全部词库 ›
            </Text>
          </TouchableOpacity>
        )}

      {/* Today's roots preview */}
      {mission && mission.newRoots.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>今日词根预览</Text>
          {mission.newRoots.map(rootId => {
            const root = coreRoots.find(r => r.id === rootId);
            if (!root) {
              return null;
            }
            const familyGain = progress
              ? getWordsByRoot(root.id).filter(
                  w => !progress.completedWords.includes(w.id),
                ).length
              : 0;
            return (
              <View
                key={root.id}
                style={[styles.rootPreview, {borderLeftColor: root.color}]}>
                <View style={styles.rootPreviewHead}>
                  <Text style={[styles.rootPreviewName, {color: root.color}]}>
                    {root.root}
                  </Text>
                  <Text style={styles.rootPreviewMeaning}>{root.meaning}</Text>
                  {familyGain > 0 && (
                    <View style={styles.rootGainBadge}>
                      <Text style={styles.rootGainText}>
                        带出 {familyGain} 词
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={styles.rootPreviewWords}>
                  {root.words
                    .slice(0, 5)
                    .map(w => w.word)
                    .join(' / ')}
                  {root.words.length > 5 ? ` +${root.words.length - 5}` : ''}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Quick stats */}
      {stats && (
        <View style={styles.quickStats}>
          <View style={styles.qStat}>
            <Text style={styles.qStatNum}>{plan?.wordsPerDay || '-'}</Text>
            <Text style={styles.qStatLabel}>词/天</Text>
          </View>
          <View style={styles.qStat}>
            <Text style={[styles.qStatNum, {color: colors.secondary}]}>
              {stats.learnedRoots}
            </Text>
            <Text style={styles.qStatLabel}>已学词根</Text>
          </View>
          <View style={styles.qStat}>
            <Text style={[styles.qStatNum, {color: colors.accent}]}>
              {stats.streak}
            </Text>
            <Text style={styles.qStatLabel}>连续天数</Text>
          </View>
          <View style={styles.qStat}>
            <Text style={[styles.qStatNum, {color: '#C57BDB'}]}>
              {progress?.totalScore || 0}
            </Text>
            <Text style={styles.qStatLabel}>总得分</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

// ==================== Session Header Component ====================

const SessionHeader: React.FC<{
  pct: number;
  step: number;
  total: number;
  label: string;
  onClose: () => void;
  styles: ReturnType<typeof createStyles>;
}> = ({pct, step, total, label, onClose, styles}) => (
  <View style={styles.sessHead}>
    <TouchableOpacity onPress={onClose}>
      <Text style={styles.sessClose}>{'\u2715'}</Text>
    </TouchableOpacity>
    <View style={styles.sessInfo}>
      <Text style={styles.sessLabel}>{label}</Text>
      <Text style={styles.sessStep}>
        {step}/{total}
      </Text>
    </View>
    <View style={styles.sessProg}>
      <View style={[styles.sessProgFill, {width: `${pct}%`}]} />
    </View>
  </View>
);

// ==================== Styles ====================

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: colors.background},

    // Setup
    setupWrap: {
      flex: 1,
      paddingHorizontal: 24,
      justifyContent: 'center',
      maxWidth: theme.layout.maxContentWidth,
      width: '100%',
      alignSelf: 'center',
    },
    setupTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: 8,
    },
    setupSub: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 32,
    },
    paceList: {gap: 12, marginBottom: 32},
    paceCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 18,
      borderWidth: 2,
      borderColor: 'transparent',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    },
    paceCardActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight,
    },
    paceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    paceLabel: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    paceLabelActive: {color: colors.primary},
    paceNum: {fontSize: 16, fontWeight: '600', color: colors.textSecondary},
    paceNumActive: {color: colors.primary},
    paceDesc: {fontSize: 13, color: colors.textSecondary},
    paceSub: {fontSize: 12, color: colors.textTertiary, marginTop: 2},
    startBtn: {
      backgroundColor: colors.primary,
      padding: 18,
      borderRadius: 16,
      alignItems: 'center',
      shadowColor: colors.primary,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    startBtnText: {fontSize: 18, fontWeight: 'bold', color: '#FFFFFF'},

    // Dashboard
    dashHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    dashTitle: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    dashTitleSub: {
      fontSize: 11,
      color: colors.textTertiary,
      letterSpacing: 2,
    },
    dayBadge: {
      backgroundColor: colors.primary,
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 20,
      shadowColor: colors.primary,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    dayBadgeText: {fontSize: 14, fontWeight: 'bold', color: '#FFFFFF'},

    overallCard: {
      marginHorizontal: 20,
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 18,
      marginBottom: 16,
      shadowColor: '#4A6AE5',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 4,
    },
    overallRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    overallLabel: {fontSize: 14, color: colors.textSecondary},
    overallNum: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    progressBar: {
      height: 8,
      backgroundColor: colors.surfaceLight,
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: 10,
    },
    progressFill: {
      height: 8,
      backgroundColor: colors.primary,
      borderRadius: 4,
      minWidth: 0,
    },
    overallMeta: {flexDirection: 'row', gap: 16},
    overallMetaText: {fontSize: 12, color: colors.textTertiary},

    // 破译力卡片
    powerCard: {
      marginHorizontal: 20,
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 18,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#8B5CF640',
      shadowColor: '#8B5CF6',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 4,
    },
    powerHead: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    powerTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: '#8B5CF6',
      letterSpacing: 1,
    },
    powerLeverBadge: {
      backgroundColor: '#8B5CF618',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    powerLeverText: {fontSize: 12, fontWeight: '700', color: '#8B5CF6'},
    powerMain: {
      fontSize: 17,
      color: colors.textPrimary,
      marginBottom: 6,
    },
    powerNum: {fontSize: 22, fontWeight: 'bold', color: '#8B5CF6'},
    powerSub: {fontSize: 12, color: colors.textSecondary, lineHeight: 18},
    powerSample: {
      fontSize: 12,
      color: colors.textTertiary,
      marginTop: 8,
      fontStyle: 'italic',
    },

    missionCard: {
      marginHorizontal: 20,
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 18,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    },
    missionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 14,
    },
    missionRow: {flexDirection: 'row', gap: 10},
    missionItem: {
      flex: 1,
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 12,
      borderLeftWidth: 3,
    },
    missionItemTitle: {
      fontSize: 11,
      color: colors.textTertiary,
      marginBottom: 4,
    },
    missionItemNum: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 2,
    },
    missionItemSub: {fontSize: 10, color: colors.textTertiary},

    ctaBtn: {
      marginHorizontal: 20,
      backgroundColor: colors.primary,
      borderRadius: 18,
      padding: 20,
      alignItems: 'center',
      marginBottom: 24,
      shadowColor: colors.primary,
      shadowOffset: {width: 0, height: 6},
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 6,
    },
    ctaDone: {
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.success,
      shadowOpacity: 0,
    },
    ctaText: {fontSize: 20, fontWeight: 'bold', color: '#FFFFFF'},
    ctaDoneText: {color: colors.success, fontSize: 16},
    ctaSub: {fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4},
    ctaDoneSub: {fontSize: 12, color: colors.textTertiary, marginTop: 4},
    paywallHint: {
      marginHorizontal: 20,
      marginTop: -12,
      marginBottom: 24,
      backgroundColor: colors.primaryLight,
      borderRadius: 14,
      paddingVertical: 12,
      paddingHorizontal: 16,
      alignItems: 'center',
    },
    paywallHintText: {
      fontSize: 13,
      color: colors.primary,
      fontWeight: '600',
      textAlign: 'center',
    },

    // 扫荡入口（琥珀色：收割的颜色）
    harvestBtn: {
      marginHorizontal: 20,
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 18,
      alignItems: 'center',
      marginTop: -8,
      marginBottom: 24,
      borderWidth: 1.5,
      borderColor: '#F59E0B60',
      shadowColor: '#F59E0B',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 3,
    },
    harvestTitle: {fontSize: 17, fontWeight: 'bold', color: '#F59E0B'},
    harvestSub: {fontSize: 12, color: colors.textSecondary, marginTop: 4},
    harvestRemainText: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 28,
      textAlign: 'center',
    },

    section: {paddingHorizontal: 20, marginBottom: 20},
    sectionTitle: {
      fontSize: 12,
      color: colors.primary,
      marginBottom: 10,
      fontWeight: '700',
      letterSpacing: 1,
    },
    rootPreview: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 14,
      marginBottom: 10,
      borderLeftWidth: 4,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
    },
    rootPreviewHead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 6,
    },
    rootPreviewName: {fontSize: 22, fontWeight: 'bold'},
    rootPreviewMeaning: {fontSize: 15, color: colors.textPrimary, flex: 1},
    rootGainBadge: {
      backgroundColor: '#F59E0B18',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
    },
    rootGainText: {fontSize: 11, fontWeight: '700', color: '#F59E0B'},
    rootPreviewWords: {
      fontSize: 13,
      color: colors.textTertiary,
      lineHeight: 20,
    },

    quickStats: {
      flexDirection: 'row',
      marginHorizontal: 20,
      gap: 8,
      marginBottom: 20,
    },
    qStat: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 14,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
    },
    qStatNum: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 4,
    },
    qStatLabel: {fontSize: 10, color: colors.textSecondary},

    // Session common
    sessHead: {paddingHorizontal: 16, paddingVertical: 10, gap: 6},
    sessClose: {fontSize: 18, color: colors.textTertiary, width: 30},
    sessInfo: {flexDirection: 'row', justifyContent: 'space-between'},
    sessLabel: {fontSize: 13, color: colors.primary, fontWeight: '600'},
    sessStep: {fontSize: 13, color: colors.textTertiary},
    sessProg: {
      height: 4,
      backgroundColor: colors.surfaceLight,
      borderRadius: 2,
    },
    sessProgFill: {
      height: 4,
      backgroundColor: colors.primary,
      borderRadius: 2,
    },

    sessionBody: {flex: 1},
    sessionContent: {
      paddingHorizontal: 20,
      paddingBottom: 20,
      maxWidth: theme.layout.maxContentWidth,
      width: '100%',
      alignSelf: 'center',
    },
    sessionFooter: {padding: 20},
    sessionFooterRow: {flexDirection: 'row', padding: 20, gap: 12},

    nextBtn: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 16,
      alignItems: 'center',
      shadowColor: colors.primary,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    nextBtnText: {fontSize: 17, fontWeight: 'bold', color: '#FFFFFF'},
    btnDisabled: {
      backgroundColor: colors.textTertiary + '40',
      shadowOpacity: 0,
    },

    // Unlock banner (new root introduced in context, on its first word)
    unlockBanner: {
      borderRadius: 18,
      padding: 16,
      marginTop: 8,
      marginBottom: 16,
      borderWidth: 1,
    },
    unlockTag: {
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.5,
      marginBottom: 8,
    },
    unlockHeadRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 12,
      marginBottom: 4,
    },
    unlockRoot: {fontSize: 30, fontWeight: 'bold'},
    unlockMeaning: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.textPrimary,
      flex: 1,
    },
    unlockOrigin: {fontSize: 12, color: colors.textSecondary, marginBottom: 8},
    unlockHint: {fontSize: 13, color: colors.textTertiary},

    // Word learn
    wordBig: {
      fontSize: 36,
      fontWeight: 'bold',
      color: colors.textPrimary,
      textAlign: 'center',
      marginTop: 20,
      marginBottom: 4,
    },
    speakerIcon: {fontSize: 20, color: colors.textTertiary},
    wordPhonetic: {
      fontSize: 14,
      color: colors.textTertiary,
      textAlign: 'center',
      marginBottom: 12,
    },
    wordMeaningBig: {
      fontSize: 22,
      fontWeight: '600',
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: 20,
    },
    morphRow: {flexDirection: 'row', gap: 8, marginBottom: 20},
    morphBlock: {
      flex: 1,
      borderRadius: 12,
      padding: 12,
      alignItems: 'center',
      gap: 4,
    },
    morphText: {fontSize: 15, fontWeight: 'bold', color: '#FFF'},
    morphSub: {fontSize: 10, color: 'rgba(255,255,255,0.85)'},
    morphKnownTag: {
      fontSize: 9,
      fontWeight: '700',
      color: 'rgba(255,255,255,0.9)',
      backgroundColor: 'rgba(0,0,0,0.18)',
      paddingHorizontal: 6,
      paddingVertical: 1,
      borderRadius: 6,
      overflow: 'hidden',
    },
    // 未翻开的碎片：灰块 + 问号，点击翻开
    morphLocked: {
      backgroundColor: colors.surfaceLight,
      borderWidth: 1.5,
      borderColor: colors.cardBorder,
      borderStyle: 'dashed',
    },
    morphLockedText: {
      fontSize: 15,
      fontWeight: 'bold',
      color: colors.textSecondary,
    },
    morphLockedSub: {fontSize: 12, color: colors.textTertiary},

    // 先猜后揭提示
    guessPrompt: {
      backgroundColor: '#8B5CF614',
      borderRadius: 14,
      padding: 14,
      marginBottom: 20,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#8B5CF630',
    },
    guessPromptTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: '#8B5CF6',
      marginBottom: 4,
    },
    guessPromptText: {
      fontSize: 13,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 19,
    },
    assocCard: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 16,
      marginBottom: 14,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
    },
    assocLabel: {
      fontSize: 11,
      color: colors.primary,
      fontWeight: '700',
      marginBottom: 6,
      letterSpacing: 1,
    },
    assocText: {fontSize: 14, color: colors.textSecondary, lineHeight: 22},
    exCard: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 16,
      borderLeftWidth: 3,
      borderLeftColor: colors.primary,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
    },
    exText: {
      fontSize: 14,
      color: colors.textPrimary,
      fontStyle: 'italic',
      marginBottom: 6,
    },
    exTrans: {fontSize: 13, color: colors.textSecondary},

    // 派生带学（顺手带走全家）
    famBanner: {
      backgroundColor: '#F59E0B14',
      borderRadius: 14,
      padding: 14,
      marginTop: 8,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#F59E0B30',
    },
    famBannerTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: '#F59E0B',
      marginBottom: 4,
    },
    famBannerText: {
      fontSize: 12,
      color: colors.textSecondary,
      lineHeight: 18,
    },
    famAnchorCard: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 14,
      marginBottom: 12,
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: colors.primary,
    },
    famAnchorWord: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    famAnchorMeaning: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 2,
    },
    famSatRow: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 14,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
    },
    famSatLeft: {flex: 1, marginRight: 12},
    famSatWord: {fontSize: 18, fontWeight: '600', color: colors.textPrimary},
    famSatPos: {fontSize: 11, color: colors.textTertiary, marginTop: 2},
    famSatMeaning: {
      fontSize: 14,
      color: colors.textSecondary,
      flexShrink: 0,
      maxWidth: '45%',
      textAlign: 'right',
    },

    knowBtn: {
      flex: 1,
      backgroundColor: colors.success,
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
      shadowColor: colors.success,
      shadowOffset: {width: 0, height: 3},
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 3,
    },
    knowText: {fontSize: 17, fontWeight: 'bold', color: '#FFF'},
    dontKnowBtn: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: colors.cardBorder,
    },
    dontKnowText: {
      fontSize: 17,
      fontWeight: '600',
      color: colors.textSecondary,
    },

    // Quiz
    quizQCard: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 20,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    },
    quizQType: {
      fontSize: 11,
      color: colors.primary,
      fontWeight: '700',
      letterSpacing: 1,
      marginBottom: 8,
    },
    quizQText: {fontSize: 18, color: colors.textPrimary, lineHeight: 28},
    quizOpt: {
      padding: 16,
      borderRadius: 14,
      borderWidth: 1.5,
      marginBottom: 10,
    },
    quizOptText: {fontSize: 16},
    quizExpl: {
      backgroundColor: colors.secondaryLight,
      borderRadius: 14,
      padding: 14,
      marginTop: 4,
    },
    quizAutoNext: {
      backgroundColor: colors.secondaryLight,
      shadowOpacity: 0,
      elevation: 0,
    },
    quizExplText: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 20,
    },

    // 拼词工坊（碎片瓦片多选）
    buildHint: {fontSize: 12, color: colors.textTertiary, marginTop: 8},
    buildRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginBottom: 10,
    },
    buildTile: {
      paddingHorizontal: 18,
      paddingVertical: 14,
      borderRadius: 14,
      borderWidth: 1.5,
      minWidth: 80,
      alignItems: 'center',
    },
    buildTileText: {fontSize: 17, fontWeight: '600'},

    // Review
    flashCard: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    flashCardInner: {
      backgroundColor: colors.surface,
      borderRadius: 24,
      padding: 32,
      alignItems: 'center',
      width: '100%',
      shadowColor: '#4A6AE5',
      shadowOffset: {width: 0, height: 6},
      shadowOpacity: 0.1,
      shadowRadius: 20,
      elevation: 6,
    },
    flashWord: {
      fontSize: 40,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 20,
    },
    flashMeaning: {
      fontSize: 24,
      color: colors.textPrimary,
      fontWeight: '600',
      marginBottom: 12,
    },
    flashMorphRow: {
      flexDirection: 'row',
      gap: 8,
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    flashMorph: {fontSize: 14, fontWeight: '500'},
    flashFamily: {
      fontSize: 13,
      color: colors.textTertiary,
      marginTop: 12,
      textAlign: 'center',
    },
    flipBtn: {
      backgroundColor: colors.primaryLight,
      paddingHorizontal: 32,
      paddingVertical: 14,
      borderRadius: 14,
    },
    flipBtnText: {fontSize: 16, color: colors.primary, fontWeight: '500'},
    gradeRow: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingBottom: 20,
      gap: 8,
    },
    gradeBtn: {flex: 1, borderRadius: 14, padding: 14, alignItems: 'center'},
    gradeText: {fontSize: 15, fontWeight: '600'},

    // Complete
    completeWrap: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      maxWidth: theme.layout.maxContentWidth,
      width: '100%',
      alignSelf: 'center',
    },
    completeTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 24,
    },
    completeCircle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
      shadowColor: colors.primary,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 4,
    },
    completeScore: {
      fontSize: 40,
      fontWeight: 'bold',
      color: colors.primary,
    },
    completeLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 28,
    },
    completeSummary: {flexDirection: 'row', gap: 24, marginBottom: 40},
    completeStat: {alignItems: 'center'},
    completeStatNum: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colors.primary,
    },
    completeStatLabel: {fontSize: 12, color: colors.textTertiary},
    // 结算页破译力增量
    unlockBonus: {
      backgroundColor: '#8B5CF614',
      borderRadius: 16,
      padding: 16,
      marginTop: -16,
      marginBottom: 32,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#8B5CF630',
    },
    unlockBonusTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#8B5CF6',
      marginBottom: 4,
    },
    unlockBonusText: {fontSize: 12, color: colors.textSecondary},
    secondaryBtn: {
      backgroundColor: colors.surfaceLight,
      padding: 16,
      borderRadius: 16,
      alignItems: 'center',
      marginTop: 10,
    },
    secondaryBtnText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textSecondary,
    },
  });
