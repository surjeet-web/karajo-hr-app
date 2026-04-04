import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Button, AnimatedListItem } from '../../components';
import { hapticFeedback } from '../../utils/haptics';
import { useFadeIn, useSlideIn } from '../../utils/animations';
import { getState, resetState } from '../../store';

export const ProfileScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const user = getState().user;
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleLogout = () => {
    hapticFeedback('medium');
    resetState();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const menuItems = [
    { icon: 'person-outline', title: 'Personal Information', subtitle: 'Contact details, address, and emergency', route: 'PersonalInfo' },
    { icon: 'shield-checkmark-outline', title: 'Identity Verification', subtitle: 'Passport, ID card, tax information', route: 'IdentityVerification' },
    { icon: 'briefcase-outline', title: 'Employment Information', subtitle: 'Position, department, employment details', route: 'EmploymentInfo' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Profile" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.role}>{user.role} • {user.department}</Text>
          <View style={styles.idBadge}>
            <Text style={styles.idText}>ID: {user.id}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => { hapticFeedback('light'); navigation.navigate(item.route); }}
              accessibilityLabel={`${item.title}: ${item.subtitle}`}
              accessibilityRole="button"
            >
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon} size={22} color={colors.primary} />
              </View>
              <View style={styles.menuInfo}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <Button
            title="Log Out"
            variant="outline"
            onPress={handleLogout}
            icon={<Ionicons name="log-out-outline" size={20} color={colors.error} />}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  profileHeader: { alignItems: 'center', marginBottom: spacing.xl },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: spacing.lg },
  name: { ...typography.h3, color: colors.text, marginBottom: spacing.xs },
  role: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.md },
  idBadge: { backgroundColor: colors.surfaceVariant, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full },
  idText: { ...typography.bodySmall, color: colors.textSecondary },
  menuContainer: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  menuIcon: { width: 44, height: 44, borderRadius: borderRadius.md, backgroundColor: colors.primaryLighter, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  menuInfo: { flex: 1 },
  menuTitle: { ...typography.body, color: colors.text, fontWeight: '600' },
  menuSubtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  logoutContainer: { marginTop: spacing.xl },
});
