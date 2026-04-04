import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card } from '../../components';
import { StatCard } from '../../components/management';

export const FinanceBudgetScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const budgets = [
    { department: 'Engineering', budget: 450, spent: 380, pct: 84 },
    { department: 'Marketing', budget: 200, spent: 165, pct: 82 },
    { department: 'Sales', budget: 320, spent: 290, pct: 91 },
    { department: 'Operations', budget: 280, spent: 210, pct: 75 },
    { department: 'Design', budget: 150, spent: 120, pct: 80 },
    { department: 'HR', budget: 80, spent: 65, pct: 81 },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Budget Management" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <StatCard icon="wallet" label="Total Budget" value="$1.48M" color={colors.primary} delay={0} />
          <StatCard icon="trending-up" label="Total Spent" value="$1.23M" color={colors.warning} delay={100} />
          <StatCard icon="cash" label="Remaining" value="$250K" color={colors.success} delay={200} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Department Budgets</Text>
          {budgets.map((dept, i) => (
            <Card key={dept.department} style={styles.budgetCard} padding="md">
              <View style={styles.budgetHeader}>
                <Text style={styles.budgetDept}>{dept.department}</Text>
                <Text style={[styles.budgetPct, { color: dept.pct > 90 ? colors.error : dept.pct > 75 ? colors.warning : colors.success }]}>{dept.pct}%</Text>
              </View>
              <View style={styles.budgetBar}>
                <View style={[styles.budgetFill, { width: `${dept.pct}%`, backgroundColor: dept.pct > 90 ? colors.error : dept.pct > 75 ? colors.warning : colors.success }]} />
              </View>
              <View style={styles.budgetAmounts}>
                <Text style={styles.budgetSpent}>Spent: ${dept.spent}K</Text>
                <Text style={styles.budgetTotal}>Budget: ${dept.budget}K</Text>
              </View>
            </Card>
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
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  budgetCard: { marginBottom: spacing.sm },
  budgetHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  budgetDept: { ...typography.body, color: colors.text, fontWeight: '600' },
  budgetPct: { ...typography.body, fontWeight: '700' },
  budgetBar: { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden', marginBottom: spacing.sm },
  budgetFill: { height: '100%', borderRadius: 3 },
  budgetAmounts: { flexDirection: 'row', justifyContent: 'space-between' },
  budgetSpent: { ...typography.caption, color: colors.textSecondary },
  budgetTotal: { ...typography.caption, color: colors.textSecondary },
});
