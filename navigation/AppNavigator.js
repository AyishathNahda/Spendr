import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Context
import { AuthContext } from '../context/AuthContext';

// Components
import LoadingSpinner from '../components/LoadingSpinner';

// Screens
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import HomeScreen from '../screens/HomeScreen';

import { globalStyles } from '../styles/global';
import colors from '../constants/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Placeholders for future modules
const PlaceholderHistory = () => (
  <View style={globalStyles.center}><Text>History (Module 6)</Text></View>
);
const PlaceholderStats = () => (
  <View style={globalStyles.center}><Text>Statistics (Module 7)</Text></View>
);
const PlaceholderProfile = () => (
  <View style={globalStyles.center}><Text>Profile (Module 8)</Text></View>
);

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'HomeTab') iconName = 'home';
        else if (route.name === 'History') iconName = 'format-list-bulleted';
        else if (route.name === 'Statistics') iconName = 'chart-pie';
        else if (route.name === 'Profile') iconName = 'account';

        return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarStyle: {
        borderTopWidth: 0,
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: -3 },
        shadowRadius: 5,
        height: 60,
        paddingBottom: 8,
        paddingTop: 8,
      },
    })}
  >
    <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home' }} />
    <Tab.Screen name="History" component={PlaceholderHistory} />
    <Tab.Screen name="Statistics" component={PlaceholderStats} />
    <Tab.Screen name="Profile" component={PlaceholderProfile} />
  </Tab.Navigator>
);

export default function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // Protected Routes
          <Stack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          // Auth Routes
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
