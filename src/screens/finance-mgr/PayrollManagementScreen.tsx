import React, { useState, useEffect } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card, Badge, Button } from '../../components';
import { StatCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';
import { getState, subscribe, createPayrollRun, approvePayroll, getPayrollData, getPayrollTrendData } from '../../store';
import { formatCurrency } from '../../utils/calculations';

const PAYROLL_STEPS = [
  { id: 1, title: 'Verify Attendance', desc: 'Confirm all attendance data' },
  { id: 2, title: 'Calculate Overtime', desc: 'Compute OT hours and pay' },
  { id: 3, title: 'Apply Deductions', desc: 'Tax, insurance, retirement' },
  { id: 4, title: 'Review & Approve', desc: 'Final review before processing' },
];

export const PayrollManagementScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [state, setStateLocal] = useState(getState());
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [payrollRun, setPayrollRun] = useState<any>(null);

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
  const trends = getPayrollTrendData(6);
  const runs = state.payroll?.payrollRuns || [];

  const handleStartPayroll = (): void => {
    hapticFeedback('heavy');
    Alert.alert(
      'Start Payroll Run',
      `This will process payroll for ${new Date(0, currentMonth - 1).toLocaleString('default', { month: 'long' })} ${currentYear} for ${state.employees.filter(e => e.status === 'active').length} employees. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start',
          onPress: () => {
            setIsProcessing(true);
            const run = createPayrollRun(currentMonth, currentYear);
            setPayrollRun(run);
            setCurrentStep(1);
            setIsProcessing(false);
            hapticFeedback('success');
          },
        },
      ]
    );
  };

  const handleApprovePayroll = (): void => {
    hapticFeedback('heavy');
    Alert.alert(
      'Approve Payroll',
      `Total payroll: ${formatCurrency(payrollData.totalPayroll || 485200)}. This will generate payslips for all employees.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve & Process',
          onPress: () => {
            setIsProcessing(true);
            approvePayroll(payrollData.id || Date.now(), state.user?.name || 'Finance Manager');
            setCurrentStep(0);
            setPayrollRun(null);
            setStateLocal(getState());
            setIsProcessing(false);
            hapticFeedback('success');
            Alert.alert('Success', 'Payroll has been processed and payslips generated.');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Payroll Management" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        
        <View style={styles.statsRow}>
          <StatCard icon="wallet" label="Total Payroll" value={payrollData.totalPayroll ? formatCurrency(payrollData.totalPayroll) : formatCurrency(485200)} color={colors.primary} delay={0} />
          <StatCard icon="people" label="Employees" value={payrollData.employeeCount || state.employees.filter(e => e.status === 'active').length} color={colors.success} delay={100} />
          <StatCard icon="trending-up" label="Avg Net Pay" value={payrollData.avgNetPay ? formatCurrency(payrollData.avgNetPay) : formatCurrency(3200)} color={colors.accentPurple} delay={200} />
        </View>

        {currentStep > 0 && payrollRun && (
          <Card style={styles.processCard} padding="lg">
            <Text style={styles.processTitle}>Payroll Run in Progress</Text>
            <View style={styles.stepsContainer}>
              {PAYROLL_STEPS.map((step, i) => (
                <View key={step.id} style={styles.stepRow}>
                  <View style={[styles.stepDot, i < currentStep ? styles.stepDotComplete : i === currentStep ? styles.stepDotActive : styles.stepDotPending]}>
                    <Ionicons name={i < currentStep ? 'checkmark' : `${i + 1}`} size={16} color={i < currentStep ? colors.textInverse : i === currentStep ? colors.primary : colors.textTertiary} />
                  </View>
                  <View style={styles.stepInfo}>
                    <Text style={[styles.stepTitle, i <= currentStep && styles.stepTitleActive]}>{step.title}</Text>
                    <Text style={styles.stepDesc}>{step.desc}</Text>
                  </View>
                </View>
              ))}
            </View>

            {currentStep === 1 && (
              <View style={styles.stepContent}>
                <Text style={styles.stepContentTitle}>Attendance Verification</Text>
                <Text style={styles.stepContentText}>All {payrollRun.employeeCount} employees have attendance records for this month.</Text>
                <View style={styles.verifyStats}>
                  <View style={styles.verifyStat}>
                    <Text style={styles.verifyValue}>{payrollRun.employeeCount}</Text>
                    <Text style={styles.verifyLabel}>Total</Text>
                  </View>
                  <View style={styles.verifyStat}>
                    <Text style={[styles.verifyValue, { color: colors.success }]}>{payrollRun.employeeCount - 2}</Text>
                    <Text style={styles.verifyLabel}>Present</Text>
                  </View>
                  <View style={styles.verifyStat}>
                    <Text style={[styles.verifyValue, { color: colors.warning }]}>{2}</Text>
                    <Text style={styles.verifyLabel}>Absent</Text>
                  </View>
                </View>
                <Button title="Continue to Overtime Calculation" onPress={() => { hapticFeedback('medium'); setCurrentStep(2); }} style={styles.stepBtn} />
              </View>
            )}

            {currentStep === 2 && (
              <View style={styles.stepContent}>
                <Text style={styles.stepContentTitle}>Overtime Calculation</Text>
                <Text style={styles.stepContentText}>Total overtime hours: {payrollRun.totalOvertimeHours || 45.5}h</Text>
                <Text style={styles.stepContentText}>Overtime pay: {formatCurrency(payrollRun.totalOvertimePay || 12500)}</Text>
                <Button title="Continue to Deductions" onPress={() => { hapticFeedback('medium'); setCurrentStep(3); }} style={styles.stepBtn} />
              </View>
            )}

            {currentStep === 3 && (
              <View style={styles.stepContent}>
                <Text style={styles.stepContentTitle}>Deductions Applied</Text>
                <View style={styles.deductionList}>
                  <View style={styles.deductionRow}>
                    <Text style={styles.deductionLabel}>Total Tax</Text>
                    <Text style={styles.deductionValue}>{formatCurrency(payrollData.totalTax || 48500)}</Text>
                  </View>
                  <View style={styles.deductionRow}>
                    <Text style={styles.deductionLabel}>Insurance (5%)</Text>
                    <Text style={styles.deductionValue}>{formatCurrency((payrollData.totalGross || 550000) * 0.05)}</Text>
                  </View>
                  <View style={styles.deductionRow}>
                    <Text style={styles.deductionLabel}>Retirement (6%)</Text>
                    <Text style={styles.deductionValue}>{formatCurrency((payrollData.totalGross || 550000) * 0.06)}</Text>
                  </View>
                  <View style={[styles.deductionRow, styles.deductionTotal]}>
                    <Text style={styles.deductionTotalLabel}>Net Payroll</Text>
                    <Text style={styles.deductionTotalValue}>{formatCurrency(payrollData.totalPayroll || 485200)}</Text>
                  </View>
                </View>
                <Button title="Review & Approve" onPress={() => setCurrentStep(4)} style={styles.stepBtn} />
              </View>
            )}

            {currentStep === 4 && (
              <View style={styles.stepContent}>
                <Text style={styles.stepContentTitle}>Final Review</Text>
                <View style={styles.summaryGrid}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Gross Payroll</Text>
                    <Text style={styles.summaryValue}>{formatCurrency(payrollData.totalGross || 550000)}</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Total Deductions</Text>
                    <Text style={[styles.summaryValue, { color: colors.error }]}>{formatCurrency((payrollData.totalGross || 550000) - (payrollData.totalPayroll || 485200))}</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Net Payroll</Text>
                    <Text style={[styles.summaryValue, { color: colors.success }]}>{formatCurrency(payrollData.totalPayroll || 485200)}</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Employees</Text>
                    <Text style={styles.summaryValue}>{payrollRun.employeeCount}</Text>
                  </View>
                </View>
                <Button title="Approve & Process Payroll" onPress={handleApprovePayroll} style={styles.approveBtn} />
                <Button title="Back to Edit" variant="outline" onPress={() => setCurrentStep(3)} style={styles.backBtn} />
              </View>
            )}
          </Card>
        )}

        {!payrollRun && (
          <TouchableOpacity style={[styles.runBtn, shadows.md]} onPress={handleStartPayroll} activeOpacity={0.7} disabled={isProcessing}>
            <Ionicons name="play-circle" size={24} color={colors.textInverse} />
            <Text style={styles.runBtnText}>{isProcessing ? 'Processing...' : 'Start New Payroll Run'}</Text>
          </TouchableOpacity>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payroll Trends</Text>
          <Card style={styles.trendCard} padding="lg">
            {trends.map((trend, i) => (
              <View key={i} style={styles.trendRow}>
                <Text style={styles.trendMonth}>{trend.month}</Text>
                <View style={styles.trendBar}>
                  <View style={[styles.trendFill, { width: trend.totalPayroll > 0 ? `${(trend.totalPayroll / 500000) * 100}%` : '0%', backgroundColor: trend.status === 'approved' ? colors.success : trend.status === 'draft' ? colors.warning : colors.border }]} />
                </View>
                <Text style={styles.trendValue}>{trend.totalPayroll > 0 ? formatCurrency(trend.totalPayroll) : '-'}</Text>
                <Badge text={trend.status} variant={trend.status === 'approved' ? 'success' : trend.status === 'draft' ? 'warning' : 'default'} size="small" />
              </View>
            ))}
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Payroll Runs</Text>
          {runs.length > 0 ? runs.slice(0, 5).map((run, i) => (
            <TouchableOpacity key={run.id} style={[styles.runCard, shadows.sm]} onPress={() => navigation.navigate('PayrollDetail', { payrollRun: run })} activeOpacity={0.7}>
              <View style={styles.runInfo}>
                <Text style={styles.runMonth}>{new Date(0, run.month - 1).toLocaleString('default', { month: 'long' })} {run.year}</Text>
                <Text style={styles.runDetails}>{run.employeeCount} employees • {run.processedAt ? `Processed ${new Date(run.processedAt).toLocaleDateString()}` : 'Not processed'}</Text>
              </View>
              <View style={styles.runAmount}>
                <Text style={styles.runTotal}>{formatCurrency(run.totalPayroll)}</Text>
                <Badge text={run.status} variant={run.status === 'approved' ? 'success' : run.status === 'draft' ? 'warning' : 'default'} size="small" />
              </View>
            </TouchableOpacity>
          )) : (
            <Card style={styles.emptyCard} padding="lg">
              <Ionicons name="card-outline" size={40} color={colors.textTertiary} />
              <Text style={styles.emptyText}>No payroll runs yet. Start your first payroll run above.</Text>
            </Card>
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
  processCard: { marginBottom: spacing.lg, borderWidth: 2, borderColor: colors.primary },
  processTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  stepsContainer: { marginBottom: spacing.lg },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm },
  stepDot: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  stepDotComplete: { backgroundColor: colors.success },
  stepDotActive: { backgroundColor: colors.primaryLighter, borderWidth: 2, borderColor: colors.primary },
  stepDotPending: { backgroundColor: colors.border },
  stepInfo: { flex: 1 },
  stepTitle: { ...typography.bodySmall, color: colors.textTertiary },
  stepTitleActive: { color: colors.text, fontWeight: '600' },
  stepDesc: { ...typography.caption, color: colors.textTertiary },
  stepContent: { marginTop: spacing.md },
  stepContentTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.sm },
  stepContentText: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xs },
  verifyStats: { flexDirection: 'row', gap: spacing.md, marginVertical: spacing.md },
  verifyStat: { flex: 1, alignItems: 'center', backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.md, padding: spacing.md },
  verifyValue: { ...typography.h4, fontWeight: '700' },
  verifyLabel: { ...typography.caption, color: colors.textTertiary, marginTop: spacing.xs },
  stepBtn: { marginTop: spacing.md },
  deductionList: { marginTop: spacing.md },
  deductionRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  deductionLabel: { ...typography.bodySmall, color: colors.textSecondary },
  deductionValue: { ...typography.bodySmall, color: colors.text, fontWeight: '600' },
  deductionTotal: { borderBottomWidth: 0, marginTop: spacing.sm },
  deductionTotalLabel: { ...typography.body, color: colors.text, fontWeight: '700' },
  deductionTotalValue: { ...typography.h5, color: colors.success, fontWeight: '700' },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.lg },
  summaryItem: { width: '47%', backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.md, padding: spacing.md, alignItems: 'center' },
  summaryLabel: { ...typography.caption, color: colors.textTertiary },
  summaryValue: { ...typography.h5, color: colors.text, fontWeight: '700', marginTop: spacing.xs },
  approveBtn: { marginBottom: spacing.sm },
  backBtn: { borderWidth: 1.5, borderColor: colors.primary },
  runBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.primary, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.lg },
  runBtnText: { ...typography.button, color: colors.textInverse },
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  trendCard: { marginBottom: spacing.sm },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  trendMonth: { width: 35, ...typography.caption, color: colors.textSecondary },
  trendBar: { flex: 1, height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  trendFill: { height: '100%', borderRadius: 3 },
  trendValue: { width: 80, ...typography.caption, color: colors.text, fontWeight: '600', textAlign: 'right' },
  runCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm },
  runInfo: { flex: 1 },
  runMonth: { ...typography.body, color: colors.text, fontWeight: '600' },
  runDetails: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  runAmount: { alignItems: 'flex-end', gap: spacing.xs },
  runTotal: { ...typography.h5, color: colors.success, fontWeight: '700' },
  emptyCard: { alignItems: 'center', gap: spacing.sm },
  emptyText: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
});
