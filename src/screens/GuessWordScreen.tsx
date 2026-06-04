import React, {useState, useMemo, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Share,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  GuessWord,
  GuessSegment,
  shuffleGuessWords,
  segmentTypeLabel,
  getRelatedWords,
} from '../data/guessWords';
import {
  loadGuessProgress,
  saveGuessProgress,
  getRank,
  getDailyWord,
  comboCheer,
} from '../data/guessProgress';
import {speak} from '../utils/speech';
import {theme, useAppTheme, ThemeColors} from '../theme';

export const GuessWordScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {colors} = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [deck] = useState(() => shuffleGuessWords());
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [openSegs, setOpenSegs] = useState<Set<number>>(new Set());

  // 会话内
  const [combo, setCombo] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [hitCount, setHitCount] = useState(0);
  // 持久化
  const [totalDecoded, setTotalDecoded] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  // 战绩卡
  const [shareOpen, setShareOpen] = useState(false);
  const [hardestCracked, setHardestCracked] = useState<string | null>(null);

  const dailyWord = useMemo(() => getDailyWord(), []);
  // 展示用"长难词"：用户破译过的最长词，否则取词库最长的当样板
  const longestWord = useMemo(
    () =>
      shuffleGuessWords().reduce(
        (a, b) => (b.word.length > a.length ? b.word : a),
        '',
      ),
    [],
  );

  useEffect(() => {
    loadGuessProgress().then(p => {
      setTotalDecoded(p.totalDecoded);
      setMaxCombo(p.maxCombo);
    });
  }, []);

  const total = deck.length;
  const word = deck[index];
  const relatedGroups = useMemo(
    () => (word ? getRelatedWords(word) : []),
    [word],
  );

  const segColor = useCallback(
    (type: GuessSegment['type']): string => {
      switch (type) {
        case 'prefix':
          return colors.morphemeColors.prefix;
        case 'root':
          return colors.morphemeColors.root;
        case 'suffix':
          return colors.morphemeColors.suffix;
        default:
          return colors.textTertiary;
      }
    },
    [colors],
  );

  const resetCard = useCallback(() => {
    setRevealed(false);
    setOpenSegs(new Set());
  }, []);

  const toggleSeg = useCallback((i: number) => {
    setOpenSegs(prev => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
      }
      return next;
    });
  }, []);

  const openAll = useCallback(() => {
    setOpenSegs(new Set(word.segments.map((_, i) => i)));
  }, [word]);

  const goNext = useCallback(
    (hit: boolean) => {
      const newCombo = hit ? combo + 1 : 0;
      const newTotal = totalDecoded + 1;
      const newMax = Math.max(maxCombo, newCombo);
      setCombo(newCombo);
      setHitCount(c => (hit ? c + 1 : c));
      setAnsweredCount(c => c + 1);
      setTotalDecoded(newTotal);
      setMaxCombo(newMax);
      saveGuessProgress({totalDecoded: newTotal, maxCombo: newMax});
      if (hit) {
        setHardestCracked(prev =>
          word.word.length > (prev?.length || 0) ? word.word : prev,
        );
      }
      resetCard();
      setIndex(i => (i + 1) % total);
    },
    [combo, totalDecoded, maxCombo, total, resetCard, word],
  );

  const showcaseWord = hardestCracked || longestWord;

  const shareAchievement = useCallback(async () => {
    const r = getRank(totalDecoded);
    const message =
      `🔮 我在 WordPulse 解锁了「词根破译」超能力！\n` +
      `段位：${r.title} · 已破译 ${totalDecoded} 个长难词` +
      (maxCombo >= 2 ? ` · 最高连击 🔥${maxCombo}` : '') +
      `\n像 ${showcaseWord} 这种长单词，拆开词根就能猜出意思。\n` +
      `—— WordPulse 背单词（by King Top）`;
    try {
      await Share.share({message});
    } catch {
      // 用户取消分享，忽略
    }
  }, [totalDecoded, maxCombo, showcaseWord]);

  const jumpToDaily = useCallback(() => {
    const pos = deck.findIndex(w => w.word === dailyWord.word);
    if (pos >= 0) {
      resetCard();
      setIndex(pos);
    }
  }, [deck, dailyWord, resetCard]);

  if (!word) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.emptyText}>词库加载中…</Text>
      </View>
    );
  }

  const rank = getRank(totalDecoded);
  const rankProgress =
    rank.ceil === null
      ? 1
      : Math.min(
          1,
          (totalDecoded - rank.floor) / (rank.ceil - rank.floor),
        );
  const accuracy =
    answeredCount > 0 ? Math.round((hitCount / answeredCount) * 100) : 0;
  const morphemeParts = word.segments
    .map((s, i) => ({s, i}))
    .filter(({s}) => s.type !== 'link');
  const isDaily = word.word === dailyWord.word;
  const cheer = comboCheer(combo);

  return (
    <View style={styles.container}>
      {/* 段位 / 超能力值 常驻头部 */}
      <View style={[styles.header, {paddingTop: insets.top + 12}]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>词根破译</Text>
            <Text style={styles.subtitle}>拆开词根，再难的词也能破译</Text>
          </View>
          <TouchableOpacity
            style={styles.rankBadge}
            onPress={() => setShareOpen(true)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="查看并分享我的破译战绩">
            <Text style={styles.rankTitle}>{rank.title}</Text>
            <Text style={styles.rankCount}>已破译 {totalDecoded} · 🏆</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.powerBar}>
          <View
            style={[styles.powerFill, {width: `${Math.round(rankProgress * 100)}%`}]}
          />
        </View>
        <Text style={styles.powerHint}>
          {rank.ceil === null
            ? '超能力已满级 · 词根宗师'
            : `距「${rank.nextTitle}」还差 ${rank.ceil - totalDecoded} 词`}
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentWrap}>
          {/* 今日神词 + 进度 + 命中率 */}
          <View style={styles.statsRow}>
            <TouchableOpacity
              style={[styles.statBadge, styles.dailyBadge]}
              onPress={jumpToDaily}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={`今日神词 ${dailyWord.word}`}>
              <Text style={styles.dailyText}>⭐ 今日神词</Text>
            </TouchableOpacity>
            <View style={styles.statBadge}>
              <Text style={styles.statBadgeText}>
                {index + 1} / {total}
              </Text>
            </View>
            {combo >= 2 && (
              <View style={[styles.statBadge, styles.comboBadge]}>
                <Text style={styles.comboText}>🔥 连击 {combo}</Text>
              </View>
            )}
            {answeredCount > 0 && (
              <View style={styles.statBadge}>
                <Text style={styles.statBadgeText}>准确 {accuracy}%</Text>
              </View>
            )}
          </View>

          {/* 线索卡 */}
          <View style={styles.clueCard}>
            {isDaily && (
              <View style={styles.dailyTag}>
                <Text style={styles.dailyTagText}>⭐ 今日神词</Text>
              </View>
            )}
            <View style={styles.wordRow}>
              <Text style={styles.fullWord}>{word.word}</Text>
              <TouchableOpacity
                style={styles.speakerButton}
                onPress={() => speak(word.word)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`朗读 ${word.word}`}>
                <Text style={styles.speakerIcon}>{'🔊'}</Text>
              </TouchableOpacity>
            </View>
            {!!word.phonetic && (
              <Text style={styles.phonetic}>{word.phonetic}</Text>
            )}

            <View style={styles.decodeHintRow}>
              <Text style={styles.clueHint}>点色块逐个破译 👇</Text>
              {openSegs.size < word.segments.length && (
                <TouchableOpacity onPress={openAll} accessibilityRole="button">
                  <Text style={styles.openAllText}>全部展开</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* 分段色块：可点击翻开含义；连接字母弱化、不可点 */}
            <View style={styles.segRow}>
              {word.segments.map((s, i) =>
                s.type === 'link' ? (
                  <Text key={i} style={styles.linkText}>
                    {s.text}
                  </Text>
                ) : (
                  <TouchableOpacity
                    key={i}
                    onPress={() => toggleSeg(i)}
                    activeOpacity={0.85}
                    accessibilityRole="button"
                    accessibilityLabel={`${s.text} ${segmentTypeLabel(s.type)}`}
                    style={[styles.segBlock, {backgroundColor: segColor(s.type)}]}>
                    <Text style={styles.segText}>{s.text}</Text>
                    <Text style={styles.segType}>
                      {openSegs.has(i) ? s.meaning : segmentTypeLabel(s.type)}
                    </Text>
                  </TouchableOpacity>
                ),
              )}
            </View>

            {/* 已翻开的含义清单 */}
            {morphemeParts.some(({i}) => openSegs.has(i)) && (
              <View style={styles.meaningList}>
                {morphemeParts
                  .filter(({i}) => openSegs.has(i))
                  .map(({s, i}) => (
                    <View key={i} style={styles.meaningItem}>
                      <View
                        style={[
                          styles.meaningDot,
                          {backgroundColor: segColor(s.type)},
                        ]}
                      />
                      <Text style={styles.meaningItemText}>
                        <Text style={styles.meaningItemKey}>{s.text}</Text>
                        {'  '}
                        {s.meaning}
                      </Text>
                    </View>
                  ))}
              </View>
            )}

            <Text style={styles.question}>拼起来，它的中文意思是？</Text>
          </View>

          {!revealed ? (
            <TouchableOpacity
              style={styles.revealButton}
              onPress={() => setRevealed(true)}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="破译答案">
              <Text style={styles.revealButtonText}>破译答案</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.answerCard}>
              <View style={styles.answerMeaningRow}>
                <Text style={styles.answerPos}>{word.pos}</Text>
                <Text style={styles.answerMeaning}>{word.meaning}</Text>
              </View>

              <View style={styles.hintBox}>
                <Text style={styles.hintText}>{word.hint}</Text>
              </View>

              {relatedGroups.length > 0 && (
                <View style={styles.familySection}>
                  <Text style={styles.familyTitle}>
                    举一反三 · 记一个词根，认一串词
                  </Text>
                  {relatedGroups.map((g, gi) => (
                    <View key={gi} style={styles.familyGroup}>
                      <View style={styles.familyRootTag}>
                        <Text style={styles.familyRootText}>{g.morpheme}</Text>
                        <Text style={styles.familyRootMeaning}>{g.meaning}</Text>
                      </View>
                      {g.words.map((rw, ri) => (
                        <View key={ri} style={styles.familyWordRow}>
                          <Text style={styles.familyWord}>{rw.word}</Text>
                          <Text style={styles.familyWordMeaning}>
                            {rw.meaning}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.powerBanner}>
                <Text style={styles.powerText}>
                  ✨ 拆开词根你就破译了 —— 这就是 WordPulse 给你的超能力
                  {cheer ? `\n${cheer}` : ''}
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
                  accessibilityLabel="我破译了，下一个">
                  <Text style={styles.judgeHitText}>我破译了 ✓</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* 战绩分享卡 */}
      <Modal
        visible={shareOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setShareOpen(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShareOpen(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.shareCard}>
            <Text style={styles.shareBrandIcon}>🔮</Text>
            <Text style={styles.shareBrand}>WordPulse · 词根破译</Text>

            <View style={styles.shareRankWrap}>
              <Text style={styles.shareRankTitle}>{rank.title}</Text>
              <Text style={styles.shareSlogan}>我已解锁「词根破译」超能力</Text>
            </View>

            <View style={styles.shareStatsRow}>
              <View style={styles.shareStat}>
                <Text style={styles.shareStatNum}>{totalDecoded}</Text>
                <Text style={styles.shareStatLabel}>已破译</Text>
              </View>
              <View style={styles.shareStatDivider} />
              <View style={styles.shareStat}>
                <Text style={styles.shareStatNum}>🔥{maxCombo}</Text>
                <Text style={styles.shareStatLabel}>最高连击</Text>
              </View>
            </View>

            <View style={styles.shareWordBox}>
              <Text style={styles.shareWordLabel}>我能秒解这种长难词</Text>
              <Text style={styles.shareWord}>{showcaseWord}</Text>
            </View>

            <TouchableOpacity
              style={styles.shareButton}
              onPress={shareAchievement}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="分享战绩">
              <Text style={styles.shareButtonText}>分享我的超能力</Text>
            </TouchableOpacity>

            <Text style={styles.shareFooter}>by King Top · 长按截图也能晒</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: colors.background},
    center: {alignItems: 'center', justifyContent: 'center'},
    emptyText: {color: colors.textTertiary, fontSize: 14},
    header: {paddingHorizontal: 20, paddingBottom: 14},
    headerTop: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 30,
      fontWeight: '800',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    subtitle: {fontSize: 12, color: colors.textTertiary, letterSpacing: 0.5},
    rankBadge: {
      alignItems: 'flex-end',
      backgroundColor: colors.primaryLight,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: theme.borderRadius.md,
    },
    rankTitle: {fontSize: 15, fontWeight: '800', color: colors.primary},
    rankCount: {fontSize: 11, color: colors.primary, marginTop: 1},
    powerBar: {
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.surfaceLight,
      marginTop: 12,
      overflow: 'hidden',
    },
    powerFill: {
      height: '100%',
      borderRadius: 3,
      backgroundColor: colors.secondary,
    },
    powerHint: {fontSize: 11, color: colors.textTertiary, marginTop: 6},
    scroll: {flex: 1},
    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 100,
      paddingTop: 4,
      alignItems: 'center',
    },
    contentWrap: {width: '100%', maxWidth: theme.layout.maxContentWidth},
    statsRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 14,
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    statBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: theme.borderRadius.pill,
      backgroundColor: colors.surface,
      ...theme.shadow.sm,
    },
    statBadgeText: {fontSize: 12, color: colors.textSecondary, fontWeight: '600'},
    dailyBadge: {backgroundColor: colors.accentLight},
    dailyText: {fontSize: 12, color: colors.accent, fontWeight: '700'},
    comboBadge: {backgroundColor: colors.warningBg},
    comboText: {fontSize: 12, color: colors.warning, fontWeight: '700'},
    clueCard: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 18,
      ...theme.shadow.md,
    },
    dailyTag: {alignSelf: 'center', marginBottom: 8},
    dailyTagText: {fontSize: 12, color: colors.accent, fontWeight: '700'},
    wordRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    fullWord: {
      fontSize: 26,
      fontWeight: '800',
      color: colors.textPrimary,
      textAlign: 'center',
      letterSpacing: 0.5,
    },
    speakerButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primaryLight,
    },
    speakerIcon: {fontSize: 18},
    phonetic: {
      fontSize: 13,
      color: colors.textTertiary,
      textAlign: 'center',
      marginTop: 4,
    },
    decodeHintRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 16,
      marginBottom: 12,
    },
    clueHint: {fontSize: 12, color: colors.textTertiary, letterSpacing: 0.3},
    openAllText: {fontSize: 12, color: colors.primary, fontWeight: '600'},
    segRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 4,
      marginBottom: 16,
    },
    segBlock: {
      paddingHorizontal: 12,
      paddingVertical: 9,
      borderRadius: 11,
      alignItems: 'center',
      minWidth: 48,
    },
    segText: {fontSize: 17, fontWeight: '800', color: '#FFFFFF'},
    segType: {fontSize: 9, color: 'rgba(255,255,255,0.9)', marginTop: 2},
    linkText: {
      fontSize: 17,
      fontWeight: '600',
      color: colors.textTertiary,
      marginHorizontal: 1,
    },
    meaningList: {gap: 8, marginBottom: 16},
    meaningItem: {flexDirection: 'row', alignItems: 'center', gap: 8},
    meaningDot: {width: 7, height: 7, borderRadius: 4},
    meaningItemText: {
      flex: 1,
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 19,
    },
    meaningItemKey: {fontWeight: '700', color: colors.textPrimary},
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
    revealButtonText: {color: '#FFFFFF', fontSize: 16, fontWeight: '700'},
    answerCard: {
      marginTop: 16,
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 18,
      ...theme.shadow.md,
    },
    answerMeaningRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
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
    answerMeaning: {fontSize: 20, color: colors.textPrimary, fontWeight: '700'},
    hintBox: {
      marginTop: 14,
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 12,
      borderLeftWidth: 3,
      borderLeftColor: colors.primary,
    },
    hintText: {fontSize: 13, color: colors.textSecondary, lineHeight: 21},
    familySection: {
      marginTop: 16,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.divider,
      paddingTop: 14,
      gap: 12,
    },
    familyTitle: {
      fontSize: 11,
      color: colors.primary,
      fontWeight: '700',
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    familyGroup: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 12,
      gap: 6,
    },
    familyRootTag: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 8,
      marginBottom: 4,
    },
    familyRootText: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.morphemeColors.root,
    },
    familyRootMeaning: {
      fontSize: 12,
      color: colors.textTertiary,
      fontWeight: '600',
    },
    familyWordRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 12,
    },
    familyWord: {fontSize: 14, color: colors.textPrimary, fontWeight: '600'},
    familyWordMeaning: {
      fontSize: 13,
      color: colors.textSecondary,
      flexShrink: 1,
      textAlign: 'right',
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
    judgeRow: {flexDirection: 'row', gap: 10, marginTop: 16},
    judgeButton: {
      flex: 1,
      paddingVertical: 13,
      borderRadius: 12,
      alignItems: 'center',
    },
    judgeMiss: {backgroundColor: colors.surfaceLight},
    judgeMissText: {fontSize: 15, color: colors.textSecondary, fontWeight: '600'},
    judgeHit: {backgroundColor: colors.success},
    judgeHitText: {fontSize: 15, color: '#FFFFFF', fontWeight: '700'},
    // 战绩卡
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.55)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 28,
    },
    shareCard: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: colors.surface,
      borderRadius: 24,
      padding: 24,
      alignItems: 'center',
      ...theme.shadow.lg,
    },
    shareBrandIcon: {fontSize: 40},
    shareBrand: {
      fontSize: 13,
      color: colors.textTertiary,
      fontWeight: '700',
      letterSpacing: 1,
      marginTop: 6,
    },
    shareRankWrap: {alignItems: 'center', marginTop: 18},
    shareRankTitle: {
      fontSize: 30,
      fontWeight: '900',
      color: colors.primary,
      letterSpacing: 1,
    },
    shareSlogan: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 6,
      fontWeight: '600',
    },
    shareStatsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
      gap: 20,
    },
    shareStat: {alignItems: 'center', minWidth: 70},
    shareStatNum: {fontSize: 24, fontWeight: '800', color: colors.textPrimary},
    shareStatLabel: {fontSize: 12, color: colors.textTertiary, marginTop: 2},
    shareStatDivider: {
      width: StyleSheet.hairlineWidth,
      height: 36,
      backgroundColor: colors.divider,
    },
    shareWordBox: {
      marginTop: 20,
      width: '100%',
      backgroundColor: colors.secondaryLight,
      borderRadius: 14,
      paddingVertical: 14,
      paddingHorizontal: 12,
      alignItems: 'center',
    },
    shareWordLabel: {fontSize: 12, color: colors.secondary, fontWeight: '600'},
    shareWord: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.textPrimary,
      marginTop: 4,
      letterSpacing: 0.5,
    },
    shareButton: {
      marginTop: 22,
      width: '100%',
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: 'center',
      ...theme.shadow.colored(colors.primary),
    },
    shareButtonText: {color: '#FFFFFF', fontSize: 16, fontWeight: '700'},
    shareFooter: {fontSize: 11, color: colors.textTertiary, marginTop: 14},
  });
