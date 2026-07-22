import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { globalStyles } from '../styles/global';
import colors from '../constants/colors';

const ProfileScreen = ({ navigation }) => {
  const { user, logoutUser } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: async () => {
            try {
              await logoutUser();
            } catch (error) {
              Alert.alert('Error', 'Failed to log out');
            }
          }
        }
      ]
    );
  };

  const renderMenuItem = (icon, title, onPress) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIconContainer}>
        <MaterialCommunityIcons name={icon} size={24} color={colors.primary} />
      </View>
      <Text style={styles.menuTitle}>{title}</Text>
      <MaterialCommunityIcons name="chevron-right" size={24} color={colors.border} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.email ? user.email.charAt(0).toUpperCase() : 'S'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.displayName || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        {/* Settings Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={globalStyles.card}>
            {renderMenuItem('account-edit-outline', 'Edit Profile', () => Alert.alert('Coming Soon', 'This feature will be available soon.'))}
            {renderMenuItem('bell-outline', 'Notifications', () => Alert.alert('Coming Soon', 'This feature will be available soon.'))}
            {renderMenuItem('shield-check-outline', 'Privacy & Security', () => Alert.alert('Coming Soon', 'This feature will be available soon.'))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={globalStyles.card}>
            {renderMenuItem('help-circle-outline', 'Help & Support', () => Alert.alert('Coming Soon', 'This feature will be available soon.'))}
            {renderMenuItem('file-document-outline', 'Terms & Conditions', () => Alert.alert('Coming Soon', 'This feature will be available soon.'))}
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={24} color={colors.error} style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 1.0.0</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textMuted,
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textMuted,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)', // Light red background
    marginHorizontal: 24,
    marginTop: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.error,
  },
  versionText: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: 24,
    fontSize: 12,
  }
});

export default ProfileScreen;
