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
import { generateW2, getPayrollData } from '../../services/payrollEngine';
import { formatCurrency } from '../../utils/calculations';

export const FinanceTaxScreen: React.FC<any> = ({ navigation }) => {
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
  const currentYear = now.getFullYear();
  const payrollData = getPayrollData(now.getMonth() + 1, currentYear);

  const taxItems = [
    { id: 1, title: 'W-2 Forms', year: currentYear - 1, status: state.payroll?.taxDocuments?.find(t => t.type === 'W-2')?.status || 'pending', deadline: 'Jan 31', desc: 'Employee wage and tax statements', action: 'generate' },
    { id: 2, title: '1099 Forms', year: currentYear - 1, status: state.payroll?.taxDocuments?.find(t => t.type === '1099')?.status || 'pending', deadline: 'Jan 31', desc: 'Contractor payment reports', action: 'generate' },
    { id: 3, title: 'Quarterly Tax Q1', year: currentYear, status: now.getMonth() < 3 ? 'upcoming' : 'filed', deadline: 'Apr 15', desc: 'Q1 estimated tax payment', action: 'file' },
    { id: 4, title: 'Quarterly Tax Q2', year: currentYear, status: now.getMonth() < 6 ? 'upcoming' : 'filed', deadline: 'Jun 15', desc: 'Q2 estimated tax payment', action: 'file' },
    { id: 5, title: 'State Tax Filing', year: currentYear, status: 'upcoming', deadline: 'Mar 15', desc: 'State income tax returns', action: 'file' },
    { id: 6, title: 'Payroll Tax Summary', year: currentYear, status: 'available', deadline: 'Monthly', desc: 'Monthly payroll tax liability report', action: 'view' },
  ];

  const totalTaxLiability = payrollData.totalTax || 48500;
  const filedCount = taxItems.filter(t => t.status === 'filed' || t.status === 'available').length;
  const pendingCount = taxItems.filter(t => t.status === 'pending' || t.status === 'upcoming').length;

  const handleGenerateW2 = (): void => {
    hapticFeedback('medium');
    Alert.alert(
      'Generate W-2 Forms',
      `Generate W-2 forms for all ${state.employees.filter(e => e.status === 'active').length} employees for tax year ${currentYear - 1}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Generate',
          onPress: () => {
            hapticFeedback('success');
            Alert.alert('Success', `W-2 forms generated for ${state.employees.filter(e => e.status === 'active').length} employees.`);
          },
        },
      ]
    );
  };

  const handleFileTax = (item) => {
    hapticFeedback('medium');
    Alert.alert(
      `File ${item.title}`,
      `File ${item.title} for ${item.year}? Deadline: ${item.deadline}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'File Now',
          onPress: () => {
            hapticFeedback('success');
            Alert.alert('Filed', `${item.title} has been filed successfully.`);
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Tax Management" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>

        <View style={styles.statsRow}>
          <StatCard icon="wallet" label="Tax Liability" value={formatCurrency(totalTaxLiability)} color={colors.primary} delay={0} />
          <StatCard icon="checkmark-circle" label="Filed" value={filedCount.toString()} color={colors.success} delay={100} />
          <StatCard icon="hourglass" label="Pending" value={pendingCount.toString()} color={colors.warning} delay={200} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tax Forms & Filings</Text>
          {taxItems.map((item, i) => (
            <TouchableOpacity key={item.id} style={[styles.taxCard, shadows.sm]} onPress={() => {
              hapticFeedback('medium');
              if (item.action === 'generate') handleGenerateW2();
              else if (item.action === 'file') handleFileTax(item);
            }} activeOpacity={0.7}>
              <View style={styles.taxHeader}>
                <View style={styles.taxInfo}>
                  <Text style={styles.taxTitle}>{item.title} {item.year}</Text>
                  <Text style={styles.taxDesc}>{item.desc}</Text>
                </View>
                <Badge text={item.status} variant={item.status === 'filed' || item.status === 'available' ? 'success' : item.status === 'pending' ? 'warning' : 'default'} size="small" />
              </View>
              <View style={styles.taxFooter}>
                <Text style={styles.taxDeadline}>Deadline: {item.deadline}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tax Summary</Text>
          <Card style={styles.summaryCard} padding="lg">
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Payroll Tax</Text>
              <Text style={styles.summaryValue}>{formatCurrency(totalTaxLiability)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Federal Tax</Text>
              <Text style={styles.summaryValue}>{formatCurrency(totalTaxLiability * 0.7)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>State Tax</Text>
              <Text style={styles.summaryValue}>{formatCurrency(totalTaxLiability * 0.2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>FICA (Social Security + Medicare)</Text>
              <Text style={styles.summaryValue}>{formatCurrency(totalTaxLiability * 0.1)}</Text>
            </View>
          </Card>
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
  taxCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm },
  taxHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm },
  taxInfo: { flex: 1 },
  taxTitle: { ...typography.body, color: colors.text, fontWeight: '600' },
  taxDesc: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  taxFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm },
  taxDeadline: { ...typography.caption, color: colors.warning, fontWeight: '600' },
  summaryCard: { marginBottom: spacing.sm },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  summaryLabel: { ...typography.bodySmall, color: colors.textSecondary },
  summaryValue: { ...typography.bodySmall, color: colors.text, fontWeight: '600' },
});
