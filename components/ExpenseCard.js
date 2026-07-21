import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../constants/colors';

// Helper function to get icon based on category
const getCategoryIcon = (category) => {
  const icons = {
    Food: 'food',
    Shopping: 'shopping',
    Travel: 'airplane',
    Healthcare: 'medical-bag',
    Bills: 'file-document',
    Entertainment: 'movie',
    Education: 'school',
    Salary: 'cash',
    Investment: 'chart-line',
    Others: 'dots-horizontal',
  };
  return icons[category] || 'cash';
};

const ExpenseCard = ({ expense, onPress }) => {
  const isIncome = expense.type === 'income';
  const amountColor = isIncome ? colors.income : colors.text;

  // Format date if it exists, otherwise provide a fallback
  const dateObj = expense.date ? new Date(expense.date) : new Date();
  const dateString = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons 
          name={getCategoryIcon(expense.category)} 
          size={24} 
          color={isIncome ? colors.income : colors.primary} 
        />
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{expense.title || expense.category}</Text>
        <Text style={styles.date}>{dateString}</Text>
      </View>

      <View style={styles.amountContainer}>
        <Text style={[styles.amount, { color: amountColor }]}>
          {isIncome ? '+' : '-'}${parseFloat(expense.amount).toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 12,
    marginRight: 16,
  },
  detailsContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: colors.textMuted,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ExpenseCard;
