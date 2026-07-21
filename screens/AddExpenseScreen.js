import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReusableTextInput from '../components/ReusableTextInput';
import ReusableButton from '../components/ReusableButton';
import { ExpenseContext } from '../context/ExpenseContext';
import { globalStyles } from '../styles/global';
import colors from '../constants/colors';

const CATEGORIES = [
  'Food', 'Shopping', 'Travel', 'Healthcare', 'Bills', 
  'Entertainment', 'Education', 'Salary', 'Investment', 'Others'
];

const AddExpenseScreen = ({ navigation, route }) => {
  const { addExpense, updateExpense } = useContext(ExpenseContext);
  
  // Check if we are editing an existing expense
  const editMode = route?.params?.expense ? true : false;
  const existingExpense = route?.params?.expense;

  const [title, setTitle] = useState(existingExpense?.title || '');
  const [amount, setAmount] = useState(existingExpense?.amount?.toString() || '');
  const [type, setType] = useState(existingExpense?.type || 'expense');
  const [category, setCategory] = useState(existingExpense?.category || 'Others');
  const [notes, setNotes] = useState(existingExpense?.notes || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!title || !amount) {
      setError('Title and amount are required');
      return;
    }

    if (isNaN(parseFloat(amount))) {
      setError('Please enter a valid numeric amount');
      return;
    }

    setLoading(true);
    setError('');

    const expenseData = {
      title,
      amount: parseFloat(amount),
      type,
      category,
      notes,
      date: existingExpense?.date || new Date().toISOString(),
    };

    try {
      if (editMode) {
        await updateExpense(existingExpense.id, expenseData);
      } else {
        await addExpense(expenseData);
      }
      navigation.goBack();
    } catch (err) {
      setError(err.message || 'Failed to save transaction');
      Alert.alert('Error', err.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{editMode ? 'Edit' : 'Add'} Transaction</Text>
          <View style={{ width: 50 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Type Selector (Income vs Expense) */}
          <View style={styles.typeSelector}>
            <TouchableOpacity 
              style={[styles.typeBtn, type === 'expense' && styles.typeBtnActiveExpense]}
              onPress={() => setType('expense')}
            >
              <Text style={[styles.typeText, type === 'expense' && styles.typeTextActive]}>Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.typeBtn, type === 'income' && styles.typeBtnActiveIncome]}
              onPress={() => setType('income')}
            >
              <Text style={[styles.typeText, type === 'income' && styles.typeTextActive]}>Income</Text>
            </TouchableOpacity>
          </View>

          <View style={globalStyles.card}>
            <ReusableTextInput
              label="Title"
              placeholder="e.g. Lunch at Cafe"
              value={title}
              onChangeText={setTitle}
            />
            
            <ReusableTextInput
              label="Amount ($)"
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
            
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoriesContainer}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity 
                  key={cat}
                  style={[styles.categoryChip, category === cat && styles.categoryChipActive]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.categoryText, category === cat && styles.categoryTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <ReusableTextInput
              label="Notes (Optional)"
              placeholder="Add any extra details here"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <ReusableButton 
              title={editMode ? 'Update' : 'Save'} 
              onPress={handleSave} 
              loading={loading}
              style={{ marginTop: 16 }}
            />
          </View>
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingBottom: 16,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeBtn: {
    padding: 4,
  },
  closeText: {
    color: colors.textMuted,
    fontSize: 16,
  },
  scrollView: {
    padding: 24,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  typeBtnActiveExpense: {
    backgroundColor: colors.expense,
  },
  typeBtnActiveIncome: {
    backgroundColor: colors.income,
  },
  typeText: {
    fontWeight: 'bold',
    color: colors.textMuted,
  },
  typeTextActive: {
    color: '#FFF',
  },
  label: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 8,
    fontWeight: '500',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 12,
    color: colors.text,
  },
  categoryTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default AddExpenseScreen;
