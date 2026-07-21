import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { ExpenseContext } from '../context/ExpenseContext';
import BalanceCard from '../components/BalanceCard';
import ExpenseCard from '../components/ExpenseCard';
import colors from '../constants/colors';
import { globalStyles } from '../styles/global';

const HomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const { expenses } = useContext(ExpenseContext);

  // Calculate stats from real data
  const income = expenses.filter(e => e.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const expense = expenses.filter(e => e.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = income - expense;
  
  // For savings, a simple calculation (could be customized later)
  const savings = income > 0 ? (income - expense > 0 ? income - expense : 0) : 0;

  // Get only the 5 most recent transactions
  const recentTransactions = expenses.slice(0, 5);

  const handleAddExpense = () => {
    navigation.navigate('AddExpense');
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.userName}>{user?.displayName || 'User'}</Text>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
          <MaterialCommunityIcons name="account-circle" size={40} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <BalanceCard 
          balance={balance} 
          income={income} 
          expense={expense} 
          savings={savings} 
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('History')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transactionsContainer}>
          {recentTransactions.map((tx) => (
            <ExpenseCard 
              key={tx.id} 
              expense={tx} 
              onPress={() => navigation.navigate('AddExpense', { expense: tx })} 
            />
          ))}
          {recentTransactions.length === 0 && (
            <Text style={{ textAlign: 'center', marginTop: 20, color: colors.textMuted }}>
              No transactions yet. Add one!
            </Text>
          )}
        </View>
        
        {/* Extra spacing at the bottom for scroll */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Quick Add FAB */}
      <TouchableOpacity style={styles.fab} onPress={handleAddExpense}>
        <MaterialCommunityIcons name="plus" size={30} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  profileButton: {
    padding: 4,
  },
  scrollView: {
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 32,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  transactionsContainer: {
    marginBottom: 24,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});

export default HomeScreen;
