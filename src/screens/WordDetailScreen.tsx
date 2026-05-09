import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Word} from '../data/types';
import {theme} from '../theme';
import {
  loadProgress,
  saveProgress,
  markWordLearned,
} from '../data/learningLogic';
import {getWordsByRoot, coreRoots, getSimilarWords} from '../data/wordDatabase';
import {speak} from '../utils/speech';

type RootStackParamList = {
  Tab: undefined;
  WordDetail: {word: Word};
};

type WordDetailScreenRouteProp = RouteProp<RootStackParamList, 'WordDetail'>;
type WordDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'WordDetail'
>;

interface WordDetailScreenProps {
  route: WordDetailScreenRouteProp;
  navigation: WordDetailScreenNavigationProp;
}

export const WordDetailScreen: React.FC<WordDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const {word} = route.params;
  const [selectedMorpheme, setSelectedMorpheme] = useState<number>(0);
  const [isLearned, setIsLearned] = useState(false);
  const [relatedWords, setRelatedWords] = useState<Word[]>([]);
  const [similarWords, setSimilarWords] = useState<Word[]>([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const check = async () => {
      const p = await loadProgress();
      setIsLearned(p.completedWords.includes(word.id));
    };
    check();

    if (word.rootId) {
      const related = getWordsByRoot(word.rootId)
        .filter(w => w.id !== word.id)
        .slice(0, 6);
      setRelatedWords(related);
    }

    const similar = getSimilarWords(word);
    setSimilarWords(similar);
  }, [word]);

  const handleMarkLearned = async () => {
    const p = await loadProgress();
    const newP = markWordLearned(p, word.id, 4);
    await saveProgress(newP);
    setIsLearned(true);
  };

  const currentMorpheme = word.morphemes[selectedMorpheme];
  const rootInfo = word.rootId
    ? coreRoots.find(r => r.id === word.rootId)
    : null;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, {paddingTop: insets.top + 12}]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>{'\u2039'}</Text>
        </TouchableOpacity>

        <View style={styles.wordHeader}>
          <TouchableOpacity
            onPress={() => speak(word.word)}
            activeOpacity={0.6}>
            <Text style={styles.word}>
              {word.word}{' '}
              <Text style={styles.speakerIcon}>{'\uD83D\uDD0A'}</Text>
            </Text>
          </TouchableOpacity>
          {word.phonetic ? (
            <Text style={styles.phonetic}>{word.phonetic}</Text>
          ) : null}
          <Text style={styles.pos}>{word.partOfSpeech}</Text>
        </View>

        <Text style={styles.meaning}>{word.meaning}</Text>
      </View>

      {/* Morpheme blocks */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>拆词解义</Text>
        <View style={styles.morphemeRow}>
          {word.morphemes.map((morpheme, index) => (
            <React.Fragment key={index}>
              {index > 0 && <Text style={styles.morphemePlus}>+</Text>}
              <TouchableOpacity
                style={[
                  styles.morphemeBlock,
                  {backgroundColor: morpheme.color},
                  selectedMorpheme === index && styles.morphemeBlockActive,
                ]}
                onPress={() => setSelectedMorpheme(index)}>
                <Text style={styles.morphemeText}>{morpheme.text}</Text>
                <Text style={styles.morphemeLabel}>
                  {morpheme.type === 'prefix'
                    ? '前缀'
                    : morpheme.type === 'root'
                    ? '词根'
                    : '后缀'}
                </Text>
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Morpheme detail */}
      {currentMorpheme && (
        <View
          style={[
            styles.morphemeDetail,
            {
              backgroundColor: currentMorpheme.color + '12',
              borderColor: currentMorpheme.color + '30',
            },
          ]}>
          <View style={styles.detailHeader}>
            <Text style={[styles.detailRoot, {color: currentMorpheme.color}]}>
              {currentMorpheme.text}
            </Text>
            <View
              style={[
                styles.detailBadge,
                {backgroundColor: currentMorpheme.color},
              ]}>
              <Text style={styles.detailBadgeText}>
                {currentMorpheme.type === 'prefix'
                  ? '前缀'
                  : currentMorpheme.type === 'root'
                  ? '词根'
                  : '后缀'}
              </Text>
            </View>
          </View>
          <Text style={styles.detailMeaning}>{currentMorpheme.meaning}</Text>
          {currentMorpheme.origin ? (
            <Text style={styles.detailOrigin}>{currentMorpheme.origin}</Text>
          ) : null}
        </View>
      )}

      {/* Association story */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>联想记忆</Text>
        <View style={styles.storyCard}>
          <Text style={styles.storyText}>{word.associationStory}</Text>
        </View>
      </View>

      {/* Example */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>例句</Text>
        <View style={styles.exampleCard}>
          <Text style={styles.exampleText}>{word.example}</Text>
          <Text style={styles.exampleTranslation}>{word.translation}</Text>
        </View>
      </View>

      {/* Related words from same root */}
      {relatedWords.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            同根词 {rootInfo ? `· ${rootInfo.root}(${rootInfo.meaning})` : ''}
          </Text>
          <View style={styles.relatedGrid}>
            {relatedWords.map(rw => (
              <TouchableOpacity
                key={rw.id}
                style={styles.relatedCard}
                onPress={() => navigation.push('WordDetail', {word: rw})}
                activeOpacity={0.7}>
                <Text style={styles.relatedWord}>{rw.word}</Text>
                <Text style={styles.relatedMeaning} numberOfLines={1}>
                  {rw.meaning}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Lookalike / confusable words */}
      {similarWords.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>形近词 · 别搞混</Text>
          <View style={styles.similarList}>
            {similarWords.map(sw => {
              const thisWord = word.word.toLowerCase();
              return (
                <TouchableOpacity
                  key={sw.id}
                  style={styles.similarCard}
                  onPress={() => navigation.push('WordDetail', {word: sw})}
                  activeOpacity={0.7}>
                  <View style={styles.similarHeader}>
                    <Text style={styles.similarWord}>
                      {sw.word.split('').map((ch, i) => {
                        const isDiff =
                          i >= thisWord.length ||
                          ch.toLowerCase() !== thisWord[i];
                        return (
                          <Text
                            key={i}
                            style={isDiff ? styles.similarDiffChar : undefined}>
                            {ch}
                          </Text>
                        );
                      })}
                    </Text>
                    <Text style={styles.similarPos}>{sw.partOfSpeech}</Text>
                  </View>
                  <Text style={styles.similarMeaning} numberOfLines={1}>
                    {sw.meaning}
                  </Text>
                  <View style={styles.similarCompare}>
                    <Text style={styles.similarCompareText}>
                      {word.word} = {word.meaning.split('/')[0]}
                    </Text>
                    <Text style={styles.similarVs}>VS</Text>
                    <Text style={styles.similarCompareText}>
                      {sw.word} = {sw.meaning.split('/')[0]}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Mark as learned button */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={[styles.learnButton, isLearned && styles.learnedButton]}
          onPress={handleMarkLearned}
          disabled={isLearned}
          activeOpacity={0.7}>
          <Text
            style={[
              styles.learnButtonText,
              isLearned && styles.learnedButtonText,
            ]}>
            {isLearned ? '\u2713 已学会' : '标记为已学会'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{height: 60}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  backText: {
    fontSize: 24,
    color: theme.colors.textPrimary,
    fontWeight: '300',
    marginTop: -2,
  },
  wordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  word: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  speakerIcon: {
    fontSize: 18,
    color: theme.colors.textTertiary,
  },
  phonetic: {
    fontSize: 14,
    color: theme.colors.textTertiary,
  },
  pos: {
    fontSize: 13,
    color: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
    fontWeight: '600',
  },
  meaning: {
    fontSize: 20,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    color: theme.colors.primary,
    marginBottom: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  morphemeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  morphemePlus: {
    fontSize: 18,
    color: theme.colors.textTertiary,
  },
  morphemeBlock: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    gap: 4,
  },
  morphemeBlockActive: {
    transform: [{scale: 1.03}],
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  morphemeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  morphemeLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
  },
  morphemeDetail: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  detailRoot: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  detailBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  detailBadgeText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  detailMeaning: {
    fontSize: 20,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    marginBottom: 4,
  },
  detailOrigin: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  storyCard: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  storyText: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  exampleCard: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 14,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  exampleText: {
    fontSize: 15,
    color: theme.colors.textPrimary,
    marginBottom: 8,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  exampleTranslation: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  relatedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  relatedCard: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    width: '48%' as any,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  relatedWord: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  relatedMeaning: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  similarList: {
    gap: 10,
  },
  similarCard: {
    backgroundColor: theme.colors.surface,
    padding: 14,
    borderRadius: 14,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.accent,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  similarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  similarWord: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  similarDiffChar: {
    color: theme.colors.accent,
  },
  similarPos: {
    fontSize: 11,
    color: theme.colors.textTertiary,
  },
  similarMeaning: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  similarCompare: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F4F8',
  },
  similarCompareText: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    flex: 1,
  },
  similarVs: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.accent,
    backgroundColor: theme.colors.accentLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  actionSection: {
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 20,
  },
  learnButton: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  learnedButton: {
    backgroundColor: theme.colors.secondaryLight,
    borderWidth: 1,
    borderColor: theme.colors.success,
    shadowOpacity: 0,
    elevation: 0,
  },
  learnButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  learnedButtonText: {
    color: theme.colors.success,
  },
});
