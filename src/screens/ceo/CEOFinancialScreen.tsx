import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Card, ProgressBar } from '../../components';
import { StatCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';

const REVENUE_MONTHS = [
  { month: 'Jan', value: 420 },
  { month: 'Feb', value: 380 },
  { month: 'Mar', value: 510 },
  { month: 'Apr', value: 470 },
  { month: 'May', value: 530 },
  { month: 'Jun', value: 610 },
  { month: 'Jul', value: 580 },
  { month: 'Aug', value: 640 },
  { month: 'Sep', value: 590 },
  { month: 'Oct', value: 720 },
  { month: 'Nov', value: 680 },
  { month: 'Dec', value: 750 },
];

const COST_CENTERS = [
  { name: 'Engineering', budget: 2400000, spent: 1890000, pct: 79 },
  { name: 'Marketing', budget: 1200000, spent: 980000, pct: 82 },
  { name: 'Sales', budget: 1800000, spent: 1350000, pct: 75 },
  { name: 'Operations', budget: 800000, spent: 720000, pct: 90 },
  { name: 'HR', budget: 500000, spent: 380000, pct: 76 },
];

const PNL_ITEMS = [
  { label: 'Total Revenue', value: '$6.88M', trend: '+18%', up: true },
  { label: 'Cost of Goods Sold', value: '$2.14M', trend: '+5%', up: false },
  { label: 'Gross Profit', value: '$4.74M', trend: '+24%', up: true },
  { label: 'Operating Expenses', value: '$2.89M', trend: '+12%', up: false },
  { label: 'EBITDA', value: '$1.85M', trend: '+38%', up: true },
  { label: 'Net Profit', value: '$1.42M', trend: '+31%', up: true },
];

export const CEOFinancialScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const maxRevenue = Math.max(...REVENUE_MONTHS.map(m => m.value));

  useEffect(() => { hapticFeedback('medium'); }, []);

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
    return `$${val}`;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Financial Overview" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* KPI Summary */}
        <View style={styles.statsRow}>
          <StatCard icon="trending-up" label="Revenue" value="$6.88M" color={colors.success} delay={0} />
          <StatCard icon="wallet" label="Net Profit" value="$1.42M" color={colors.primary} delay={100} />
        </View>
        <View style={styles.statsRow}>
          <StatCard icon="pie-chart" label="Margin" value="20.6%" color={colors.accentPurple} delay={200} />
          <StatCard icon="cash" label="Burn Rate" value="$241K/mo" color={colors.warning} delay={300} />
        </View>

        {/* Revenue Trend */}
        <Card style={styles.section} padding="lg">
          <Text style={styles.sectionTitle}>Monthly Revenue</Text>
          <View style={styles.chartContainer}>
            {REVENUE_MONTHS.map((m, i) => (
              <View key={i} style={styles.barWrapper}>
                <View style={styles.barValueContainer}>
                  <Text style={styles.barValue}>{formatCurrency(m.value)}</Text>
                </View>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { height: `${(m.value / maxRevenue) * 100}%` }]} />
                </View>
                <Text style={styles.barLabel}>{m.month}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* P&L Summary */}
        <Card style={styles.section} padding="lg">
          <Text style={styles.sectionTitle}>Profit & Loss</Text>
          {PNL_ITEMS.map((item, i) => (
            <View key={i} style={styles.pnlRow}>
              <Text style={styles.pnlLabel}>{item.label}</Text>
              <View style={styles.pnlRight}>
                <Text style={styles.pnlValue}>{item.value}</Text>
                <View style={[styles.trendBadge, { backgroundColor: item.up ? colors.success + '15' : colors.error + '15' }]}>
                  <Ionicons name={item.up ? 'arrow-up' : 'arrow-down'} size={12} color={item.up ? colors.success : colors.error} />
                  <Text style={[styles.trendText, { color: item.up ? colors.success : colors.error }]}>{item.trend}</Text>
                </View>
              </View>
            </View>
          ))}
        </Card>

        {/* Budget vs Actual */}
        <Card style={styles.section} padding="lg">
          <Text style={styles.sectionTitle}>Budget Utilization</Text>
          {COST_CENTERS.map((dept, i) => (
            <View key={i} style={styles.budgetRow}>
              <View style={styles.budgetInfo}>
                <Text style={styles.budgetName}>{dept.name}</Text>
                <Text style={styles.budgetAmounts}>
                  {formatCurrency(dept.spent)} / {formatCurrency(dept.budget)}
                </Text>
              </View>
              <View style={styles.budgetBarTrack}>
                <View style={[styles.budgetBarFill, { width: `${dept.pct}%`, backgroundColor: dept.pct > 85 ? colors.error : colors.primary }]} />
              </View>
              <Text style={[styles.budgetPct, { color: dept.pct > 85 ? colors.error : colors.textSecondary }]}>{dept.pct}%</Text>
            </View>
          ))}
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => { hapticFeedback('light'); navigation.navigate('FinanceReportDetail'); }}>
            <Ionicons name="document-text" size={22} color={colors.primary} />
            <Text style={styles.actionText}>Full Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => { hapticFeedback('light'); }}>
            <Ionicons name="download" size={22} color={colors.primary} />
            <Text style={styles.actionText}>Export CSV</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => { hapticFeedback('light'); }}>
            <Ionicons name="share" size={22} color={colors.primary} />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  section: { marginBottom: spacing.md },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  chartContainer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 160, gap: 4 },
  barWrapper: { flex: 1, alignItems: 'center', gap: 4 },
  barValueContainer: { height: 20, justifyContent: 'flex-end' },
  barValue: { ...typography.caption, color: colors.textSecondary, fontSize: 9 },
  barTrack: { flex: 1, width: '100%', justifyContent: 'flex-end' },
  barFill: { width: '100%', backgroundColor: colors.primary, borderRadius: 4, minHeight: 8 },
  barLabel: { ...typography.caption, color: colors.textTertiary, fontSize: 9 },
  pnlRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  pnlLabel: { ...typography.body, color: colors.textSecondary },
  pnlRight: { alignItems: 'flex-end', gap: 4 },
  pnlValue: { ...typography.body, color: colors.text, fontWeight: '600' },
  trendBadge: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  trendText: { ...typography.caption, fontWeight: '600' },
  budgetRow: { marginBottom: spacing.md },
  budgetInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  budgetName: { ...typography.bodySmall, color: colors.text, fontWeight: '500' },
  budgetAmounts: { ...typography.caption, color: colors.textTertiary },
  budgetBarTrack: { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  budgetBarFill: { height: '100%', borderRadius: 3 },
  budgetPct: { ...typography.caption, fontWeight: '600', marginTop: 4, textAlign: 'right' },
  quickActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: spacing.md, backgroundColor: colors.surface, borderRadius: borderRadius.md },
  actionText: { ...typography.bodySmall, color: colors.primary, fontWeight: '600' },
});
