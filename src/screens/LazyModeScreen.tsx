import React, {useState, useEffect, useMemo, useCallback, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  AppState,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {theme, useAppTheme, ThemeColors} from '../theme';
import {UserProgress} from '../data/types';
import {loadProgress, saveProgress} from '../data/learningLogic';
import {
  LazyQueue,
  buildLazyQueue,
  finishLazySession,
  lazyTimings,
  lazyPlanSummary,
  lazySegments,
  segmentAt,
  STEP_MS,
} from '../data/lazySession';
import {getFullMeaning, getWordOrigin} from '../data/wordDatabase';
import {speak} from '../utils/speech';

const TICK_MS = 250;

const fmtMinutes = (ms: number): string => {
  const m = Math.ceil(ms / 60000);
  return m <= 1 ? '不到 1 分钟' : `约 ${m} 分钟`;
};

// 懒人模式：零操作自动播放。点屏幕暂停/继续，左上角退出。
export const LazyModeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {colors} = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();

  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [queue, setQueue] = useState<LazyQueue | null>(null);
  const [phase, setPhase] = useState<'preview' | 'playing' | 'done'>('preview');
  const [idx, setIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [saving, setSaving] = useState(false);
  const spokenRef = useRef(-1);

  const prepareBatch = useCallback((p: UserProgress) => {
    const q = buildLazyQueue(p);
    setQueue(q);
    setIdx(0);
    setElapsed(0);
    setPhase('preview');
    setPaused(false);
    spokenRef.current = -1;
  }, []);

  useEffect(() => {
    loadProgress().then(p => {
      setProgress(p);
      prepareBatch(p);
    });
  }, [prepareBatch]);

  // 切后台自动暂停
  useEffect(() => {
    const sub = AppState.addEventListener('change', s => {
      if (s !== 'active') {
        setPaused(true);
      }
    });
    return () => sub.remove();
  }, []);

  const summary = useMemo(
    () => (queue ? lazyPlanSummary(queue) : null),
    [queue],
  );
  const segments = useMemo(() => (queue ? lazySegments(queue) : []), [queue]);

  const step = queue && phase === 'playing' ? queue.steps[idx] : null;
  const timings = step ? lazyTimings(step.pass) : null;

  // 自动朗读：每个曝光步首次出现时读一遍
  useEffect(() => {
    if (step && spokenRef.current !== idx && !paused) {
      spokenRef.current = idx;
      speak(step.word.word);
    }
  }, [step, idx, paused]);

  const handleBatchDone = useCallback(async () => {
    if (!progress || !queue || saving) {
      return;
    }
    setSaving(true);
    try {
      const p = finishLazySession(progress, queue);
      await saveProgress(p);
      setProgress(p);
      setPhase('done');
    } catch {
      Alert.alert('保存失败', '进度保存失败，请重试');
    } finally {
      setSaving(false);
    }
  }, [progress, queue, saving]);

  // 播放心跳
  useEffect(() => {
    if (!step || paused) {
      return;
    }
    const t = setInterval(() => setElapsed(e => e + TICK_MS), TICK_MS);
    return () => clearInterval(t);
  }, [step, paused]);

  // 到点切词/收尾
  useEffect(() => {
    if (!step || !timings || !queue) {
      return;
    }
    if (elapsed >= timings.nextAt) {
      if (idx + 1 < queue.steps.length) {
        setIdx(i => i + 1);
        setElapsed(0);
      } else {
        handleBatchDone();
      }
    }
  }, [elapsed, step, timings, idx, queue, handleBatchDone]);

  if (!progress || !queue) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.emptyTitle}>
          {progress && !queue ? '🎉 没有待学的词了' : '加载中…'}
        </Text>
        {progress && !queue && (
          <TouchableOpacity
            style={styles.exitBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}>
            <Text style={styles.exitBtnText}>返回</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // ==================== 本批预告 ====================
  if (phase === 'preview') {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.previewEmoji}>😴</Text>
        <Text style={styles.previewTitle}>这批要躺多久，先说清楚</Text>
        <View style={styles.previewCard}>
          <View style={styles.previewRow}>
            <Text style={styles.previewNum}>{summary!.newCount}</Text>
            <Text style={styles.previewLabel}>个新词 × 3 遍</Text>
          </View>
          {summary!.reviewCount > 0 && (
            <View style={styles.previewRow}>
              <Text style={styles.previewNum}>{summary!.reviewCount}</Text>
              <Text style={styles.previewLabel}>个到期复习 × 1 遍</Text>
            </View>
          )}
          <View style={styles.previewDivider} />
          <Text style={styles.previewTotal}>
            共 {summary!.totalSteps} 步 · 每步 8 秒 · 全程
            {fmtMinutes(summary!.totalSteps * STEP_MS)}
          </Text>
          <Text style={styles.previewNote}>
            你只管盯着看：单词会自动朗读，意思和例句自己浮现，{'\n'}
            同一个词会按记忆曲线回来找你 3 次
          </Text>
        </View>
        <TouchableOpacity
          style={styles.againBtn}
          onPress={() => setPhase('playing')}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="开始自动播放">
          <Text style={styles.againBtnText}>开始躺 ▶</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.exitBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}>
          <Text style={styles.exitBtnText}>先不了</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ==================== 结算页 ====================
  if (phase === 'done') {
    const today = progress.learningHistory[progress.learningHistory.length - 1];
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.doneEmoji}>😴✨</Text>
        <Text style={styles.doneTitle}>这批躺完了</Text>
        <Text style={styles.doneSub}>
          新词 {queue.newWords.length} 个 × 3 遍 · 复习{' '}
          {queue.reviewWords.length} 个{'\n'}
          已按记忆曲线排好下次见面的日子
        </Text>
        <View style={styles.doneStatsRow}>
          <View style={styles.doneStat}>
            <Text style={styles.doneStatNum}>🔥 {progress.streak}</Text>
            <Text style={styles.doneStatLabel}>连续天数</Text>
          </View>
          <View style={styles.doneStat}>
            <Text style={styles.doneStatNum}>
              {(today?.wordsLearned || 0) + (today?.wordsReviewed || 0)}
            </Text>
            <Text style={styles.doneStatLabel}>今日已学+复习</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.againBtn}
          onPress={() => prepareBatch(progress)}
          activeOpacity={0.8}
          accessibilityRole="button">
          <Text style={styles.againBtnText}>再来一批</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.exitBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          accessibilityRole="button">
          <Text style={styles.exitBtnText}>今天到这</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ==================== 播放 ====================
  const word = step!.word;
  const showMeaning = elapsed >= timings!.meaningAt;
  const showExample = elapsed >= timings!.exampleAt;
  const origin = getWordOrigin(word.word);
  const pct = Math.round(((idx + 1) / queue.steps.length) * 100);
  const seg = segmentAt(segments, idx);
  const remainMs = (queue.steps.length - idx) * STEP_MS - elapsed;
  const halfway = idx + 1 > queue.steps.length / 2;
  const wordPct = Math.min(100, Math.round((elapsed / timings!.nextAt) * 100));

  return (
    <Pressable
      style={[styles.container, {paddingTop: insets.top + 8}]}
      onPress={() => setPaused(p => !p)}
      accessibilityLabel={paused ? '继续播放' : '暂停播放'}>
      {/* 顶栏：退出 + 总进度 + 剩余时间 */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="退出懒人模式">
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, {width: `${pct}%`}]} />
        </View>
        <Text style={styles.counter}>
          {idx + 1}/{queue.steps.length} · 剩{fmtMinutes(remainMs)}
        </Text>
      </View>

      <View style={styles.cardArea}>
        {/* 轮次小目标：把一长批切成可完成的小段 */}
        <Text style={styles.passTag}>
          {step!.isReview
            ? `${seg.label} · 还记得吗`
            : `${seg.label} · ${seg.pos}/${seg.count}`}
        </Text>

        <Text style={styles.word}>{word.word}</Text>
        {!!word.phonetic && (
          <Text style={styles.phonetic}>
            {word.phonetic} {word.partOfSpeech}
          </Text>
        )}

        {showMeaning ? (
          <Text style={styles.meaning}>{getFullMeaning(word)}</Text>
        ) : (
          <Text style={styles.meaningPlaceholder}>
            {step!.pass === 1 ? '…' : '想一想它的意思'}
          </Text>
        )}

        {/* 可拆词亮出词根块：8 秒里多塞一层记忆抓手 */}
        {showMeaning && word.morphemes.length >= 2 && (
          <View style={styles.morphRow}>
            {word.morphemes.map((m, i) => (
              <View
                key={i}
                style={[styles.morphChip, {backgroundColor: m.color + '22'}]}>
                <Text style={[styles.morphChipText, {color: m.color}]}>
                  {m.text}
                </Text>
                <Text style={styles.morphChipMeaning}>{m.meaning}</Text>
              </View>
            ))}
          </View>
        )}

        {showExample && (
          <View style={styles.exampleBox}>
            <Text style={styles.exampleText}>{word.example}</Text>
            <Text style={styles.exampleTrans}>{word.translation}</Text>
            {step!.pass === 1 && origin && (
              <Text style={styles.originText}>📜 {origin}</Text>
            )}
          </View>
        )}
      </View>

      {/* 本词 8 秒倒计时细条：节奏可感知 */}
      <View style={styles.wordTimerTrack}>
        <View style={[styles.wordTimerFill, {width: `${wordPct}%`}]} />
      </View>
      <Text style={styles.hint}>
        {paused
          ? '⏸ 已暂停 · 点屏幕继续'
          : halfway
          ? `已过半，稳住 😌 剩${fmtMinutes(remainMs)}`
          : '全自动播放 · 点屏幕暂停'}
      </Text>
    </Pressable>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: colors.background},
    center: {alignItems: 'center', justifyContent: 'center', padding: 32},
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      gap: 12,
    },
    closeText: {fontSize: 20, color: colors.textTertiary, padding: 4},
    progressTrack: {
      flex: 1,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.surfaceLight,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 3,
      backgroundColor: colors.primary,
    },
    counter: {fontSize: 12, color: colors.textTertiary},
    cardArea: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 28,
      maxWidth: theme.layout.maxContentWidth,
      alignSelf: 'center',
      width: '100%',
    },
    passTag: {
      fontSize: 13,
      color: colors.primary,
      fontWeight: '600',
      marginBottom: 18,
    },
    word: {
      fontSize: 46,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 8,
      textAlign: 'center',
    },
    phonetic: {fontSize: 16, color: colors.textTertiary, marginBottom: 22},
    meaning: {
      fontSize: 22,
      color: colors.textPrimary,
      fontWeight: '600',
      textAlign: 'center',
      lineHeight: 32,
    },
    meaningPlaceholder: {
      fontSize: 22,
      color: colors.textTertiary,
      textAlign: 'center',
      lineHeight: 32,
    },
    morphRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 8,
      marginTop: 14,
    },
    morphChip: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 5,
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    morphChipText: {fontSize: 15, fontWeight: '700'},
    morphChipMeaning: {fontSize: 12, color: colors.textSecondary},
    exampleBox: {
      marginTop: 22,
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 16,
      width: '100%',
    },
    exampleText: {fontSize: 15, color: colors.textSecondary, lineHeight: 22},
    exampleTrans: {
      fontSize: 13,
      color: colors.textTertiary,
      marginTop: 6,
      lineHeight: 20,
    },
    originText: {
      fontSize: 13,
      color: colors.warning,
      marginTop: 10,
      lineHeight: 20,
    },
    wordTimerTrack: {
      height: 3,
      marginHorizontal: 28,
      borderRadius: 2,
      backgroundColor: colors.surfaceLight,
      overflow: 'hidden',
      marginBottom: 10,
    },
    wordTimerFill: {
      height: '100%',
      backgroundColor: colors.primary + '88',
    },
    hint: {
      textAlign: 'center',
      fontSize: 12,
      color: colors.textTertiary,
      marginBottom: 28,
    },
    previewEmoji: {fontSize: 44, marginBottom: 10},
    previewTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 20,
    },
    previewCard: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 22,
      width: '100%',
      maxWidth: 360,
      marginBottom: 26,
    },
    previewRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 8,
      marginBottom: 6,
    },
    previewNum: {fontSize: 26, fontWeight: 'bold', color: colors.primary},
    previewLabel: {fontSize: 15, color: colors.textSecondary},
    previewDivider: {
      height: 1,
      backgroundColor: colors.surfaceLight,
      marginVertical: 12,
    },
    previewTotal: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 8,
    },
    previewNote: {
      fontSize: 13,
      color: colors.textTertiary,
      lineHeight: 20,
    },
    doneEmoji: {fontSize: 48, marginBottom: 12},
    doneTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 10,
    },
    doneSub: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 20,
    },
    doneStatsRow: {flexDirection: 'row', gap: 36, marginBottom: 26},
    doneStat: {alignItems: 'center'},
    doneStatNum: {fontSize: 22, fontWeight: 'bold', color: colors.textPrimary},
    doneStatLabel: {fontSize: 12, color: colors.textTertiary, marginTop: 4},
    againBtn: {
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingVertical: 14,
      paddingHorizontal: 48,
      marginBottom: 12,
    },
    againBtnText: {fontSize: 17, fontWeight: 'bold', color: '#FFFFFF'},
    exitBtn: {paddingVertical: 10, paddingHorizontal: 24},
    exitBtnText: {fontSize: 15, color: colors.textTertiary},
    emptyTitle: {fontSize: 18, color: colors.textPrimary, marginBottom: 16},
  });
