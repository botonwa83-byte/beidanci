import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Word} from '../data/types';
import {theme} from '../theme';

interface WordCardProps {
  word: Word;
  onPress: () => void;
}

export const WordCard: React.FC<WordCardProps> = ({word, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.word}>{word.word}</Text>
          {word.phonetic ? (
            <Text style={styles.phonetic}>{word.phonetic}</Text>
          ) : null}
        </View>
        <Text style={styles.posTag}>{word.partOfSpeech}</Text>
      </View>

      <Text style={styles.meaning}>{word.meaning}</Text>

      {word.morphemes.length > 0 && (
        <View style={styles.morphemeContainer}>
          {word.morphemes.map((morpheme, index) => (
            <View
              key={index}
              style={[
                styles.morpheme,
                {backgroundColor: morpheme.color + '18'},
              ]}>
              <Text style={[styles.morphemeText, {color: morpheme.color}]}>
                {morpheme.text}
              </Text>
              {morpheme.meaning ? (
                <Text
                  style={[
                    styles.morphemeMeaning,
                    {color: morpheme.color + 'AA'},
                  ]}>
                  {morpheme.meaning}
                </Text>
              ) : null}
            </View>
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText} numberOfLines={1}>
          {word.associationStory}
        </Text>
        <Text style={styles.arrow}>{'\u203A'}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#4A6AE5',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  word: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  phonetic: {
    fontSize: 12,
    color: theme.colors.textTertiary,
  },
  posTag: {
    fontSize: 11,
    color: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: 'hidden',
    fontWeight: '600',
  },
  meaning: {
    fontSize: 17,
    color: theme.colors.textPrimary,
    marginBottom: 12,
    fontWeight: '500',
  },
  morphemeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  morpheme: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    gap: 3,
  },
  morphemeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  morphemeMeaning: {
    fontSize: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F4F8',
  },
  footerText: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    flex: 1,
    marginRight: 8,
  },
  arrow: {
    fontSize: 18,
    color: theme.colors.textTertiary,
  },
});
