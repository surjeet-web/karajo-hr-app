import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card, Badge } from '../../components';

export const PayrollDetailScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Payroll Detail" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Card style={styles.summaryCard} padding="lg">
          <Text style={styles.month}>February 2026</Text>
          <Text style={styles.total}>$485,200</Text>
          <Badge text="Completed" variant="success" size="medium" />
        </Card>

        <Card style={styles.breakdownCard} padding="lg">
          <Text style={styles.breakdownTitle}>Breakdown</Text>
          {[
            { label: 'Basic Salary', value: '$290,000', pct: 60 },
            { label: 'HRA', value: '$97,000', pct: 20 },
            { label: 'Allowances', value: '$48,500', pct: 10 },
            { label: 'Overtime', value: '$24,200', pct: 5 },
            { label: 'Bonus', value: '$25,500', pct: 5 },
          ].map((item, i) => (
            <View key={i} style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>{item.label}</Text>
              <Text style={styles.breakdownValue}>{item.value}</Text>
            </View>
          ))}
        </Card>

        <Card style={styles.deductionCard} padding="lg">
          <Text style={styles.deductionTitle}>Deductions</Text>
          {[
            { label: 'Tax', value: '$48,500' },
            { label: 'Insurance', value: '$12,100' },
            { label: '401k', value: '$24,200' },
          ].map((item, i) => (
            <View key={i} style={styles.deductionRow}>
              <Text style={styles.deductionLabel}>{item.label}</Text>
              <Text style={[styles.deductionValue, { color: colors.error }]}>-{item.value}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  summaryCard: { alignItems: 'center', marginBottom: spacing.md },
  month: { ...typography.h5, color: colors.textSecondary },
  total: { ...typography.statNumber, color: colors.success, marginVertical: spacing.sm },
  breakdownCard: { marginBottom: spacing.md },
  breakdownTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  breakdownLabel: { ...typography.bodySmall, color: colors.textSecondary },
  breakdownValue: { ...typography.bodySmall, color: colors.text, fontWeight: '600' },
  deductionCard: { marginBottom: spacing.md },
  deductionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  deductionRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  deductionLabel: { ...typography.bodySmall, color: colors.textSecondary },
  deductionValue: { ...typography.bodySmall, fontWeight: '600' },
});
