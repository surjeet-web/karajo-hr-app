import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card } from '../../components';
import { StatCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';
import { getState, subscribe } from '../../store';
import { formatCurrency } from '../../utils/calculations';

export const TeamReportsScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [state, setStateLocal] = useState(getState());
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    const unsub = subscribe(setStateLocal);
    return unsub;
  }, []);

  const onRefresh = (): void => {
    setRefreshing(true);
    setStateLocal(getState());
    setRefreshing(false);
  };

  const employees = state.employees || [];
  const teamMembers = employees.filter(e => e.status === 'active');
  const attendanceHistory = state.attendance.history || [];
  const leaveRequests = state.leave.requests || [];
  const expenses = state.expenses.requests || [];
  const performance = state.performance;

  const onTimeCount = attendanceHistory.filter(a => a.status === 'on-time').length;
  const lateCount = attendanceHistory.filter(a => a.status === 'late').length;
  const absentCount = attendanceHistory.filter(a => a.status === 'absent').length;
  const attendanceRate = attendanceHistory.length > 0 ? Math.round(((onTimeCount + lateCount) / attendanceHistory.length) * 100) : 0;
  const avgRating = teamMembers.length > 0 ? (teamMembers.reduce((sum, e) => sum + (e.rating || 0), 0) / teamMembers.length).toFixed(1) : 0;
  const avgKpi = teamMembers.length > 0 ? Math.round(teamMembers.reduce((sum, e) => sum + (e.kpiScore || 0), 0) / teamMembers.length) : 0;
  const approvedLeave = leaveRequests.filter(r => r.status === 'approved');
  const totalLeaveDays = approvedLeave.reduce((sum, r) => sum + r.days, 0);
  const totalExpenses = expenses.filter(e => e.status === 'approved').reduce((sum, e) => sum + e.amount, 0);

  const reports = [
    { id: 'attendance', title: 'Attendance Summary', desc: `${attendanceHistory.length} records - ${attendanceRate}% rate`, icon: 'calendar', color: colors.primary, data: { onTime: onTimeCount, late: lateCount, absent: absentCount } },
    { id: 'leave', title: 'Leave Utilization', desc: `${approvedLeave.length} approved - ${totalLeaveDays} days`, icon: 'umbrella', color: colors.warning, data: { approved: approvedLeave.length, days: totalLeaveDays } },
    { id: 'performance', title: 'Performance Summary', desc: `Avg Rating: ${avgRating} - Avg KPI: ${avgKpi}`, icon: 'trending-up', color: colors.success, data: { rating: avgRating, kpi: avgKpi } },
    { id: 'expenses', title: 'Expense Summary', desc: `${formatCurrency(totalExpenses)} approved`, icon: 'receipt', color: colors.accentPurple, data: { total: totalExpenses } },
  ];

  const handleExportReport = (report) => {
    hapticFeedback('medium');
    Alert.alert('Export Report', `Export ${report.title}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Export', onPress: () => { hapticFeedback('success'); Alert.alert('Success', `${report.title} exported.`); } },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Team Reports" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        <View style={styles.statsRow}>
          <StatCard icon="checkmark-circle" label="Attendance" value={`${attendanceRate}%`} trend={attendanceRate > 90 ? 'up' : 'down'} trendValue={attendanceRate > 90 ? '+2%' : '-1%'} color={colors.success} delay={0} />
          <StatCard icon="umbrella" label="Leave Used" value={`${totalLeaveDays}d`} color={colors.warning} delay={100} />
          <StatCard icon="star" label="Avg Rating" value={avgRating.toString()} trend="up" trendValue="+0.2" color={colors.primary} delay={200} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Team Reports</Text>
          {reports.map((report, i) => (
            <TouchableOpacity key={report.id} style={[styles.reportCard, shadows.sm]} onPress={() => handleExportReport(report)} activeOpacity={0.7}>
              <View style={[styles.reportIcon, { backgroundColor: report.color + '15' }]}>
                <Ionicons name={report.icon} size={24} color={report.color} />
              </View>
              <View style={styles.reportInfo}>
                <Text style={styles.reportTitle}>{report.title}</Text>
                <Text style={styles.reportDesc}>{report.desc}</Text>
              </View>
              <Ionicons name="download-outline" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Team Performance Overview</Text>
          {teamMembers.slice(0, 5).map((emp, i) => (
            <Card key={emp.id} style={styles.perfCard} padding="md">
              <View style={styles.perfRow}>
                <Text style={styles.perfName}>{emp.name}</Text>
                <View style={styles.perfValues}>
                  <Text style={styles.perfValue}>Rating: {emp.rating || 'N/A'}</Text>
                  <Text style={styles.perfValue}>KPI: {emp.kpiScore || 'N/A'}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  reportCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.md },
  reportIcon: { width: 48, height: 48, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center' },
  reportInfo: { flex: 1 },
  reportTitle: { ...typography.body, color: colors.text, fontWeight: '600' },
  reportDesc: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  perfCard: { marginBottom: spacing.sm },
  perfRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  perfName: { ...typography.body, color: colors.text, fontWeight: '600' },
  perfValues: { alignItems: 'flex-end' },
  perfValue: { ...typography.caption, color: colors.textSecondary },
});
