import React, {useEffect, useRef, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppTheme, ThemeColors} from '../theme';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({onFinish}) => {
  const insets = useSafeAreaInsets();
  const {colors, isDark} = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const featureFades = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    // Logo entrance
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Feature items staggered
    const featureDelay = 800;
    featureFades.forEach((anim, i) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: featureDelay + i * 200,
        useNativeDriver: true,
      }).start();
    });
  }, [fadeAnim, slideAnim, logoScale, featureFades]);

  const features = [
    {icon: '🔮', title: '猜词超能力 · 词根破译', desc: '看到陌生长难词，拆开词根就能猜出意思，越破译段位越高'},
    {icon: '🧩', title: '先猜后揭 · 拼词工坊', desc: '不再被动刷词：先自己猜再翻答案，拆碎的词根亲手拼回去'},
    {icon: '🌍', title: '词源宇宙 · 单词身世', desc: '每个词都有来历故事，词源版图横跨拉丁语、希腊语等15种语言'},
    {icon: '🛋️', title: '懒人模式', desc: '零操作自动播放，按记忆曲线间隔重现，通勤躺平都能背'},
    {icon: '🌱', title: '词根词缀记忆法', desc: '330+ 词根词缀拆解 5800+ 词汇，记一个词根认一串词'},
    {icon: '✈️', title: '纯离线使用', desc: '无需网络，地铁飞机随时背单词'},
  ];

  return (
    <View style={[styles.container, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Logo 区域 */}
        <Animated.View
          style={[
            styles.logoSection,
            {
              opacity: fadeAnim,
              transform: [{scale: logoScale}, {translateY: slideAnim}],
            },
          ]}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>W</Text>
          </View>
          <Text style={styles.appName}>WordPulse</Text>
          <Text style={styles.slogan}>让每个单词都有脉搏</Text>
        </Animated.View>

        {/* 核心卖点 */}
        <Animated.View style={[styles.heroSection, {opacity: fadeAnim}]}>
          <Text style={styles.heroTitle}>装上 WordPulse，解锁「猜词超能力」</Text>
          <Text style={styles.heroSubtitle}>
            330+ 词根词缀 · 5800+ 词汇，覆盖考研 / 四六级 / 雅思 / 托福{'\n'}
            看到没背过的长单词，拆开词根也能猜出意思
          </Text>
        </Animated.View>

        {/* 功能亮点 */}
        <View style={styles.featuresSection}>
          {features.map((f, i) => (
            <Animated.View key={i} style={[styles.featureCard, {opacity: featureFades[i]}]}>
              <View style={styles.featureIconWrap}>
                <Text style={styles.featureIcon}>{f.icon}</Text>
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* 数据统计 */}
        <Animated.View style={[styles.statsSection, {opacity: fadeAnim}]}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>330+</Text>
            <Text style={styles.statLabel}>词根词缀</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5800+</Text>
            <Text style={styles.statLabel}>精选词汇</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>15</Text>
            <Text style={styles.statLabel}>语源语言</Text>
          </View>
        </Animated.View>

        {/* 开发者介绍 */}
        <Animated.View style={[styles.developerSection, {opacity: fadeAnim}]}>
          <View style={styles.devHeader}>
            <View style={styles.devAvatar}>
              <Text style={styles.devAvatarText}>K</Text>
            </View>
            <View style={styles.devInfo}>
              <Text style={styles.devName}>King Top</Text>
              <Text style={styles.devRole}>独立开发者 / 教育科技探索者</Text>
            </View>
          </View>
          <Text style={styles.devBio}>
            专注教育类 App 开发，致力于用科技让学习更高效、更有趣。
            WordPulse 是我的第一款产品，融合了认知科学与移动端体验，
            希望帮助每一位英语学习者突破词汇瓶颈。
          </Text>
          <View style={styles.devFooter}>
            <Text style={styles.devFollowTitle}>更多教育类应用，敬请期待</Text>
            <Text style={styles.devFollowHint}>
              关注我们，第一时间获取新产品动态
            </Text>
          </View>
        </Animated.View>

        {/* 底部版权 */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>WordPulse v2.0.0</Text>
          <Text style={styles.footerCopy}>
            {'(c)'} 2024-2026 King Top. All rights reserved.
          </Text>
        </View>
      </ScrollView>

      {/* 进入按钮 */}
      <TouchableOpacity
        style={[styles.enterButton, {marginBottom: insets.bottom + 16}]}
        onPress={onFinish}
        activeOpacity={0.8}>
        <Text style={styles.enterButtonText}>立即开始学习</Text>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingHorizontal: 24,
      paddingBottom: 100,
    },
    // Logo
    logoSection: {
      alignItems: 'center',
      marginTop: 60,
      marginBottom: 32,
    },
    logoContainer: {
      width: 80,
      height: 80,
      borderRadius: 20,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.primary,
      shadowOffset: {width: 0, height: 8},
      shadowOpacity: 0.3,
      shadowRadius: 16,
    },
    logoText: {
      fontSize: 40,
      fontWeight: '800',
      color: '#FFFFFF',
    },
    appName: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.textPrimary,
      marginTop: 16,
      letterSpacing: 1,
    },
    slogan: {
      fontSize: 15,
      color: colors.textSecondary,
      marginTop: 6,
    },

    // Hero
    heroSection: {
      alignItems: 'center',
      marginBottom: 32,
      paddingHorizontal: 8,
    },
    heroTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.textPrimary,
      textAlign: 'center',
      lineHeight: 30,
    },
    heroSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 10,
      lineHeight: 22,
    },

    // Features
    featuresSection: {
      marginBottom: 28,
    },
    featureCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    featureIconWrap: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: colors.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 14,
    },
    featureIcon: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.primary,
    },
    featureContent: {
      flex: 1,
    },
    featureTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 3,
    },
    featureDesc: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 19,
    },

    // Stats
    statsSection: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 14,
      paddingVertical: 20,
      paddingHorizontal: 16,
      marginBottom: 28,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 24,
      fontWeight: '800',
      color: colors.primary,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
    },
    statDivider: {
      width: 1,
      height: 32,
      backgroundColor: colors.divider,
    },

    // Developer
    developerSection: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 20,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    devHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 14,
    },
    devAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 14,
    },
    devAvatarText: {
      fontSize: 22,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    devInfo: {
      flex: 1,
    },
    devName: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    devRole: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 2,
    },
    devBio: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 22,
      marginBottom: 16,
    },
    devFooter: {
      borderTopWidth: 1,
      borderTopColor: colors.divider,
      paddingTop: 14,
      alignItems: 'center',
    },
    devFollowTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.primary,
      marginBottom: 4,
    },
    devFollowHint: {
      fontSize: 12,
      color: colors.textTertiary,
    },

    // Footer
    footer: {
      alignItems: 'center',
      marginBottom: 16,
    },
    footerText: {
      fontSize: 12,
      color: colors.textTertiary,
    },
    footerCopy: {
      fontSize: 11,
      color: colors.textTertiary,
      marginTop: 2,
    },

    // Enter button
    enterButton: {
      position: 'absolute',
      bottom: 0,
      left: 24,
      right: 24,
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: 'center',
      shadowColor: colors.primary,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    enterButtonText: {
      fontSize: 17,
      fontWeight: '700',
      color: '#FFFFFF',
    },
  });
