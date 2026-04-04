import React, { useState, useEffect } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card, Badge } from '../../components';
import { StatCard, ApprovalCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';
import { getState, subscribe, createPayrollRun, getPayrollData, getBudgetUtilization } from '../../store';
import { formatCurrency } from '../../utils/calculations';

export const FinanceDashboardScreen: React.FC<any> = ({ navigation }) => {
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

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const payrollData = getPayrollData(currentMonth, currentYear);
  const budgetData = getBudgetUtilization();
  const totalBudget = state.budgets?.totalBudget || 0;
  const totalSpent = state.budgets?.totalSpent || 0;
  const pendingExpenses = state.expenses.requests.filter(e => e.status === 'pending').length;
  const approvedExpenses = state.expenses.requests.filter(e => e.status === 'approved').length;

  const nextPayrollDate = new Date(currentYear, currentMonth, 1);
  const daysUntilPayroll = Math.ceil((nextPayrollDate - now) / (1000 * 60 * 60 * 24));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Finance Dashboard" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        
        <View style={styles.statsRow}>
          <StatCard icon="wallet" label="Monthly Payroll" value={payrollData.totalPayroll ? formatCurrency(payrollData.totalPayroll) : formatCurrency(485200)} trend="up" trendValue="+5%" color={colors.primary} delay={0} />
          <StatCard icon="hourglass" label="Pending Expenses" value={pendingExpenses.toString()} color={colors.warning} delay={100} />
          <StatCard icon="checkmark-circle" label="Approved" value={approvedExpenses.toString()} color={colors.success} delay={200} />
          <StatCard icon="calendar" label="Next Payroll" value={`${daysUntilPayroll}d`} color={colors.accentPurple} delay={300} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget Overview</Text>
          <Card style={styles.budgetCard} padding="lg">
            <View style={styles.budgetHeader}>
              <Text style={styles.budgetLabel}>Total Budget</Text>
              <Text style={styles.budgetValue}>{formatCurrency(totalBudget)}</Text>
            </View>
            <View style={styles.budgetBar}>
              <View style={[styles.budgetFill, { width: `${totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0}%`, backgroundColor: totalSpent > totalBudget ? colors.error : colors.success }]} />
            </View>
            <View style={styles.budgetFooter}>
              <Text style={styles.budgetSpent}>Spent: {formatCurrency(totalSpent)}</Text>
              <Text style={[styles.budgetRemaining, { color: totalSpent > totalBudget ? colors.error : colors.success }]}>
                Remaining: {formatCurrency(totalBudget - totalSpent)}
              </Text>
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            {[
              { icon: 'card', label: 'Run Payroll', color: colors.primary, screen: 'PayrollManagement', action: () => { hapticFeedback('medium'); navigation.navigate('PayrollManagement'); } },
              { icon: 'receipt', label: 'Expenses', color: colors.success, screen: 'FinanceExpenseManagement', action: () => { hapticFeedback('medium'); navigation.navigate('FinanceExpenseManagement'); } },
              { icon: 'wallet', label: 'Budgets', color: colors.warning, screen: 'FinanceBudget', action: () => { hapticFeedback('medium'); navigation.navigate('FinanceBudget'); } },
              { icon: 'bar-chart', label: 'Reports', color: colors.accentPurple, screen: 'FinanceReports', action: () => { hapticFeedback('medium'); navigation.navigate('FinanceReports'); } },
            ].map(action => (
              <TouchableOpacity key={action.label} style={[styles.quickAction, { backgroundColor: `${action.color}10` }]}
                onPress={action.action} activeOpacity={0.7}>
                <Ionicons name={action.icon} size={24} color={action.color} />
                <Text style={[styles.quickActionLabel, { color: action.color }]}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pending Expenses</Text>
            <TouchableOpacity onPress={() => navigation.navigate('FinanceExpenseManagement')}><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
          </View>
          {state.expenses.requests.filter(e => e.status === 'pending').slice(0, 3).map((exp, i) => (
            <ApprovalCard key={exp.id} request={{ type: 'expense', requesterName: exp.title, date: exp.date, amount: exp.amount, status: exp.status }}
              onPress={() => navigation.navigate('FinanceExpenseManagement')} delay={400 + i * 80} />
          ))}
          {state.expenses.requests.filter(e => e.status === 'pending').length === 0 && (
            <Card style={styles.emptyCard} padding="lg">
              <Ionicons name="checkmark-circle" size={32} color={colors.success} />
              <Text style={styles.emptyText}>All caught up! No pending expenses.</Text>
            </Card>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Department Budgets</Text>
          {budgetData.slice(0, 4).map((dept, i) => (
            <TouchableOpacity key={dept.id} style={[styles.deptRow, shadows.sm]} onPress={() => navigation.navigate('FinanceBudget')} activeOpacity={0.7}>
              <View style={styles.deptInfo}>
                <Text style={styles.deptName}>{dept.name}</Text>
                <Text style={styles.deptSpent}>{formatCurrency(dept.spent)} of {formatCurrency(dept.budget)}</Text>
              </View>
              <View style={styles.deptBar}>
                <View style={[styles.deptFill, { width: `${dept.utilization}%`, backgroundColor: dept.utilization > 90 ? colors.error : dept.utilization > 75 ? colors.warning : colors.success }]} />
              </View>
              <Text style={[styles.deptPct, { color: dept.utilization > 90 ? colors.error : colors.text }]}>{dept.utilization}%</Text>
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
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.xl },
  section: { marginBottom: spacing.xl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  viewAll: { ...typography.bodySmall, color: colors.primary, fontWeight: '600' },
  quickActions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  quickAction: { width: '47%', borderRadius: borderRadius.lg, padding: spacing.lg, alignItems: 'center', gap: spacing.sm, ...shadows.sm },
  quickActionLabel: { ...typography.label, fontWeight: '600' },
  budgetCard: { marginBottom: spacing.sm },
  budgetHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  budgetLabel: { ...typography.bodySmall, color: colors.textSecondary },
  budgetValue: { ...typography.h4, color: colors.text, fontWeight: '700' },
  budgetBar: { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden', marginBottom: spacing.sm },
  budgetFill: { height: '100%', borderRadius: 4 },
  budgetFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  budgetSpent: { ...typography.bodySmall, color: colors.textSecondary },
  budgetRemaining: { ...typography.bodySmall, fontWeight: '600' },
  emptyCard: { alignItems: 'center', gap: spacing.sm },
  emptyText: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  deptRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.md },
  deptInfo: { width: 120 },
  deptName: { ...typography.bodySmall, color: colors.text, fontWeight: '600' },
  deptSpent: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
  deptBar: { flex: 1, height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  deptFill: { height: '100%', borderRadius: 3 },
  deptPct: { ...typography.bodySmall, fontWeight: '600', width: 40, textAlign: 'right' },
});
