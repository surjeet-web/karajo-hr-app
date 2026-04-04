import React, { useState, useEffect } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
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

export const HRReportDetailScreen: React.FC<any> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [state, setStateLocal] = useState(getState());
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const reportType = route.params?.type || 'employee';

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
  const departments = [...new Set(employees.map(e => e.department))];
  const leaveRequests = state.leave.requests || [];
  const attendanceHistory = state.attendance.history || [];
  const expenses = state.expenses.requests || [];

  const onTimeCount = attendanceHistory.filter(a => a.status === 'on-time').length;
  const lateCount = attendanceHistory.filter(a => a.status === 'late').length;
  const absentCount = attendanceHistory.filter(a => a.status === 'absent').length;
  const attendanceRate = attendanceHistory.length > 0 ? Math.round(((onTimeCount + lateCount) / attendanceHistory.length) * 100) : 0;

  const deptBreakdown = departments.map(name => {
    const count = employees.filter(e => e.department === name).length;
    return { name, count, pct: employees.length > 0 ? Math.round((count / employees.length) * 100) : 0 };
  }).sort((a, b) => b.count - a.count);

  const handleExport = (): void => {
    hapticFeedback('medium');
    Alert.alert('Export Report', `Export ${reportType} report as PDF?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Export', onPress: () => { hapticFeedback('success'); Alert.alert('Success', 'Report exported successfully.'); } },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title={`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        <View style={styles.statsRow}>
          <StatCard icon="people" label="Total" value={employees.length.toString()} color={colors.primary} delay={0} />
          <StatCard icon="checkmark-circle" label="Active" value={activeEmployees.toString()} color={colors.success} delay={100} />
          <StatCard icon="calendar" label="Attendance" value={`${attendanceRate}%`} color={colors.warning} delay={200} />
          <StatCard icon="umbrella" label="Leave Days" value={leaveRequests.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.days, 0).toString()} color={colors.accentPurple} delay={300} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Department Breakdown</Text>
          {deptBreakdown.map((dept, i) => (
            <Card key={dept.name} style={styles.deptCard} padding="md">
              <View style={styles.deptHeader}>
                <Text style={styles.deptName}>{dept.name}</Text>
                <Text style={styles.deptCount}>{dept.count} employees ({dept.pct}%)</Text>
              </View>
              <View style={styles.deptBar}>
                <View style={[styles.deptFill, { width: `${dept.pct}%`, backgroundColor: colors.primary }]} />
              </View>
            </Card>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Card style={styles.summaryCard} padding="lg">
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Total Employees</Text><Text style={styles.summaryValue}>{employees.length}</Text></View>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Active Employees</Text><Text style={[styles.summaryValue, { color: colors.success }]}>{activeEmployees}</Text></View>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Onboarding</Text><Text style={[styles.summaryValue, { color: colors.warning }]}>{employees.filter(e => e.status === 'onboarding').length}</Text></View>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Departments</Text><Text style={styles.summaryValue}>{departments.length}</Text></View>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Attendance Rate</Text><Text style={styles.summaryValue}>{attendanceRate}%</Text></View>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Leave Requests</Text><Text style={styles.summaryValue}>{leaveRequests.length}</Text></View>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Expense Claims</Text><Text style={styles.summaryValue}>{expenses.length}</Text></View>
          </Card>
        </View>

        <TouchableOpacity style={[styles.exportBtn, shadows.md]} onPress={handleExport} activeOpacity={0.7}>
          <Ionicons name="download" size={20} color={colors.textInverse} />
          <Text style={styles.exportBtnText}>Export as PDF</Text>
        </TouchableOpacity>
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
  deptCard: { marginBottom: spacing.sm },
  deptHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  deptName: { ...typography.body, color: colors.text, fontWeight: '600' },
  deptCount: { ...typography.bodySmall, color: colors.textSecondary },
  deptBar: { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  deptFill: { height: '100%', borderRadius: 3 },
  summaryCard: { marginBottom: spacing.sm },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  summaryLabel: { ...typography.bodySmall, color: colors.textSecondary },
  summaryValue: { ...typography.bodySmall, color: colors.text, fontWeight: '600' },
  exportBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.primary, borderRadius: borderRadius.lg, padding: spacing.md },
  exportBtnText: { ...typography.button, color: colors.textInverse },
});
