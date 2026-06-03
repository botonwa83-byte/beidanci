import React, {useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  guessWords,
  shuffleGuessWords,
  morphemeTypeLabel,
} from '../data/guessWords';
import {theme, useAppTheme, ThemeColors} from '../theme';

export const GuessWordScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {colors} = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  // 每次进入页面洗一次牌，确定式数据、随机顺序
  const [deck] = useState(() => shuffleGuessWords());
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [hitCount, setHitCount] = useState(0); // 自评"猜对了"的次数
  const [answeredCount, setAnsweredCount] = useState(0);

  const total = deck.length;
  const word = deck[index];

  const goNext = useCallback(
    (hit: boolean) => {
      setHitCount(c => (hit ? c + 1 : c));
      setAnsweredCount(c => c + 1);
      setRevealed(false);
      setIndex(i => (i + 1) % total);
    },
    [total],
  );

  if (!word) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.emptyText}>词库加载中…</Text>
      </View>
    );
  }

  const accuracy =
    answeredCount > 0 ? Math.round((hitCount / answeredCount) * 100) : 0;

  return (
    <View style={styles.container}>
      <View style={[styles.header, {paddingTop: insets.top + 12}]}>
        <Text style={styles.title}>猜词超能力</Text>
        <Text style={styles.subtitle}>
          只看词根词缀，猜出它的意思 · 共 {total} 词
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentWrap}>
          {/* 进度 + 命中率 */}
          <View style={styles.statsRow}>
            <View style={styles.statBadge}>
              <Text style={styles.statBadgeText}>
                第 {index + 1} / {total}
              </Text>
            </View>
            {answeredCount > 0 && (
              <View style={[styles.statBadge, styles.statBadgeAccent]}>
                <Text style={styles.statBadgeAccentText}>
                  猜中率 {accuracy}% · {hitCount}/{answeredCount}
                </Text>
              </View>
            )}
          </View>

          {/* 线索卡：词根词缀拆解（不显示完整释义） */}
          <View style={styles.clueCard}>
            <Text style={styles.clueHint}>把下面的词根词缀含义拼起来 👇</Text>

            <View style={styles.morphemeRow}>
              {word.morphemes.map((m, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <Text style={styles.morphemePlus}>+</Text>}
                  <View
                    style={[styles.morphemeBlock, {backgroundColor: m.color}]}>
                    <Text style={styles.morphemeText}>{m.text}</Text>
                    <Text style={styles.morphemeType}>
                      {morphemeTypeLabel(m.type)}
                    </Text>
                  </View>
                </React.Fragment>
              ))}
            </View>

            <View style={styles.meaningList}>
              {word.morphemes.map((m, i) => (
                <View key={i} style={styles.meaningItem}>
                  <View
                    style={[styles.meaningDot, {backgroundColor: m.color}]}
                  />
                  <Text style={styles.meaningItemText}>
                    <Text style={styles.meaningItemKey}>{m.text}</Text>
                    {'  '}
                    {m.meaning}
                  </Text>
                </View>
              ))}
            </View>

            <Text style={styles.question}>
              那么，这个词大概是什么意思？
            </Text>
          </View>

          {/* 揭晓前：按钮；揭晓后：答案 */}
          {!revealed ? (
            <TouchableOpacity
              style={styles.revealButton}
              onPress={() => setRevealed(true)}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="揭晓答案">
              <Text style={styles.revealButtonText}>揭晓答案</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.answerCard}>
              <Text style={styles.answerWord}>{word.word}</Text>
              {!!word.phonetic && (
                <Text style={styles.answerPhonetic}>{word.phonetic}</Text>
              )}
              <View style={styles.answerMeaningRow}>
                {!!word.partOfSpeech && (
                  <Text style={styles.answerPos}>{word.partOfSpeech}</Text>
                )}
                <Text style={styles.answerMeaning}>{word.meaning}</Text>
              </View>

              {!!word.associationStory && (
                <View style={styles.storyBox}>
                  <Text style={styles.storyText}>{word.associationStory}</Text>
                </View>
              )}

              <View style={styles.powerBanner}>
                <Text style={styles.powerText}>
                  ✨ 看，拆开词根你就猜到了 —— 这就是 WordPulse 给你的超能力
                </Text>
              </View>

              <View style={styles.judgeRow}>
                <TouchableOpacity
                  style={[styles.judgeButton, styles.judgeMiss]}
                  onPress={() => goNext(false)}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel="没猜到，下一个">
                  <Text style={styles.judgeMissText}>没猜到</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.judgeButton, styles.judgeHit]}
                  onPress={() => goNext(true)}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel="我猜对了，下一个">
                  <Text style={styles.judgeHitText}>我猜对了 ✓</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    center: {alignItems: 'center', justifyContent: 'center'},
    emptyText: {color: colors.textTertiary, fontSize: 14},
    header: {
      paddingHorizontal: 20,
      paddingBottom: 14,
    },
    title: {
      fontSize: 30,
      fontWeight: '800',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 12,
      color: colors.textTertiary,
      letterSpacing: 0.5,
    },
    scroll: {flex: 1},
    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 100,
      alignItems: 'center',
    },
    contentWrap: {
      width: '100%',
      maxWidth: theme.layout.maxContentWidth,
    },
    statsRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 14,
      flexWrap: 'wrap',
    },
    statBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: theme.borderRadius.pill,
      backgroundColor: colors.surface,
      ...theme.shadow.sm,
    },
    statBadgeText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    statBadgeAccent: {
      backgroundColor: colors.primaryLight,
    },
    statBadgeAccentText: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: '700',
    },
    clueCard: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 18,
      ...theme.shadow.md,
    },
    clueHint: {
      fontSize: 12,
      color: colors.textTertiary,
      marginBottom: 14,
      letterSpacing: 0.3,
    },
    morphemeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 6,
      marginBottom: 16,
    },
    morphemePlus: {
      fontSize: 18,
      color: colors.textTertiary,
      fontWeight: '700',
    },
    morphemeBlock: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      alignItems: 'center',
      minWidth: 56,
    },
    morphemeText: {
      fontSize: 18,
      fontWeight: '800',
      color: '#FFFFFF',
    },
    morphemeType: {
      fontSize: 10,
      color: 'rgba(255,255,255,0.85)',
      marginTop: 2,
    },
    meaningList: {
      gap: 8,
      marginBottom: 16,
    },
    meaningItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    meaningDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
    },
    meaningItemText: {
      flex: 1,
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 19,
    },
    meaningItemKey: {
      fontWeight: '700',
      color: colors.textPrimary,
    },
    question: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.textPrimary,
      marginTop: 2,
    },
    revealButton: {
      marginTop: 16,
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 15,
      alignItems: 'center',
      ...theme.shadow.colored(colors.primary),
    },
    revealButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
    },
    answerCard: {
      marginTop: 16,
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 18,
      ...theme.shadow.md,
    },
    answerWord: {
      fontSize: 30,
      fontWeight: '800',
      color: colors.textPrimary,
      textAlign: 'center',
    },
    answerPhonetic: {
      fontSize: 14,
      color: colors.textTertiary,
      textAlign: 'center',
      marginTop: 4,
    },
    answerMeaningRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginTop: 10,
    },
    answerPos: {
      fontSize: 13,
      color: colors.primary,
      backgroundColor: colors.primaryLight,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
      overflow: 'hidden',
      fontWeight: '600',
    },
    answerMeaning: {
      fontSize: 17,
      color: colors.textPrimary,
      fontWeight: '600',
    },
    storyBox: {
      marginTop: 14,
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 12,
      borderLeftWidth: 3,
      borderLeftColor: colors.primary,
    },
    storyText: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 21,
    },
    powerBanner: {
      marginTop: 14,
      backgroundColor: colors.secondaryLight,
      borderRadius: 12,
      padding: 12,
    },
    powerText: {
      fontSize: 13,
      color: colors.secondary,
      fontWeight: '600',
      lineHeight: 20,
      textAlign: 'center',
    },
    judgeRow: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 16,
    },
    judgeButton: {
      flex: 1,
      paddingVertical: 13,
      borderRadius: 12,
      alignItems: 'center',
    },
    judgeMiss: {
      backgroundColor: colors.surfaceLight,
    },
    judgeMissText: {
      fontSize: 15,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    judgeHit: {
      backgroundColor: colors.success,
    },
    judgeHitText: {
      fontSize: 15,
      color: '#FFFFFF',
      fontWeight: '700',
    },
  });
