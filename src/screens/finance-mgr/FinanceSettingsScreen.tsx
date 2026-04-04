import React from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header } from '../../components';
import { hapticFeedback } from '../../utils/haptics';
import { useAuth } from '../../context/AuthContext';

export const FinanceSettingsScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();

  const menuItems = [
    { icon: 'person-outline', label: 'Profile Settings', screen: 'Profile' },
    { icon: 'shield-checkmark-outline', label: 'Security & Privacy' },
    { icon: 'notifications-outline', label: 'Notification Preferences', screen: 'Notifications' },
    { icon: 'calculator-outline', label: 'Tax Configuration' },
    { icon: 'wallet-outline', label: 'Budget Settings' },
    { icon: 'help-circle-outline', label: 'Help & Support' },
  ];

  const handleLogout = (): void => {
    hapticFeedback('heavy');
    Alert.alert('Logout', 'Are you sure?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Logout', style: 'destructive', onPress: logout }]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Settings" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
  menuSection: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, marginBottom: spacing.lg, ...shadows.sm },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  menuLabel: { ...typography.body, color: colors.text, flex: 1 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.md, backgroundColor: colors.errorLight, borderRadius: borderRadius.lg },
  logoutText: { ...typography.body, color: colors.error, fontWeight: '600' },
});
