import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { coreRoots, rootWordMap } from '../data/mockData';
import { theme } from '../theme';

export const RootScreen: React.FC = () => {
  const [activeRoot, setActiveRoot] = useState('port');

  const currentRootData = coreRoots.find((r) => r.root === activeRoot);
  const currentWords = rootWordMap[activeRoot] || [];

  const displayedRoots = coreRoots.slice(0, 8);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>词根探索</Text>
        <Text style={styles.subtitle}>一个词根，解锁一个词汇家族</Text>
      </View>

      <ScrollView horizontal style={styles.tabsContainer} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContent}>
        {displayedRoots.map((root) => (
          <TouchableOpacity
            key={root.id}
            style={[styles.tab, activeRoot === root.root && styles.activeTab]}
            onPress={() => setActiveRoot(root.root)}
          >
            <Text style={[styles.tabText, activeRoot === root.root ? { color: root.color, fontWeight: 'bold' } : { color: theme.colors.textSecondary }]}>
              {root.root}
            </Text>
            {activeRoot === root.root && (
              <View style={[styles.tabIndicator, { backgroundColor: root.color }]} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {currentRootData && (
        <View style={[styles.rootInfo, { backgroundColor: currentRootData.color + '20' }]}>
          <Text style={[styles.rootText, { color: currentRootData.color }]}>{currentRootData.root}</Text>
          <Text style={styles.rootMeaning}>{currentRootData.meaning}</Text>
          <Text style={styles.rootOrigin}>{currentRootData.origin}</Text>
          <View style={styles.wordCount}>
            <Text style={styles.wordCountText}>{currentWords.length}个词汇</Text>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>词汇家族</Text>
        <ScrollView style={styles.wordList}>
          {currentWords.map((word, index) => (
            <View key={index} style={styles.wordItem}>
              <Text style={styles.wordText}>{word.word}</Text>
              <Text style={styles.wordMeaning}>{word.meaning}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: 44,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textTertiary,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tabsContent: {
    flexDirection: 'row',
    gap: 32,
  },
  tab: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  activeTab: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: 18,
  },
  tabIndicator: {
    height: 3,
    width: 30,
    borderRadius: 2,
    marginTop: 6,
  },
  rootInfo: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  rootText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  rootMeaning: {
    fontSize: 18,
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  rootOrigin: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  wordCount: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  wordCountText: {
    fontSize: 12,
    color: theme.colors.textTertiary,
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    marginBottom: 12,
    fontWeight: '500',
  },
  wordList: {
    gap: 12,
  },
  wordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
  },
  wordText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  wordMeaning: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});
