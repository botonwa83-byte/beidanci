import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Word } from '../data/types';
import { theme } from '../theme';

interface WordCardProps {
  word: Word;
  onPress: () => void;
}

export const WordCard: React.FC<WordCardProps> = ({ word, onPress }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.word}>{word.word}</Text>
          <View style={styles.morphemeBadge}>
            <Text style={styles.morphemeBadgeText}>{word.morphemes.length}个语素</Text>
          </View>
        </View>
        <Text style={styles.phonetic}>{word.phonetic}  {word.partOfSpeech}</Text>
        <Text style={styles.meaning}>{word.meaning}</Text>
        <View style={styles.morphemeContainer}>
          {word.morphemes.map((morpheme, index) => (
            <View key={index} style={[styles.morpheme, { backgroundColor: morpheme.color }]}>
              <Text style={styles.morphemeText}>{morpheme.text}</Text>
              <Text style={styles.morphemeMeaning}>{morpheme.meaning}</Text>
            </View>
          ))}
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>点击查看词根详解</Text>
          <Text style={styles.arrow}>›</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.textTertiary + '20',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  word: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  morphemeBadge: {
    backgroundColor: '#A03B82',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  morphemeBadgeText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  phonetic: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  meaning: {
    fontSize: 20,
    color: theme.colors.textPrimary,
    marginBottom: 16,
    fontWeight: '500',
  },
  morphemeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  morpheme: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    gap: 4,
  },
  morphemeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  morphemeMeaning: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.textTertiary + '20',
  },
  footerText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  arrow: {
    fontSize: 20,
    color: theme.colors.textTertiary,
  },
});
