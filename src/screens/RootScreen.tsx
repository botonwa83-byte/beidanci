import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  coreRoots,
  prefixes,
  suffixes,
  getWordsByRoot,
  searchWords,
  allWords,
} from '../data/wordDatabase';
import {theme, useAppTheme, ThemeColors} from '../theme';
import {Word} from '../data/types';

type RootStackParamList = {
  Tab: undefined;
  WordDetail: {word: Word};
};

type TabType = 'root' | 'prefix' | 'suffix' | 'search';

export const RootScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {colors} = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState<TabType>('root');
  const [activeRoot, setActiveRoot] = useState(coreRoots[0]?.root || 'port');
  const [activePrefix, setActivePrefix] = useState(
    prefixes[0]?.prefix || 're-',
  );
  const [activeSuffix, setActiveSuffix] = useState(
    suffixes[0]?.suffix || '-tion/-sion',
  );
  const [searchQuery, setSearchQuery] = useState('');

  const currentRootData = coreRoots.find(r => r.root === activeRoot);
  const currentPrefixData = prefixes.find(p => p.prefix === activePrefix);
  const currentSuffixData = suffixes.find(s => s.suffix === activeSuffix);

  const rootMatchedWords = useMemo(() => {
    if (activeTab !== 'root' || !currentRootData) {
      return [];
    }
    return getWordsByRoot(currentRootData.id);
  }, [activeTab, currentRootData]);

  const prefixMatchedWords = useMemo(() => {
    if (activeTab !== 'prefix' || !currentPrefixData) {
      return [];
    }
    const clean = currentPrefixData.prefix.replace(/[-/].*/g, '');
    return allWords.filter(w => w.word.startsWith(clean)).slice(0, 30);
  }, [activeTab, currentPrefixData]);

  const suffixMatchedWords = useMemo(() => {
    if (activeTab !== 'suffix' || !currentSuffixData) {
      return [];
    }
    const variants = currentSuffixData.suffix
      .replace('-', '')
      .split('/')
      .map(v => v.replace('-', ''));
    return allWords
      .filter(w => variants.some(v => w.word.endsWith(v)))
      .slice(0, 30);
  }, [activeTab, currentSuffixData]);

  const searchResults = useMemo(() => {
    if (activeTab !== 'search' || searchQuery.length < 1) {
      return [];
    }
    return searchWords(searchQuery);
  }, [activeTab, searchQuery]);

  const handleWordPress = (word: Word) => {
    navigation.navigate('WordDetail', {word});
  };

  const tabs: {key: TabType; label: string}[] = [
    {key: 'root', label: '词根'},
    {key: 'prefix', label: '前缀'},
    {key: 'suffix', label: '后缀'},
    {key: 'search', label: '搜索'},
  ];

  const renderWordItem = (word: Word) => (
    <TouchableOpacity
      key={word.id}
      style={styles.wordItem}
      onPress={() => handleWordPress(word)}
      activeOpacity={0.7}
      accessibilityLabel={`${word.word}，${word.meaning}`}
      accessibilityRole="button">
      <View style={styles.wordItemLeft}>
        <Text style={styles.wordText}>{word.word}</Text>
        <Text style={styles.wordPhonetic}>{word.phonetic}</Text>
      </View>
      <View style={styles.wordItemRight}>
        <Text style={styles.wordMeaning} numberOfLines={1}>
          {word.meaning}
        </Text>
        <Text style={styles.wordPos}>{word.partOfSpeech}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, {paddingTop: insets.top + 12}]}>
        <Text style={styles.title}>词根探索</Text>
        <Text style={styles.subtitle}>
          {coreRoots.length}词根 {prefixes.length}前缀 {suffixes.length}后缀
        </Text>
      </View>

      {/* Main tabs */}
      <View style={styles.mainTabs}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.mainTab,
              activeTab === tab.key && styles.mainTabActive,
            ]}
            onPress={() => setActiveTab(tab.key)}
            accessibilityLabel={tab.label}
            accessibilityRole="tab"
            accessibilityState={{selected: activeTab === tab.key}}>
            <Text
              style={[
                styles.mainTabText,
                activeTab === tab.key && styles.mainTabTextActive,
              ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search tab */}
      {activeTab === 'search' && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="输入单词、中文或词根..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            autoCapitalize="none"
            accessibilityLabel="搜索单词"
            accessibilityHint="输入单词、中文释义或词根进行搜索"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
              accessibilityLabel="清除搜索"
              accessibilityRole="button">
              <Text style={styles.clearText}>{'\u2715'}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Root tab content */}
      {activeTab === 'root' && (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.morphemeScroll}
            contentContainerStyle={styles.morphemeScrollContent}>
            {coreRoots.map(root => (
              <TouchableOpacity
                key={root.id}
                style={[
                  styles.morphemeChip,
                  activeRoot === root.root && {
                    backgroundColor: root.color + '20',
                    borderColor: root.color,
                  },
                ]}
                onPress={() => setActiveRoot(root.root)}>
                <Text
                  style={[
                    styles.morphemeChipText,
                    activeRoot === root.root && {
                      color: root.color,
                      fontWeight: 'bold',
                    },
                  ]}>
                  {root.root}
                </Text>
                <Text style={styles.morphemeChipCount}>
                  {root.words.length}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {currentRootData && (
            <View
              style={[
                styles.infoCard,
                {
                  backgroundColor: currentRootData.color + '0D',
                  borderColor: currentRootData.color + '30',
                },
              ]}>
              <View style={styles.infoHeader}>
                <Text style={[styles.infoRoot, {color: currentRootData.color}]}>
                  {currentRootData.root}
                </Text>
                <View
                  style={[
                    styles.levelTag,
                    {backgroundColor: currentRootData.color},
                  ]}>
                  <Text style={styles.levelTagText}>
                    L{currentRootData.level}
                  </Text>
                </View>
              </View>
              <Text style={styles.infoMeaning}>{currentRootData.meaning}</Text>
              <Text style={styles.infoOrigin}>{currentRootData.origin}</Text>
            </View>
          )}
        </>
      )}

      {/* Prefix tab content */}
      {activeTab === 'prefix' && (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.morphemeScroll}
            contentContainerStyle={styles.morphemeScrollContent}>
            {prefixes.map(p => (
              <TouchableOpacity
                key={p.id}
                style={[
                  styles.morphemeChip,
                  activePrefix === p.prefix && {
                    backgroundColor: p.color + '20',
                    borderColor: p.color,
                  },
                ]}
                onPress={() => setActivePrefix(p.prefix)}>
                <Text
                  style={[
                    styles.morphemeChipText,
                    activePrefix === p.prefix && {
                      color: p.color,
                      fontWeight: 'bold',
                    },
                  ]}>
                  {p.prefix}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {currentPrefixData && (
            <View
              style={[
                styles.infoCard,
                {
                  backgroundColor: currentPrefixData.color + '0D',
                  borderColor: currentPrefixData.color + '30',
                },
              ]}>
              <View style={styles.infoHeader}>
                <Text
                  style={[styles.infoRoot, {color: currentPrefixData.color}]}>
                  {currentPrefixData.prefix}
                </Text>
                <View
                  style={[
                    styles.typeBadge,
                    {backgroundColor: currentPrefixData.color},
                  ]}>
                  <Text style={styles.typeBadgeText}>前缀</Text>
                </View>
              </View>
              <Text style={styles.infoMeaning}>
                {currentPrefixData.meaning}
              </Text>
              <Text style={styles.infoOrigin}>{currentPrefixData.origin}</Text>
            </View>
          )}
        </>
      )}

      {/* Suffix tab content */}
      {activeTab === 'suffix' && (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.morphemeScroll}
            contentContainerStyle={styles.morphemeScrollContent}>
            {suffixes.map(s => (
              <TouchableOpacity
                key={s.id}
                style={[
                  styles.morphemeChip,
                  activeSuffix === s.suffix && {
                    backgroundColor: s.color + '20',
                    borderColor: s.color,
                  },
                ]}
                onPress={() => setActiveSuffix(s.suffix)}>
                <Text
                  style={[
                    styles.morphemeChipText,
                    activeSuffix === s.suffix && {
                      color: s.color,
                      fontWeight: 'bold',
                    },
                  ]}>
                  {s.suffix}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {currentSuffixData && (
            <View
              style={[
                styles.infoCard,
                {
                  backgroundColor: currentSuffixData.color + '0D',
                  borderColor: currentSuffixData.color + '30',
                },
              ]}>
              <View style={styles.infoHeader}>
                <Text
                  style={[styles.infoRoot, {color: currentSuffixData.color}]}>
                  {currentSuffixData.suffix}
                </Text>
                <View
                  style={[
                    styles.typeBadge,
                    {backgroundColor: currentSuffixData.color},
                  ]}>
                  <Text style={styles.typeBadgeText}>
                    后缀 {currentSuffixData.partOfSpeech}
                  </Text>
                </View>
              </View>
              <Text style={styles.infoMeaning}>
                {currentSuffixData.meaning}
              </Text>
              <Text style={styles.infoOrigin}>{currentSuffixData.origin}</Text>
            </View>
          )}
        </>
      )}

      {/* Content area */}
      <View style={styles.wordListSection}>
        <Text style={styles.wordListTitle}>
          {activeTab === 'root' && `词汇家族 (${rootMatchedWords.length})`}
          {activeTab === 'prefix' && `相关词汇 (${prefixMatchedWords.length})`}
          {activeTab === 'suffix' && `相关词汇 (${suffixMatchedWords.length})`}
          {activeTab === 'search' &&
            (searchResults.length > 0
              ? `搜索结果 (${searchResults.length})`
              : searchQuery
              ? '未找到'
              : '输入关键词搜索')}
        </Text>
        <ScrollView
          style={styles.wordList}
          contentContainerStyle={styles.wordListContent}>
          {activeTab === 'root' && rootMatchedWords.map(renderWordItem)}
          {activeTab === 'prefix' && prefixMatchedWords.map(renderWordItem)}
          {activeTab === 'suffix' && suffixMatchedWords.map(renderWordItem)}
          {activeTab === 'search' && searchResults.map(renderWordItem)}
        </ScrollView>
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingBottom: 14,
    },
    title: {
      fontSize: 30,
      fontWeight: '800',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 12,
      color: colors.textTertiary,
      letterSpacing: 0.5,
    },
    mainTabs: {
      flexDirection: 'row',
      marginHorizontal: 20,
      backgroundColor: colors.surfaceLight,
      borderRadius: 14,
      padding: 3,
      marginBottom: 14,
    },
    mainTab: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
      borderRadius: 12,
    },
    mainTabActive: {
      backgroundColor: colors.primary,
      ...theme.shadow.colored(colors.primary),
    },
    mainTabText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    mainTabTextActive: {
      color: '#FFFFFF',
      fontWeight: '700',
    },
    searchContainer: {
      marginHorizontal: 20,
      marginBottom: 14,
      position: 'relative',
    },
    searchInput: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      paddingVertical: 13,
      paddingHorizontal: 16,
      paddingRight: 40,
      fontSize: 15,
      color: colors.textPrimary,
      borderWidth: 1,
      borderColor: colors.divider,
      ...theme.shadow.sm,
    },
    clearButton: {
      position: 'absolute',
      right: 14,
      top: 13,
    },
    clearText: {
      fontSize: 15,
      color: colors.textTertiary,
    },
    morphemeScroll: {
      marginBottom: 12,
      maxHeight: 40,
    },
    morphemeScrollContent: {
      paddingHorizontal: 20,
      gap: 8,
    },
    morphemeChip: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: theme.borderRadius.pill,
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: 'transparent',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      ...theme.shadow.sm,
    },
    morphemeChipText: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    morphemeChipCount: {
      fontSize: 10,
      color: colors.textTertiary,
      fontWeight: '600',
    },
    infoCard: {
      marginHorizontal: 20,
      padding: 18,
      borderRadius: theme.borderRadius.lg,
      marginBottom: 14,
      borderWidth: 1,
    },
    infoHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 8,
    },
    infoRoot: {
      fontSize: 28,
      fontWeight: '800',
    },
    levelTag: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
    },
    levelTagText: {
      fontSize: 11,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    typeBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
    },
    typeBadgeText: {
      fontSize: 11,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    infoMeaning: {
      fontSize: 18,
      color: colors.textPrimary,
      marginBottom: 4,
      fontWeight: '600',
    },
    infoOrigin: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    wordListSection: {
      flex: 1,
      paddingHorizontal: 20,
    },
    wordListTitle: {
      fontSize: 11,
      color: colors.primary,
      marginBottom: 10,
      fontWeight: '700',
      letterSpacing: 1.5,
      textTransform: 'uppercase',
    },
    wordList: {
      flex: 1,
    },
    wordListContent: {
      gap: 6,
      paddingBottom: 100,
    },
    wordItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 16,
      backgroundColor: colors.surface,
      borderRadius: 14,
      ...theme.shadow.sm,
    },
    wordItemLeft: {
      flex: 1,
    },
    wordItemRight: {
      alignItems: 'flex-end',
      marginLeft: 12,
      flexShrink: 0,
    },
    wordText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    wordPhonetic: {
      fontSize: 12,
      color: colors.textTertiary,
      marginTop: 3,
    },
    wordMeaning: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    wordPos: {
      fontSize: 11,
      color: colors.textTertiary,
      marginTop: 3,
      fontWeight: '500',
    },

  });
