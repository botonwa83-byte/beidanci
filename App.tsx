import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider, useSafeAreaInsets} from 'react-native-safe-area-context';
import {theme, useAppTheme, ThemeProvider} from './src/theme';
import {LearnScreen} from './src/screens/LearnScreen';
import {RootScreen} from './src/screens/RootScreen';
import {GrammarScreen} from './src/screens/GrammarScreen';
import {GuessWordScreen} from './src/screens/GuessWordScreen';
import {ReviewScreen} from './src/screens/ReviewScreen';
import {ProfileScreen} from './src/screens/ProfileScreen';
import {WordDetailScreen} from './src/screens/WordDetailScreen';
import {LoginScreen} from './src/screens/LoginScreen';
import {SplashScreen} from './src/screens/SplashScreen';
import {PaywallScreen} from './src/screens/PaywallScreen';
import {TabBarIcon} from './src/components/TabBarIcon';
import {loadAuth, clearAuth, AuthUser} from './src/data/authService';
import {migrateAuthToKeychain} from './src/data/secureStorage';
import {setLogoutListener} from './src/data/authState';
import {EntitlementProvider} from './src/data/useEntitlement';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {colors} = useAppTheme();
  return (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: {
        backgroundColor: colors.surface,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.divider,
        paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
        paddingTop: 8,
        height: 56 + (insets.bottom > 0 ? insets.bottom : 8),
        shadowColor: '#1A2332',
        shadowOffset: {width: 0, height: -4},
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 8,
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textTertiary,
      tabBarShowLabel: false,
      headerShown: false,
    }}>
    <Tab.Screen
      name="Learn"
      component={LearnScreen}
      options={{
        tabBarAccessibilityLabel: '学习',
        tabBarIcon: ({focused}) => (
          <TabBarIcon name="learn" label="学习" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="Library"
      component={RootScreen}
      options={{
        tabBarAccessibilityLabel: '词库',
        tabBarIcon: ({focused}) => (
          <TabBarIcon name="library" label="词库" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="Grammar"
      component={GrammarScreen}
      options={{
        tabBarAccessibilityLabel: '语法',
        tabBarIcon: ({focused}) => (
          <TabBarIcon name="grammar" label="语法" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="Guess"
      component={GuessWordScreen}
      options={{
        tabBarAccessibilityLabel: '猜词',
        tabBarIcon: ({focused}) => (
          <TabBarIcon name="guess" label="猜词" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="Review"
      component={ReviewScreen}
      options={{
        tabBarAccessibilityLabel: '复习',
        tabBarIcon: ({focused}) => (
          <TabBarIcon name="review" label="复习" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarAccessibilityLabel: '我的',
        tabBarIcon: ({focused}) => (
          <TabBarIcon name="profile" label="我的" focused={focused} />
        ),
      }}
    />
  </Tab.Navigator>
  );
};

const App: React.FC = () => {
  const [authUser, setAuthUser] = useState<AuthUser | null | undefined>(
    undefined,
  );
  const [showSplash, setShowSplash] = useState(true);

  // 广告页和认证数据并行加载，互不阻塞
  useEffect(() => {
    migrateAuthToKeychain().then(() => loadAuth()).then(user => setAuthUser(user));
  }, []);

  const handleLoginSuccess = useCallback((user: AuthUser) => {
    setAuthUser(user);
  }, []);

  const handleLogout = useCallback(async () => {
    await clearAuth();
    setAuthUser(null);
  }, []);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  useEffect(() => {
    setLogoutListener(handleLogout);
  }, [handleLogout]);

  // 广告页：认证在后台同步加载，不浪费时间
  if (showSplash) {
    return (
      <SafeAreaProvider>
        <ThemeProvider>
          <SplashScreen onFinish={handleSplashFinish} />
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }

  // Loading state (广告看完后认证还没加载完才会短暂出现)
  if (authUser === undefined) {
    return null;
  }

  // Not logged in
  if (authUser === null) {
    return (
      <SafeAreaProvider>
        <ThemeProvider>
          <LoginScreen onLoginSuccess={handleLoginSuccess} />
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }

  // Logged in
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <EntitlementProvider>
          <AppContent />
        </EntitlementProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

const AppContent: React.FC = () => {
  const {colors} = useAppTheme();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {backgroundColor: colors.background},
        }}>
        <Stack.Screen name="Tab" component={TabNavigator} />
        <Stack.Screen name="WordDetail" component={WordDetailScreen as any} />
        <Stack.Screen
          name="Paywall"
          component={PaywallScreen}
          options={{presentation: 'modal'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
