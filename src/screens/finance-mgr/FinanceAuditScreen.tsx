import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card, Badge } from '../../components';
import { StatCard } from '../../components/management';
import { getState, subscribe } from '../../store';
import { formatCurrency } from '../../utils/calculations';

export const FinanceAuditScreen: React.FC<any> = ({ navigation }) => {
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

  const generateAuditTrail = () => {
    const audits = [];

    state.payroll?.payrollRuns?.forEach(run => {
      audits.push({
        id: `payroll-${run.id}`,
        action: run.status === 'approved' ? 'Payroll Approved' : 'Payroll Draft Created',
        by: run.approvedBy || run.processedBy || 'System',
        date: run.approvedAt || run.createdAt,
        amount: formatCurrency(run.totalPayroll),
        type: run.status === 'approved' ? 'success' : 'info',
        category: 'payroll',
      });
    });

    state.expenses.requests.forEach(exp => {
      audits.push({
        id: `expense-${exp.id}`,
        action: exp.status === 'approved' ? 'Expense Approved' : exp.status === 'rejected' ? 'Expense Rejected' : 'Expense Submitted',
        by: exp.approvedBy || exp.rejectedBy || 'Employee',
        date: exp.appliedOn || exp.date,
        amount: formatCurrency(exp.amount),
        type: exp.status === 'approved' ? 'success' : exp.status === 'rejected' ? 'error' : 'info',
        category: 'expense',
      });
    });

    state.leave.requests.filter(r => r.status !== 'pending').forEach(req => {
      audits.push({
        id: `leave-${req.id}`,
        action: req.status === 'approved' ? 'Leave Approved' : 'Leave Rejected',
        by: 'HR Manager',
        date: req.appliedOn,
        amount: `${req.days} days`,
        type: req.status === 'approved' ? 'success' : 'error',
        category: 'leave',
      });
    });

    return audits.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 30);
  };

  const audits = generateAuditTrail();
  const payrollCount = audits.filter(a => a.category === 'payroll').length;
  const expenseCount = audits.filter(a => a.category === 'expense').length;
  const leaveCount = audits.filter(a => a.category === 'leave').length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Audit Trail" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>

        <View style={styles.statsRow}>
          <StatCard icon="card" label="Payroll" value={payrollCount.toString()} color={colors.primary} delay={0} />
          <StatCard icon="receipt" label="Expenses" value={expenseCount.toString()} color={colors.success} delay={100} />
          <StatCard icon="calendar" label="Leave" value={leaveCount.toString()} color={colors.warning} delay={200} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity ({audits.length})</Text>
          {audits.map((audit, i) => (
            <Card key={audit.id} style={styles.auditCard} padding="md">
              <View style={styles.auditRow}>
                <View style={[styles.auditIcon, { backgroundColor: audit.type === 'success' ? colors.successLight : audit.type === 'error' ? colors.errorLight : colors.infoLight }]}>
                  <Ionicons name={audit.type === 'success' ? 'checkmark-circle' : audit.type === 'error' ? 'close-circle' : 'information-circle'} size={20} color={audit.type === 'success' ? colors.success : audit.type === 'error' ? colors.error : colors.info} />
                </View>
                <View style={styles.auditInfo}>
                  <Text style={styles.auditAction}>{audit.action}</Text>
                  <Text style={styles.auditMeta}>{audit.by} - {new Date(audit.date).toLocaleDateString()}</Text>
                </View>
                <Text style={styles.auditAmount}>{audit.amount}</Text>
              </View>
            </Card>
          ))}
          {audits.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="shield-checkmark-outline" size={64} color={colors.textTertiary} />
              <Text style={styles.emptyTitle}>No Audit Records</Text>
              <Text style={styles.emptySubtitle}>Activity will appear here as transactions are processed.</Text>
            </View>
          )}
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
  auditCard: { marginBottom: spacing.sm },
  auditRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  auditIcon: { width: 36, height: 36, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center' },
  auditInfo: { flex: 1 },
  auditAction: { ...typography.bodySmall, color: colors.text, fontWeight: '600' },
  auditMeta: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
  auditAmount: { ...typography.bodySmall, color: colors.text, fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxxxl },
  emptyTitle: { ...typography.h4, color: colors.text, marginTop: spacing.md },
  emptySubtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
});
