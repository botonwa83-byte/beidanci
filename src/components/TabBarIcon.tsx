import React, {useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useAppTheme, ThemeColors} from '../theme';

interface TabBarIconProps {
  name: 'learn' | 'library' | 'grammar' | 'guess' | 'review' | 'profile';
  label: string;
  focused: boolean;
}

const emojiMap: Record<string, string> = {
  learn: '\u{1F4D6}',
  library: '\u{1F50D}',
  grammar: '\u{1F4DD}',
  guess: '\u{1F52E}',
  review: '\u{1F504}',
  profile: '\u{1F464}',
};

const labelMap: Record<string, string> = {
  learn: '学习',
  library: '词库',
  grammar: '语法',
  guess: '猜词',
  review: '复习',
  profile: '我的',
};

export const TabBarIcon: React.FC<TabBarIconProps> = ({name, focused}) => {
  const {colors} = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const color = focused ? colors.primary : colors.textTertiary;

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
        <Text style={[styles.icon, {opacity: focused ? 1 : 0.45}]}>
          {emojiMap[name]}
        </Text>
      </View>
      <Text
        style={[styles.subLabel, {color, fontWeight: focused ? '700' : '500'}]}>
        {labelMap[name]}
      </Text>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {alignItems: 'center', justifyContent: 'center', gap: 3},
    iconWrap: {
      width: 32,
      height: 26,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
    },
    iconWrapActive: {
      backgroundColor: colors.primaryLight,
    },
    icon: {fontSize: 20},
    subLabel: {fontSize: 10, letterSpacing: 0.3},
  });
