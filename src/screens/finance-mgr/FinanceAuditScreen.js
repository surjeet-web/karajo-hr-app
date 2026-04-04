import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card } from '../../components';

export const FinanceAuditScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const audits = [
    { action: 'Payroll Processed', by: 'Finance Team', date: 'Mar 1, 2026', amount: '$485,200', type: 'success' },
    { action: 'Expense Approved', by: 'Finance Manager', date: 'Feb 28, 2026', amount: '$450', type: 'info' },
    { action: 'Budget Updated', by: 'Finance Manager', date: 'Feb 25, 2026', amount: '$200K', type: 'info' },
    { action: 'Tax Filed', by: 'System', date: 'Feb 20, 2026', amount: '-', type: 'success' },
    { action: 'Expense Rejected', by: 'Finance Manager', date: 'Feb 18, 2026', amount: '$1,200', type: 'error' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Audit Trail" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {audits.map((audit, i) => (
          <Card key={i} style={styles.auditCard} padding="md">
            <View style={styles.auditRow}>
              <Ionicons name={audit.type === 'success' ? 'checkmark-circle' : audit.type === 'error' ? 'close-circle' : 'information-circle'} size={20} color={audit.type === 'success' ? colors.success : audit.type === 'error' ? colors.error : colors.info} />
              <View style={styles.auditInfo}>
                <Text style={styles.auditAction}>{audit.action}</Text>
                <Text style={styles.auditMeta}>{audit.by} • {audit.date}</Text>
              </View>
              {audit.amount !== '-' && <Text style={styles.auditAmount}>{audit.amount}</Text>}
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  auditCard: { marginBottom: spacing.sm },
  auditRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  auditInfo: { flex: 1 },
  auditAction: { ...typography.bodySmall, color: colors.text, fontWeight: '600' },
  auditMeta: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
  auditAmount: { ...typography.bodySmall, color: colors.text, fontWeight: '600' },
});
