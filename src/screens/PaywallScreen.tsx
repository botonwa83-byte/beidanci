import React, {useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {theme, useAppTheme, ThemeColors} from '../theme';
import {useEntitlement} from '../data/useEntitlement';

/**
 * 付费墙。买断模式：一次 ¥12，永久解锁完整版。
 * 可从「我的」主动进入，也可在功能门禁处被动弹出（route.params.feature 用于定制文案）。
 */

type PaywallRoute = RouteProp<{Paywall: {feature?: string} | undefined}, 'Paywall'>;

const BENEFITS: {icon: string; title: string; desc: string}[] = [
  {icon: '🔮', title: '无限猜词', desc: '词根破译超能力，敞开练，不再每日限量'},
  {icon: '📚', title: '全部词库与关卡', desc: '解锁所有等级，例句 / 联想故事 / 词根拆解全开'},
  {icon: '🧠', title: '完整记忆曲线', desc: '科学复习排程，长期记忆不靠运气'},
  {icon: '📖', title: '全部语法精讲', desc: '系统语法专题，告别试看'},
];

export const PaywallScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {colors} = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const route = useRoute<PaywallRoute>();
  const {isPremium, loading, price, purchase, restore} = useEntitlement();

  const feature = route.params?.feature;
  const headline = feature
    ? `「${feature}」是完整版功能`
    : '解锁 WordPulse 完整版';

  const close = () => navigation.goBack();

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={close}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
          accessibilityLabel="关闭"
          accessibilityRole="button">
          <Text style={styles.closeIcon}>{'✕'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + 32,
          maxWidth: theme.layout.maxContentWidth,
          width: '100%',
          alignSelf: 'center',
        }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.heroBadge}>完整版</Text>
          <Text style={styles.heroTitle}>{headline}</Text>
          <Text style={styles.heroSub}>一次购买，永久使用 · 非订阅</Text>
        </View>

        <View style={styles.benefits}>
          {BENEFITS.map(b => (
            <View key={b.title} style={styles.benefitRow}>
              <Text style={styles.benefitIcon}>{b.icon}</Text>
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>{b.title}</Text>
                <Text style={styles.benefitDesc}>{b.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {isPremium ? (
          <View style={styles.ownedCard}>
            <Text style={styles.ownedTitle}>✓ 已是完整版用户</Text>
            <Text style={styles.ownedDesc}>感谢支持，所有功能已为你解锁</Text>
          </View>
        ) : (
          <>
            <View style={styles.priceCard}>
              <View>
                <Text style={styles.priceLabel}>终身买断</Text>
                <Text style={styles.priceNote}>一次付费，永久解锁</Text>
              </View>
              <Text style={styles.priceValue}>{price}</Text>
            </View>

            <TouchableOpacity
              style={[styles.buyBtn, loading && styles.buyBtnDisabled]}
              onPress={purchase}
              disabled={loading}
              activeOpacity={0.85}
              accessibilityLabel="立即解锁完整版"
              accessibilityRole="button">
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buyBtnText}>立即解锁 · {price}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.restoreBtn}
              onPress={restore}
              disabled={loading}
              activeOpacity={0.7}
              accessibilityLabel="恢复购买"
              accessibilityRole="button">
              <Text style={styles.restoreText}>恢复购买</Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.legal}>
          通过 App Store 完成支付。购买后将永久解锁完整版功能，非订阅、无自动续费。
          更换设备可在「恢复购买」中找回。
        </Text>
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: colors.background},
    topBar: {
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 4,
      alignItems: 'flex-end',
    },
    closeIcon: {fontSize: 20, color: colors.textTertiary, fontWeight: '600'},

    hero: {paddingHorizontal: 24, paddingTop: 12, marginBottom: 28},
    heroBadge: {
      alignSelf: 'flex-start',
      backgroundColor: colors.primaryLight,
      color: colors.primary,
      fontSize: 12,
      fontWeight: '800',
      letterSpacing: 1,
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: theme.borderRadius.pill,
      overflow: 'hidden',
      marginBottom: 14,
    },
    heroTitle: {
      fontSize: 26,
      fontWeight: '800',
      color: colors.textPrimary,
      lineHeight: 34,
      marginBottom: 8,
    },
    heroSub: {fontSize: 14, color: colors.textSecondary, fontWeight: '500'},

    benefits: {
      marginHorizontal: 20,
      backgroundColor: colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: 20,
      gap: 18,
      marginBottom: 24,
      ...theme.shadow.md,
    },
    benefitRow: {flexDirection: 'row', alignItems: 'flex-start', gap: 14},
    benefitIcon: {fontSize: 24, width: 30, textAlign: 'center'},
    benefitText: {flex: 1},
    benefitTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 3,
    },
    benefitDesc: {fontSize: 13, color: colors.textSecondary, lineHeight: 19},

    priceCard: {
      marginHorizontal: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.primaryLight,
      borderRadius: theme.borderRadius.lg,
      paddingVertical: 18,
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    priceLabel: {fontSize: 16, fontWeight: '700', color: colors.textPrimary},
    priceNote: {fontSize: 12, color: colors.textSecondary, marginTop: 3},
    priceValue: {fontSize: 26, fontWeight: '800', color: colors.primary},

    buyBtn: {
      marginHorizontal: 20,
      backgroundColor: colors.primary,
      borderRadius: theme.borderRadius.lg,
      paddingVertical: 17,
      alignItems: 'center',
      marginBottom: 10,
      ...theme.shadow.colored(colors.primary),
    },
    buyBtnDisabled: {opacity: 0.6},
    buyBtnText: {fontSize: 17, fontWeight: '800', color: '#FFFFFF'},

    restoreBtn: {paddingVertical: 12, alignItems: 'center', marginBottom: 8},
    restoreText: {fontSize: 14, color: colors.primary, fontWeight: '600'},

    ownedCard: {
      marginHorizontal: 20,
      backgroundColor: colors.secondaryLight,
      borderRadius: theme.borderRadius.lg,
      padding: 20,
      alignItems: 'center',
      marginBottom: 16,
    },
    ownedTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.secondary,
      marginBottom: 4,
    },
    ownedDesc: {fontSize: 13, color: colors.textSecondary},

    legal: {
      paddingHorizontal: 28,
      marginTop: 12,
      fontSize: 11,
      color: colors.textTertiary,
      lineHeight: 17,
      textAlign: 'center',
    },
  });
