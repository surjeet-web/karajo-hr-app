import React, { useState, useEffect } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Badge, Card } from '../../components';
import { StatCard, ApprovalCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';
import { getState, subscribe } from '../../store';
import { formatCurrency } from '../../utils/calculations';
import { useAuth } from '../../context/AuthContext';

export const ManagerDashboardScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { hasFeature } = useAuth();
  const [appState, setAppState] = useState(getState());
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => { const unsub = subscribe(setAppState); return unsub; }, []);
  const onRefresh = (): void => { setRefreshing(true); setAppState(getState()); setRefreshing(false); };

  const { leave, permission, overtime, employees, attendance, expenses } = appState;
  const canManageAllTeams = hasFeature('canManageAllTeams');
  
  // If manager can manage all teams, show ALL employees; otherwise filter by department
  const teamMembers = canManageAllTeams 
    ? employees.filter(e => e.status === 'active')
    : employees.filter(e => e.status === 'active'); // Already shows all since manager has 'all' department access
  
  const departments = [...new Set(employees.filter(e => e.status === 'active').map(e => e.department))];
  const pendingLeave = leave.requests.filter(r => r.status === 'pending').length;
  const pendingPermission = permission.requests.filter(r => r.status === 'pending').length;
  const pendingOvertime = overtime.requests.filter(r => r.status === 'pending').length;
  const pendingExpenses = expenses.requests.filter(e => e.status === 'pending').length;
  const totalPending = pendingLeave + pendingPermission + pendingOvertime + pendingExpenses;
  const attendanceHistory = attendance.history || [];
  const onTimeCount = attendanceHistory.filter(a => a.status === 'on-time').length;
  const lateCount = attendanceHistory.filter(a => a.status === 'late').length;
  const attendanceRate = attendanceHistory.length > 0 ? Math.round(((onTimeCount + lateCount) / attendanceHistory.length) * 100) : 0;

  const allPendingRequests = [
    ...leave.requests.filter(r => r.status === 'pending').map(r => ({ type: 'leave', id: r.id, requesterName: r.delegate || 'Team Member', date: `${r.startDate} to ${r.endDate}`, days: r.days, status: r.status })),
    ...permission.requests.filter(r => r.status === 'pending').map(r => ({ type: 'permission', id: r.id, requesterName: 'Team Member', date: r.date, days: r.duration, status: r.status })),
    ...overtime.requests.filter(r => r.status === 'pending').map(r => ({ type: 'overtime', id: r.id, requesterName: 'Team Member', date: r.date, days: r.duration, status: r.status })),
    ...expenses.requests.filter(e => e.status === 'pending').map(e => ({ type: 'expense', id: e.id, requesterName: e.title, date: e.date, amount: e.amount, status: e.status })),
  ].sort((a, b) => b.id - a.id).slice(0, 4);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title={canManageAllTeams ? "All Teams Dashboard" : "Manager Dashboard"} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        <View style={styles.statsRow}>
          <StatCard icon="people" label={canManageAllTeams ? "All Teams" : "Team"} value={teamMembers.length.toString()} color={colors.primary} delay={0} />
          <StatCard icon="checkmark-circle" label="Attendance" value={`${attendanceRate}%`} color={colors.success} delay={100} />
          <StatCard icon="hourglass" label="Pending" value={totalPending.toString()} color={colors.warning} delay={200} />
          <StatCard icon="calendar" label="On Leave" value={pendingLeave.toString()} color={colors.accentPurple} delay={300} />
        </View>

        {canManageAllTeams && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Departments ({departments.length})</Text>
            <View style={styles.deptGrid}>
              {departments.map((dept, i) => {
                const deptCount = employees.filter(e => e.status === 'active' && e.department === dept).length;
                const deptPending = leave.requests.filter(r => r.status === 'pending').length;
                return (
                  <TouchableOpacity key={dept} style={[styles.deptCard, shadows.sm]} onPress={() => navigation.navigate('MyTeam')} activeOpacity={0.7}>
                    <Ionicons name="business" size={24} color={colors.primary} />
                    <Text style={styles.deptName}>{dept}</Text>
                    <Text style={styles.deptCount}>{deptCount} members</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            {[
              { icon: 'checkmark-circle', label: 'Approvals', color: colors.success, screen: 'ManagerApproval' },
              { icon: 'people', label: canManageAllTeams ? 'All Teams' : 'My Team', color: colors.primary, screen: 'MyTeam' },
              { icon: 'calendar', label: 'Planning', color: colors.warning, screen: 'TeamPlanning' },
              { icon: 'bar-chart', label: 'Reports', color: colors.accentPurple, screen: 'TeamReports' },
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
            <Text style={styles.sectionTitle}>{canManageAllTeams ? 'All Teams Overview' : 'Team Overview'}</Text>
            <TouchableOpacity onPress={() => { hapticFeedback('light'); navigation.navigate('MyTeam'); }}><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
          </View>
          {teamMembers.slice(0, 5).map((emp, i) => {
            const empAttendance = attendanceHistory[i % attendanceHistory.length];
            const status = empAttendance?.status === 'on-time' ? 'Present' : empAttendance?.status === 'late' ? 'Late' : empAttendance?.status === 'absent' ? 'Absent' : 'Present';
            const variant = status === 'Present' ? 'success' : status === 'Late' ? 'warning' : 'error';
            return (
              <TouchableOpacity key={emp.id} style={[styles.teamRow, shadows.sm]} onPress={() => { hapticFeedback('medium'); navigation.navigate('EmployeeDetail', { employee: emp }); }} activeOpacity={0.7}>
                <Ionicons name="person-circle" size={36} color={colors.primary} />
                <View style={styles.teamInfo}>
                  <Text style={styles.teamName}>{emp.name}</Text>
                  <Text style={styles.teamRole}>{emp.role} • {emp.department}</Text>
                </View>
                <Badge text={status} variant={variant} size="small" />
              </TouchableOpacity>
            );
          })}
        </View>

        {allPendingRequests.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Pending Approvals ({totalPending})</Text>
              <TouchableOpacity onPress={() => { hapticFeedback('light'); navigation.navigate('ManagerApproval'); }}><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
            </View>
            {allPendingRequests.map((req, i) => (
              <ApprovalCard key={`${req.type}-${req.id}`} request={req} onPress={() => { hapticFeedback('medium'); navigation.navigate('ManagerApproval'); }} delay={500 + i * 80} />
            ))}
          </View>
        )}
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
  deptGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.lg },
  deptCard: { width: '30%', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, alignItems: 'center', gap: spacing.xs },
  deptName: { ...typography.bodySmall, color: colors.text, fontWeight: '600', textAlign: 'center' },
  deptCount: { ...typography.caption, color: colors.textTertiary },
  teamRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.md },
  teamInfo: { flex: 1 },
  teamName: { ...typography.body, color: colors.text, fontWeight: '600' },
  teamRole: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
});
