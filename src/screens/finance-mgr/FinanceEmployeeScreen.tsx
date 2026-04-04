import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card, Badge, Avatar } from '../../components';
import { StatCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';
import { getState, subscribe } from '../../store';
import { formatCurrency, calculateBudgetUtilization } from '../../utils/calculations';
import { getEmployeePayslip, getDepartmentPayroll } from '../../services/payrollEngine';

export const FinanceEmployeeScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [state, setStateLocal] = useState(getState());
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');

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
  const departments = [...new Set(employees.map(e => e.department))];
  const expenses = state.expenses.requests || [];
  const payrollRuns = state.payroll?.payrollRuns || [];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'all' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const getEmployeeFinancialData = (emp) => {
    const empExpenses = expenses.filter(e => e.title?.toLowerCase().includes(emp.name.toLowerCase()));
    const totalExpenses = empExpenses.reduce((sum, e) => sum + e.amount, 0);
    const pendingExpenses = empExpenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);
    const approvedExpenses = empExpenses.filter(e => e.status === 'approved').reduce((sum, e) => sum + e.amount, 0);

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const payslip = getEmployeePayslip(emp.id, currentMonth, currentYear);

    const salary = emp.salary || { basic: 5000, hra: 2000, allowances: 1500, deductions: 800, tax: 450 };
    const grossSalary = salary.basic + salary.hra + salary.allowances;
    const netSalary = grossSalary - salary.deductions - salary.tax;
    const annualSalary = netSalary * 12;

    const deptPayroll = getDepartmentPayroll(emp.department, currentMonth, currentYear);
    const deptBudget = state.budgets?.departments?.find(d => d.name === emp.department);
    const budgetUtil = deptBudget ? calculateBudgetUtilization(deptBudget.spent, deptBudget.budget) : { utilization: 0 };

    return {
      employee: emp,
      salary: {
        basic: salary.basic,
        hra: salary.hra,
        allowances: salary.allowances,
        deductions: salary.deductions,
        tax: salary.tax,
        gross: grossSalary,
        net: netSalary,
        annual: annualSalary,
      },
      expenses: {
        total: totalExpenses,
        pending: pendingExpenses,
        approved: approvedExpenses,
        count: empExpenses.length,
      },
      payroll: payslip,
      department: {
        name: emp.department,
        budgetUtilization: budgetUtil.utilization,
        totalPayroll: deptPayroll?.totalPayroll || 0,
      },
    };
  };

  const totalPayroll = employees.reduce((sum, emp) => {
    const data = getEmployeeFinancialData(emp);
    return sum + data.salary.net;
  }, 0);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const avgSalary = employees.length > 0 ? totalPayroll / employees.length : 0;
  const highestPaid = employees.reduce((max, emp) => {
    const data = getEmployeeFinancialData(emp);
    return data.salary.annual > (max?.salary?.annual || 0) ? { emp, data } : max;
  }, null);

  const handleViewEmployeeDetail = (emp) => {
    hapticFeedback('medium');
    setSelectedEmployee(selectedEmployee?.id === emp.id ? null : emp);
  };

  const handleAdjustSalary = (emp) => {
    hapticFeedback('medium');
    Alert.prompt(
      'Adjust Salary',
      `Enter new monthly salary for ${emp.name} (current: ${formatCurrency(getEmployeeFinancialData(emp).salary.net)}):`,
      (newSalary) => {
        if (newSalary && !isNaN(Number(newSalary)) && Number(newSalary) > 0) {
          Alert.alert('Success', `Salary for ${emp.name} updated to ${formatCurrency(parseFloat(newSalary))}/month`);
          hapticFeedback('success');
        }
      },
      'numeric',
      getEmployeeFinancialData(emp).salary.net.toString()
    );
  };

  const handleViewPayslip = (emp) => {
    hapticFeedback('medium');
    const now = new Date();
    const payslip = getEmployeePayslip(emp.id, now.getMonth() + 1, now.getFullYear());
    if (payslip) {
      Alert.alert(
        `Payslip - ${emp.name}`,
        `Gross: ${formatCurrency(payslip.grossIncome)}\nDeductions: ${formatCurrency(payslip.totalDeductions)}\nTax: ${formatCurrency(payslip.tax)}\nNet Pay: ${formatCurrency(payslip.netPay)}`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert('No Payslip', `No payslip found for ${emp.name} for the current month.`);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Employee Financial Tracking" />

      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={colors.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search employees..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textTertiary}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        ) : null}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>

        <View style={styles.statsRow}>
          <StatCard icon="people" label="Employees" value={employees.length.toString()} color={colors.primary} delay={0} />
          <StatCard icon="wallet" label="Monthly Payroll" value={formatCurrency(totalPayroll)} color={colors.success} delay={100} />
          <StatCard icon="trending-up" label="Avg Salary" value={formatCurrency(avgSalary)} color={colors.accentPurple} delay={200} />
          <StatCard icon="receipt" label="Total Expenses" value={formatCurrency(totalExpenses)} color={colors.warning} delay={300} />
        </View>

        {highestPaid && (
          <Card style={styles.highlightCard} padding="md">
            <View style={styles.highlightHeader}>
              <Ionicons name="star" size={20} color={colors.warning} />
              <Text style={styles.highlightTitle}>Highest Paid Employee</Text>
            </View>
            <View style={styles.highlightContent}>
              <Text style={styles.highlightName}>{highestPaid.emp.name}</Text>
              <Text style={styles.highlightRole}>{highestPaid.emp.role}</Text>
              <Text style={styles.highlightSalary}>Annual: {formatCurrency(highestPaid.data.salary.annual)}</Text>
            </View>
          </Card>
        )}

        <View style={styles.departmentFilter}>
          <TouchableOpacity
            style={[styles.deptChip, selectedDept === 'all' && styles.deptChipActive]}
            onPress={() => { hapticFeedback('light'); setSelectedDept('all'); }}
          >
            <Text style={[styles.deptChipText, selectedDept === 'all' && styles.deptChipTextActive]}>All</Text>
          </TouchableOpacity>
          {departments.map(dept => (
            <TouchableOpacity
              key={dept}
              style={[styles.deptChip, selectedDept === dept && styles.deptChipActive]}
              onPress={() => { hapticFeedback('light'); setSelectedDept(dept); }}
            >
              <Text style={[styles.deptChipText, selectedDept === dept && styles.deptChipTextActive]}>
                {dept}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Employees ({filteredEmployees.length})</Text>
          {filteredEmployees.map((emp, i) => {
            const finData = getEmployeeFinancialData(emp);
            const isSelected = selectedEmployee?.id === emp.id;

            return (
              <Card key={emp.id} style={[styles.empCard, isSelected && styles.empCardSelected]} padding="md">
                <TouchableOpacity style={styles.empHeader} onPress={() => handleViewEmployeeDetail(emp)} activeOpacity={0.7}>
                  <Avatar source={{ uri: emp.avatar }} name={emp.name} size="medium" />
                  <View style={styles.empInfo}>
                    <Text style={styles.empName}>{emp.name}</Text>
                    <Text style={styles.empRole}>{emp.role}</Text>
                    <Text style={styles.empDept}>{emp.department} • {emp.location}</Text>
                  </View>
                  <View style={styles.empFinancial}>
                    <Text style={styles.empNetPay}>{formatCurrency(finData.salary.net)}</Text>
                    <Text style={styles.empGrossPay}>Gross: {formatCurrency(finData.salary.gross)}</Text>
                    <Ionicons name={isSelected ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textTertiary} />
                  </View>
                </TouchableOpacity>

                {isSelected && (
                  <View style={styles.empDetail}>
                    <View style={styles.detailTabs}>
                      {['overview', 'payroll', 'expenses', 'tax'].map(tab => (
                        <TouchableOpacity
                          key={tab}
                          style={[styles.detailTab, activeTab === tab && styles.detailTabActive]}
                          onPress={() => { hapticFeedback('light'); setActiveTab(tab); }}
                        >
                          <Text style={[styles.detailTabText, activeTab === tab && styles.detailTabTextActive]}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {activeTab === 'overview' && (
                      <View style={styles.detailContent}>
                        <View style={styles.detailGrid}>
                          <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Basic Salary</Text>
                            <Text style={styles.detailValue}>{formatCurrency(finData.salary.basic)}</Text>
                          </View>
                          <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>HRA</Text>
                            <Text style={styles.detailValue}>{formatCurrency(finData.salary.hra)}</Text>
                          </View>
                          <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Allowances</Text>
                            <Text style={styles.detailValue}>{formatCurrency(finData.salary.allowances)}</Text>
                          </View>
                          <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Annual Salary</Text>
                            <Text style={[styles.detailValue, { color: colors.success }]}>{formatCurrency(finData.salary.annual)}</Text>
                          </View>
                        </View>
                        <View style={styles.actionButtons}>
                          <TouchableOpacity style={styles.actionBtn} onPress={() => handleViewPayslip(emp)}>
                            <Ionicons name="document-text" size={18} color={colors.primary} />
                            <Text style={styles.actionBtnText}>View Payslip</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.actionBtn} onPress={() => handleAdjustSalary(emp)}>
                            <Ionicons name="cash" size={18} color={colors.success} />
                            <Text style={styles.actionBtnText}>Adjust Salary</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}

                    {activeTab === 'payroll' && (
                      <View style={styles.detailContent}>
                        <Text style={styles.subsectionTitle}>Payroll Summary</Text>
                        <View style={styles.payrollRow}>
                          <Text style={styles.payrollLabel}>Gross Income</Text>
                          <Text style={styles.payrollValue}>{formatCurrency(finData.salary.gross)}</Text>
                        </View>
                        <View style={styles.payrollRow}>
                          <Text style={styles.payrollLabel}>Tax</Text>
                          <Text style={[styles.payrollValue, { color: colors.error }]}>-{formatCurrency(finData.salary.tax)}</Text>
                        </View>
                        <View style={styles.payrollRow}>
                          <Text style={styles.payrollLabel}>Deductions</Text>
                          <Text style={[styles.payrollValue, { color: colors.error }]}>-{formatCurrency(finData.salary.deductions)}</Text>
                        </View>
                        <View style={[styles.payrollRow, styles.payrollTotal]}>
                          <Text style={styles.payrollTotalLabel}>Net Pay</Text>
                          <Text style={styles.payrollTotalValue}>{formatCurrency(finData.salary.net)}</Text>
                        </View>
                        <View style={styles.payrollRow}>
                          <Text style={styles.payrollLabel}>Department Budget Used</Text>
                          <Text style={styles.payrollValue}>{finData.department.budgetUtilization}%</Text>
                        </View>
                      </View>
                    )}

                    {activeTab === 'expenses' && (
                      <View style={styles.detailContent}>
                        <Text style={styles.subsectionTitle}>Expense Summary</Text>
                        <View style={styles.expenseSummaryGrid}>
                          <View style={styles.expenseSummaryItem}>
                            <Text style={styles.expenseSummaryLabel}>Total</Text>
                            <Text style={styles.expenseSummaryValue}>{formatCurrency(finData.expenses.total)}</Text>
                          </View>
                          <View style={styles.expenseSummaryItem}>
                            <Text style={styles.expenseSummaryLabel}>Pending</Text>
                            <Text style={[styles.expenseSummaryValue, { color: colors.warning }]}>{formatCurrency(finData.expenses.pending)}</Text>
                          </View>
                          <View style={styles.expenseSummaryItem}>
                            <Text style={styles.expenseSummaryLabel}>Approved</Text>
                            <Text style={[styles.expenseSummaryValue, { color: colors.success }]}>{formatCurrency(finData.expenses.approved)}</Text>
                          </View>
                          <View style={styles.expenseSummaryItem}>
                            <Text style={styles.expenseSummaryLabel}>Claims</Text>
                            <Text style={styles.expenseSummaryValue}>{finData.expenses.count}</Text>
                          </View>
                        </View>
                      </View>
                    )}

                    {activeTab === 'tax' && (
                      <View style={styles.detailContent}>
                        <Text style={styles.subsectionTitle}>Tax Summary</Text>
                        <View style={styles.taxRow}>
                          <Text style={styles.taxLabel}>Monthly Tax</Text>
                          <Text style={styles.taxValue}>{formatCurrency(finData.salary.tax)}</Text>
                        </View>
                        <View style={styles.taxRow}>
                          <Text style={styles.taxLabel}>Annual Tax</Text>
                          <Text style={styles.taxValue}>{formatCurrency(finData.salary.tax * 12)}</Text>
                        </View>
                        <View style={styles.taxRow}>
                          <Text style={styles.taxLabel}>Effective Tax Rate</Text>
                          <Text style={styles.taxValue}>{finData.salary.gross > 0 ? Math.round((finData.salary.tax / finData.salary.gross) * 100) : 0}%</Text>
                        </View>
                        <TouchableOpacity style={styles.w2Btn} onPress={() => Alert.alert('W-2 Form', `W-2 form for ${emp.name} will be generated for the current tax year.`)}>
                          <Ionicons name="download" size={18} color={colors.textInverse} />
                          <Text style={styles.w2BtnText}>Download W-2 Form</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
              </Card>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, height: 48, marginHorizontal: spacing.lg, marginTop: spacing.md, borderWidth: 1, borderColor: colors.border, gap: spacing.sm },
  searchInput: { flex: 1, ...typography.body, color: colors.text },
  scrollContent: { padding: spacing.lg },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.lg },
  highlightCard: { marginBottom: spacing.lg, backgroundColor: colors.warningLight, borderWidth: 1, borderColor: colors.warning },
  highlightHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.sm },
  highlightTitle: { ...typography.label, color: colors.warning },
  highlightContent: { marginLeft: spacing.md },
  highlightName: { ...typography.body, color: colors.text, fontWeight: '600' },
  highlightRole: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  highlightSalary: { ...typography.bodySmall, color: colors.warning, fontWeight: '600', marginTop: spacing.xs },
  departmentFilter: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  deptChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: colors.surfaceVariant },
  deptChipActive: { backgroundColor: colors.primary },
  deptChipText: { ...typography.label, color: colors.textSecondary },
  deptChipTextActive: { color: colors.textInverse },
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  empCard: { marginBottom: spacing.sm },
  empCardSelected: { borderWidth: 2, borderColor: colors.primary },
  empHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  empInfo: { flex: 1 },
  empName: { ...typography.body, color: colors.text, fontWeight: '600' },
  empRole: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  empDept: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
  empFinancial: { alignItems: 'flex-end' },
  empNetPay: { ...typography.body, color: colors.success, fontWeight: '700' },
  empGrossPay: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
  empDetail: { marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  detailTabs: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  detailTab: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: colors.surfaceVariant },
  detailTabActive: { backgroundColor: colors.primary },
  detailTabText: { ...typography.label, color: colors.textSecondary },
  detailTabTextActive: { color: colors.textInverse },
  detailContent: { marginTop: spacing.sm },
  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.md },
  detailItem: { width: '47%', backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.md, padding: spacing.md },
  detailLabel: { ...typography.caption, color: colors.textTertiary },
  detailValue: { ...typography.body, color: colors.text, fontWeight: '600', marginTop: spacing.xs },
  actionButtons: { flexDirection: 'row', gap: spacing.md },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.lg, padding: spacing.md },
  actionBtnText: { ...typography.bodySmall, color: colors.primary, fontWeight: '600' },
  subsectionTitle: { ...typography.body, color: colors.text, fontWeight: '600', marginBottom: spacing.md },
  payrollRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  payrollLabel: { ...typography.bodySmall, color: colors.textSecondary },
  payrollValue: { ...typography.bodySmall, color: colors.text, fontWeight: '600' },
  payrollTotal: { borderBottomWidth: 0, marginTop: spacing.sm },
  payrollTotalLabel: { ...typography.body, color: colors.text, fontWeight: '700' },
  payrollTotalValue: { ...typography.h5, color: colors.success, fontWeight: '700' },
  expenseSummaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  expenseSummaryItem: { width: '47%', backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.md, padding: spacing.md, alignItems: 'center' },
  expenseSummaryLabel: { ...typography.caption, color: colors.textTertiary },
  expenseSummaryValue: { ...typography.body, color: colors.text, fontWeight: '700', marginTop: spacing.xs },
  taxRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  taxLabel: { ...typography.bodySmall, color: colors.textSecondary },
  taxValue: { ...typography.bodySmall, color: colors.text, fontWeight: '600' },
  w2Btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, backgroundColor: colors.primary, borderRadius: borderRadius.lg, padding: spacing.md, marginTop: spacing.lg },
  w2BtnText: { ...typography.bodySmall, color: colors.textInverse, fontWeight: '600' },
});
