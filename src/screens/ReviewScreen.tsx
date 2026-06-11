import React, {useState, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {theme, useAppTheme, ThemeColors} from '../theme';
import {Word, UserProgress, Question} from '../data/types';
import {
  loadProgress,
  saveProgress,
  getReviewWords,
  getLearnedWords,
  markWordLearned,
  generateReviewQuestions,
} from '../data/learningLogic';
import {allWords} from '../data/wordDatabase';

type Nav = NativeStackNavigationProp<{
  Tab: undefined;
  WordDetail: {word: Word};
}>;
type Mode = 'list' | 'quiz' | 'result';

export const ReviewScreen: React.FC = () => {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const {colors} = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [reviewWords, setReviewWords] = useState<Word[]>([]);
  const [learnedWords, setLearnedWords] = useState<Word[]>([]);
  const [mode, setMode] = useState<Mode>('list');

  // Quiz state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  // 拼词工坊：多选碎片瓦片下标
  const [buildSel, setBuildSel] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [wrongWords, setWrongWords] = useState<Word[]>([]);

  const reload = useCallback(async () => {
    const p = await loadProgress();
    setProgress(p);
    setReviewWords(getReviewWords(p));
    setLearnedWords(getLearnedWords(p));
  }, []);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  // Start quiz with given word list
  const startQuizWith = (words: Word[]) => {
    if (words.length === 0) {
      return;
    }
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    const batch = shuffled.slice(0, Math.min(20, shuffled.length));
    const qs = generateReviewQuestions(batch, Math.min(15, batch.length));
    if (qs.length === 0) {
      return;
    }
    setQuestions(qs);
    setQIdx(0);
    setSelected(null);
    setBuildSel([]);
    setRevealed(false);
    setCorrect(0);
    setWrong(0);
    setWrongWords([]);
    setMode('quiz');
  };

  const startQuiz = () => startQuizWith(reviewWords);
  const startFreePractice = () => startQuizWith(learnedWords);

  const isBuildQ = (q: Question | undefined) => q?.type === 'word-build';
  // 拼词题：选中集合恰好 = 全部正确碎片才算对
  const buildAnswerCorrect = (q: Question, sel: number[]): boolean => {
    const correctCount = q.options.filter(o => o.isCorrect).length;
    return (
      sel.length === correctCount && sel.every(i => q.options[i].isCorrect)
    );
  };

  const handleSelect = (idx: number) => {
    if (revealed) {
      return;
    }
    if (isBuildQ(questions[qIdx])) {
      setBuildSel(sel =>
        sel.includes(idx) ? sel.filter(i => i !== idx) : [...sel, idx],
      );
    } else {
      setSelected(idx);
    }
  };

  const handleConfirm = async () => {
    const q = questions[qIdx];
    const isBuild = isBuildQ(q);
    if ((isBuild ? buildSel.length === 0 : selected === null) || !progress) {
      return;
    }
    setRevealed(true);
    const isCorrect = isBuild
      ? buildAnswerCorrect(q, buildSel)
      : q.options[selected as number].isCorrect;
    if (isCorrect) {
      setCorrect(n => n + 1);
      if (q.wordId) {
        try {
          const p = markWordLearned(progress, q.wordId, 4);
          await saveProgress(p);
          setProgress(p);
        } catch {
          Alert.alert('保存失败', '进度保存失败，请重试');
        }
      }
      setTimeout(() => handleNext(), 600);
    } else {
      setWrong(n => n + 1);
      if (q.wordId) {
        const w = allWords.find(x => x.id === q.wordId);
        if (w) {
          setWrongWords(prev =>
            prev.some(pw => pw.id === w.id) ? prev : [...prev, w],
          );
        }
        try {
          const p = markWordLearned(progress, q.wordId, 1);
          await saveProgress(p);
          setProgress(p);
        } catch {
          Alert.alert('保存失败', '进度保存失败，请重试');
        }
      }
    }
  };

  const handleNext = () => {
    if (qIdx < questions.length - 1) {
      setQIdx(i => i + 1);
      setSelected(null);
      setBuildSel([]);
      setRevealed(false);
    } else {
      setMode('result');
    }
  };

  const handleFinish = () => {
    setMode('list');
    reload();
  };

  // ==================== Quiz Mode ====================
  if (mode === 'quiz' && questions.length > 0) {
    const q = questions[qIdx];
    if (!q) {
      setMode('result');
      return null;
    }
    const pct = ((qIdx + 1) / questions.length) * 100;
    const typeLabel: Record<string, string> = {
      'word-meaning': '词义选择',
      'root-meaning': '词根含义',
      'morpheme-match': '词根匹配',
      'fill-blank': '例句填空',
      'word-build': '拼词工坊',
    };
    const isBuild = isBuildQ(q);
    const answeredCorrectly =
      revealed &&
      (isBuild
        ? buildAnswerCorrect(q, buildSel)
        : selected !== null && q.options[selected].isCorrect);

    return (
      <View style={[styles.container, {paddingTop: insets.top + 8}]}>
        <View style={styles.quizHeader}>
          <TouchableOpacity onPress={handleFinish}>
            <Text style={styles.closeText}>{'\u2715'}</Text>
          </TouchableOpacity>
          <Text style={styles.quizProgress}>
            {qIdx + 1} / {questions.length}
          </Text>
          <Text style={styles.quizScore}>
            {correct} {'\u2713'} {wrong} {'\u2717'}
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, {width: `${pct}%`}]} />
        </View>

        <ScrollView
          style={styles.quizBody}
          contentContainerStyle={styles.quizContent}>
          <View style={styles.questionCard}>
            <Text style={styles.questionType}>
              {typeLabel[q.type] || '练习'}
            </Text>
            <Text style={styles.questionText}>{q.question}</Text>
            {isBuild && !revealed && (
              <Text style={styles.buildHint}>
                选出能拼成这个词的全部碎片（已选 {buildSel.length} 块）
              </Text>
            )}
          </View>

          {isBuild ? (
            <View style={styles.buildRow}>
              {q.options.map((opt, idx) => {
                const sel = buildSel.includes(idx);
                let bg = colors.surface;
                let border = colors.cardBorder;
                let color = colors.textPrimary;
                if (revealed) {
                  if (opt.isCorrect) {
                    bg = colors.secondaryLight;
                    border = colors.success;
                    color = colors.success;
                  } else if (sel) {
                    bg = colors.errorBg;
                    border = colors.error;
                    color = colors.error;
                  }
                } else if (sel) {
                  bg = colors.primaryLight;
                  border = colors.primary;
                  color = colors.primary;
                }
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.buildTile,
                      {backgroundColor: bg, borderColor: border},
                    ]}
                    onPress={() => handleSelect(idx)}
                    disabled={revealed}
                    activeOpacity={0.7}
                    accessibilityLabel={`碎片 ${opt.text}`}
                    accessibilityRole="button"
                    accessibilityState={{selected: sel}}>
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
              if (revealed) {
                if (opt.isCorrect) {
                  bg = colors.secondaryLight;
                  border = colors.success;
                  color = colors.success;
                } else if (selected === idx) {
                  bg = colors.errorBg;
                  border = colors.error;
                  color = colors.error;
                }
              } else if (selected === idx) {
                bg = colors.primaryLight;
                border = colors.primary;
                color = colors.primary;
              }
              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.optionBtn,
                    {backgroundColor: bg, borderColor: border},
                  ]}
                  onPress={() => handleSelect(idx)}
                  disabled={revealed}
                  activeOpacity={0.7}>
                  <Text style={[styles.optionText, {color}]}>{opt.text}</Text>
                </TouchableOpacity>
              );
            })
          )}

          {revealed && (
            <View style={styles.explanationCard}>
              <Text style={styles.explanationText}>{q.explanation}</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.bottomBar}>
          {!revealed ? (
            <TouchableOpacity
              style={[
                styles.confirmBtn,
                (isBuild ? buildSel.length === 0 : selected === null) &&
                  styles.btnDisabled,
              ]}
              onPress={handleConfirm}
              disabled={isBuild ? buildSel.length === 0 : selected === null}
              activeOpacity={0.7}>
              <Text style={styles.confirmBtnText}>确认</Text>
            </TouchableOpacity>
          ) : !answeredCorrectly ? (
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={handleNext}
              activeOpacity={0.7}>
              <Text style={styles.confirmBtnText}>
                {qIdx < questions.length - 1 ? '下一题' : '查看结果'}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }

  // ==================== Result Mode ====================
  if (mode === 'result') {
    const total = correct + wrong;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    return (
      <View style={[styles.container, {paddingTop: insets.top + 20}]}>
        <ScrollView contentContainerStyle={styles.resultContent}>
          <Text style={styles.resultTitle}>练习结束</Text>

          <View style={styles.scoreCircle}>
            <Text style={styles.scoreNum}>{accuracy}%</Text>
          </View>
          <Text style={styles.scoreLabel}>正确率</Text>

          <View style={styles.resultStats}>
            <View style={styles.resultStat}>
              <Text style={[styles.resultStatNum, {color: colors.success}]}>
                {correct}
              </Text>
              <Text style={styles.resultStatLabel}>正确</Text>
            </View>
            <View style={styles.resultStat}>
              <Text style={[styles.resultStatNum, {color: colors.error}]}>
                {wrong}
              </Text>
              <Text style={styles.resultStatLabel}>错误</Text>
            </View>
            <View style={styles.resultStat}>
              <Text style={[styles.resultStatNum, {color: colors.primary}]}>
                {total}
              </Text>
              <Text style={styles.resultStatLabel}>总题数</Text>
            </View>
          </View>

          {wrongWords.length > 0 && (
            <View style={styles.wrongSection}>
              <Text style={styles.wrongTitle}>需要加强的单词</Text>
              {wrongWords.map(w => (
                <TouchableOpacity
                  key={w.id}
                  style={styles.wrongRow}
                  onPress={() => {
                    handleFinish();
                    nav.navigate('WordDetail', {word: w});
                  }}
                  activeOpacity={0.7}>
                  <View>
                    <Text style={styles.wrongWord}>{w.word}</Text>
                    <Text style={styles.wrongMeaning}>{w.meaning}</Text>
                  </View>
                  <Text style={styles.wrongArrow}>{'\u203A'}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => {
              reload();
              startQuizWith(
                reviewWords.length > 0 ? reviewWords : learnedWords,
              );
            }}
            activeOpacity={0.7}>
            <Text style={styles.retryBtnText}>再练一组</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleFinish}
            activeOpacity={0.7}>
            <Text style={styles.backBtnText}>返回</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // ==================== List Mode ====================
  const dueCount = reviewWords.length;
  const learnedCount = progress?.completedWords.length || 0;

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
      <View style={styles.header}>
        <Text style={styles.title}>复习</Text>
        <Text style={styles.subtitle}>习题练习，巩固记忆</Text>
      </View>

      <View style={styles.summaryCard}>
        {dueCount > 0 ? (
          <>
            <Text style={styles.summaryNum}>{dueCount}</Text>
            <Text style={styles.summaryLabel}>个单词待复习</Text>
            <TouchableOpacity
              style={styles.startBtn}
              onPress={startQuiz}
              activeOpacity={0.7}>
              <Text style={styles.startBtnText}>开始复习练习</Text>
            </TouchableOpacity>
          </>
        ) : learnedCount > 0 ? (
          <>
            <Text style={styles.summaryNum}>{learnedCount}</Text>
            <Text style={styles.summaryLabel}>个已学单词</Text>
            <Text style={styles.dueHint}>暂无到期复习词，可以自由练习巩固</Text>
          </>
        ) : (
          <>
            <Text style={styles.summaryNum}>0</Text>
            <Text style={styles.summaryLabel}>个已学单词</Text>
            <Text style={styles.dueHint}>先去学习新词吧</Text>
          </>
        )}
      </View>

      {learnedCount > 0 && (
        <View style={styles.freeCard}>
          <View style={styles.freeInfo}>
            <Text style={styles.freeTitle}>自由练习</Text>
            <Text style={styles.freeSub}>
              从 {learnedCount} 个已学词中随机出题
            </Text>
          </View>
          <TouchableOpacity
            style={styles.freeBtn}
            onPress={startFreePractice}
            activeOpacity={0.7}>
            <Text style={styles.freeBtnText}>开始</Text>
          </TouchableOpacity>
        </View>
      )}

      {dueCount > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>练习题型</Text>
          <View style={styles.typeGrid}>
            {[
              {
                label: '词义选择',
                desc: '看英文选中文',
                color: colors.primary,
              },
              {
                label: '中译英',
                desc: '看中文选英文',
                color: colors.secondary,
              },
              {
                label: '例句填空',
                desc: '语境中选词',
                color: colors.accent,
              },
              {label: '词根匹配', desc: '找同根词', color: '#C57BDB'},
              {label: '拼词工坊', desc: '用碎片拼词', color: '#8B5CF6'},
            ].map((t, i) => (
              <View key={i} style={styles.typeCard}>
                <View style={[styles.typeDot, {backgroundColor: t.color}]} />
                <Text style={styles.typeLabel}>{t.label}</Text>
                <Text style={styles.typeDesc}>{t.desc}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {dueCount > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>待复习词汇 ({dueCount})</Text>
          {reviewWords.slice(0, 20).map(w => (
            <TouchableOpacity
              key={w.id}
              style={styles.wordRow}
              onPress={() => nav.navigate('WordDetail', {word: w})}
              activeOpacity={0.7}>
              <Text style={styles.wordText}>{w.word}</Text>
              <Text style={styles.wordMeaning} numberOfLines={1}>
                {w.meaning}
              </Text>
            </TouchableOpacity>
          ))}
          {dueCount > 20 && (
            <Text style={styles.moreText}>...还有 {dueCount - 20} 个</Text>
          )}
        </View>
      )}

      {progress && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>复习统计</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNum}>
                {Object.keys(progress.wordReviews).length}
              </Text>
              <Text style={styles.statLabel}>复习池</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNum, {color: colors.secondary}]}>
                {learnedCount}
              </Text>
              <Text style={styles.statLabel}>已学词数</Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: colors.background},
    header: {paddingHorizontal: 20, marginBottom: 20},
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    subtitle: {fontSize: 13, color: colors.textTertiary},

    summaryCard: {
      marginHorizontal: 20,
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 28,
      alignItems: 'center',
      marginBottom: 24,
      shadowColor: '#4A6AE5',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 4,
    },
    summaryNum: {
      fontSize: 48,
      fontWeight: 'bold',
      color: colors.accent,
      marginBottom: 4,
    },
    summaryLabel: {
      fontSize: 15,
      color: colors.textSecondary,
      marginBottom: 20,
    },
    startBtn: {
      backgroundColor: colors.primary,
      paddingHorizontal: 48,
      paddingVertical: 14,
      borderRadius: 14,
      shadowColor: colors.primary,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    startBtnText: {fontSize: 17, fontWeight: 'bold', color: '#FFF'},
    dueHint: {fontSize: 13, color: colors.textTertiary, marginTop: 8},

    freeCard: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 20,
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 18,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    },
    freeInfo: {flex: 1},
    freeTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    freeSub: {fontSize: 13, color: colors.textTertiary},
    freeBtn: {
      backgroundColor: colors.secondary,
      paddingHorizontal: 22,
      paddingVertical: 10,
      borderRadius: 12,
      shadowColor: colors.secondary,
      shadowOffset: {width: 0, height: 3},
      shadowOpacity: 0.25,
      shadowRadius: 6,
      elevation: 3,
    },
    freeBtnText: {fontSize: 15, fontWeight: 'bold', color: '#FFF'},

    typeGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
    typeCard: {
      width: '47%' as any,
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 14,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
    },
    typeDot: {width: 8, height: 8, borderRadius: 4, marginBottom: 8},
    typeLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 2,
    },
    typeDesc: {fontSize: 12, color: colors.textTertiary},

    section: {paddingHorizontal: 20, marginBottom: 20},
    sectionTitle: {
      fontSize: 12,
      color: colors.primary,
      marginBottom: 10,
      fontWeight: '700',
      letterSpacing: 1,
    },

    wordRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 14,
      marginBottom: 8,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.03,
      shadowRadius: 4,
      elevation: 1,
    },
    wordText: {fontSize: 16, fontWeight: '600', color: colors.textPrimary},
    wordMeaning: {fontSize: 14, color: colors.textSecondary, maxWidth: 140},
    moreText: {
      fontSize: 13,
      color: colors.textTertiary,
      textAlign: 'center',
      marginTop: 4,
    },

    statsRow: {flexDirection: 'row', gap: 12},
    statCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 16,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.04,
      shadowRadius: 6,
      elevation: 1,
    },
    statNum: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 4,
    },
    statLabel: {fontSize: 11, color: colors.textSecondary},

    // Quiz mode
    quizHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 6,
    },
    closeText: {fontSize: 18, color: colors.textTertiary, width: 30},
    quizProgress: {fontSize: 14, color: colors.textSecondary},
    quizScore: {fontSize: 13, color: colors.textTertiary},
    progressBar: {
      height: 4,
      backgroundColor: colors.surfaceLight,
      marginHorizontal: 20,
      borderRadius: 2,
      marginBottom: 12,
    },
    progressFill: {
      height: 4,
      backgroundColor: colors.primary,
      borderRadius: 2,
    },

    quizBody: {flex: 1},
    quizContent: {
      paddingHorizontal: 20,
      paddingBottom: 20,
      maxWidth: theme.layout.maxContentWidth,
      width: '100%',
      alignSelf: 'center',
    },
    questionCard: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 22,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    questionType: {
      fontSize: 11,
      color: colors.primary,
      fontWeight: '700',
      letterSpacing: 1,
      marginBottom: 10,
    },
    questionText: {
      fontSize: 18,
      color: colors.textPrimary,
      lineHeight: 28,
      fontWeight: '500',
    },

    optionBtn: {
      padding: 16,
      borderRadius: 14,
      borderWidth: 1.5,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.03,
      shadowRadius: 3,
      elevation: 1,
    },
    optionText: {fontSize: 16},

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

    explanationCard: {
      backgroundColor: colors.secondaryLight,
      borderRadius: 14,
      padding: 16,
      marginTop: 4,
    },
    explanationText: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 22,
    },

    bottomBar: {padding: 20},
    confirmBtn: {
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
    confirmBtnText: {fontSize: 17, fontWeight: 'bold', color: '#FFF'},
    btnDisabled: {
      backgroundColor: colors.textTertiary + '60',
      shadowOpacity: 0,
      elevation: 0,
    },

    // Result mode
    resultContent: {
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingBottom: 60,
      maxWidth: theme.layout.maxContentWidth,
      width: '100%',
      alignSelf: 'center',
    },
    resultTitle: {
      fontSize: 26,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 24,
      marginTop: 20,
    },
    scoreCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
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
    scoreNum: {fontSize: 36, fontWeight: 'bold', color: colors.primary},
    scoreLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 24,
    },
    resultStats: {flexDirection: 'row', gap: 24, marginBottom: 28},
    resultStat: {alignItems: 'center'},
    resultStatNum: {fontSize: 28, fontWeight: 'bold', marginBottom: 2},
    resultStatLabel: {fontSize: 12, color: colors.textTertiary},

    wrongSection: {width: '100%', marginBottom: 24},
    wrongTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.error,
      marginBottom: 10,
    },
    wrongRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 14,
      marginBottom: 8,
      borderLeftWidth: 3,
      borderLeftColor: colors.error,
    },
    wrongWord: {fontSize: 16, fontWeight: '600', color: colors.textPrimary},
    wrongMeaning: {fontSize: 13, color: colors.textSecondary, marginTop: 2},
    wrongArrow: {fontSize: 20, color: colors.textTertiary},

    retryBtn: {
      backgroundColor: colors.primary,
      paddingHorizontal: 48,
      paddingVertical: 14,
      borderRadius: 16,
      marginBottom: 12,
      shadowColor: colors.primary,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    retryBtnText: {fontSize: 16, fontWeight: 'bold', color: '#FFF'},
    backBtn: {
      backgroundColor: colors.surfaceLight,
      paddingHorizontal: 48,
      paddingVertical: 14,
      borderRadius: 16,
    },
    backBtnText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textSecondary,
    },
  });
