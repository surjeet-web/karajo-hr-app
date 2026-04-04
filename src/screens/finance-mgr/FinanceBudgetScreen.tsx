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
import { getState, subscribe, updateBudget, getBudgetUtilization } from '../../store';
import { formatCurrency, calculateBudgetUtilization } from '../../utils/calculations';

export const FinanceBudgetScreen: React.FC<any> = ({ navigation }) => {
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

  const budgetData = getBudgetUtilization();
  const totalBudget = state.budgets?.totalBudget || 0;
  const totalSpent = state.budgets?.totalSpent || 0;
  const totalRemaining = totalBudget - totalSpent;
  const overallUtilization = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const handleEditBudget = (dept) => {
    hapticFeedback('medium');
    Alert.prompt(
      'Edit Budget',
      `Enter new budget for ${dept.name} (current: ${formatCurrency(dept.budget)}):`,
      (newBudget) => {
        if (newBudget && !isNaN(Number(newBudget)) && Number(newBudget) > 0) {
          updateBudget(dept.id, parseFloat(newBudget));
          setStateLocal(getState());
          hapticFeedback('success');
          Alert.alert('Success', `Budget for ${dept.name} updated to ${formatCurrency(parseFloat(newBudget))}`);
        }
      },
      'numeric',
      dept.budget.toString()
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Budget Management" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>

        <View style={styles.statsRow}>
          <StatCard icon="wallet" label="Total Budget" value={formatCurrency(totalBudget)} color={colors.primary} delay={0} />
          <StatCard icon="trending-up" label="Total Spent" value={formatCurrency(totalSpent)} color={colors.warning} delay={100} />
          <StatCard icon="cash" label="Remaining" value={formatCurrency(totalRemaining)} color={totalRemaining < 0 ? colors.error : colors.success} delay={200} />
        </View>

        <Card style={styles.overviewCard} padding="lg">
          <View style={styles.overviewHeader}>
            <Text style={styles.overviewTitle}>Overall Budget Utilization</Text>
            <Text style={[styles.overviewPct, { color: overallUtilization > 90 ? colors.error : overallUtilization > 75 ? colors.warning : colors.success }]}>
              {overallUtilization}%
            </Text>
          </View>
          <View style={styles.overviewBar}>
            <View style={[styles.overviewFill, { width: `${overallUtilization}%`, backgroundColor: overallUtilization > 90 ? colors.error : overallUtilization > 75 ? colors.warning : colors.success }]} />
          </View>
          <View style={styles.overviewFooter}>
            <Text style={styles.overviewSpent}>Spent: {formatCurrency(totalSpent)}</Text>
            <Text style={[styles.overviewRemaining, { color: totalRemaining < 0 ? colors.error : colors.success }]}>
              Remaining: {formatCurrency(totalRemaining)}
            </Text>
          </View>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Department Budgets</Text>
          {budgetData.map((dept, i) => {
            const util = calculateBudgetUtilization(dept.spent, dept.budget);
            return (
              <TouchableOpacity key={dept.id} style={[styles.budgetCard, shadows.sm]} onPress={() => handleEditBudget(dept)} activeOpacity={0.7}>
                <View style={styles.budgetHeader}>
                  <View style={styles.budgetInfo}>
                    <Text style={styles.budgetDept}>{dept.name}</Text>
                    <Text style={styles.budgetDetails}>
                      {formatCurrency(dept.spent)} of {formatCurrency(dept.budget)}
                    </Text>
                  </View>
                  <View style={styles.budgetRight}>
                    <Text style={[styles.budgetPct, { color: util.utilization > 90 ? colors.error : util.utilization > 75 ? colors.warning : colors.success }]}>
                      {util.utilization}%
                    </Text>
                    <Ionicons name="create-outline" size={16} color={colors.textTertiary} />
                  </View>
                </View>
                <View style={styles.budgetBar}>
                  <View style={[styles.budgetFill, { width: `${Math.min(util.utilization, 100)}%`, backgroundColor: util.utilization > 90 ? colors.error : util.utilization > 75 ? colors.warning : colors.success }]} />
                </View>
                {util.overBudget && (
                  <View style={styles.overBudgetWarning}>
                    <Ionicons name="warning" size={14} color={colors.error} />
                    <Text style={styles.overBudgetText}>Over budget by {formatCurrency(Math.abs(util.remaining))}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget Alerts</Text>
          {budgetData.filter(d => calculateBudgetUtilization(d.spent, d.budget).utilization > 85).map((dept, i) => {
            const util = calculateBudgetUtilization(dept.spent, dept.budget);
            return (
              <Card key={dept.id} style={styles.alertCard} padding="md">
                <View style={styles.alertRow}>
                  <Ionicons name={util.overBudget ? 'close-circle' : 'warning'} size={20} color={util.overBudget ? colors.error : colors.warning} />
                  <Text style={styles.alertText}>
                    {dept.name} is at {util.utilization}% budget utilization
                    {util.overBudget ? ' - OVER BUDGET' : ' - approaching limit'}
                  </Text>
                </View>
              </Card>
            );
          })}
          {budgetData.filter(d => calculateBudgetUtilization(d.spent, d.budget).utilization > 85).length === 0 && (
            <Card style={styles.noAlertsCard} padding="md">
              <Ionicons name="checkmark-circle" size={24} color={colors.success} />
              <Text style={styles.noAlertsText}>All departments are within budget limits.</Text>
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
  overviewCard: { marginBottom: spacing.lg },
  overviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  overviewTitle: { ...typography.body, color: colors.text, fontWeight: '600' },
  overviewPct: { ...typography.h5, fontWeight: '700' },
  overviewBar: { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden', marginBottom: spacing.sm },
  overviewFill: { height: '100%', borderRadius: 4 },
  overviewFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  overviewSpent: { ...typography.bodySmall, color: colors.textSecondary },
  overviewRemaining: { ...typography.bodySmall, fontWeight: '600' },
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  budgetCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm },
  budgetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm },
  budgetInfo: { flex: 1 },
  budgetDept: { ...typography.body, color: colors.text, fontWeight: '600' },
  budgetDetails: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
  budgetRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  budgetPct: { ...typography.body, fontWeight: '700' },
  budgetBar: { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  budgetFill: { height: '100%', borderRadius: 3 },
  overBudgetWarning: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm },
  overBudgetText: { ...typography.caption, color: colors.error, fontWeight: '600' },
  alertCard: { marginBottom: spacing.sm, backgroundColor: colors.warningLight },
  alertRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  alertText: { ...typography.bodySmall, color: colors.warning, flex: 1, fontWeight: '500' },
  noAlertsCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.successLight },
  noAlertsText: { ...typography.bodySmall, color: colors.success, flex: 1, fontWeight: '500' },
});
