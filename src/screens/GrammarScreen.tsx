import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  grammarRules,
  grammarCategories,
  getGrammarByCategory,
  GrammarRule,
} from '../data/grammarData';
import {theme, useAppTheme, ThemeColors} from '../theme';

export const GrammarScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {colors} = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [grammarCategory, setGrammarCategory] = useState<GrammarRule['category']>('morphology');
  const [expandedRule, setExpandedRule] = useState<string | null>(null);

  const filteredGrammar = useMemo(() => {
    return getGrammarByCategory(grammarCategory);
  }, [grammarCategory]);

  const renderGrammarRule = (rule: GrammarRule) => {
    const isExpanded = expandedRule === rule.id;
    return (
      <View key={rule.id} style={styles.grammarCard}>
        <TouchableOpacity
          style={styles.grammarHeader}
          onPress={() => setExpandedRule(isExpanded ? null : rule.id)}
          activeOpacity={0.7}
          accessibilityLabel={rule.title}
          accessibilityRole="button"
          accessibilityState={{expanded: isExpanded}}>
          <View style={styles.grammarHeaderLeft}>
            <View style={[styles.grammarDot, {backgroundColor: rule.color}]} />
            <View style={styles.grammarHeaderText}>
              <Text style={styles.grammarTitle}>{rule.title}</Text>
              <Text style={styles.grammarSummary} numberOfLines={isExpanded ? undefined : 1}>
                {rule.summary}
              </Text>
            </View>
          </View>
          <View style={styles.grammarHeaderRight}>
            <View style={[styles.levelBadge, {backgroundColor: rule.color + '20'}]}>
              <Text style={[styles.levelBadgeText, {color: rule.color}]}>L{rule.level}</Text>
            </View>
            <Text style={styles.expandArrow}>{isExpanded ? '\u25B2' : '\u25BC'}</Text>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.grammarBody}>
            {rule.rules.map((r, idx) => (
              <View key={idx} style={styles.ruleItem}>
                <View style={[styles.patternTag, {backgroundColor: rule.color + '15', borderColor: rule.color + '30'}]}>
                  <Text style={[styles.patternText, {color: rule.color}]}>{r.pattern}</Text>
                </View>
                <Text style={styles.ruleDesc}>{r.description}</Text>
                <View style={styles.examplesWrap}>
                  {r.examples.map((ex, i) => (
                    <Text key={i} style={styles.exampleText}>{ex}</Text>
                  ))}
                </View>
              </View>
            ))}
            {rule.tips && (
              <View style={styles.tipsCard}>
                <Text style={styles.tipsText}>{rule.tips}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, {paddingTop: insets.top + 12}]}>
        <Text style={styles.title}>语法手册</Text>
        <Text style={styles.subtitle}>
          {grammarRules.length} 条核心语法规则
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryScrollContent}>
        {grammarCategories.map(cat => (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.categoryChip,
              grammarCategory === cat.key && {
                backgroundColor: cat.color + '20',
                borderColor: cat.color,
              },
            ]}
            onPress={() => {
              setGrammarCategory(cat.key);
              setExpandedRule(null);
            }}>
            <Text
              style={[
                styles.categoryChipText,
                grammarCategory === cat.key && {
                  color: cat.color,
                  fontWeight: 'bold',
                },
              ]}>
              {cat.label}
            </Text>
            <Text style={styles.categoryChipCount}>
              {getGrammarByCategory(cat.key).length}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.listSection}>
        <Text style={styles.listTitle}>
          {grammarCategories.find(c => c.key === grammarCategory)?.label} ({filteredGrammar.length})
        </Text>
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}>
          {filteredGrammar.map(renderGrammarRule)}
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
    categoryScroll: {
      marginBottom: 12,
      maxHeight: 40,
    },
    categoryScrollContent: {
      paddingHorizontal: 20,
      gap: 8,
    },
    categoryChip: {
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
    categoryChipText: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    categoryChipCount: {
      fontSize: 10,
      color: colors.textTertiary,
      fontWeight: '600',
    },
    listSection: {
      flex: 1,
      paddingHorizontal: 20,
    },
    listTitle: {
      fontSize: 11,
      color: colors.primary,
      marginBottom: 10,
      fontWeight: '700',
      letterSpacing: 1.5,
      textTransform: 'uppercase',
    },
    list: {
      flex: 1,
    },
    listContent: {
      gap: 10,
      paddingBottom: 100,
    },
    grammarCard: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      overflow: 'hidden',
      ...theme.shadow.sm,
    },
    grammarHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 14,
    },
    grammarHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: 10,
    },
    grammarDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    grammarHeaderText: {
      flex: 1,
    },
    grammarTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 2,
    },
    grammarSummary: {
      fontSize: 12,
      color: colors.textTertiary,
      lineHeight: 18,
    },
    grammarHeaderRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginLeft: 8,
    },
    levelBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
    },
    levelBadgeText: {
      fontSize: 10,
      fontWeight: '700',
    },
    expandArrow: {
      fontSize: 8,
      color: colors.textTertiary,
    },
    grammarBody: {
      paddingHorizontal: 14,
      paddingBottom: 14,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
      paddingTop: 12,
      gap: 14,
    },
    ruleItem: {
      gap: 6,
    },
    patternTag: {
      alignSelf: 'flex-start',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      borderWidth: 1,
    },
    patternText: {
      fontSize: 13,
      fontWeight: '700',
    },
    ruleDesc: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    examplesWrap: {
      backgroundColor: colors.background,
      borderRadius: 10,
      padding: 10,
      gap: 4,
    },
    exampleText: {
      fontSize: 13,
      color: colors.textPrimary,
      lineHeight: 20,
      fontStyle: 'italic',
    },
    tipsCard: {
      backgroundColor: colors.warningBg,
      borderRadius: 10,
      padding: 12,
      borderLeftWidth: 3,
      borderLeftColor: colors.warning,
    },
    tipsText: {
      fontSize: 12,
      color: colors.textSecondary,
      lineHeight: 20,
    },
  });
