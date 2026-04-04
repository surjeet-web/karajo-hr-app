import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card } from '../../components';
import { StatCard, ApprovalCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';

export const FinanceDashboardScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 800); };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Finance Dashboard" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        <View style={styles.statsRow}>
          <StatCard icon="wallet" label="Total Payroll" value="$1.2M" trend="up" trendValue="+5%" color={colors.primary} delay={0} />
          <StatCard icon="hourglass" label="Pending Expenses" value="12" color={colors.warning} delay={100} />
          <StatCard icon="checkmark-circle" label="Approved" value="48" color={colors.success} delay={200} />
          <StatCard icon="calendar" label="Next Payroll" value="Mar 1" color={colors.accentPurple} delay={300} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            {[
              { icon: 'card', label: 'Payroll', color: colors.primary, screen: 'PayrollManagement' },
              { icon: 'receipt', label: 'Expenses', color: colors.success, screen: 'FinanceExpenseManagement' },
              { icon: 'bar-chart', label: 'Reports', color: colors.accentPurple, screen: 'FinanceReports' },
              { icon: 'settings', label: 'Settings', color: colors.textSecondary, screen: 'FinanceSettings' },
            ].map(action => (
              <TouchableOpacity key={action.label} style={[styles.quickAction, { backgroundColor: `${action.color}10` }]}
                onPress={() => { hapticFeedback('medium'); navigation.navigate(action.screen); }} activeOpacity={0.7}>
                <Ionicons name={action.icon} size={24} color={action.color} />
                <Text style={[styles.quickActionLabel, { color: action.color }]}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Expenses</Text>
          {[
            { type: 'expense', requesterName: 'James Wilson', date: 'Feb 27', amount: 450, status: 'pending' },
            { type: 'expense', requesterName: 'Rachel Green', date: 'Feb 26', amount: 85, status: 'pending' },
            { type: 'expense', requesterName: 'Tom Brown', date: 'Feb 25', amount: 32, status: 'approved' },
          ].map((exp, i) => (
            <ApprovalCard key={i} request={exp} onPress={() => navigation.navigate('FinanceExpenseManagement')} delay={400 + i * 80} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.xl },
  section: { marginBottom: spacing.xl },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  quickActions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  quickAction: { width: '47%', borderRadius: borderRadius.lg, padding: spacing.lg, alignItems: 'center', gap: spacing.sm, ...shadows.sm },
  quickActionLabel: { ...typography.label, fontWeight: '600' },
});
