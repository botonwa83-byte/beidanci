import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { UserProgress } from '../data/types';
import {
  loadProgress, saveProgress, getInitialProgress,
  getLevelProgress, getOverallStats,
} from '../data/learningLogic';
import { levels, allWords, coreRoots } from '../data/wordDatabase';
import { loadAuth, maskPhone, updateNickname, AuthUser } from '../data/authService';
import { triggerLogout } from '../data/authState';

export const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  const reload = useCallback(async () => {
    const p = await loadProgress();
    setProgress(p);
    const u = await loadAuth();
    setAuthUser(u);
  }, []);

  useFocusEffect(useCallback(() => { reload(); }, [reload]));

  const handleEditNickname = () => {
    if (!authUser) return;
    Alert.prompt(
      '修改昵称',
      '请输入新的昵称',
      async (text) => {
        if (text && text.trim()) {
          const updated = await updateNickname(text.trim());
          if (updated) setAuthUser(updated);
        }
      },
      'plain-text',
      authUser.nickname,
    );
  };

  const handleLogout = () => {
    Alert.alert('退出登录', '确定要退出当前账号吗？学习进度会保留在本地。', [
      { text: '取消', style: 'cancel' },
      { text: '退出', style: 'destructive', onPress: () => triggerLogout() },
    ]);
  };

  const handleChangePace = async (wordsPerDay: number) => {
    if (!progress?.studyPlan) return;
    const totalDays = Math.ceil(allWords.length / wordsPerDay);
    const updated = {
      ...progress,
      studyPlan: { ...progress.studyPlan, wordsPerDay, totalDays },
    };
    await saveProgress(updated);
    setProgress(updated);
  };

  const handleReset = () => {
    Alert.alert('重置进度', '确定要清除所有学习数据吗？此操作不可撤销。', [
      { text: '取消', style: 'cancel' },
      {
        text: '确认重置', style: 'destructive',
        onPress: async () => {
          const initial = getInitialProgress();
          await saveProgress(initial);
          setProgress(initial);
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 120 }}>
      <Text style={styles.title}>我的</Text>

      {/* User info */}
      {authUser && (
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{authUser.nickname[0]}</Text>
          </View>
          <View style={styles.userInfo}>
            <TouchableOpacity onPress={handleEditNickname} activeOpacity={0.7}>
              <Text style={styles.userName}>{authUser.nickname} <Text style={styles.editHint}>{'\u270E'}</Text></Text>
            </TouchableOpacity>
            <Text style={styles.userPhone}>{maskPhone(authUser.phone)}</Text>
          </View>
        </View>
      )}

      {/* Overview */}
      {stats && (
        <View style={styles.overviewCard}>
          <View style={styles.ovRow}>
            <View style={styles.ovItem}>
              <Text style={styles.ovNum}>{stats.learnedWords}</Text>
              <Text style={styles.ovLabel}>已学单词</Text>
            </View>
            <View style={styles.ovItem}>
              <Text style={[styles.ovNum, { color: theme.colors.secondary }]}>{stats.learnedRoots}</Text>
              <Text style={styles.ovLabel}>已学词根</Text>
            </View>
            <View style={styles.ovItem}>
              <Text style={[styles.ovNum, { color: theme.colors.accent }]}>{stats.streak}</Text>
              <Text style={styles.ovLabel}>连续天数</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(stats.learnedWords / stats.totalWords * 100)}%` }]} />
          </View>
          <Text style={styles.ovMeta}>{stats.learnedWords} / {stats.totalWords} 词 ({(stats.learnedWords / stats.totalWords * 100).toFixed(1)}%)</Text>
        </View>
      )}

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
              <Text style={styles.planValue}>{Math.max(plan.totalDays - plan.currentDay + 1, 0)} 天</Text>
            </View>
          </View>

          <Text style={styles.subTitle}>调整每日目标</Text>
          <View style={styles.paceRow}>
            {[15, 25, 40, 60].map(n => (
              <TouchableOpacity key={n}
                style={[styles.paceBtn, plan.wordsPerDay === n && styles.paceBtnActive]}
                onPress={() => handleChangePace(n)} activeOpacity={0.7}>
                <Text style={[styles.paceBtnText, plan.wordsPerDay === n && styles.paceBtnTextActive]}>{n}</Text>
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
                <View key={l.level} style={[styles.levelRow, isActive && styles.levelRowActive]}>
                  <View style={[styles.levelDot, done ? styles.levelDotDone : isActive ? styles.levelDotActive : styles.levelDotPending]} />
                  <Text style={[styles.levelName, isActive && styles.levelNameActive]}>L{l.level} {l.name}</Text>
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
              <Text style={styles.histDetail}>学{h.wordsLearned} 复{h.wordsReviewed} 分{h.score}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Actions */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset} activeOpacity={0.7}>
          <Text style={styles.resetText}>重置所有进度</Text>
        </TouchableOpacity>
        <View style={{ height: 10 }} />
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
          <Text style={styles.logoutText}>退出登录</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  title: { fontSize: 28, fontWeight: 'bold', color: theme.colors.textPrimary, paddingHorizontal: 20, marginBottom: 20 },

  overviewCard: { marginHorizontal: 20, backgroundColor: theme.colors.surface, borderRadius: 20, padding: 20, marginBottom: 24, shadowColor: '#4A6AE5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4 },
  ovRow: { flexDirection: 'row', marginBottom: 16 },
  ovItem: { flex: 1, alignItems: 'center' },
  ovNum: { fontSize: 28, fontWeight: 'bold', color: theme.colors.primary, marginBottom: 4 },
  ovLabel: { fontSize: 12, color: theme.colors.textSecondary },
  progressBar: { height: 8, backgroundColor: theme.colors.surfaceLight, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: 8, backgroundColor: theme.colors.primary, borderRadius: 4 },
  ovMeta: { fontSize: 12, color: theme.colors.textTertiary, textAlign: 'center' },

  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 12, color: theme.colors.primary, marginBottom: 10, fontWeight: '700', letterSpacing: 1 },
  subTitle: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 14, marginBottom: 8 },

  planCard: { backgroundColor: theme.colors.surface, borderRadius: 16, padding: 16, gap: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  planRow: { flexDirection: 'row', justifyContent: 'space-between' },
  planLabel: { fontSize: 14, color: theme.colors.textSecondary },
  planValue: { fontSize: 14, fontWeight: '600', color: theme.colors.textPrimary },

  paceRow: { flexDirection: 'row', gap: 10 },
  paceBtn: { flex: 1, backgroundColor: theme.colors.surface, borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 2, borderColor: 'transparent', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  paceBtnActive: { borderColor: theme.colors.primary, backgroundColor: theme.colors.primaryLight },
  paceBtnText: { fontSize: 16, fontWeight: 'bold', color: theme.colors.textSecondary },
  paceBtnTextActive: { color: theme.colors.primary },

  levelCard: { backgroundColor: theme.colors.surface, borderRadius: 16, padding: 14, gap: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  levelRow: { flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 10, gap: 10 },
  levelRowActive: { backgroundColor: theme.colors.primaryLight },
  levelDot: { width: 10, height: 10, borderRadius: 5 },
  levelDotDone: { backgroundColor: theme.colors.success },
  levelDotActive: { backgroundColor: theme.colors.primary },
  levelDotPending: { backgroundColor: theme.colors.textTertiary + '40' },
  levelName: { fontSize: 14, color: theme.colors.textSecondary, flex: 1 },
  levelNameActive: { color: theme.colors.primary, fontWeight: '600' },
  levelTarget: { fontSize: 12, color: theme.colors.textTertiary },

  histRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: theme.colors.surface, borderRadius: 10, padding: 12, marginBottom: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.02, shadowRadius: 3, elevation: 1 },
  histDate: { fontSize: 13, color: theme.colors.textSecondary },
  histDetail: { fontSize: 13, color: theme.colors.textTertiary },

  userCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, backgroundColor: theme.colors.surface, borderRadius: 20, padding: 20, marginBottom: 24, gap: 16, shadowColor: '#4A6AE5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  userInfo: { flex: 1 },
  userName: { fontSize: 18, fontWeight: 'bold', color: theme.colors.textPrimary, marginBottom: 4 },
  editHint: { fontSize: 14, color: theme.colors.textTertiary },
  userPhone: { fontSize: 13, color: theme.colors.textTertiary },

  resetBtn: { backgroundColor: theme.colors.surface, borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#FFE0E0' },
  resetText: { fontSize: 14, color: theme.colors.error },
  logoutBtn: { backgroundColor: theme.colors.surface, borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#E8ECF2' },
  logoutText: { fontSize: 14, color: theme.colors.textSecondary },
});
