import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header } from '../../components';
import { hapticFeedback } from '../../utils/haptics';
import { useAuth } from '../../context/AuthContext';

export const HRSettingsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { logout, user } = useAuth();

  const menuItems = [
    { icon: 'person-outline', label: 'Profile Settings', screen: 'Profile' },
    { icon: 'shield-checkmark-outline', label: 'Security & Privacy', screen: null },
    { icon: 'notifications-outline', label: 'Notification Preferences', screen: 'Notifications' },
    { icon: 'business-outline', label: 'Company Policies', screen: null },
    { icon: 'people-outline', label: 'Role Management', screen: null },
    { icon: 'help-circle-outline', label: 'Help & Support', screen: null },
  ];

  const handleLogout = () => {
    hapticFeedback('heavy');
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Settings" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {user && (
          <View style={styles.profileCard}>
            <Ionicons name="person-circle" size={48} color={colors.primary} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.name || 'HR Manager'}</Text>
              <Text style={styles.profileRole}>HR Manager</Text>
            </View>
          </View>
        )}

        <View style={styles.menuSection}>
          {menuItems.map((item, i) => (
            <TouchableOpacity key={i} style={styles.menuItem} onPress={() => { hapticFeedback('light'); if (item.screen) navigation.navigate(item.screen); }} activeOpacity={0.7}>
              <Ionicons name={item.icon} size={22} color={colors.textSecondary} />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.lg, ...shadows.sm },
  profileInfo: { flex: 1 },
  profileName: { ...typography.body, color: colors.text, fontWeight: '600' },
  profileRole: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  menuSection: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, marginBottom: spacing.lg, ...shadows.sm },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  menuLabel: { ...typography.body, color: colors.text, flex: 1 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.md, backgroundColor: colors.errorLight, borderRadius: borderRadius.lg },
  logoutText: { ...typography.body, color: colors.error, fontWeight: '600' },
});
