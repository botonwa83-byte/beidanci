import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Word } from '../data/types';
import { theme } from '../theme';

type RootStackParamList = {
  Tab: undefined;
  WordDetail: { word: Word };
};

type WordDetailScreenRouteProp = RouteProp<RootStackParamList, 'WordDetail'>;
type WordDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'WordDetail'>;

interface WordDetailScreenProps {
  route: WordDetailScreenRouteProp;
  navigation: WordDetailScreenNavigationProp;
}

const renderStoryText = (text: string) => {
  const parts = text.split(/\{([^}]+)\}/);
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return (
        <Text key={index} style={{ color: theme.colors.primary, fontWeight: '600' }}>
          {part}
        </Text>
      );
    }
    return <Text key={index}>{part}</Text>;
  });
};

export const WordDetailScreen: React.FC<WordDetailScreenProps> = ({ route, navigation }) => {
  const { word } = route.params;
  const [selectedMorpheme, setSelectedMorpheme] = useState<number>(0);
  const insets = useSafeAreaInsets();

  const currentMorpheme = word.morphemes[selectedMorpheme];

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 30 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <View style={styles.backCircle}>
            <Text style={styles.backText}>‹</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <Text style={styles.word}>{word.word}</Text>
          <Text style={styles.phonetic}>{word.phonetic} {word.partOfSpeech}</Text>
        </View>
        <Text style={[styles.meaning, { top: insets.top + 30 }]}>{word.meaning}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>拆词解义</Text>
        <View style={styles.morphemeContainer}>
          {word.morphemes.map((morpheme, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.morphemeBlock, { backgroundColor: morpheme.color }]}
              onPress={() => setSelectedMorpheme(index)}
            >
              <Text style={styles.morphemeText}>{morpheme.text}</Text>
              <Text style={styles.morphemeLabel}>
                {morpheme.type === 'prefix' ? '前缀' : morpheme.type === 'root' ? '词根' : '后缀'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {currentMorpheme && (
        <View style={[styles.morphemeDetailCard, { backgroundColor: currentMorpheme.color + '20', borderColor: currentMorpheme.color + '60' }]}>
          <View style={styles.detailHeader}>
            <Text style={[styles.detailRoot, { color: currentMorpheme.color }]}>{currentMorpheme.text}</Text>
            <View style={styles.detailTypeBadge}>
              <Text style={styles.detailType}>
                {currentMorpheme.type === 'prefix' ? '前缀' : currentMorpheme.type === 'root' ? '词根' : '后缀'}
              </Text>
            </View>
          </View>
          <Text style={styles.detailMeaning}>{currentMorpheme.meaning}</Text>
          <Text style={styles.detailOrigin}>{currentMorpheme.origin}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>联想记忆</Text>
        <View style={styles.storyCard}>
          <Text style={styles.storyText}>{renderStoryText(word.associationStory)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>例句</Text>
        <View style={styles.exampleCard}>
          <Text style={styles.exampleText}>{word.example}</Text>
          <Text style={styles.exampleTranslation}>{word.translation}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  backButton: {
    paddingTop: 4,
  },
  backCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 24,
    color: theme.colors.textPrimary,
    fontWeight: '300',
  },
  headerRight: {
    flex: 1,
  },
  word: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  phonetic: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  meaning: {
    position: 'absolute',
    right: 20,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    color: theme.colors.sectionTitle,
    marginBottom: 12,
    fontWeight: '500',
    letterSpacing: 2,
  },
  morphemeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  morphemeBlock: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 6,
  },
  morphemeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  morphemeLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  morphemeDetailCard: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  detailRoot: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  detailTypeBadge: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  detailType: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  detailMeaning: {
    fontSize: 24,
    color: theme.colors.textPrimary,
    marginBottom: 8,
    fontWeight: '600',
  },
  detailOrigin: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  storyCard: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 12,
  },
  storyText: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  exampleCard: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  exampleText: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  exampleTranslation: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});
