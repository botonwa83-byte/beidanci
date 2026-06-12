import React, {useState, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {theme, useAppTheme, ThemeColors} from '../theme';
import {useEntitlement} from '../data/useEntitlement';
import {UserProgress} from '../data/types';
import {
  loadProgress,
  saveProgress,
  getInitialProgress,
  getLevelProgress,
  getOverallStats,
} from '../data/learningLogic';
import {levels, allWords} from '../data/wordDatabase';
import {computeEtymologyMap} from '../data/etymologyMap';
import {
  loadAuth,
  maskPhone,
  updateNickname,
  AuthUser,
} from '../data/authService';
import {triggerLogout} from '../data/authState';
import {PrivacyScreen} from './PrivacyScreen';

export const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {colors} = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const {isPremium} = useEntitlement();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [privacyType, setPrivacyType] = useState<'privacy' | 'terms' | null>(null);

  const reload = useCallback(async () => {
    const p = await loadProgress();
    setProgress(p);
    const u = await loadAuth();
    setAuthUser(u);
  }, []);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const handleEditNickname = () => {
    if (!authUser) {
      return;
    }
    Alert.prompt(
      '修改昵称',
      '请输入新的昵称',
      async text => {
        if (text && text.trim()) {
          const updated = await updateNickname(text.trim());
          if (updated) {
            setAuthUser(updated);
          }
        }
      },
      'plain-text',
      authUser.nickname,
    );
  };

  const handleLogout = () => {
    Alert.alert('退出登录', '确定要退出当前账号吗？学习进度会保留在本地。', [
      {text: '取消', style: 'cancel'},
      {text: '退出', style: 'destructive', onPress: () => triggerLogout()},
    ]);
  };

  const handleChangePace = async (wordsPerDay: number) => {
    if (!progress?.studyPlan) {
      return;
    }
    try {
      const totalDays = Math.ceil(allWords.length / wordsPerDay);
      const updated = {
        ...progress,
        studyPlan: {...progress.studyPlan, wordsPerDay, totalDays},
      };
      await saveProgress(updated);
      setProgress(updated);
    } catch {
      Alert.alert('保存失败', '学习计划更新失败，请重试');
    }
  };

  const handleReset = () => {
    Alert.alert('重置进度', '确定要清除所有学习数据吗？此操作不可撤销。', [
      {text: '取消', style: 'cancel'},
      {
        text: '确认重置',
        style: 'destructive',
        onPress: async () => {
          try {
            const initial = getInitialProgress();
            await saveProgress(initial);
            setProgress(initial);
          } catch {
            Alert.alert('重置失败', '操作失败，请重试');
          }
        },
      },
    ]);
  };

  const stats = progress ? getOverallStats(progress) : null;
  const plan = progress?.studyPlan;
  const lp = progress ? getLevelProgress(progress) : null;

  const recent = (progress?.learningHistory || [])
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7);

  const mapStats = useMemo(
    () => (progress ? computeEtymologyMap(progress.completedWords) : null),
    [progress],
  );
  const litLangs = mapStats
    ? mapStats.territories.filter(t => t.learned > 0).length
    : 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{paddingTop: insets.top + 16, paddingBottom: 120, maxWidth: theme.layout.maxContentWidth, width: '100%', alignSelf: 'center'}}>
      <Text style={styles.title}>我的</Text>

      {/* User info */}
      {authUser && (
        <View style={styles.userCard} accessibilityLabel="用户信息">
          <View style={styles.avatar} accessibilityLabel={`头像 ${authUser.nickname}`}>
            <Text style={styles.avatarText}>{authUser.nickname[0]}</Text>
          </View>
          <View style={styles.userInfo}>
            <TouchableOpacity onPress={handleEditNickname} activeOpacity={0.7} accessibilityLabel="修改昵称" accessibilityRole="button">
              <Text style={styles.userName}>
                {authUser.nickname}{' '}
                <Text style={styles.editHint}>{'\u270E'}</Text>
              </Text>
            </TouchableOpacity>
            <Text style={styles.userPhone}>{maskPhone(authUser.phone)}</Text>
          </View>
        </View>
      )}

      {/* 会员入口 */}
      <TouchableOpacity
        style={[styles.memberCard, isPremium && styles.memberCardOwned]}
        onPress={() => navigation.navigate('Paywall')}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={isPremium ? '完整版用户' : '升级完整版'}>
        <View style={styles.memberLeft}>
          <Text style={styles.memberTitle}>
            {isPremium ? '✓ 完整版用户' : '升级完整版'}
          </Text>
          <Text style={styles.memberDesc}>
            {isPremium
              ? '已解锁全部功能，感谢支持'
              : '一次买断，永久解锁无限猜词 / 全部词库'}
          </Text>
        </View>
        {!isPremium && <Text style={styles.memberArrow}>解锁 ›</Text>}
      </TouchableOpacity>

      {/* Overview */}
      {stats && (
        <View style={styles.overviewCard}>
          <View style={styles.ovRow}>
            <View style={styles.ovItem}>
              <Text style={styles.ovNum}>{stats.learnedWords}</Text>
              <Text style={styles.ovLabel}>已学单词</Text>
            </View>
            <View style={styles.ovItem}>
              <Text style={[styles.ovNum, {color: colors.secondary}]}>
                {stats.learnedRoots}
              </Text>
              <Text style={styles.ovLabel}>已学词根</Text>
            </View>
            <View style={styles.ovItem}>
              <Text style={[styles.ovNum, {color: colors.accent}]}>
                {stats.streak}
              </Text>
              <Text style={styles.ovLabel}>连续天数</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {width: `${(stats.learnedWords / stats.totalWords) * 100}%`},
              ]}
            />
          </View>
          <Text style={styles.ovMeta}>
            {stats.learnedWords} / {stats.totalWords} 词 (
            {((stats.learnedWords / stats.totalWords) * 100).toFixed(1)}%)
          </Text>
        </View>
      )}

      {/* 词源版图入口 */}
      <TouchableOpacity
        style={styles.mapCard}
        onPress={() => navigation.navigate('EtymologyMap')}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="查看我的词源版图">
        <Text style={styles.mapEmoji}>🗺️</Text>
        <View style={styles.mapInfo}>
          <Text style={styles.mapTitle}>我的词源版图</Text>
          <Text style={styles.mapDesc}>
            {mapStats && mapStats.topShare
              ? `已踏足 ${litLangs} 种语言 · ${mapStats.topShare.percent}% 来自${mapStats.topShare.meta.id}`
              : '没有一个单词是凭空来的'}
          </Text>
        </View>
        <Text style={styles.mapArrow}>›</Text>
      </TouchableOpacity>

      {/* Plan info */}
      {plan && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>学习计划</Text>
          <View style={styles.planCard}>
            <View style={styles.planRow}>
              <Text style={styles.planLabel}>每日目标</Text>
              <Text style={styles.planValue}>{plan.wordsPerDay} 词/天</Text>
            </View>
            <View style={styles.planRow}>
              <Text style={styles.planLabel}>已学天数</Text>
              <Text style={styles.planValue}>第 {plan.currentDay} 天</Text>
            </View>
            <View style={styles.planRow}>
              <Text style={styles.planLabel}>预计总天数</Text>
              <Text style={styles.planValue}>{plan.totalDays} 天</Text>
            </View>
            <View style={styles.planRow}>
              <Text style={styles.planLabel}>剩余天数</Text>
              <Text style={styles.planValue}>
                {Math.max(plan.totalDays - plan.currentDay + 1, 0)} 天
              </Text>
            </View>
          </View>

          <Text style={styles.subTitle}>调整每日目标</Text>
          <View style={styles.paceRow}>
            {[15, 25, 40, 60].map(n => (
              <TouchableOpacity
                key={n}
                style={[
                  styles.paceBtn,
                  plan.wordsPerDay === n && styles.paceBtnActive,
                ]}
                onPress={() => handleChangePace(n)}
                activeOpacity={0.7}
                accessibilityLabel={`每日学习${n}个单词`}
                accessibilityRole="button"
                accessibilityState={{selected: plan.wordsPerDay === n}}>
                <Text
                  style={[
                    styles.paceBtnText,
                    plan.wordsPerDay === n && styles.paceBtnTextActive,
                  ]}>
                  {n}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Level */}
      {lp && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>等级进度</Text>
          <View style={styles.levelCard}>
            {levels.map(l => {
              const isActive = l.level === lp.currentLevel.level;
              const done = progress!.completedWords.length >= l.targetWords;
              return (
                <View
                  key={l.level}
                  style={[styles.levelRow, isActive && styles.levelRowActive]}>
                  <View
                    style={[
                      styles.levelDot,
                      done
                        ? styles.levelDotDone
                        : isActive
                        ? styles.levelDotActive
                        : styles.levelDotPending,
                    ]}
                  />
                  <Text
                    style={[
                      styles.levelName,
                      isActive && styles.levelNameActive,
                    ]}>
                    L{l.level} {l.name}
                  </Text>
                  <Text style={styles.levelTarget}>{l.targetWords}词</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Recent history */}
      {recent.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>最近学习</Text>
          {recent.map(h => (
            <View key={h.date} style={styles.histRow}>
              <Text style={styles.histDate}>{h.date}</Text>
              <Text style={styles.histDetail}>
                学{h.wordsLearned} 复{h.wordsReviewed} 分{h.score}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Actions */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => setPrivacyType('terms')}
          activeOpacity={0.7}
          accessibilityLabel="查看用户协议"
          accessibilityRole="button">
          <Text style={styles.menuBtnText}>用户协议</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => setPrivacyType('privacy')}
          activeOpacity={0.7}
          accessibilityLabel="查看隐私政策"
          accessibilityRole="button">
          <Text style={styles.menuBtnText}>隐私政策</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={handleReset}
          activeOpacity={0.7}
          accessibilityLabel="重置所有学习进度"
          accessibilityRole="button">
          <Text style={styles.resetText}>重置所有进度</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.7}
          accessibilityLabel="退出登录"
          accessibilityRole="button">
          <Text style={styles.logoutText}>退出登录</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={privacyType !== null} animationType="slide">
        {privacyType && (
          <PrivacyScreen
            type={privacyType}
            onClose={() => setPrivacyType(null)}
          />
        )}
      </Modal>
    </ScrollView>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: colors.background},
    title: {
      fontSize: 30,
      fontWeight: '800',
      color: colors.textPrimary,
      paddingHorizontal: 20,
      marginBottom: 20,
    },

    memberCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: 20,
      marginBottom: 24,
      backgroundColor: colors.primary,
      borderRadius: theme.borderRadius.xl,
      paddingVertical: 18,
      paddingHorizontal: 20,
      ...theme.shadow.colored(colors.primary),
    },
    memberCardOwned: {
      backgroundColor: colors.secondary,
      ...theme.shadow.colored(colors.secondary),
    },
    memberLeft: {flex: 1, paddingRight: 12},
    memberTitle: {
      fontSize: 17,
      fontWeight: '800',
      color: '#FFFFFF',
      marginBottom: 4,
    },
    memberDesc: {fontSize: 12, color: 'rgba(255,255,255,0.85)', lineHeight: 17},
    memberArrow: {fontSize: 15, fontWeight: '800', color: '#FFFFFF'},

    overviewCard: {
      marginHorizontal: 20,
      backgroundColor: colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: 24,
      marginBottom: 24,
      ...theme.shadow.lg,
    },
    ovRow: {flexDirection: 'row', marginBottom: 20},
    ovItem: {flex: 1, alignItems: 'center'},
    ovNum: {
      fontSize: 32,
      fontWeight: '800',
      color: colors.primary,
      marginBottom: 4,
    },
    ovLabel: {fontSize: 12, color: colors.textTertiary, fontWeight: '500'},
    progressBar: {
      height: 6,
      backgroundColor: colors.surfaceLight,
      borderRadius: 3,
      overflow: 'hidden',
      marginBottom: 10,
    },
    progressFill: {
      height: 6,
      backgroundColor: colors.primary,
      borderRadius: 3,
    },
    ovMeta: {fontSize: 12, color: colors.textTertiary, textAlign: 'center'},

    mapCard: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 20,
      marginBottom: 24,
      backgroundColor: colors.surface,
      borderRadius: theme.borderRadius.xl,
      paddingVertical: 16,
      paddingHorizontal: 20,
      gap: 14,
      ...theme.shadow.lg,
    },
    mapEmoji: {fontSize: 30},
    mapInfo: {flex: 1},
    mapTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 3,
    },
    mapDesc: {fontSize: 12, color: colors.textTertiary},
    mapArrow: {fontSize: 22, color: colors.textTertiary, fontWeight: '300'},

    section: {paddingHorizontal: 20, marginBottom: 28},
    sectionTitle: {
      fontSize: 11,
      color: colors.primary,
      marginBottom: 12,
      fontWeight: '700',
      letterSpacing: 1.5,
      textTransform: 'uppercase',
    },
    subTitle: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 16,
      marginBottom: 10,
    },

    planCard: {
      backgroundColor: colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: 18,
      gap: 14,
      ...theme.shadow.sm,
    },
    planRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
    planLabel: {fontSize: 14, color: colors.textSecondary},
    planValue: {fontSize: 14, fontWeight: '600', color: colors.textPrimary},

    paceRow: {flexDirection: 'row', gap: 10},
    paceBtn: {
      flex: 1,
      backgroundColor: colors.surfaceLight,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    paceBtnActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight,
      ...theme.shadow.colored(colors.primary),
    },
    paceBtnText: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.textTertiary,
    },
    paceBtnTextActive: {color: colors.primary},

    levelCard: {
      backgroundColor: colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: 6,
      gap: 2,
      ...theme.shadow.sm,
    },
    levelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 12,
      gap: 12,
    },
    levelRowActive: {backgroundColor: colors.primaryLight},
    levelDot: {width: 8, height: 8, borderRadius: 4},
    levelDotDone: {backgroundColor: colors.success},
    levelDotActive: {backgroundColor: colors.primary},
    levelDotPending: {backgroundColor: colors.textTertiary + '30'},
    levelName: {fontSize: 14, color: colors.textSecondary, flex: 1},
    levelNameActive: {color: colors.primary, fontWeight: '600'},
    levelTarget: {fontSize: 12, color: colors.textTertiary, fontWeight: '500'},

    histRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginBottom: 6,
      ...theme.shadow.sm,
    },
    histDate: {fontSize: 13, color: colors.textSecondary, fontWeight: '500'},
    histDetail: {fontSize: 13, color: colors.textTertiary},

    userCard: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 20,
      backgroundColor: colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: 20,
      marginBottom: 24,
      gap: 16,
      ...theme.shadow.lg,
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 18,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.shadow.colored(colors.primary),
    },
    avatarText: {fontSize: 22, fontWeight: '800', color: '#FFFFFF'},
    userInfo: {flex: 1},
    userName: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    editHint: {fontSize: 14, color: colors.textTertiary},
    userPhone: {fontSize: 13, color: colors.textTertiary, fontWeight: '500'},

    menuBtn: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      paddingVertical: 15,
      paddingHorizontal: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
      ...theme.shadow.sm,
    },
    menuBtnText: {fontSize: 15, color: colors.textPrimary, fontWeight: '500'},
    resetBtn: {
      backgroundColor: colors.error + '08',
      borderRadius: 14,
      paddingVertical: 15,
      alignItems: 'center',
      marginBottom: 8,
      marginTop: 8,
    },
    resetText: {fontSize: 14, color: colors.error, fontWeight: '500'},
    logoutBtn: {
      borderRadius: 14,
      paddingVertical: 15,
      alignItems: 'center',
    },
    logoutText: {fontSize: 14, color: colors.textTertiary, fontWeight: '500'},
  });
