import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card, Badge } from '../../components';
import { StatCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';
import { getState, subscribe } from '../../store';
import { formatCurrency } from '../../utils/calculations';

export const HRReportsScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [state, setStateLocal] = useState(getState());
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => { const unsub = subscribe(setStateLocal); return unsub; }, []);
  const onRefresh = (): void => { setRefreshing(true); setStateLocal(getState()); setRefreshing(false); };

  const employees = state.employees || [];
  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const departments = [...new Set(employees.map(e => e.department))];
  const leaveRequests = state.leave.requests || [];
  const attendanceHistory = state.attendance.history || [];
  const expenses = state.expenses.requests || [];
  const penalties = state.penalties.records || [];

  const onTimeCount = attendanceHistory.filter(a => a.status === 'on-time').length;
  const lateCount = attendanceHistory.filter(a => a.status === 'late').length;
  const absentCount = attendanceHistory.filter(a => a.status === 'absent').length;
  const attendanceRate = attendanceHistory.length > 0 ? Math.round(((onTimeCount + lateCount) / attendanceHistory.length) * 100) : 0;
  const approvedLeave = leaveRequests.filter(r => r.status === 'approved').length;
  const pendingLeave = leaveRequests.filter(r => r.status === 'pending').length;
  const totalLeaveDays = leaveRequests.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.days, 0);
  const approvedExpenses = expenses.filter(e => e.status === 'approved').reduce((sum, e) => sum + e.amount, 0);
  const pendingExpenses = expenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);

  const reports = [
    { id: 'attendance', title: 'Attendance Report', desc: `${attendanceHistory.length} records`, icon: 'calendar', color: colors.primary, data: { rate: attendanceRate, onTime: onTimeCount, late: lateCount, absent: absentCount } },
    { id: 'leave', title: 'Leave Report', desc: `${leaveRequests.length} requests`, icon: 'umbrella', color: colors.warning, data: { approved: approvedLeave, pending: pendingLeave, totalDays: totalLeaveDays } },
    { id: 'employee', title: 'Employee Report', desc: `${activeEmployees} active`, icon: 'people', color: colors.success, data: { total: employees.length, active: activeEmployees, departments: departments.length } },
    { id: 'expense', title: 'Expense Report', desc: `${formatCurrency(approvedExpenses + pendingExpenses)}`, icon: 'receipt', color: colors.accentPurple, data: { approved: approvedExpenses, pending: pendingExpenses } },
    { id: 'penalty', title: 'Penalty Report', desc: `${penalties.length} records`, icon: 'warning', color: colors.error, data: { active: penalties.filter(p => p.status === 'active').length, resolved: penalties.filter(p => p.status === 'resolved').length } },
    { id: 'department', title: 'Department Report', desc: `${departments.length} departments`, icon: 'business', color: colors.info, data: { count: departments.length } },
  ];

  const handleGenerateReport = (report) => {
    hapticFeedback('medium');
    Alert.alert('Generate Report', `Generate ${report.title}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Generate', onPress: () => { hapticFeedback('success'); Alert.alert('Success', `${report.title} generated.`); } },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="HR Reports" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        <View style={styles.statsRow}>
          <StatCard icon="people" label="Employees" value={activeEmployees.toString()} color={colors.primary} delay={0} />
          <StatCard icon="calendar" label="Attendance" value={`${attendanceRate}%`} color={colors.success} delay={100} />
          <StatCard icon="umbrella" label="Leave Days" value={totalLeaveDays.toString()} color={colors.warning} delay={200} />
        </View>
        <Text style={styles.sectionTitle}>Available Reports</Text>
        {reports.map((report, i) => (
          <TouchableOpacity key={report.id} style={[styles.reportCard, shadows.sm]} onPress={() => handleGenerateReport(report)} activeOpacity={0.7}>
            <View style={[styles.reportIcon, { backgroundColor: report.color + '15' }]}>
              <Ionicons name={report.icon} size={24} color={report.color} />
            </View>
            <View style={styles.reportInfo}>
              <Text style={styles.reportTitle}>{report.title}</Text>
              <Text style={styles.reportDesc}>{report.desc}</Text>
              <Text style={styles.reportData}>
                {report.id === 'attendance' && `Rate: ${report.data.rate}%`}
                {report.id === 'leave' && `${report.data.approved} approved, ${report.data.pending} pending`}
                {report.id === 'employee' && `${report.data.departments} departments`}
                {report.id === 'expense' && `Approved: ${formatCurrency(report.data.approved)}`}
                {report.id === 'penalty' && `${report.data.active} active, ${report.data.resolved} resolved`}
                {report.id === 'department' && `${report.data.count} departments`}
              </Text>
            </View>
            <Ionicons name="download-outline" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  reportCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.md },
  reportIcon: { width: 48, height: 48, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center' },
  reportInfo: { flex: 1 },
  reportTitle: { ...typography.body, color: colors.text, fontWeight: '600' },
  reportDesc: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  reportData: { ...typography.caption, color: colors.primary, fontWeight: '600', marginTop: 2 },
});
