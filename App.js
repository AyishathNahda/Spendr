import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './navigation/AppNavigator';
import { theme } from './constants/theme';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';

export default function App() {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <SafeAreaProvider>
          <PaperProvider theme={theme}>
            <AppNavigator />
            <StatusBar style="auto" />
          </PaperProvider>
        </SafeAreaProvider>
      </ExpenseProvider>
    </AuthProvider>
  );
}
