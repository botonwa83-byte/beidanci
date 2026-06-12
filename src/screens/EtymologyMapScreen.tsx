import React, {useState, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {theme, useAppTheme, ThemeColors} from '../theme';
import {loadProgress} from '../data/learningLogic';
import {
  computeEtymologyMap,
  buildMapShareMessage,
  taggedWordCount,
  totalWordCount,
  EtymologyMapStats,
} from '../data/etymologyMap';

// 词源版图：英语是混血儿，学过的词点亮它来自的语言领土。
// 词源宇宙计划第 4 项（最后一项），slogan：没有一个单词是凭空来的。
export const EtymologyMapScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {colors} = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const [stats, setStats] = useState<EtymologyMapStats | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadProgress().then(p => {
        setStats(computeEtymologyMap(p.completedWords));
      });
    }, []),
  );

  const handleShare = async () => {
    if (!stats) {
      return;
    }
    try {
      await Share.share({message: buildMapShareMessage(stats)});
    } catch {
      // 用户取消分享，无需处理
    }
  };

  if (!stats) {
    return <View style={styles.container} />;
  }

  const litCount = stats.territories.filter(t => t.learned > 0).length;
  const coveragePercent = Math.round((taggedWordCount / totalWordCount) * 100);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingTop: insets.top + 12,
        paddingBottom: 60,
        maxWidth: theme.layout.maxContentWidth,
        width: '100%',
        alignSelf: 'center',
      }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          accessibilityLabel="返回"
          accessibilityRole="button">
          <Text style={styles.backText}>‹ 返回</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.shareBtn}
          onPress={handleShare}
          activeOpacity={0.7}
          accessibilityLabel="分享我的词源版图"
          accessibilityRole="button">
          <Text style={styles.shareText}>分享 ↗</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>🗺️ 词源版图</Text>
      <Text style={styles.slogan}>没有一个单词是凭空来的</Text>

      {/* 总览卡 */}
      <View style={styles.summaryCard} accessibilityLabel="词源版图总览">
        {stats.topShare ? (
          <Text style={styles.topShareText}>
            你的词汇{' '}
            <Text style={[styles.topSharePct, {color: stats.topShare.meta.color}]}>
              {stats.topShare.percent}%
            </Text>{' '}
            来自{stats.topShare.meta.emoji} {stats.topShare.meta.id}
          </Text>
        ) : (
          <Text style={styles.topShareText}>
            开始学习，点亮你的第一块语言领土
          </Text>
        )}
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNum}>{stats.learnedTagged}</Text>
            <Text style={styles.summaryLabel}>已点亮来历</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNum, {color: colors.secondary}]}>
              {litCount}
            </Text>
            <Text style={styles.summaryLabel}>已踏足语言</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNum, {color: colors.accent}]}>
              {stats.territories.length}
            </Text>
            <Text style={styles.summaryLabel}>全部领土</Text>
          </View>
        </View>
        <Text style={styles.summaryMeta}>
          英语是个混血儿——全库 {totalWordCount} 词已考证 {coveragePercent}% 的来历
        </Text>
      </View>

      {/* 领土列表 */}
      <Text style={styles.sectionTitle}>语言领土</Text>
      {stats.territories.map(t => {
        const lit = t.learned > 0;
        const pct = t.totalInDb > 0 ? (t.learned / t.totalInDb) * 100 : 0;
        return (
          <View
            key={t.meta.id}
            style={[styles.terrCard, !lit && styles.terrCardDim]}
            accessibilityLabel={`${t.meta.id}领土，已点亮${t.learned}词，共${t.totalInDb}词`}>
            <View style={styles.terrTop}>
              <Text style={[styles.terrEmoji, !lit && styles.terrEmojiDim]}>
                {t.meta.emoji}
              </Text>
              <View style={styles.terrInfo}>
                <View style={styles.terrNameRow}>
                  <Text style={[styles.terrName, lit && {color: t.meta.color}]}>
                    {t.meta.id}
                  </Text>
                  <Text style={styles.terrCount}>
                    {t.learned} / {t.totalInDb}
                  </Text>
                </View>
                <Text style={styles.terrTagline} numberOfLines={1}>
                  {t.meta.tagline}
                </Text>
              </View>
            </View>
            <View style={styles.terrBar}>
              <View
                style={[
                  styles.terrBarFill,
                  {width: `${pct}%`, backgroundColor: t.meta.color},
                ]}
              />
            </View>
            {t.samples.length > 0 && (
              <Text style={styles.terrSamples} numberOfLines={1}>
                {t.samples.join(' · ')}
              </Text>
            )}
          </View>
        );
      })}

      {/* 源头待考 */}
      {stats.unknownLearned > 0 && (
        <View style={styles.unknownCard}>
          <Text style={styles.unknownText}>
            🧭 另有 {stats.unknownLearned} 个已学词源头待考——词源学家也还在破译它们
          </Text>
        </View>
      )}

      {/* 分享 CTA */}
      <TouchableOpacity
        style={styles.shareCta}
        onPress={handleShare}
        activeOpacity={0.85}
        accessibilityLabel="分享我的词源版图"
        accessibilityRole="button">
        <Text style={styles.shareCtaText}>🗺️ 分享我的词源版图</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: colors.background},
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 8,
    },
    backBtn: {paddingVertical: 6, paddingRight: 12},
    backText: {fontSize: 16, color: colors.primary, fontWeight: '600'},
    shareBtn: {paddingVertical: 6, paddingLeft: 12},
    shareText: {fontSize: 14, color: colors.primary, fontWeight: '600'},

    title: {
      fontSize: 30,
      fontWeight: '800',
      color: colors.textPrimary,
      paddingHorizontal: 20,
      marginBottom: 4,
    },
    slogan: {
      fontSize: 13,
      color: colors.textTertiary,
      paddingHorizontal: 20,
      marginBottom: 20,
      fontWeight: '500',
    },

    summaryCard: {
      marginHorizontal: 20,
      backgroundColor: colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: 24,
      marginBottom: 28,
      ...theme.shadow.lg,
    },
    topShareText: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: 18,
      lineHeight: 24,
    },
    topSharePct: {fontSize: 24, fontWeight: '800'},
    summaryRow: {flexDirection: 'row', marginBottom: 16},
    summaryItem: {flex: 1, alignItems: 'center'},
    summaryNum: {
      fontSize: 28,
      fontWeight: '800',
      color: colors.primary,
      marginBottom: 4,
    },
    summaryLabel: {fontSize: 12, color: colors.textTertiary, fontWeight: '500'},
    summaryMeta: {
      fontSize: 12,
      color: colors.textTertiary,
      textAlign: 'center',
    },

    sectionTitle: {
      fontSize: 11,
      color: colors.primary,
      marginBottom: 12,
      paddingHorizontal: 20,
      fontWeight: '700',
      letterSpacing: 1.5,
      textTransform: 'uppercase',
    },

    terrCard: {
      marginHorizontal: 20,
      backgroundColor: colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: 16,
      marginBottom: 10,
      ...theme.shadow.sm,
    },
    terrCardDim: {opacity: 0.55},
    terrTop: {flexDirection: 'row', alignItems: 'center', marginBottom: 10},
    terrEmoji: {fontSize: 28, marginRight: 12},
    terrEmojiDim: {opacity: 0.5},
    terrInfo: {flex: 1},
    terrNameRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 2,
    },
    terrName: {fontSize: 16, fontWeight: '700', color: colors.textPrimary},
    terrCount: {fontSize: 12, color: colors.textTertiary, fontWeight: '600'},
    terrTagline: {fontSize: 12, color: colors.textTertiary},
    terrBar: {
      height: 5,
      backgroundColor: colors.surfaceLight,
      borderRadius: 3,
      overflow: 'hidden',
    },
    terrBarFill: {height: 5, borderRadius: 3},
    terrSamples: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 8,
      fontStyle: 'italic',
    },

    unknownCard: {
      marginHorizontal: 20,
      marginTop: 8,
      marginBottom: 8,
      backgroundColor: colors.surfaceLight,
      borderRadius: theme.borderRadius.lg,
      padding: 14,
    },
    unknownText: {fontSize: 12, color: colors.textTertiary, lineHeight: 18},

    shareCta: {
      marginHorizontal: 20,
      marginTop: 16,
      backgroundColor: colors.primary,
      borderRadius: theme.borderRadius.xl,
      paddingVertical: 16,
      alignItems: 'center',
      ...theme.shadow.colored(colors.primary),
    },
    shareCtaText: {fontSize: 16, fontWeight: '800', color: '#FFFFFF'},
  });
