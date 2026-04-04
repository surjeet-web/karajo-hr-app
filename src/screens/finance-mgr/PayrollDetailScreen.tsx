import React, { useState, useEffect } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card, Badge, Avatar } from '../../components';
import { StatCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';
import { getState, subscribe, getPayrollData } from '../../store';
import { formatCurrency } from '../../utils/calculations';

export const PayrollDetailScreen: React.FC<any> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [state, setStateLocal] = useState(getState());
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  useEffect(() => {
    const unsub = subscribe(setStateLocal);
    return unsub;
  }, []);

  const onRefresh = (): void => {
    setRefreshing(true);
    setStateLocal(getState());
    setRefreshing(false);
  };

  const now = new Date();
  const month = route.params?.month || now.getMonth() + 1;
  const year = route.params?.year || now.getFullYear();
  const payrollData = getPayrollData(month, year);

  const employees = payrollData.employees || state.employees.filter(e => e.status === 'active').map(emp => ({
    employeeId: emp.id,
    employeeName: emp.name,
    department: emp.department,
    basic: emp.salary?.basic || 5000,
    hra: emp.salary?.hra || 2000,
    allowances: emp.salary?.allowances || 1500,
    overtimePay: Math.round(Math.random() * 1000),
    grossIncome: (emp.salary?.basic || 5000) + (emp.salary?.hra || 2000) + (emp.salary?.allowances || 1500),
    tax: Math.round(((emp.salary?.basic || 5000) * 0.1) * 100) / 100,
    totalDeductions: Math.round(((emp.salary?.basic || 5000) * 0.15) * 100) / 100,
    netPay: Math.round(((emp.salary?.basic || 5000) + (emp.salary?.hra || 2000) + (emp.salary?.allowances || 1500) - ((emp.salary?.basic || 5000) * 0.15)) * 100) / 100,
  }));

  const totalGross = employees.reduce((sum, e) => sum + e.grossIncome, 0);
  const totalDeductions = employees.reduce((sum, e) => sum + e.totalDeductions, 0);
  const totalNet = employees.reduce((sum, e) => sum + e.netPay, 0);

  const handleViewPayslip = (emp) => {
    hapticFeedback('medium');
    setSelectedEmployee(selectedEmployee?.employeeId === emp.employeeId ? null : emp);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title={`Payroll - ${new Date(0, month - 1).toLocaleString('default', { month: 'long' })} ${year}`} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>

        <View style={styles.statsRow}>
          <StatCard icon="wallet" label="Gross Payroll" value={formatCurrency(totalGross)} color={colors.primary} delay={0} />
          <StatCard icon="trending-down" label="Deductions" value={formatCurrency(totalDeductions)} color={colors.error} delay={100} />
          <StatCard icon="cash" label="Net Payroll" value={formatCurrency(totalNet)} color={colors.success} delay={200} />
        </View>

        <Card style={styles.summaryCard} padding="lg">
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Payroll Summary</Text>
            <Badge text={payrollData.status || 'draft'} variant={payrollData.status === 'approved' ? 'success' : 'warning'} size="medium" />
          </View>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Employees</Text>
              <Text style={styles.summaryValue}>{employees.length}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Avg Net Pay</Text>
              <Text style={styles.summaryValue}>{employees.length > 0 ? formatCurrency(totalNet / employees.length) : '-'}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Tax</Text>
              <Text style={[styles.summaryValue, { color: colors.error }]}>{formatCurrency(employees.reduce((sum, e) => sum + e.tax, 0))}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Overtime Pay</Text>
              <Text style={[styles.summaryValue, { color: colors.warning }]}>{formatCurrency(employees.reduce((sum, e) => sum + e.overtimePay, 0))}</Text>
            </View>
          </View>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Employee Breakdown</Text>
          {employees.map((emp, i) => (
            <TouchableOpacity key={emp.employeeId} style={[styles.empCard, shadows.sm]} onPress={() => handleViewPayslip(emp)} activeOpacity={0.7}>
              <View style={styles.empHeader}>
                <Avatar name={emp.employeeName} size="small" />
                <View style={styles.empInfo}>
                  <Text style={styles.empName}>{emp.employeeName}</Text>
                  <Text style={styles.empDept}>{emp.department}</Text>
                </View>
                <View style={styles.empAmount}>
                  <Text style={styles.empNetPay}>{formatCurrency(emp.netPay)}</Text>
                  <Text style={styles.empGrossPay}>Gross: {formatCurrency(emp.grossIncome)}</Text>
                </View>
              </View>

              {selectedEmployee?.employeeId === emp.employeeId && (
                <View style={styles.payslipDetail}>
                  <View style={styles.payslipRow}>
                    <Text style={styles.payslipLabel}>Basic Salary</Text>
                    <Text style={styles.payslipValue}>{formatCurrency(emp.basic)}</Text>
                  </View>
                  <View style={styles.payslipRow}>
                    <Text style={styles.payslipLabel}>HRA</Text>
                    <Text style={styles.payslipValue}>{formatCurrency(emp.hra)}</Text>
                  </View>
                  <View style={styles.payslipRow}>
                    <Text style={styles.payslipLabel}>Allowances</Text>
                    <Text style={styles.payslipValue}>{formatCurrency(emp.allowances)}</Text>
                  </View>
                  <View style={styles.payslipRow}>
                    <Text style={styles.payslipLabel}>Overtime Pay</Text>
                    <Text style={[styles.payslipValue, { color: colors.warning }]}>{formatCurrency(emp.overtimePay)}</Text>
                  </View>
                  <View style={[styles.payslipRow, styles.payslipTotal]}>
                    <Text style={styles.payslipTotalLabel}>Gross Income</Text>
                    <Text style={styles.payslipTotalValue}>{formatCurrency(emp.grossIncome)}</Text>
                  </View>
                  <View style={styles.payslipDivider} />
                  <View style={styles.payslipRow}>
                    <Text style={styles.payslipLabel}>Tax</Text>
                    <Text style={[styles.payslipValue, { color: colors.error }]}>-{formatCurrency(emp.tax)}</Text>
                  </View>
                  <View style={styles.payslipRow}>
                    <Text style={styles.payslipLabel}>Insurance</Text>
                    <Text style={[styles.payslipValue, { color: colors.error }]}>-{formatCurrency(emp.grossIncome * 0.05)}</Text>
                  </View>
                  <View style={styles.payslipRow}>
                    <Text style={styles.payslipLabel}>Retirement (6%)</Text>
                    <Text style={[styles.payslipValue, { color: colors.error }]}>-{formatCurrency(emp.grossIncome * 0.06)}</Text>
                  </View>
                  <View style={[styles.payslipRow, styles.payslipNet]}>
                    <Text style={styles.payslipNetLabel}>Net Pay</Text>
                    <Text style={styles.payslipNetValue}>{formatCurrency(emp.netPay)}</Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
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
  summaryCard: { marginBottom: spacing.lg },
  summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  summaryTitle: { ...typography.h5, color: colors.text },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  summaryItem: { width: '47%', backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.md, padding: spacing.md, alignItems: 'center' },
  summaryLabel: { ...typography.caption, color: colors.textTertiary },
  summaryValue: { ...typography.h5, color: colors.text, fontWeight: '700', marginTop: spacing.xs },
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  empCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm },
  empHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  empInfo: { flex: 1 },
  empName: { ...typography.body, color: colors.text, fontWeight: '600' },
  empDept: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  empAmount: { alignItems: 'flex-end' },
  empNetPay: { ...typography.body, color: colors.success, fontWeight: '700' },
  empGrossPay: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
  payslipDetail: { marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  payslipRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  payslipLabel: { ...typography.bodySmall, color: colors.textSecondary },
  payslipValue: { ...typography.bodySmall, color: colors.text, fontWeight: '500' },
  payslipTotal: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm, marginTop: spacing.xs },
  payslipTotalLabel: { ...typography.bodySmall, color: colors.text, fontWeight: '600' },
  payslipTotalValue: { ...typography.bodySmall, color: colors.text, fontWeight: '700' },
  payslipDivider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
  payslipNet: { marginTop: spacing.sm },
  payslipNetLabel: { ...typography.body, color: colors.text, fontWeight: '700' },
  payslipNetValue: { ...typography.h5, color: colors.success, fontWeight: '700' },
});
