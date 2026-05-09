import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {theme} from '../theme';

interface TabBarIconProps {
  name: 'learn' | 'library' | 'review' | 'profile';
  label: string;
  focused: boolean;
}

const iconMap: Record<string, {icon: string; sub: string}> = {
  learn: {icon: '~', sub: '学习'},
  library: {icon: '~', sub: '词库'},
  review: {icon: '~', sub: '复习'},
  profile: {icon: '~', sub: '我的'},
};

const emojiMap: Record<string, string> = {
  learn: '\u{1F4D6}',
  library: '\u{1F50D}',
  review: '\u{1F504}',
  profile: '\u{1F464}',
};

export const TabBarIcon: React.FC<TabBarIconProps> = ({name, focused}) => {
  const color = focused ? theme.colors.primary : theme.colors.textTertiary;
  const sub = iconMap[name]?.sub || name;

  return (
    <View style={styles.container}>
      <Text style={[styles.icon, {opacity: focused ? 1 : 0.5}]}>
        {emojiMap[name]}
      </Text>
      <Text
        style={[styles.subLabel, {color, fontWeight: focused ? '700' : '500'}]}>
        {sub}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {alignItems: 'center', justifyContent: 'center', gap: 3},
  icon: {fontSize: 22},
  subLabel: {fontSize: 10},
});
