import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import StatsScreen from '../screens/StatsScreen';
import AddHabitScreen from '../screens/AddHabitScreen';
import { colors, radius } from '../theme';

const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();

function TabIcon({ name, focused }) {
  const icons = {
    Home:  { active: '⬤ Today',  inactive: '○ Today' },
    Stats: { active: '⬤ Stats',  inactive: '○ Stats' },
  };
  return null; // We use tabBarLabel only
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
          paddingTop: 8,
          paddingBottom: 8,
          height: 64,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = { Home: '🏠', Stats: '📊' };
          return (
            <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.4 }}>
              {icons[route.name]}
            </Text>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Today' }} />
      <Tab.Screen name="Stats" component={StatsScreen} options={{ tabBarLabel: 'Stats' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Main" component={TabNavigator} />
        <RootStack.Screen
          name="AddHabit"
          component={AddHabitScreen}
          options={{
            presentation: 'modal',
            cardStyle: { borderRadius: radius.xl },
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
