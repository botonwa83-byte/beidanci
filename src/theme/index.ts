import React, {createContext, useContext} from 'react';
import {useColorScheme} from 'react-native';

const lightColors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceLight: '#EEF2F7',
  surfaceWarm: '#FAFBFD',
  primary: '#4F6EF7',
  primaryDark: '#3A56D4',
  primaryLight: '#EBF0FF',
  secondary: '#2DC89B',
  secondaryLight: '#E3FAF2',
  accent: '#F472A8',
  accentLight: '#FFF0F6',
  textPrimary: '#1A2332',
  textSecondary: '#5E6E82',
  textTertiary: '#9AABC0',
  sectionTitle: '#4F6EF7',
  success: '#2DC89B',
  error: '#EF5B5B',
  warning: '#F5A623',
  divider: '#E4EAF1',
  cardBorder: '#E8ECF2',
  errorBg: '#FFF0F0',
  warningBg: '#FFF8E8',
  footerBorder: '#F0F4F8',
  rootColors: {
    port: '#5B9BD5',
    cred: '#C57BDB',
    scrib: '#7BC67B',
    magn: '#E8A54B',
    fic: '#4BC6B0',
    ent: '#6BBF6B',
  },
  morphemeColors: {
    prefix: '#F472A8',
    root: '#4F6EF7',
    suffix: '#2DC89B',
  },
};

const darkColors: typeof lightColors = {
  background: '#0F1419',
  surface: '#1A1F2E',
  surfaceLight: '#242B3D',
  surfaceWarm: '#151A24',
  primary: '#6B8AFF',
  primaryDark: '#5A78F0',
  primaryLight: '#1E2A4A',
  secondary: '#3DD9A6',
  secondaryLight: '#1A3B30',
  accent: '#F78CC7',
  accentLight: '#3A2030',
  textPrimary: '#E6EDF3',
  textSecondary: '#9EAAB8',
  textTertiary: '#6B7B8D',
  sectionTitle: '#6B8AFF',
  success: '#3DD9A6',
  error: '#F85149',
  warning: '#E3B341',
  divider: '#2D3548',
  cardBorder: '#2D3548',
  errorBg: '#3A1A1A',
  warningBg: '#3A3018',
  footerBorder: '#2D3548',
  rootColors: {
    port: '#6BABE5',
    cred: '#D58BEB',
    scrib: '#8BD68B',
    magn: '#F0B55B',
    fic: '#5BD6C0',
    ent: '#7BCF7B',
  },
  morphemeColors: {
    prefix: '#F78CC7',
    root: '#6B8AFF',
    suffix: '#3DD9A6',
  },
};

export type ThemeColors = typeof lightColors;

const ThemeContext = createContext<ThemeColors>(lightColors);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  return React.createElement(ThemeContext.Provider, {value: colors}, children);
};

export const useAppTheme = () => {
  const colors = useContext(ThemeContext);
  return {colors, isDark: colors === darkColors};
};

export const theme = {
  colors: lightColors,
  fonts: {
    regular: 'System',
    medium: 'System-Medium',
    bold: 'System-Bold',
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    pill: 100,
  },
  shadow: {
    sm: {
      shadowColor: '#1A2332',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
    },
    md: {
      shadowColor: '#1A2332',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 3,
    },
    lg: {
      shadowColor: '#4F6EF7',
      shadowOffset: {width: 0, height: 6},
      shadowOpacity: 0.12,
      shadowRadius: 20,
      elevation: 6,
    },
    colored: (color: string) => ({
      shadowColor: color,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 4,
    }),
  },
  layout: {
    maxContentWidth: 600,
  },
};
