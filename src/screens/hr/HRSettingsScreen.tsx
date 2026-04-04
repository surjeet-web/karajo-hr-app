import React, { useState, useEffect } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card } from '../../components';
import { hapticFeedback } from '../../utils/haptics';
import { useAuth } from '../../context/AuthContext';
import { getState, subscribe } from '../../store';

export const HRSettingsScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { logout, user } = useAuth();
  const [state, setStateLocal] = useState(getState());
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [emailAlerts, setEmailAlerts] = useState<boolean>(true);
  const [autoApproveLeave, setAutoApproveLeave] = useState<boolean>(false);

  useEffect(() => {
    const unsub = subscribe(setStateLocal);
    return unsub;
  }, []);

  const handleLogout = (): void => {
    hapticFeedback('heavy');
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const handleClearCache = (): void => {
    hapticFeedback('medium');
    Alert.alert('Clear Cache', 'This will clear all cached data. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => { hapticFeedback('success'); Alert.alert('Cleared', 'Cache has been cleared.'); } },
    ]);
  };

  const menuItems = [
    { icon: 'person-outline', label: 'Profile Settings', screen: 'Profile' },
    { icon: 'shield-checkmark-outline', label: 'Security & Privacy', screen: null },
    { icon: 'notifications-outline', label: 'Notification Preferences', screen: 'Notifications' },
    { icon: 'business-outline', label: 'Company Policies', screen: 'HRPolicyManagement' },
    { icon: 'people-outline', label: 'Role Management', screen: null },
    { icon: 'briefcase-outline', label: 'Bulk Actions', screen: 'HRBulkActions' },
    { icon: 'help-circle-outline', label: 'Help & Support', screen: null },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Settings" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {user && (
          <Card style={styles.profileCard} padding="lg">
            <Ionicons name="person-circle" size={48} color={colors.primary} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.name || 'HR Manager'}</Text>
              <Text style={styles.profileRole}>HR Manager</Text>
            </View>
          </Card>
        )}

        <Card style={styles.settingsCard} padding="lg">
          <Text style={styles.settingsTitle}>Preferences</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDesc}>Receive push notifications for approvals</Text>
            </View>
            <Switch value={notificationsEnabled} onValueChange={(v) => { hapticFeedback('light'); setNotificationsEnabled(v); }} trackColor={{ false: colors.border, true: colors.primary }} thumbColor={colors.textInverse} />
          </View>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Email Alerts</Text>
              <Text style={styles.settingDesc}>Receive email alerts for pending items</Text>
            </View>
            <Switch value={emailAlerts} onValueChange={(v) => { hapticFeedback('light'); setEmailAlerts(v); }} trackColor={{ false: colors.border, true: colors.primary }} thumbColor={colors.textInverse} />
          </View>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Auto-Approve Leave</Text>
              <Text style={styles.settingDesc}>Auto-approve leave requests under 2 days</Text>
            </View>
            <Switch value={autoApproveLeave} onValueChange={(v) => { hapticFeedback('light'); setAutoApproveLeave(v); }} trackColor={{ false: colors.border, true: colors.primary }} thumbColor={colors.textInverse} />
          </View>
        </Card>

        <Card style={styles.menuCard} padding="none">
          {menuItems.map((item, i) => (
            <TouchableOpacity key={i} style={[styles.menuItem, i < menuItems.length - 1 && styles.menuItemBorder]} onPress={() => { hapticFeedback('light'); if (item.screen) navigation.navigate(item.screen); else Alert.alert('Coming Soon', `${item.label} will be available soon.`); }} activeOpacity={0.7}>
              <Ionicons name={item.icon} size={22} color={colors.textSecondary} />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </Card>

        <TouchableOpacity style={[styles.dangerBtn, { marginBottom: spacing.md }]} onPress={handleClearCache} activeOpacity={0.7}>
          <Ionicons name="trash-outline" size={20} color={colors.error} />
          <Text style={styles.dangerBtnText}>Clear Cache</Text>
        </TouchableOpacity>

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
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
  profileInfo: { flex: 1 },
  profileName: { ...typography.body, color: colors.text, fontWeight: '600' },
  profileRole: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  settingsCard: { marginBottom: spacing.lg },
  settingsTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  settingInfo: { flex: 1, marginRight: spacing.md },
  settingLabel: { ...typography.body, color: colors.text, fontWeight: '500' },
  settingDesc: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
  menuCard: { borderRadius: borderRadius.lg, marginBottom: spacing.lg, ...shadows.sm },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  menuLabel: { ...typography.body, color: colors.text, flex: 1 },
  dangerBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.md, backgroundColor: colors.errorLight, borderRadius: borderRadius.lg },
  dangerBtnText: { ...typography.body, color: colors.error, fontWeight: '600' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.md, backgroundColor: colors.errorLight, borderRadius: borderRadius.lg },
  logoutText: { ...typography.body, color: colors.error, fontWeight: '600' },
});
