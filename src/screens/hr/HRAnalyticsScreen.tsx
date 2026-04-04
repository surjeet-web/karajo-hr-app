import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card } from '../../components';
import { StatCard } from '../../components/management';
import { getState, subscribe } from '../../store';
import { calculateTurnoverRate, calculateRetentionRate, calculateAbsenceRate, calculatePromotionRate, calculateDiversityIndex } from '../../utils/calculations';

export const HRAnalyticsScreen: React.FC<any> = ({ navigation }) => {
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
  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const onboardingEmployees = employees.filter(e => e.status === 'onboarding').length;
  const departments = [...new Set(employees.map(e => e.department))];
  const avgRating = employees.length > 0 ? (employees.reduce((sum, e) => sum + (e.rating || 0), 0) / employees.length).toFixed(1) : 0;
  const avgKpi = employees.length > 0 ? Math.round(employees.reduce((sum, e) => sum + (e.kpiScore || 0), 0) / employees.length) : 0;

  const leaveRequests = state.leave.requests || [];
  const approvedLeave = leaveRequests.filter(r => r.status === 'approved').length;
  const rejectedLeave = leaveRequests.filter(r => r.status === 'rejected').length;
  const totalLeaveDays = leaveRequests.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.days, 0);

  const attendanceHistory = state.attendance.history || [];
  const onTimeCount = attendanceHistory.filter(a => a.status === 'on-time').length;
  const lateCount = attendanceHistory.filter(a => a.status === 'late').length;
  const absentCount = attendanceHistory.filter(a => a.status === 'absent').length;
  const attendanceRate = attendanceHistory.length > 0 ? Math.round(((onTimeCount + lateCount) / attendanceHistory.length) * 100) : 0;

  const deptDistribution = departments.map(name => {
    const count = employees.filter(e => e.department === name).length;
    return { name, count, pct: employees.length > 0 ? Math.round((count / employees.length) * 100) : 0 };
  }).sort((a, b) => b.count - a.count);

  const headcountTrend = [
    { month: 'Jan', value: Math.max(0, activeEmployees - 5) },
    { month: 'Feb', value: Math.max(0, activeEmployees - 3) },
    { month: 'Mar', value: Math.max(0, activeEmployees - 2) },
    { month: 'Apr', value: Math.max(0, activeEmployees - 1) },
    { month: 'May', value: activeEmployees },
    { month: 'Jun', value: activeEmployees + onboardingEmployees },
  ];
  const maxHeadcount = Math.max(...headcountTrend.map(t => t.value), 1);

  const turnoverRate = calculateTurnoverRate(2, activeEmployees, 12);
  const retentionRate = calculateRetentionRate(activeEmployees + 2, activeEmployees, onboardingEmployees);
  const absenceRate = calculateAbsenceRate(absentCount, 22, activeEmployees);
  const promotionRate = calculatePromotionRate(5, activeEmployees);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="HR Analytics" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        <View style={styles.statsRow}>
          <StatCard icon="trending-up" label="Headcount" value={activeEmployees.toString()} trend="up" trendValue={`+${onboardingEmployees}`} color={colors.success} delay={0} />
          <StatCard icon="trending-down" label="Turnover" value={`${turnoverRate}%`} color={colors.warning} delay={100} />
          <StatCard icon="star" label="Avg Rating" value={avgRating.toString()} color={colors.accentPurple} delay={200} />
          <StatCard icon="trending-up" label="Avg KPI" value={avgKpi.toString()} color={colors.primary} delay={300} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Headcount Trends</Text>
          <Card style={styles.chartCard} padding="lg">
            <Text style={styles.chartTitle}>Monthly Headcount</Text>
            {headcountTrend.map((trend, i) => (
              <View key={trend.month} style={styles.barRow}>
                <Text style={styles.barLabel}>{trend.month}</Text>
                <View style={styles.barContainer}>
                  <View style={[styles.bar, { width: `${(trend.value / maxHeadcount) * 100}%`, backgroundColor: colors.primary }]} />
                </View>
                <Text style={styles.barValue}>{trend.value}</Text>
              </View>
            ))}
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key HR Metrics</Text>
          <View style={styles.metricsGrid}>
            <Card style={styles.metricCard} padding="md">
              <Text style={styles.metricValue}>{attendanceRate}%</Text>
              <Text style={styles.metricLabel}>Attendance Rate</Text>
            </Card>
            <Card style={styles.metricCard} padding="md">
              <Text style={styles.metricValue}>{retentionRate}%</Text>
              <Text style={styles.metricLabel}>Retention Rate</Text>
            </Card>
            <Card style={styles.metricCard} padding="md">
              <Text style={styles.metricValue}>{absenceRate}%</Text>
              <Text style={styles.metricLabel}>Absence Rate</Text>
            </Card>
            <Card style={styles.metricCard} padding="md">
              <Text style={styles.metricValue}>{promotionRate}%</Text>
              <Text style={styles.metricLabel}>Promotion Rate</Text>
            </Card>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Leave Analytics</Text>
          <Card style={styles.leaveCard} padding="lg">
            <View style={styles.leaveRow}>
              <Text style={styles.leaveLabel}>Total Leave Days Used</Text>
              <Text style={styles.leaveValue}>{totalLeaveDays} days</Text>
            </View>
            <View style={styles.leaveRow}>
              <Text style={styles.leaveLabel}>Approved Requests</Text>
              <Text style={[styles.leaveValue, { color: colors.success }]}>{approvedLeave}</Text>
            </View>
            <View style={styles.leaveRow}>
              <Text style={styles.leaveLabel}>Rejected Requests</Text>
              <Text style={[styles.leaveValue, { color: colors.error }]}>{rejectedLeave}</Text>
            </View>
            <View style={styles.leaveRow}>
              <Text style={styles.leaveLabel}>Avg Leave per Employee</Text>
              <Text style={styles.leaveValue}>{activeEmployees > 0 ? (totalLeaveDays / activeEmployees).toFixed(1) : 0} days</Text>
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Department Distribution</Text>
          {deptDistribution.map((dept, i) => (
            <Card key={dept.name} style={styles.deptDistCard} padding="md">
              <View style={styles.deptDistHeader}>
                <Text style={styles.deptDistName}>{dept.name}</Text>
                <Text style={styles.deptDistCount}>{dept.count} employees ({dept.pct}%)</Text>
              </View>
              <View style={styles.deptDistBar}>
                <View style={[styles.deptDistFill, { width: `${dept.pct}%`, backgroundColor: colors.primary }]} />
              </View>
            </Card>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attendance Breakdown</Text>
          <View style={styles.attendanceGrid}>
            <Card style={styles.attendanceCard} padding="md">
              <Ionicons name="checkmark-circle" size={24} color={colors.success} />
              <Text style={styles.attendanceValue}>{onTimeCount}</Text>
              <Text style={styles.attendanceLabel}>On Time</Text>
            </Card>
            <Card style={styles.attendanceCard} padding="md">
              <Ionicons name="warning" size={24} color={colors.warning} />
              <Text style={styles.attendanceValue}>{lateCount}</Text>
              <Text style={styles.attendanceLabel}>Late</Text>
            </Card>
            <Card style={styles.attendanceCard} padding="md">
              <Ionicons name="close-circle" size={24} color={colors.error} />
              <Text style={styles.attendanceValue}>{absentCount}</Text>
              <Text style={styles.attendanceLabel}>Absent</Text>
            </Card>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.lg },
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  chartCard: { marginBottom: spacing.sm },
  chartTitle: { ...typography.body, color: colors.text, fontWeight: '600', marginBottom: spacing.md },
  barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, gap: spacing.sm },
  barLabel: { width: 30, ...typography.caption, color: colors.textSecondary },
  barContainer: { flex: 1, height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' },
  bar: { height: '100%', borderRadius: 4 },
  barValue: { width: 35, ...typography.caption, color: colors.text, fontWeight: '600', textAlign: 'right' },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  metricCard: { width: '47%', alignItems: 'center' },
  metricValue: { ...typography.statNumberSmall, color: colors.text },
  metricLabel: { ...typography.caption, color: colors.textTertiary, marginTop: spacing.xs },
  leaveCard: { marginBottom: spacing.sm },
  leaveRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  leaveLabel: { ...typography.bodySmall, color: colors.textSecondary },
  leaveValue: { ...typography.bodySmall, color: colors.text, fontWeight: '600' },
  deptDistCard: { marginBottom: spacing.sm },
  deptDistHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  deptDistName: { ...typography.body, color: colors.text, fontWeight: '600' },
  deptDistCount: { ...typography.bodySmall, color: colors.textSecondary },
  deptDistBar: { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  deptDistFill: { height: '100%', borderRadius: 3 },
  attendanceGrid: { flexDirection: 'row', gap: spacing.md },
  attendanceCard: { flex: 1, alignItems: 'center', gap: spacing.xs },
  attendanceValue: { ...typography.h4, color: colors.text, fontWeight: '700' },
  attendanceLabel: { ...typography.caption, color: colors.textTertiary },
});
