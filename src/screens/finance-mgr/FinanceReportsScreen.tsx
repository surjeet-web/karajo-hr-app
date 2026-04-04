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
import { getState, subscribe, getPayrollTrendData, getBudgetUtilization } from '../../store';
import { formatCurrency } from '../../utils/calculations';

export const FinanceReportsScreen: React.FC<any> = ({ navigation }) => {
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

  const payrollTrends = getPayrollTrendData(6);
  const budgetData = getBudgetUtilization();
  const totalBudget = state.budgets?.totalBudget || 0;
  const totalSpent = state.budgets?.totalSpent || 0;
  const totalExpenses = state.expenses.requests.reduce((sum, e) => sum + e.amount, 0);
  const pendingExpenses = state.expenses.requests.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);

  const reports = [
    {
      id: 'payroll',
      title: 'Payroll Summary',
      desc: `Monthly payroll for ${state.employees.filter(e => e.status === 'active').length} employees`,
      icon: 'card',
      color: colors.primary,
      data: {
        totalPayroll: payrollTrends.reduce((sum, t) => sum + (t.totalPayroll || 0), 0),
        months: payrollTrends.length,
        avgMonthly: payrollTrends.length > 0 ? payrollTrends.reduce((sum, t) => sum + (t.totalPayroll || 0), 0) / payrollTrends.length : 0,
      },
    },
    {
      id: 'expenses',
      title: 'Expense Analysis',
      desc: `${state.expenses.requests.length} expense claims processed`,
      icon: 'receipt',
      color: colors.success,
      data: {
        total: totalExpenses,
        pending: pendingExpenses,
        count: state.expenses.requests.length,
        avgExpense: state.expenses.requests.length > 0 ? totalExpenses / state.expenses.requests.length : 0,
      },
    },
    {
      id: 'budget',
      title: 'Budget Utilization',
      desc: `${budgetData.length} departments tracked`,
      icon: 'wallet',
      color: colors.warning,
      data: {
        totalBudget,
        totalSpent,
        remaining: totalBudget - totalSpent,
        utilization: totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0,
      },
    },
    {
      id: 'tax',
      title: 'Tax Report',
      desc: 'Tax filings and compliance summary',
      icon: 'document-text',
      color: colors.accentPurple,
      data: {
        totalTax: payrollTrends.reduce((sum, t) => sum + (t.totalPayroll || 0) * 0.1, 0),
        filings: 4,
        nextDeadline: 'Apr 15, 2026',
      },
    },
    {
      id: 'department',
      title: 'Department Breakdown',
      desc: 'Cost analysis by department',
      icon: 'business',
      color: colors.info,
      data: {
        departments: budgetData.length,
        highestSpend: budgetData.length > 0 ? budgetData.reduce((max, d) => d.spent > max.spent ? d : max, budgetData[0]) : null,
        lowestSpend: budgetData.length > 0 ? budgetData.reduce((min, d) => d.spent < min.spent ? d : min, budgetData[0]) : null,
      },
    },
  ];

  const handleExportReport = (report) => {
    hapticFeedback('medium');
    Alert.alert(
      'Export Report',
      `Export ${report.title} as PDF?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: () => {
            hapticFeedback('success');
            Alert.alert('Success', `${report.title} has been exported successfully.`);
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Finance Reports" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>

        <View style={styles.statsRow}>
          <StatCard icon="wallet" label="Total Budget" value={formatCurrency(totalBudget)} color={colors.primary} delay={0} />
          <StatCard icon="trending-up" label="Total Spent" value={formatCurrency(totalSpent)} color={colors.warning} delay={100} />
          <StatCard icon="receipt" label="Expenses" value={formatCurrency(totalExpenses)} color={colors.success} delay={200} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Reports</Text>
          {reports.map((report, i) => (
            <TouchableOpacity key={report.id} style={[styles.reportCard, shadows.sm]} onPress={() => handleExportReport(report)} activeOpacity={0.7}>
              <View style={[styles.reportIcon, { backgroundColor: report.color + '15' }]}>
                <Ionicons name={report.icon} size={24} color={report.color} />
              </View>
              <View style={styles.reportInfo}>
                <Text style={styles.reportTitle}>{report.title}</Text>
                <Text style={styles.reportDesc}>{report.desc}</Text>
                {report.id === 'payroll' && (
                  <Text style={styles.reportData}>
                    {report.data.months} months - Avg: {formatCurrency(report.data.avgMonthly)}/mo
                  </Text>
                )}
                {report.id === 'expenses' && (
                  <Text style={styles.reportData}>
                    {report.data.count} claims - Avg: {formatCurrency(report.data.avgExpense)}
                  </Text>
                )}
                {report.id === 'budget' && (
                  <Text style={styles.reportData}>
                    {report.data.utilization}% utilized - {formatCurrency(report.data.remaining)} remaining
                  </Text>
                )}
              </View>
              <Ionicons name="download-outline" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payroll Trends (6 months)</Text>
          <Card style={styles.trendCard} padding="lg">
            {payrollTrends.map((trend, i) => (
              <View key={i} style={styles.trendRow}>
                <Text style={styles.trendMonth}>{trend.month}</Text>
                <View style={styles.trendBar}>
                  <View style={[styles.trendFill, { width: trend.status !== 'not-run' ? '60%' : '0%', backgroundColor: trend.status === 'approved' ? colors.success : trend.status === 'draft' ? colors.warning : colors.border }]} />
                </View>
                <Text style={styles.trendValue}>
                  {trend.totalPayroll > 0 ? formatCurrency(trend.totalPayroll) : '-'}
                </Text>
                <Badge text={trend.status} variant={trend.status === 'approved' ? 'success' : trend.status === 'draft' ? 'warning' : 'default'} size="small" />
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

import { Badge } from '../../components';

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
  reportData: { ...typography.caption, color: colors.primary, fontWeight: '600', marginTop: 2 },
  trendCard: { marginBottom: spacing.sm },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  trendMonth: { width: 35, ...typography.caption, color: colors.textSecondary },
  trendBar: { flex: 1, height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  trendFill: { height: '100%', borderRadius: 3 },
  trendValue: { width: 80, ...typography.caption, color: colors.text, fontWeight: '600', textAlign: 'right' },
});
