import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../constants/colors';

const EmptyState = ({ message = 'No items found', icon = 'file-search-outline' }) => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={icon} size={80} color={colors.border} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 40,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
  }
});

export default EmptyState;
