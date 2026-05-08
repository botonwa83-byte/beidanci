import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Word, UserProgress, SessionStep, Question, DailyMission } from '../data/types';
import {
  loadProgress, saveProgress, getTodayMission, buildLearningSession,
  markWordLearned, markRootLearned, markQuizDone, finishDailySession,
  createStudyPlan, getEstimatedDays, getOverallStats, generateNextBatch,
} from '../data/learningLogic';
import { allWords, coreRoots, getWordsByRoot } from '../data/wordDatabase';
import { speak } from '../utils/speech';

type Nav = NativeStackNavigationProp<{ Tab: undefined; WordDetail: { word: Word } }>;

type AppMode = 'dashboard' | 'setup' | 'session';

export const LearnScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
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

  // Setup state
  const [selectedPace, setSelectedPace] = useState(25);

  const reload = useCallback(async () => {
    const p = await loadProgress();
    setProgress(p);
    if (!p.studyPlan) {
      setMode('setup');
    } else {
      const m = getTodayMission(p);
      setMission(m);
      if (!p.todayMission || p.todayMission.date !== m.date) {
        const updated = { ...p, todayMission: m };
        await saveProgress(updated);
        setProgress(updated);
      }
      setMode('dashboard');
    }
  }, []);

  useFocusEffect(useCallback(() => { reload(); }, [reload]));

  // ==================== Setup ====================
  const handleSetup = async () => {
    if (!progress) return;
    const plan = createStudyPlan(selectedPace);
    const p = { ...progress, studyPlan: plan };
    const m = getTodayMission(p);
    const updated = { ...p, todayMission: m };
    await saveProgress(updated);
    setProgress(updated);
    setMission(m);
    setMode('dashboard');
  };

  if (mode === 'setup') {
    const paces = [
      { n: 15, label: '轻松', desc: `${getEstimatedDays(15)}天完成`, sub: '每天约10分钟' },
      { n: 25, label: '标准', desc: `${getEstimatedDays(25)}天完成`, sub: '每天约15分钟' },
      { n: 40, label: '冲刺', desc: `${getEstimatedDays(40)}天完成`, sub: '每天约25分钟' },
      { n: 60, label: '极限', desc: `${getEstimatedDays(60)}天完成`, sub: '每天约35分钟' },
    ];
    return (
      <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
        <View style={styles.setupWrap}>
          <Text style={styles.setupTitle}>制定你的背词计划</Text>
          <Text style={styles.setupSub}>共 {allWords.length} 个核心词汇，通过词根联想高效记忆</Text>

          <View style={styles.paceList}>
            {paces.map(p => (
              <TouchableOpacity
                key={p.n}
                style={[styles.paceCard, selectedPace === p.n && styles.paceCardActive]}
                onPress={() => setSelectedPace(p.n)}
                activeOpacity={0.7}
              >
                <View style={styles.paceHeader}>
                  <Text style={[styles.paceLabel, selectedPace === p.n && styles.paceLabelActive]}>{p.label}</Text>
                  <Text style={[styles.paceNum, selectedPace === p.n && styles.paceNumActive]}>{p.n}词/天</Text>
                </View>
                <Text style={styles.paceDesc}>{p.desc}</Text>
                <Text style={styles.paceSub}>{p.sub}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.startBtn} onPress={handleSetup} activeOpacity={0.7}>
            <Text style={styles.startBtnText}>开始背单词</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ==================== Session ====================
  const startSession = async () => {
    if (!progress) return;

    let currentMission = mission;

    // If current mission is fully done, generate a fresh batch
    if (currentMission) {
      const allNewDone = currentMission.completedNewWords.length >= currentMission.newWordIds.length;
      const allReviewDone = currentMission.completedReviews.length >= currentMission.reviewWordIds.length;
      if (allNewDone && allReviewDone) {
        currentMission = generateNextBatch(progress);
        const updated = { ...progress, todayMission: currentMission };
        await saveProgress(updated);
        setProgress(updated);
        setMission(currentMission);
      }
    }

    if (!currentMission) return;

    const s = buildLearningSession(currentMission, progress);
    setSteps(s);
    setStepIdx(0);
    setSessionScore(0);
    setQuizIdx(0);
    setQuizAnswer(null);
    setQuizRevealed(false);
    setFlipReview(false);
    setMode('session');
  };

  const nextStep = async () => {
    setQuizAnswer(null);
    setQuizRevealed(false);
    setFlipReview(false);
    if (stepIdx < steps.length - 1) {
      setStepIdx(i => i + 1);
    }
  };

  const handleSessionComplete = async () => {
    if (!progress) return;
    const p = finishDailySession(progress, sessionScore);
    await saveProgress(p);
    setProgress(p);
    setMode('dashboard');
    reload();
  };

  if (mode === 'session' && steps.length > 0) {
    const step = steps[stepIdx];
    const totalSteps = steps.length;
    const pct = ((stepIdx + 1) / totalSteps) * 100;

    // --- Root Intro ---
    if (step.type === 'root-intro') {
      const root = coreRoots.find(r => r.id === step.rootId);
      if (!root) { nextStep(); return null; }
      const rootWords = getWordsByRoot(root.id).slice(0, 8);

      const handleRootDone = async () => {
        if (!progress) return;
        const p = markRootLearned(progress, root.id);
        await saveProgress(p);
        setProgress(p);
        nextStep();
      };

      return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
          <SessionHeader pct={pct} step={stepIdx + 1} total={totalSteps} label="学习词根" onClose={() => setMode('dashboard')} />
          <ScrollView style={styles.sessionBody} contentContainerStyle={styles.sessionContent}>
            <View style={[styles.rootIntroCard, { backgroundColor: root.color + '10', borderColor: root.color + '30' }]}>
              <Text style={[styles.rootBig, { color: root.color }]}>{root.root}</Text>
              <Text style={styles.rootMeaningBig}>{root.meaning}</Text>
              <Text style={styles.rootOriginText}>{root.origin}</Text>
            </View>

            <Text style={styles.sessionLabel}>这个词根的词汇家族</Text>
            {rootWords.map((w, i) => (
              <View key={w.id} style={styles.rootWordRow}>
                <Text style={styles.rootWordNum}>{i + 1}</Text>
                <View style={styles.rootWordInfo}>
                  <Text style={styles.rootWordText}>{w.word}</Text>
                  <Text style={styles.rootWordMeaning}>{w.meaning}</Text>
                </View>
                <Text style={styles.rootWordPos}>{w.partOfSpeech}</Text>
              </View>
            ))}
            <Text style={styles.rootFamilyHint}>
              记住：看到 "{root.root}" 就想到 "{root.meaning}"
            </Text>
          </ScrollView>
          <View style={styles.sessionFooter}>
            <TouchableOpacity style={styles.nextBtn} onPress={handleRootDone} activeOpacity={0.7}>
              <Text style={styles.nextBtnText}>记住了，继续</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // --- Word Learn ---
    if (step.type === 'word-learn') {
      const word = allWords.find(w => w.id === step.wordId);
      if (!word) { nextStep(); return null; }

      const handleKnow = async () => {
        if (!progress) return;
        const p = markWordLearned(progress, word.id, 4);
        await saveProgress(p);
        setProgress(p);
        setSessionScore(s => s + 1);
        nextStep();
      };
      const handleDontKnow = async () => {
        if (!progress) return;
        const p = markWordLearned(progress, word.id, 2);
        await saveProgress(p);
        setProgress(p);
        nextStep();
      };

      return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
          <SessionHeader pct={pct} step={stepIdx + 1} total={totalSteps} label="学习新词" onClose={() => setMode('dashboard')} />
          <ScrollView style={styles.sessionBody} contentContainerStyle={styles.sessionContent}>
            <TouchableOpacity onPress={() => speak(word.word)} activeOpacity={0.6}>
              <Text style={styles.wordBig}>{word.word} <Text style={styles.speakerIcon}>{'\uD83D\uDD0A'}</Text></Text>
            </TouchableOpacity>
            {word.phonetic ? <Text style={styles.wordPhonetic}>{word.phonetic}  {word.partOfSpeech}</Text> : <Text style={styles.wordPhonetic}>{word.partOfSpeech}</Text>}
            <Text style={styles.wordMeaningBig}>{word.meaning}</Text>

            {word.morphemes.length > 0 && (
              <View style={styles.morphRow}>
                {word.morphemes.map((m, i) => (
                  <View key={i} style={[styles.morphBlock, { backgroundColor: m.color }]}>
                    <Text style={styles.morphText}>{m.text}</Text>
                    <Text style={styles.morphSub}>{m.meaning}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.assocCard}>
              <Text style={styles.assocLabel}>联想记忆</Text>
              <Text style={styles.assocText}>{word.associationStory}</Text>
            </View>

            <View style={styles.exCard}>
              <Text style={styles.exText}>{word.example}</Text>
              <Text style={styles.exTrans}>{word.translation}</Text>
            </View>
          </ScrollView>
          <View style={styles.sessionFooterRow}>
            <TouchableOpacity style={styles.dontKnowBtn} onPress={handleDontKnow} activeOpacity={0.7}>
              <Text style={styles.dontKnowText}>不认识</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.knowBtn} onPress={handleKnow} activeOpacity={0.7}>
              <Text style={styles.knowText}>认识了</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // --- Quiz ---
    if (step.type === 'quiz') {
      const qs = step.questions;
      const q = qs[quizIdx];
      if (!q) { nextStep(); return null; }

      const handleQuizSelect = (idx: number) => {
        if (quizRevealed) return;
        setQuizAnswer(idx);
      };
      const handleQuizConfirm = () => {
        if (quizAnswer === null) return;
        setQuizRevealed(true);
        if (q.options[quizAnswer].isCorrect) setSessionScore(s => s + 1);
      };
      const handleQuizNext = async () => {
        if (quizIdx < qs.length - 1) {
          setQuizIdx(i => i + 1);
          setQuizAnswer(null);
          setQuizRevealed(false);
        } else {
          if (progress) {
            const p = markQuizDone(progress);
            await saveProgress(p);
            setProgress(p);
          }
          nextStep();
        }
      };

      return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
          <SessionHeader pct={pct} step={stepIdx + 1} total={totalSteps} label={`测验 ${quizIdx + 1}/${qs.length}`} onClose={() => setMode('dashboard')} />
          <ScrollView style={styles.sessionBody} contentContainerStyle={styles.sessionContent}>
            <View style={styles.quizQCard}>
              <Text style={styles.quizQType}>
                {q.type === 'root-meaning' ? '词根含义' : q.type === 'word-meaning' ? '单词释义' : '词根匹配'}
              </Text>
              <Text style={styles.quizQText}>{q.question}</Text>
            </View>
            {q.options.map((opt, idx) => {
              let bg = theme.colors.surface;
              let border = '#E8ECF2';
              let color = theme.colors.textPrimary;
              if (quizRevealed) {
                if (opt.isCorrect) { bg = theme.colors.secondaryLight; border = theme.colors.success; color = theme.colors.success; }
                else if (quizAnswer === idx) { bg = '#FFF0F0'; border = theme.colors.error; color = theme.colors.error; }
              } else if (quizAnswer === idx) {
                border = theme.colors.primary; color = theme.colors.primary; bg = theme.colors.primaryLight;
              }
              return (
                <TouchableOpacity key={idx} style={[styles.quizOpt, { backgroundColor: bg, borderColor: border }]}
                  onPress={() => handleQuizSelect(idx)} disabled={quizRevealed} activeOpacity={0.7}>
                  <Text style={[styles.quizOptText, { color }]}>{opt.text}</Text>
                </TouchableOpacity>
              );
            })}
            {quizRevealed && (
              <View style={styles.quizExpl}>
                <Text style={styles.quizExplText}>{q.explanation}</Text>
              </View>
            )}
          </ScrollView>
          <View style={styles.sessionFooter}>
            {!quizRevealed ? (
              <TouchableOpacity style={[styles.nextBtn, quizAnswer === null && styles.btnDisabled]}
                onPress={handleQuizConfirm} disabled={quizAnswer === null} activeOpacity={0.7}>
                <Text style={styles.nextBtnText}>确认</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.nextBtn} onPress={handleQuizNext} activeOpacity={0.7}>
                <Text style={styles.nextBtnText}>{quizIdx < qs.length - 1 ? '下一题' : '继续'}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    }

    // --- Review Card ---
    if (step.type === 'review-card') {
      const word = allWords.find(w => w.id === step.wordId);
      if (!word) { nextStep(); return null; }

      const handleGrade = async (quality: number) => {
        if (!progress) return;
        const p = markWordLearned(progress, word.id, quality);
        await saveProgress(p);
        setProgress(p);
        if (quality >= 3) setSessionScore(s => s + 1);
        nextStep();
      };

      return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
          <SessionHeader pct={pct} step={stepIdx + 1} total={totalSteps} label="复习" onClose={() => setMode('dashboard')} />
          <View style={styles.sessionBody}>
            <View style={styles.flashCard}>
              <View style={styles.flashCardInner}>
                <TouchableOpacity onPress={() => speak(word.word)} activeOpacity={0.6}>
                  <Text style={styles.flashWord}>{word.word} <Text style={styles.speakerIcon}>{'\uD83D\uDD0A'}</Text></Text>
                </TouchableOpacity>
                {flipReview ? (
                  <>
                    <Text style={styles.flashMeaning}>{word.meaning}</Text>
                    <View style={styles.flashMorphRow}>
                      {word.morphemes.map((m, i) => (
                        <Text key={i} style={[styles.flashMorph, { color: m.color }]}>{m.text}({m.meaning})</Text>
                      ))}
                    </View>
                  </>
                ) : (
                  <TouchableOpacity style={styles.flipBtn} onPress={() => setFlipReview(true)} activeOpacity={0.7}>
                    <Text style={styles.flipBtnText}>点击显示释义</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
          {flipReview && (
            <View style={styles.gradeRow}>
              <TouchableOpacity style={[styles.gradeBtn, { backgroundColor: '#FFF0F0' }]} onPress={() => handleGrade(1)}>
                <Text style={[styles.gradeText, { color: theme.colors.error }]}>忘了</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.gradeBtn, { backgroundColor: '#FFF8E8' }]} onPress={() => handleGrade(3)}>
                <Text style={[styles.gradeText, { color: theme.colors.warning }]}>模糊</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.gradeBtn, { backgroundColor: theme.colors.secondaryLight }]} onPress={() => handleGrade(4)}>
                <Text style={[styles.gradeText, { color: theme.colors.success }]}>记得</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.gradeBtn, { backgroundColor: theme.colors.primaryLight }]} onPress={() => handleGrade(5)}>
                <Text style={[styles.gradeText, { color: theme.colors.primary }]}>秒杀</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
    }

    // --- Complete ---
    if (step.type === 'complete') {
      const allDone = progress?.completedWords.length === allWords.length;
      const handleContinue = async () => {
        await handleSessionComplete();
        if (!allDone) {
          // Immediately start next batch after returning to dashboard
          setTimeout(() => startSession(), 100);
        }
      };

      return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
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
                <Text style={styles.completeStatNum}>{mission?.completedNewWords.length || 0}</Text>
                <Text style={styles.completeStatLabel}>新词</Text>
              </View>
              <View style={styles.completeStat}>
                <Text style={[styles.completeStatNum, { color: theme.colors.accent }]}>{mission?.completedReviews.length || 0}</Text>
                <Text style={styles.completeStatLabel}>复习</Text>
              </View>
              <View style={styles.completeStat}>
                <Text style={[styles.completeStatNum, { color: theme.colors.secondary }]}>{progress?.completedWords.length || 0}/{allWords.length}</Text>
                <Text style={styles.completeStatLabel}>总进度</Text>
              </View>
            </View>
            {!allDone && (
              <TouchableOpacity style={styles.startBtn} onPress={handleContinue} activeOpacity={0.7}>
                <Text style={styles.startBtnText}>继续下一组</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[allDone ? styles.startBtn : styles.secondaryBtn]}
              onPress={handleSessionComplete}
              activeOpacity={0.7}
            >
              <Text style={allDone ? styles.startBtnText : styles.secondaryBtnText}>返回主页</Text>
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
    ? mission.completedNewWords.length >= mission.newWordIds.length && mission.completedReviews.length >= mission.reviewWordIds.length
    : false;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 120 }}>
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
            <Text style={styles.overallNum}>{stats.learnedWords} / {stats.totalWords}</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.round(stats.learnedWords / stats.totalWords * 100)}%` as any }]} />
          </View>
          <View style={styles.overallMeta}>
            <Text style={styles.overallMetaText}>{stats.learnedRoots}/{stats.totalRoots} 词根</Text>
            <Text style={styles.overallMetaText}>{stats.streak} 天连续</Text>
            {stats.daysRemaining > 0 && <Text style={styles.overallMetaText}>还需 {stats.daysRemaining} 天</Text>}
          </View>
        </View>
      )}

      {/* Today's Mission */}
      {mission && stats && (
        <View style={styles.missionCard}>
          <Text style={styles.missionTitle}>今日任务</Text>

          <View style={styles.missionRow}>
            <View style={[styles.missionItem, { borderLeftColor: theme.colors.primary }]}>
              <Text style={styles.missionItemTitle}>新词根</Text>
              <Text style={styles.missionItemNum}>{mission.newRoots.length}</Text>
              <Text style={styles.missionItemSub}>
                {mission.newRoots.map(id => coreRoots.find(r => r.id === id)?.root).filter(Boolean).join(', ') || '-'}
              </Text>
            </View>
            <View style={[styles.missionItem, { borderLeftColor: theme.colors.secondary }]}>
              <Text style={styles.missionItemTitle}>新单词</Text>
              <Text style={styles.missionItemNum}>{stats.todayNewDone}/{stats.todayNew}</Text>
            </View>
            <View style={[styles.missionItem, { borderLeftColor: theme.colors.accent }]}>
              <Text style={styles.missionItemTitle}>复习</Text>
              <Text style={styles.missionItemNum}>{stats.todayReviewDone}/{stats.todayReview}</Text>
            </View>
          </View>
        </View>
      )}

      {/* CTA Button */}
      <TouchableOpacity
        style={[styles.ctaBtn, todayDone && styles.ctaDone]}
        onPress={startSession}
        activeOpacity={0.7}
      >
        <Text style={[styles.ctaText, todayDone && styles.ctaDoneText]}>
          {todayDone ? '继续学习下一组' : '开始今日学习'}
        </Text>
        {!todayDone && stats && stats.todayNew > 0 && (
          <Text style={styles.ctaSub}>
            {mission?.newRoots.length || 0}个词根 + {stats.todayNew}个新词 + {stats.todayReview}个复习
          </Text>
        )}
        {todayDone && stats && (
          <Text style={styles.ctaDoneSub}>
            已学 {stats.learnedWords}/{stats.totalWords} 词，还剩 {stats.totalWords - stats.learnedWords} 词
          </Text>
        )}
      </TouchableOpacity>

      {/* Today's roots preview */}
      {mission && mission.newRoots.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>今日词根预览</Text>
          {mission.newRoots.map(rootId => {
            const root = coreRoots.find(r => r.id === rootId);
            if (!root) return null;
            return (
              <View key={root.id} style={[styles.rootPreview, { borderLeftColor: root.color }]}>
                <View style={styles.rootPreviewHead}>
                  <Text style={[styles.rootPreviewName, { color: root.color }]}>{root.root}</Text>
                  <Text style={styles.rootPreviewMeaning}>{root.meaning}</Text>
                </View>
                <Text style={styles.rootPreviewWords}>
                  {root.words.slice(0, 5).map(w => w.word).join(' / ')}
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
            <Text style={[styles.qStatNum, { color: theme.colors.secondary }]}>{stats.learnedRoots}</Text>
            <Text style={styles.qStatLabel}>已学词根</Text>
          </View>
          <View style={styles.qStat}>
            <Text style={[styles.qStatNum, { color: theme.colors.accent }]}>{stats.streak}</Text>
            <Text style={styles.qStatLabel}>连续天数</Text>
          </View>
          <View style={styles.qStat}>
            <Text style={[styles.qStatNum, { color: '#C57BDB' }]}>{progress?.totalScore || 0}</Text>
            <Text style={styles.qStatLabel}>总得分</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

// ==================== Session Header Component ====================

const SessionHeader: React.FC<{ pct: number; step: number; total: number; label: string; onClose: () => void }> = ({ pct, step, total, label, onClose }) => (
  <View style={styles.sessHead}>
    <TouchableOpacity onPress={onClose}><Text style={styles.sessClose}>{'\u2715'}</Text></TouchableOpacity>
    <View style={styles.sessInfo}>
      <Text style={styles.sessLabel}>{label}</Text>
      <Text style={styles.sessStep}>{step}/{total}</Text>
    </View>
    <View style={styles.sessProg}><View style={[styles.sessProgFill, { width: `${pct}%` }]} /></View>
  </View>
);

// ==================== Styles ====================

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },

  // Setup
  setupWrap: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  setupTitle: { fontSize: 28, fontWeight: 'bold', color: theme.colors.textPrimary, textAlign: 'center', marginBottom: 8 },
  setupSub: { fontSize: 14, color: theme.colors.textSecondary, textAlign: 'center', marginBottom: 32 },
  paceList: { gap: 12, marginBottom: 32 },
  paceCard: { backgroundColor: theme.colors.surface, borderRadius: 16, padding: 18, borderWidth: 2, borderColor: 'transparent', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  paceCardActive: { borderColor: theme.colors.primary, backgroundColor: theme.colors.primaryLight },
  paceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  paceLabel: { fontSize: 18, fontWeight: 'bold', color: theme.colors.textPrimary },
  paceLabelActive: { color: theme.colors.primary },
  paceNum: { fontSize: 16, fontWeight: '600', color: theme.colors.textSecondary },
  paceNumActive: { color: theme.colors.primary },
  paceDesc: { fontSize: 13, color: theme.colors.textSecondary },
  paceSub: { fontSize: 12, color: theme.colors.textTertiary, marginTop: 2 },
  startBtn: { backgroundColor: theme.colors.primary, padding: 18, borderRadius: 16, alignItems: 'center', shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  startBtnText: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },

  // Dashboard
  dashHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
  dashTitle: { fontSize: 32, fontWeight: 'bold', color: theme.colors.textPrimary },
  dashTitleSub: { fontSize: 11, color: theme.colors.textTertiary, letterSpacing: 2 },
  dayBadge: { backgroundColor: theme.colors.primary, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 },
  dayBadgeText: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' },

  overallCard: { marginHorizontal: 20, backgroundColor: theme.colors.surface, borderRadius: 20, padding: 18, marginBottom: 16, shadowColor: '#4A6AE5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4 },
  overallRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  overallLabel: { fontSize: 14, color: theme.colors.textSecondary },
  overallNum: { fontSize: 14, fontWeight: '600', color: theme.colors.textPrimary },
  progressBar: { height: 8, backgroundColor: theme.colors.surfaceLight, borderRadius: 4, overflow: 'hidden', marginBottom: 10 },
  progressFill: { height: 8, backgroundColor: theme.colors.primary, borderRadius: 4, minWidth: 0 },
  overallMeta: { flexDirection: 'row', gap: 16 },
  overallMetaText: { fontSize: 12, color: theme.colors.textTertiary },

  missionCard: { marginHorizontal: 20, backgroundColor: theme.colors.surface, borderRadius: 20, padding: 18, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  missionTitle: { fontSize: 16, fontWeight: 'bold', color: theme.colors.textPrimary, marginBottom: 14 },
  missionRow: { flexDirection: 'row', gap: 10 },
  missionItem: { flex: 1, backgroundColor: theme.colors.background, borderRadius: 12, padding: 12, borderLeftWidth: 3 },
  missionItemTitle: { fontSize: 11, color: theme.colors.textTertiary, marginBottom: 4 },
  missionItemNum: { fontSize: 20, fontWeight: 'bold', color: theme.colors.textPrimary, marginBottom: 2 },
  missionItemSub: { fontSize: 10, color: theme.colors.textTertiary },

  ctaBtn: { marginHorizontal: 20, backgroundColor: theme.colors.primary, borderRadius: 18, padding: 20, alignItems: 'center', marginBottom: 24, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6 },
  ctaDone: { backgroundColor: theme.colors.surface, borderWidth: 2, borderColor: theme.colors.success, shadowOpacity: 0 },
  ctaText: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  ctaDoneText: { color: theme.colors.success, fontSize: 16 },
  ctaSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  ctaDoneSub: { fontSize: 12, color: theme.colors.textTertiary, marginTop: 4 },

  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 12, color: theme.colors.primary, marginBottom: 10, fontWeight: '700', letterSpacing: 1 },
  rootPreview: { backgroundColor: theme.colors.surface, borderRadius: 14, padding: 14, marginBottom: 10, borderLeftWidth: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  rootPreviewHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  rootPreviewName: { fontSize: 22, fontWeight: 'bold' },
  rootPreviewMeaning: { fontSize: 15, color: theme.colors.textPrimary },
  rootPreviewWords: { fontSize: 13, color: theme.colors.textTertiary, lineHeight: 20 },

  quickStats: { flexDirection: 'row', marginHorizontal: 20, gap: 8, marginBottom: 20 },
  qStat: { flex: 1, backgroundColor: theme.colors.surface, borderRadius: 14, padding: 14, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  qStatNum: { fontSize: 22, fontWeight: 'bold', color: theme.colors.primary, marginBottom: 4 },
  qStatLabel: { fontSize: 10, color: theme.colors.textSecondary },

  // Session common
  sessHead: { paddingHorizontal: 16, paddingVertical: 10, gap: 6 },
  sessClose: { fontSize: 18, color: theme.colors.textTertiary, width: 30 },
  sessInfo: { flexDirection: 'row', justifyContent: 'space-between' },
  sessLabel: { fontSize: 13, color: theme.colors.primary, fontWeight: '600' },
  sessStep: { fontSize: 13, color: theme.colors.textTertiary },
  sessProg: { height: 4, backgroundColor: theme.colors.surfaceLight, borderRadius: 2 },
  sessProgFill: { height: 4, backgroundColor: theme.colors.primary, borderRadius: 2 },

  sessionBody: { flex: 1 },
  sessionContent: { paddingHorizontal: 20, paddingBottom: 20 },
  sessionFooter: { padding: 20 },
  sessionFooterRow: { flexDirection: 'row', padding: 20, gap: 12 },

  nextBtn: { backgroundColor: theme.colors.primary, padding: 16, borderRadius: 16, alignItems: 'center', shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  nextBtnText: { fontSize: 17, fontWeight: 'bold', color: '#FFFFFF' },
  btnDisabled: { backgroundColor: theme.colors.textTertiary + '40', shadowOpacity: 0 },

  // Root intro
  rootIntroCard: { borderRadius: 24, padding: 28, alignItems: 'center', marginBottom: 24, borderWidth: 1 },
  rootBig: { fontSize: 48, fontWeight: 'bold', marginBottom: 8 },
  rootMeaningBig: { fontSize: 24, fontWeight: '600', color: theme.colors.textPrimary, marginBottom: 4 },
  rootOriginText: { fontSize: 13, color: theme.colors.textSecondary },
  sessionLabel: { fontSize: 13, color: theme.colors.primary, marginBottom: 10, fontWeight: '600' },
  rootWordRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: 12, padding: 14, marginBottom: 8, gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },
  rootWordNum: { fontSize: 14, fontWeight: 'bold', color: theme.colors.textTertiary, width: 20 },
  rootWordInfo: { flex: 1 },
  rootWordText: { fontSize: 16, fontWeight: '600', color: theme.colors.textPrimary },
  rootWordMeaning: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 2 },
  rootWordPos: { fontSize: 11, color: theme.colors.textTertiary },
  rootFamilyHint: { fontSize: 14, color: theme.colors.primary, textAlign: 'center', marginTop: 16, fontWeight: '600' },

  // Word learn
  wordBig: { fontSize: 36, fontWeight: 'bold', color: theme.colors.textPrimary, textAlign: 'center', marginTop: 20, marginBottom: 4 },
  speakerIcon: { fontSize: 20, color: theme.colors.textTertiary },
  wordPhonetic: { fontSize: 14, color: theme.colors.textTertiary, textAlign: 'center', marginBottom: 12 },
  wordMeaningBig: { fontSize: 22, fontWeight: '600', color: theme.colors.textPrimary, textAlign: 'center', marginBottom: 20 },
  morphRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  morphBlock: { flex: 1, borderRadius: 12, padding: 12, alignItems: 'center', gap: 4 },
  morphText: { fontSize: 15, fontWeight: 'bold', color: '#FFF' },
  morphSub: { fontSize: 10, color: 'rgba(255,255,255,0.85)' },
  assocCard: { backgroundColor: theme.colors.surface, borderRadius: 14, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  assocLabel: { fontSize: 11, color: theme.colors.primary, fontWeight: '700', marginBottom: 6, letterSpacing: 1 },
  assocText: { fontSize: 14, color: theme.colors.textSecondary, lineHeight: 22 },
  exCard: { backgroundColor: theme.colors.surface, borderRadius: 14, padding: 16, borderLeftWidth: 3, borderLeftColor: theme.colors.primary, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  exText: { fontSize: 14, color: theme.colors.textPrimary, fontStyle: 'italic', marginBottom: 6 },
  exTrans: { fontSize: 13, color: theme.colors.textSecondary },

  knowBtn: { flex: 1, backgroundColor: theme.colors.success, borderRadius: 16, padding: 16, alignItems: 'center', shadowColor: theme.colors.success, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 3 },
  knowText: { fontSize: 17, fontWeight: 'bold', color: '#FFF' },
  dontKnowBtn: { flex: 1, backgroundColor: theme.colors.surface, borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1.5, borderColor: '#E8ECF2' },
  dontKnowText: { fontSize: 17, fontWeight: '600', color: theme.colors.textSecondary },

  // Quiz
  quizQCard: { backgroundColor: theme.colors.surface, borderRadius: 18, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  quizQType: { fontSize: 11, color: theme.colors.primary, fontWeight: '700', letterSpacing: 1, marginBottom: 8 },
  quizQText: { fontSize: 18, color: theme.colors.textPrimary, lineHeight: 28 },
  quizOpt: { padding: 16, borderRadius: 14, borderWidth: 1.5, marginBottom: 10 },
  quizOptText: { fontSize: 16 },
  quizExpl: { backgroundColor: theme.colors.secondaryLight, borderRadius: 14, padding: 14, marginTop: 4 },
  quizExplText: { fontSize: 13, color: theme.colors.textSecondary, lineHeight: 20 },

  // Review
  flashCard: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  flashCardInner: { backgroundColor: theme.colors.surface, borderRadius: 24, padding: 32, alignItems: 'center', width: '100%', shadowColor: '#4A6AE5', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 6 },
  flashWord: { fontSize: 40, fontWeight: 'bold', color: theme.colors.textPrimary, marginBottom: 20 },
  flashMeaning: { fontSize: 24, color: theme.colors.textPrimary, fontWeight: '600', marginBottom: 12 },
  flashMorphRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  flashMorph: { fontSize: 14, fontWeight: '500' },
  flipBtn: { backgroundColor: theme.colors.primaryLight, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 14 },
  flipBtnText: { fontSize: 16, color: theme.colors.primary, fontWeight: '500' },
  gradeRow: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 20, gap: 8 },
  gradeBtn: { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center' },
  gradeText: { fontSize: 15, fontWeight: '600' },

  // Complete
  completeWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  completeTitle: { fontSize: 28, fontWeight: 'bold', color: theme.colors.textPrimary, marginBottom: 24 },
  completeCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: theme.colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 8, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 4 },
  completeScore: { fontSize: 40, fontWeight: 'bold', color: theme.colors.primary },
  completeLabel: { fontSize: 14, color: theme.colors.textSecondary, marginBottom: 28 },
  completeSummary: { flexDirection: 'row', gap: 24, marginBottom: 40 },
  completeStat: { alignItems: 'center' },
  completeStatNum: { fontSize: 22, fontWeight: 'bold', color: theme.colors.primary },
  completeStatLabel: { fontSize: 12, color: theme.colors.textTertiary },
  secondaryBtn: { backgroundColor: theme.colors.surfaceLight, padding: 16, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  secondaryBtnText: { fontSize: 16, fontWeight: '600', color: theme.colors.textSecondary },
});
