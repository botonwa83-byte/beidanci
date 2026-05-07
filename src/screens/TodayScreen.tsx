import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WordCard } from '../components/WordCard';
import { todayWords, coreRoots } from '../data/mockData';
import { theme } from '../theme';
import { Word, UserProgress } from '../data/types';
import { loadProgress, getLevelProgress, getTodayWords } from '../data/learningLogic';

type RootStackParamList = {
  Tab: undefined;
  WordDetail: { word: Word };
};

export const TodayScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [levelProgress, setLevelProgress] = useState<{ currentLevel: any; progress: number; completed: number; total: number } | null>(null);
  const [wordsToLearn, setWordsToLearn] = useState<Word[]>([]);

  useEffect(() => {
    const loadedProgress = loadProgress();
    setProgress(loadedProgress);
    setLevelProgress(getLevelProgress(loadedProgress));
    setWordsToLearn(getTodayWords(loadedProgress));
  }, []);

  const handleWordPress = (word: Word) => {
    navigation.navigate('WordDetail', { word });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>语根</Text>
        </View>
        <Text style={styles.subtitle}>词根联想记忆</Text>
      </View>

      {levelProgress && (
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLevel}>L{levelProgress.currentLevel.level} {levelProgress.currentLevel.name}</Text>
            <Text style={styles.progressText}>{levelProgress.completed}/{levelProgress.total}</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${levelProgress.progress}%`, backgroundColor: theme.colors.primary }]} />
          </View>
          <Text style={styles.progressLabel}>进度 {Math.round(levelProgress.progress)}%</Text>
        </View>
      )}

      {progress && (
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{progress.streak}</Text>
            <Text style={styles.statLabel}>连续天数</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{progress.totalScore}</Text>
            <Text style={styles.statLabel}>累计得分</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{progress.masteredRoots.length}</Text>
            <Text style={styles.statLabel}>已掌握词根</Text>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>今日单词</Text>
        {wordsToLearn.length > 0 ? (
          wordsToLearn.map((word) => (
            <WordCard key={word.id} word={word} onPress={() => handleWordPress(word)} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>今日学习任务已完成！</Text>
            <Text style={styles.emptySubText}>明天再来学习新单词吧</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>全部单词</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.wordScroll}>
          {todayWords.map((word) => (
            <TouchableWithoutFeedback key={word.id} onPress={() => handleWordPress(word)}>
              <View style={styles.smallCard}>
                <Text style={styles.smallWord}>{word.word}</Text>
                <Text style={styles.smallMeaning}>{word.meaning}</Text>
                <View style={styles.colorBar}>
                  {word.morphemes.map((m, i) => (
                    <View key={i} style={{ backgroundColor: m.color, flex: 1, height: 3 }} />
                  ))}
                </View>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>今日词根</Text>
        <View style={styles.rootGrid}>
          {coreRoots.slice(0, 2).map((root) => (
            <TouchableWithoutFeedback key={root.id}>
              <View style={[styles.rootCard, { backgroundColor: root.color }]}>
                <Text style={styles.rootText}>{root.root}</Text>
                <Text style={styles.rootMeaning}>{root.meaning}</Text>
                <Text style={styles.rootOrigin}>{root.origin}</Text>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerLeft: {},
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textTertiary,
    paddingBottom: 4,
  },
  progressCard: {
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLevel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  progressText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    backgroundColor: theme.colors.textTertiary + '30',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    borderRadius: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: theme.colors.textTertiary,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    marginBottom: 12,
    fontWeight: '500',
  },
  emptyState: {
    backgroundColor: theme.colors.surface,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  wordScroll: {
    flexDirection: 'row',
    gap: 12,
  },
  smallCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    width: 140,
    flexShrink: 0,
  },
  smallWord: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  smallMeaning: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  colorBar: {
    flexDirection: 'row',
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
  },
  rootGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  rootCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
  },
  rootText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  rootMeaning: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  rootOrigin: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
});
