import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from './src/theme';
import { TodayScreen } from './src/screens/TodayScreen';
import { RootScreen } from './src/screens/RootScreen';
import { PracticeScreen } from './src/screens/PracticeScreen';
import { WordDetailScreen } from './src/screens/WordDetailScreen';
import { TabBarIcon } from './src/components/TabBarIcon';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: {
        backgroundColor: theme.colors.surface,
        borderTopWidth: 0,
        paddingBottom: 30,
        paddingTop: 10,
        height: 85,
      },
      tabBarActiveTintColor: theme.colors.primary,
      tabBarInactiveTintColor: theme.colors.textTertiary,
      headerShown: false,
    }}
  >
    <Tab.Screen
      name="Today"
      component={TodayScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabBarIcon name="today" label="今日" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="Root"
      component={RootScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabBarIcon name="root" label="词根" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="Practice"
      component={PracticeScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabBarIcon name="practice" label="练习" focused={focused} />
        ),
      }}
    />
  </Tab.Navigator>
);

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.colors.background },
          }}
        >
          <Stack.Screen name="Tab" component={TabNavigator} />
          <Stack.Screen name="WordDetail" component={WordDetailScreen as any} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
