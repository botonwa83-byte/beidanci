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
} from '../data/lazySession';
import {getFullMeaning, getWordOrigin} from '../data/wordDatabase';
import {speak} from '../utils/speech';

const TICK_MS = 250;

// 懒人模式：零操作自动播放。点屏幕暂停/继续，左上角退出。
export const LazyModeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {colors} = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();

  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [queue, setQueue] = useState<LazyQueue | null>(null);
  const [idx, setIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const spokenRef = useRef(-1);

  const startBatch = useCallback((p: UserProgress) => {
    const q = buildLazyQueue(p);
    setQueue(q);
    setIdx(0);
    setElapsed(0);
    setDone(false);
    spokenRef.current = -1;
  }, []);

  useEffect(() => {
    loadProgress().then(p => {
      setProgress(p);
      startBatch(p);
    });
  }, [startBatch]);

  // 切后台自动暂停
  useEffect(() => {
    const sub = AppState.addEventListener('change', s => {
      if (s !== 'active') {
        setPaused(true);
      }
    });
    return () => sub.remove();
  }, []);

  const step = queue && !done ? queue.steps[idx] : null;
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
      setDone(true);
    } catch {
      Alert.alert('保存失败', '进度保存失败，请重试');
    } finally {
      setSaving(false);
    }
  }, [progress, queue, saving]);

  // 播放心跳
  useEffect(() => {
    if (!step || paused || done) {
      return;
    }
    const t = setInterval(() => setElapsed(e => e + TICK_MS), TICK_MS);
    return () => clearInterval(t);
  }, [step, paused, done]);

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

  // ==================== 结算页 ====================
  if (done) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.doneEmoji}>😴✨</Text>
        <Text style={styles.doneTitle}>这批躺完了</Text>
        <Text style={styles.doneSub}>
          新词 {queue.newWords.length} 个 × 3 遍 · 复习{' '}
          {queue.reviewWords.length} 个{'\n'}
          已按记忆曲线排好下次见面的日子
        </Text>
        <TouchableOpacity
          style={styles.againBtn}
          onPress={() => startBatch(progress)}
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

  const word = step!.word;
  const showMeaning = elapsed >= timings!.meaningAt;
  const showExample = elapsed >= timings!.exampleAt;
  const origin = getWordOrigin(word.word);
  const pct = Math.round(((idx + 1) / queue.steps.length) * 100);

  return (
    <Pressable
      style={[styles.container, {paddingTop: insets.top + 8}]}
      onPress={() => setPaused(p => !p)}
      accessibilityLabel={paused ? '继续播放' : '暂停播放'}>
      {/* 顶栏：退出 + 进度 */}
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
          {idx + 1}/{queue.steps.length}
        </Text>
      </View>

      <View style={styles.cardArea}>
        {step!.isReview ? (
          <Text style={styles.passTag}>🔁 复习 · 还记得吗</Text>
        ) : (
          <Text style={styles.passTag}>
            {step!.pass === 1 ? '✨ 新词' : `第 ${step!.pass} 遍 · 先回忆一下`}
          </Text>
        )}

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

      <Text style={styles.hint}>
        {paused ? '⏸ 已暂停 · 点屏幕继续' : '全自动播放 · 点屏幕暂停'}
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
    exampleBox: {
      marginTop: 24,
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
    hint: {
      textAlign: 'center',
      fontSize: 12,
      color: colors.textTertiary,
      marginBottom: 28,
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
      marginBottom: 28,
    },
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
