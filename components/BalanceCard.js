import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../constants/colors';
import { globalStyles } from '../styles/global';

const BalanceCard = ({ balance = 0, income = 0, expense = 0, savings = 0 }) => {
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  }, [opacity, scale]);

  return (
    <Animated.View style={[globalStyles.card, styles.container, { opacity, transform: [{ scale }] }]}>
      <Text style={styles.title}>Current Balance</Text>
      <Text style={styles.balanceText}>${balance.toFixed(2)}</Text>

      <View style={styles.row}>
        <View style={styles.statContainer}>
          <View style={styles.iconContainerIncome}>
            <MaterialCommunityIcons name="arrow-down" size={20} color={colors.income} />
          </View>
          <View>
            <Text style={styles.statLabel}>Income</Text>
            <Text style={styles.statValueIncome}>+${income.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.statContainer}>
          <View style={styles.iconContainerExpense}>
            <MaterialCommunityIcons name="arrow-up" size={20} color={colors.expense} />
          </View>
          <View>
            <Text style={styles.statLabel}>Expense</Text>
            <Text style={styles.statValueExpense}>-${expense.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.savingsContainer}>
        <Text style={styles.statLabel}>Savings</Text>
        <Text style={styles.statValueSavings}>${savings.toFixed(2)}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    padding: 24,
    borderRadius: 24,
  },
  title: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginBottom: 8,
  },
  balanceText: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainerIncome: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    padding: 8,
    borderRadius: 12,
    marginRight: 12,
  },
  iconContainerExpense: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    padding: 8,
    borderRadius: 12,
    marginRight: 12,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  statValueIncome: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statValueExpense: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statValueSavings: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  savingsContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default BalanceCard;
