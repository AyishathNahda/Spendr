import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { 
  addExpense as firestoreAddExpense,
  getUserExpenses as firestoreGetExpenses,
  updateExpense as firestoreUpdateExpense,
  deleteExpense as firestoreDeleteExpense
} from '../services/firestoreService';

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load expenses when user changes
  useEffect(() => {
    if (user) {
      loadExpenses();
    } else {
      setExpenses([]); // Clear on logout
    }
  }, [user]);

  const loadExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await firestoreGetExpenses(user.uid);
      setExpenses(data);
    } catch (err) {
      setError('Failed to load expenses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expenseData) => {
    try {
      const id = await firestoreAddExpense(user.uid, expenseData);
      const newExpense = { id, ...expenseData, userId: user.uid, createdAt: new Date().toISOString() };
      // Prepend the new expense to local state
      setExpenses((prev) => [newExpense, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date)));
      return true;
    } catch (err) {
      setError('Failed to add expense');
      console.error(err);
      throw err;
    }
  };

  const updateExpense = async (id, updateData) => {
    try {
      await firestoreUpdateExpense(id, updateData);
      setExpenses((prev) => 
        prev.map(exp => exp.id === id ? { ...exp, ...updateData, updatedAt: new Date().toISOString() } : exp)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
      );
      return true;
    } catch (err) {
      setError('Failed to update expense');
      console.error(err);
      throw err;
    }
  };

  const deleteExpense = async (id) => {
    try {
      await firestoreDeleteExpense(id);
      setExpenses((prev) => prev.filter(exp => exp.id !== id));
      return true;
    } catch (err) {
      setError('Failed to delete expense');
      console.error(err);
      throw err;
    }
  };

  return (
    <ExpenseContext.Provider 
      value={{ 
        expenses, 
        loading, 
        error, 
        addExpense, 
        updateExpense, 
        deleteExpense,
        refreshExpenses: loadExpenses
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};
