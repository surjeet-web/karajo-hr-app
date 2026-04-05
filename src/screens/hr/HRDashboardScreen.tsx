import React, { useState, useEffect } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Badge, Card } from '../../components';
import { StatCard, ApprovalCard, DepartmentCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';
import { getState, subscribe } from '../../store';
import { performanceData } from '../../data/mockData';
import { formatCurrency } from '../../utils/calculations';

export const HRDashboardScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [appState, setAppState] = useState(getState());
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => { const unsub = subscribe(setAppState); return unsub; }, []);

  const onRefresh = (): void => { setRefreshing(true); setAppState(getState()); setRefreshing(false); };

  const { leave, permission, overtime, employees, notifications, attendance, expenses, penalties } = appState;
  const pendingLeave = leave.requests.filter(r => r.status === 'pending').length;
  const pendingPermission = permission.requests.filter(r => r.status === 'pending').length;
  const pendingOvertime = overtime.requests.filter(r => r.status === 'pending').length;
  const pendingCorrections = attendance.corrections?.filter(c => c.status === 'pending').length || 0;
  const pendingExpenses = expenses.requests.filter(e => e.status === 'pending').length;
  const totalPending = pendingLeave + pendingPermission + pendingOvertime + pendingCorrections + pendingExpenses;
  const unreadCount = notifications.filter(n => !n.read).length;
  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const onboardingEmployees = employees.filter(e => e.status === 'onboarding').length;
  const todayAttendance = attendance.history.filter(a => {
    const d = new Date(a.date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });
  const lateToday = todayAttendance.filter(a => a.status === 'late').length;

  const departments = [...new Set(employees.map(e => e.department))].map(name => {
    const deptEmployees = employees.filter(e => e.department === name);
    return {
      name,
      headcount: deptEmployees.length,
      openPositions: Math.floor(Math.random() * 5) + 1,
      head: deptEmployees[0]?.manager || 'Not assigned',
      budget: Math.floor(Math.random() * 400 + 100),
    };
  });

  const allPendingRequests = [
    ...leave.requests.filter(r => r.status === 'pending').map(r => ({ type: 'leave', id: r.id, requesterName: r.delegate || 'Employee', date: `${r.startDate} to ${r.endDate}`, days: r.days, status: r.status })),
    ...permission.requests.filter(r => r.status === 'pending').map(r => ({ type: 'permission', id: r.id, requesterName: 'Employee', date: r.date, days: r.duration, status: r.status })),
    ...overtime.requests.filter(r => r.status === 'pending').map(r => ({ type: 'overtime', id: r.id, requesterName: 'Employee', date: r.date, days: r.duration, status: r.status })),
    ...(attendance.corrections || []).filter(c => c.status === 'pending').map(c => ({ type: 'correction', id: c.id, requesterName: 'Employee', date: c.date, status: c.status })),
    ...expenses.requests.filter(e => e.status === 'pending').map(e => ({ type: 'expense', id: e.id, requesterName: e.title, date: e.date, amount: e.amount, status: e.status })),
  ].sort((a, b) => b.id - a.id).slice(0, 5);

  const avgRating = performanceData.overview.overallRating;
  const completedReviews = performanceData.overview.completedReviews;
  const topPerformers = performanceData.overview.topPerformers;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="HR Dashboard" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        <View style={styles.statsRow}>
          <StatCard icon="people" label="Employees" value={activeEmployees.toString()} trend="up" trendValue={`+${onboardingEmployees}`} color={colors.primary} delay={0} />
          <StatCard icon="hourglass" label="Pending" value={totalPending.toString()} color={colors.warning} delay={100} />
          <StatCard icon="calendar" label="On Leave" value={pendingLeave.toString()} color={colors.accentPurple} delay={200} />
          <StatCard icon="notifications" label="Unread" value={unreadCount.toString()} color={colors.info} delay={300} />
        </View>

        <View style={styles.statsRow}>
          <StatCard icon="warning" label="Late Today" value={lateToday.toString()} color={colors.error} delay={400} />
          <StatCard icon="person-add" label="Onboarding" value={onboardingEmployees.toString()} color={colors.success} delay={500} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            {[
              { icon: 'checkmark-circle', label: 'Approvals', color: colors.success, screen: 'HRApprovalCenter' },
              { icon: 'people', label: 'Employees', color: colors.primary, screen: 'HREmployeeManagement' },
              { icon: 'calendar', label: 'Attendance', color: colors.warning, screen: 'HRAttendanceManagement' },
              { icon: 'umbrella', label: 'Leave Mgmt', color: colors.accentPurple, screen: 'HRLeaveManagement' },
              { icon: 'school', label: 'Onboarding', color: colors.info, screen: 'HROnboardingManagement' },
              { icon: 'trending-up', label: 'Performance', color: colors.accentOrange, screen: 'PerformanceDashboard' },
              { icon: 'bar-chart', label: 'Reports', color: colors.textSecondary, screen: 'HRReports' },
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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Performance Overview</Text>
            <TouchableOpacity onPress={() => { hapticFeedback('light'); navigation.navigate('PerformanceDashboard'); }}>
              <Text style={styles.viewAll}>View Details</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.perfGrid}>
            <TouchableOpacity style={[styles.perfStatCard, { backgroundColor: `${colors.primary}10` }]} onPress={() => { hapticFeedback('light'); navigation.navigate('PerformanceDashboard'); }} activeOpacity={0.7}>
              <Ionicons name="star" size={24} color={colors.primary} />
              <Text style={[styles.perfStatValue, { color: colors.primary }]}>{avgRating}</Text>
              <Text style={styles.perfStatLabel}>Avg Rating</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.perfStatCard, { backgroundColor: `${colors.success}10` }]} onPress={() => { hapticFeedback('light'); navigation.navigate('PerformanceReview'); }} activeOpacity={0.7}>
              <Ionicons name="checkmark-done" size={24} color={colors.success} />
              <Text style={[styles.perfStatValue, { color: colors.success }]}>{completedReviews}</Text>
              <Text style={styles.perfStatLabel}>Reviews Done</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.perfStatCard, { backgroundColor: `${colors.warning}10` }]} onPress={() => { hapticFeedback('light'); navigation.navigate('KPITracking'); }} activeOpacity={0.7}>
              <Ionicons name="people" size={24} color={colors.warning} />
              <Text style={[styles.perfStatValue, { color: colors.warning }]}>{topPerformers}</Text>
              <Text style={styles.perfStatLabel}>Top Performers</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pending Approvals ({totalPending})</Text>
            <TouchableOpacity onPress={() => { hapticFeedback('light'); navigation.navigate('HRApprovalCenter'); }}><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
          </View>
          {allPendingRequests.length > 0 ? allPendingRequests.map((req, i) => (
            <ApprovalCard key={`${req.type}-${req.id}`} request={req} onPress={() => { hapticFeedback('medium'); navigation.navigate('HRApprovalCenter'); }} delay={400 + i * 80} />
          )) : (
            <Card style={styles.emptyCard} padding="lg">
              <Ionicons name="checkmark-circle" size={32} color={colors.success} />
              <Text style={styles.emptyText}>All caught up! No pending approvals.</Text>
            </Card>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Departments</Text>
          {departments.map((dept, i) => (
            <DepartmentCard key={dept.name} department={dept} delay={600 + i * 80} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.lg },
  section: { marginBottom: spacing.xl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  viewAll: { ...typography.bodySmall, color: colors.primary, fontWeight: '600' },
  quickActions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  quickAction: { width: '30%', borderRadius: borderRadius.lg, padding: spacing.lg, alignItems: 'center', gap: spacing.sm, ...shadows.sm },
  quickActionLabel: { ...typography.label, fontWeight: '600' },
  emptyCard: { alignItems: 'center', gap: spacing.sm },
  emptyText: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  perfGrid: { flexDirection: 'row', gap: spacing.md },
  perfStatCard: { flex: 1, borderRadius: borderRadius.lg, padding: spacing.md, alignItems: 'center', gap: spacing.xs },
  perfStatValue: { ...typography.h3, fontWeight: '700' },
  perfStatLabel: { ...typography.caption, color: colors.textSecondary },
});
