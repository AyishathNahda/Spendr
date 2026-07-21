import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const EXPENSES_COLLECTION = 'expenses';

/**
 * Create a new expense/income record
 */
export const addExpense = async (userId, expenseData) => {
  try {
    const docRef = await addDoc(collection(db, EXPENSES_COLLECTION), {
      ...expenseData,
      userId,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all expenses for a specific user
 */
export const getUserExpenses = async (userId) => {
  try {
    const q = query(
      collection(db, EXPENSES_COLLECTION),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing expense
 */
export const updateExpense = async (expenseId, updateData) => {
  try {
    const expenseRef = doc(db, EXPENSES_COLLECTION, expenseId);
    await updateDoc(expenseRef, {
      ...updateData,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Delete an expense
 */
export const deleteExpense = async (expenseId) => {
  try {
    const expenseRef = doc(db, EXPENSES_COLLECTION, expenseId);
    await deleteDoc(expenseRef);
  } catch (error) {
    throw error;
  }
};
