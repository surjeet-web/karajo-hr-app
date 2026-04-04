import React, { useState, useEffect } from 'react';
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

export const HRDashboardScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [appState, setAppState] = useState(getState());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { const unsub = subscribe(setAppState); return unsub; }, []);

  const onRefresh = () => { setRefreshing(true); setAppState(getState()); setRefreshing(false); };

  const { leave, permission, overtime, employees, notifications } = appState;
  const pendingLeave = leave.requests.filter(r => r.status === 'pending').length;
  const pendingPermission = permission.requests.filter(r => r.status === 'pending').length;
  const pendingOvertime = overtime.requests.filter(r => r.status === 'pending').length;
  const totalPending = pendingLeave + pendingPermission + pendingOvertime;
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="HR Dashboard" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        <View style={styles.statsRow}>
          <StatCard icon="people" label="Employees" value={employees.length} trend="up" trendValue="+3" color={colors.primary} delay={0} />
          <StatCard icon="hourglass" label="Pending" value={totalPending} trend="down" trendValue="-2" color={colors.warning} delay={100} />
          <StatCard icon="calendar" label="On Leave" value={pendingLeave} color={colors.accentPurple} delay={200} />
          <StatCard icon="notifications" label="Unread" value={unreadCount} color={colors.info} delay={300} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            {[
              { icon: 'checkmark-circle', label: 'Approvals', color: colors.success, screen: 'HRApprovalCenter' },
              { icon: 'people', label: 'Employees', color: colors.primary, screen: 'HREmployeeManagement' },
              { icon: 'calendar', label: 'Attendance', color: colors.warning, screen: 'HRAttendanceManagement' },
              { icon: 'bar-chart', label: 'Reports', color: colors.accentPurple, screen: 'HRReports' },
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
            <Text style={styles.sectionTitle}>Pending Approvals</Text>
            <TouchableOpacity onPress={() => navigation.navigate('HRApprovalCenter')}><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
          </View>
          {leave.requests.filter(r => r.status === 'pending').slice(0, 3).map((r, i) => (
            <ApprovalCard key={r.id} request={{ type: 'leave', requesterName: r.delegate || 'Employee', date: `${r.startDate} to ${r.endDate}`, days: r.days, status: 'pending' }}
              onPress={() => navigation.navigate('HRApprovalCenter')} delay={400 + i * 80} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Departments</Text>
          {[
            { name: 'Engineering', headcount: 89, openPositions: 5, head: 'James Wilson', budget: 450 },
            { name: 'Marketing', headcount: 34, openPositions: 3, head: 'Emma Wilson', budget: 200 },
            { name: 'Sales', headcount: 56, openPositions: 4, head: 'Alex Johnson', budget: 320 },
            { name: 'Operations', headcount: 42, openPositions: 2, head: 'Hanna Jenkins', budget: 280 },
          ].map((dept, i) => (
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
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.xl },
  section: { marginBottom: spacing.xl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  viewAll: { ...typography.bodySmall, color: colors.primary, fontWeight: '600' },
  quickActions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  quickAction: { width: '47%', borderRadius: borderRadius.lg, padding: spacing.lg, alignItems: 'center', gap: spacing.sm, ...shadows.sm },
  quickActionLabel: { ...typography.label, fontWeight: '600' },
});
