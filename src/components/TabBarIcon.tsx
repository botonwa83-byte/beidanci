import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface TabBarIconProps {
  name: 'today' | 'root' | 'practice';
  label: string;
  focused: boolean;
}

export const TabBarIcon: React.FC<TabBarIconProps> = ({ name, label, focused }) => {
  const color = focused ? theme.colors.primary : theme.colors.textTertiary;
  const labelMap: Record<string, { main: string; sub: string }> = {
    today: { main: '今', sub: '今日' },
    root: { main: '根', sub: '词根' },
    practice: { main: '练', sub: '练习' },
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.mainLabel, { color }]}>{labelMap[name].main}</Text>
      <Text style={[styles.subLabel, { color }]}>{labelMap[name].sub}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  mainLabel: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
});
