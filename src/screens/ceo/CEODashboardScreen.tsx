import React, { useState } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card } from '../../components';
import { StatCard, DepartmentCard, ApprovalCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';

export const CEODashboardScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const onRefresh = (): void => { setRefreshing(true); setTimeout(() => setRefreshing(false), 800); };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="CEO Dashboard" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        <View style={styles.statsRow}>
          <StatCard icon="people" label="Total Employees" value="247" trend="up" trendValue="+12%" color={colors.primary} delay={0} />
          <StatCard icon="wallet" label="Revenue/Employee" value="$285K" trend="up" trendValue="+8%" color={colors.success} delay={100} />
          <StatCard icon="checkmark-circle" label="Attendance Rate" value="94%" trend="up" trendValue="+2%" color={colors.info} delay={200} />
          <StatCard icon="star" label="Critical Approvals" value="3" color={colors.warning} delay={300} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Navigation</Text>
          <View style={styles.quickActions}>
            {[
              { icon: 'stats-chart', label: 'Analytics', color: colors.primary, screen: 'CEOAnalytics' },
              { icon: 'business', label: 'Departments', color: colors.success, screen: 'DepartmentOverview' },
              { icon: 'flag', label: 'Goals', color: colors.warning, screen: 'CompanyGoals' },
              { icon: 'bar-chart', label: 'Reports', color: colors.accentPurple, screen: 'CEOReports' },
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
          <Text style={styles.sectionTitle}>Department Performance</Text>
          {[
            { name: 'Engineering', headcount: 89, openPositions: 5, head: 'James Wilson', budget: 450, score: 92 },
            { name: 'Marketing', headcount: 34, openPositions: 3, head: 'Emma Wilson', budget: 200, score: 87 },
            { name: 'Sales', headcount: 56, openPositions: 4, head: 'Alex Johnson', budget: 320, score: 95 },
            { name: 'Operations', headcount: 42, openPositions: 2, head: 'Hanna Jenkins', budget: 280, score: 89 },
          ].map((dept, i) => (
            <TouchableOpacity key={dept.name} style={[styles.deptRow, shadows.sm]} onPress={() => { hapticFeedback('medium'); navigation.navigate('DepartmentDetail'); }} activeOpacity={0.7}>
              <View style={styles.deptInfo}>
                <Text style={styles.deptName}>{dept.name}</Text>
                <Text style={styles.deptCount}>{dept.headcount} employees</Text>
              </View>
              <View style={styles.deptScore}>
                <Text style={[styles.scoreValue, { color: dept.score >= 90 ? colors.success : dept.score >= 80 ? colors.warning : colors.error }]}>{dept.score}%</Text>
                <Text style={styles.scoreLabel}>Score</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Critical Approvals</Text>
          {[
            { type: 'expense', requesterName: 'James Wilson', date: 'Feb 27', amount: 15000, reason: 'Server infrastructure upgrade', status: 'pending' },
            { type: 'leave', requesterName: 'Hanna Jenkins', date: 'Mar 1 - Mar 15', days: 15, reason: 'Sabbatical', status: 'pending' },
          ].map((approval, i) => (
            <ApprovalCard key={i} request={approval} onPress={() => {}} delay={500 + i * 80} />
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
  deptRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm },
  deptInfo: { flex: 1 },
  deptName: { ...typography.body, color: colors.text, fontWeight: '600' },
  deptCount: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  deptScore: { alignItems: 'flex-end' },
  scoreValue: { ...typography.h4, fontWeight: '700' },
  scoreLabel: { ...typography.caption, color: colors.textTertiary },
});
