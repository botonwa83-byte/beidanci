import React, {useState, useEffect, useCallback} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {theme} from './src/theme';
import {LearnScreen} from './src/screens/LearnScreen';
import {RootScreen} from './src/screens/RootScreen';
import {ReviewScreen} from './src/screens/ReviewScreen';
import {ProfileScreen} from './src/screens/ProfileScreen';
import {WordDetailScreen} from './src/screens/WordDetailScreen';
import {LoginScreen} from './src/screens/LoginScreen';
import {TabBarIcon} from './src/components/TabBarIcon';
import {loadAuth, clearAuth, AuthUser} from './src/data/authService';
import {setLogoutListener} from './src/data/authState';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: {
        backgroundColor: theme.colors.surface,
        borderTopWidth: 1,
        borderTopColor: '#E8ECF2',
        paddingBottom: 28,
        paddingTop: 8,
        height: 80,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -2},
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 8,
      },
      tabBarActiveTintColor: theme.colors.primary,
      tabBarInactiveTintColor: theme.colors.textTertiary,
      tabBarShowLabel: false,
      headerShown: false,
    }}>
    <Tab.Screen
      name="Learn"
      component={LearnScreen}
      options={{
        tabBarIcon: ({focused}) => (
          <TabBarIcon name="learn" label="学习" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="Library"
      component={RootScreen}
      options={{
        tabBarIcon: ({focused}) => (
          <TabBarIcon name="library" label="词库" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="Review"
      component={ReviewScreen}
      options={{
        tabBarIcon: ({focused}) => (
          <TabBarIcon name="review" label="复习" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({focused}) => (
          <TabBarIcon name="profile" label="我的" focused={focused} />
        ),
      }}
    />
  </Tab.Navigator>
);

const App: React.FC = () => {
  const [authUser, setAuthUser] = useState<AuthUser | null | undefined>(
    undefined,
  );

  useEffect(() => {
    loadAuth().then(user => setAuthUser(user));
  }, []);

  const handleLoginSuccess = useCallback((user: AuthUser) => {
    setAuthUser(user);
  }, []);

  const handleLogout = useCallback(async () => {
    await clearAuth();
    setAuthUser(null);
  }, []);

  useEffect(() => {
    setLogoutListener(handleLogout);
  }, [handleLogout]);

  // Loading state
  if (authUser === undefined) {
    return null;
  }

  // Not logged in
  if (authUser === null) {
    return (
      <SafeAreaProvider>
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      </SafeAreaProvider>
    );
  }

  // Logged in
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: {backgroundColor: theme.colors.background},
          }}>
          <Stack.Screen name="Tab" component={TabNavigator} />
          <Stack.Screen name="WordDetail" component={WordDetailScreen as any} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
