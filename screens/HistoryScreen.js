import React, { useState, useContext, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SwipeListView } from 'react-native-swipe-list-view';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ExpenseContext } from '../context/ExpenseContext';
import ExpenseCard from '../components/ExpenseCard';
import EmptyState from '../components/EmptyState';
import { globalStyles } from '../styles/global';
import colors from '../constants/colors';

const CATEGORIES = ['All', 'Food', 'Shopping', 'Travel', 'Healthcare', 'Bills', 'Entertainment', 'Education', 'Salary', 'Investment', 'Others'];
const SORTS = ['Newest', 'Oldest', 'Highest Amount', 'Lowest Amount'];

const HistoryScreen = ({ navigation }) => {
  const { expenses, loading, refreshExpenses, deleteExpense } = useContext(ExpenseContext);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all'); // all, income, expense
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Newest');
  
  const [showFilters, setShowFilters] = useState(false);

  // Apply Search, Filter, and Sort
  const filteredAndSortedExpenses = useMemo(() => {
    let result = [...expenses];

    // Search
    if (searchQuery) {
      result = result.filter(e => 
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        e.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type Filter
    if (selectedType !== 'all') {
      result = result.filter(e => e.type === selectedType);
    }

    // Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(e => e.category === selectedCategory);
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      
      switch(selectedSort) {
        case 'Newest': return dateB - dateA;
        case 'Oldest': return dateA - dateB;
        case 'Highest Amount': return b.amount - a.amount;
        case 'Lowest Amount': return a.amount - b.amount;
        default: return dateB - dateA;
      }
    });

    return result;
  }, [expenses, searchQuery, selectedType, selectedCategory, selectedSort]);

  const handleDelete = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
    deleteExpense(rowKey);
  };

  const renderItem = (data, rowMap) => (
    <View style={styles.rowFront}>
      <ExpenseCard 
        expense={data.item} 
        onPress={() => navigation.navigate('AddExpense', { expense: data.item })} 
      />
    </View>
  );

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => handleDelete(rowMap, data.item.id)}
      >
        <MaterialCommunityIcons name="delete-outline" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transaction History</Text>
        <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
          <MaterialCommunityIcons name="filter-variant" size={28} color={showFilters ? colors.primary : colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={24} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search transactions..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textMuted}
        />
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filterLabel}>Type</Text>
          <View style={styles.filterRow}>
            {['all', 'income', 'expense'].map(type => (
              <TouchableOpacity 
                key={type} 
                style={[styles.filterChip, selectedType === type && styles.filterChipActive]}
                onPress={() => setSelectedType(type)}
              >
                <Text style={[styles.filterChipText, selectedType === type && styles.filterChipTextActive]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.filterLabel}>Sort By</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
            {SORTS.map(sort => (
              <TouchableOpacity 
                key={sort} 
                style={[styles.filterChip, selectedSort === sort && styles.filterChipActive]}
                onPress={() => setSelectedSort(sort)}
              >
                <Text style={[styles.filterChipText, selectedSort === sort && styles.filterChipTextActive]}>{sort}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.filterLabel}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity 
                key={cat} 
                style={[styles.filterChip, selectedCategory === cat && styles.filterChipActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[styles.filterChipText, selectedCategory === cat && styles.filterChipTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {filteredAndSortedExpenses.length === 0 ? (
        <EmptyState message="No transactions found matching your criteria." />
      ) : (
        <SwipeListView
          data={filteredAndSortedExpenses}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-75}
          disableRightSwipe
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refreshExpenses} tintColor={colors.primary} />
          }
        />
      )}
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 24,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 16,
  },
  filtersContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: '#F1F5F9', // slightly darker background for filter area
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 12,
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
  },
  scrollRow: {
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    color: colors.text,
  },
  filterChipTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  rowFront: {
    backgroundColor: colors.background,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: colors.error,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    marginVertical: 8,
    borderRadius: 16,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    backgroundColor: colors.error,
    right: 0,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
});

export default HistoryScreen;
