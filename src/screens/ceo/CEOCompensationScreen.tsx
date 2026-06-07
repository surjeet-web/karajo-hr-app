import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Card } from '../../components';
import { StatCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';

const COMP_SUMMARY = [
  { label: 'Total Payroll', value: '$4.2M/yr', icon: 'cash', color: colors.primary },
  { label: 'Avg Salary', value: '$68,500', icon: 'trending-up', color: colors.success },
  { label: 'Benefits Cost', value: '$840K/yr', icon: 'heart', color: colors.accentPurple },
  { label: 'Pay Equity Score', value: '94%', icon: 'balance', color: colors.info },
];

const DEPT_COMP = [
  { dept: 'Engineering', headcount: 89, avgSalary: '$95,200', totalCost: '$8.5M', bonusPct: '12%' },
  { dept: 'Design', headcount: 24, avgSalary: '$78,400', totalCost: '$1.9M', bonusPct: '10%' },
  { dept: 'Marketing', headcount: 32, avgSalary: '$65,800', totalCost: '$2.1M', bonusPct: '8%' },
  { dept: 'Sales', headcount: 45, avgSalary: '$72,300', totalCost: '$3.3M', bonusPct: '18%' },
  { dept: 'Finance', headcount: 18, avgSalary: '$82,100', totalCost: '$1.5M', bonusPct: '11%' },
  { dept: 'HR', headcount: 15, avgSalary: '$62,400', totalCost: '$936K', bonusPct: '7%' },
];

const BENEFITS_USAGE = [
  { benefit: 'Health Insurance', enrolled: 210, total: 223, pct: 94 },
  { benefit: '401(k) Match', enrolled: 185, total: 223, pct: 83 },
  { benefit: 'Dental & Vision', enrolled: 198, total: 223, pct: 89 },
  { benefit: 'PTO (Unlimited)', enrolled: 223, total: 223, pct: 100 },
  { benefit: 'Remote Stipend', enrolled: 156, total: 223, pct: 70 },
  { benefit: 'Learning Budget', enrolled: 142, total: 223, pct: 64 },
];

const PAY_BANDS = [
  { band: 'L1 - Entry', range: '$45K - $65K', count: 32, pct: 14 },
  { band: 'L2 - Mid', range: '$65K - $90K', count: 78, pct: 35 },
  { band: 'L3 - Senior', range: '$90K - $130K', count: 68, pct: 30 },
  { band: 'L4 - Lead', range: '$130K - $170K', count: 32, pct: 14 },
  { band: 'L5 - Director+', range: '$170K+', count: 13, pct: 6 },
];

export const CEOCompensationScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const totalCost = DEPT_COMP.reduce((s, d) => s + parseFloat(d.totalCost.replace(/[$MK]/g, '')) * (d.totalCost.includes('M') ? 1000 : 1), 0);

  useEffect(() => { hapticFeedback('medium'); }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Compensation Overview" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <StatCard icon="cash" label="Total Comp" value="$18.2M" color={colors.primary} delay={0} />
          <StatCard icon="people" label="Per Employee" value="$81.6K" color={colors.success} delay={100} />
        </View>

        {/* Pay Bands */}
        <Card style={styles.section} padding="lg">
          <Text style={styles.sectionTitle}>Pay Band Distribution</Text>
          {PAY_BANDS.map((band, i) => (
            <View key={i} style={styles.bandRow}>
              <View style={styles.bandInfo}>
                <Text style={styles.bandName}>{band.band}</Text>
                <Text style={styles.bandRange}>{band.range}</Text>
              </View>
              <View style={styles.bandBarTrack}>
                <View style={[styles.bandBarFill, { width: `${band.pct * 2.5}%` }]} />
              </View>
              <Text style={styles.bandCount}>{band.count}</Text>
            </View>
          ))}
        </Card>

        {/* Department Compensation */}
        <Card style={styles.section} padding="lg">
          <Text style={styles.sectionTitle}>By Department</Text>
          {DEPT_COMP.map((dept, i) => (
            <View key={i} style={styles.deptRow}>
              <Text style={styles.deptName}>{dept.dept}</Text>
              <Text style={styles.deptAvg}>{dept.avgSalary}</Text>
              <Text style={styles.deptTotal}>{dept.totalCost}</Text>
              <Text style={styles.deptBonus}>{dept.bonusPct}</Text>
            </View>
          ))}
          <View style={styles.deptHeader}>
            <Text style={[styles.deptName, styles.deptHeaderLabel]}>Department</Text>
            <Text style={[styles.deptAvg, styles.deptHeaderLabel]}>Avg Salary</Text>
            <Text style={[styles.deptTotal, styles.deptHeaderLabel]}>Total</Text>
            <Text style={[styles.deptBonus, styles.deptHeaderLabel]}>Bonus</Text>
          </View>
        </Card>

        {/* Benefits Utilization */}
        <Card style={styles.section} padding="lg">
          <Text style={styles.sectionTitle}>Benefits Utilization</Text>
          {BENEFITS_USAGE.map((b, i) => (
            <View key={i} style={styles.benefitRow}>
              <View style={styles.benefitInfo}>
                <Text style={styles.benefitName}>{b.benefit}</Text>
                <Text style={styles.benefitCount}>{b.enrolled}/{b.total} enrolled</Text>
              </View>
              <View style={styles.benefitBarTrack}>
                <View style={[styles.benefitBarFill, { width: `${b.pct}%`, backgroundColor: b.pct >= 90 ? colors.success : b.pct >= 70 ? colors.primary : colors.warning }]} />
              </View>
              <Text style={styles.benefitPct}>{b.pct}%</Text>
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
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  section: { marginBottom: spacing.md },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  bandRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  bandInfo: { width: 100 },
  bandName: { ...typography.bodySmall, color: colors.text, fontWeight: '500' },
  bandRange: { ...typography.caption, color: colors.textTertiary },
  bandBarTrack: { flex: 1, height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' },
  bandBarFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 4 },
  bandCount: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: '600', width: 30, textAlign: 'right' },
  deptHeader: { flexDirection: 'row', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: spacing.sm },
  deptHeaderLabel: { ...typography.caption, color: colors.textTertiary, fontWeight: '600' },
  deptRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  deptName: { ...typography.bodySmall, color: colors.text, width: 80, fontWeight: '500' },
  deptAvg: { ...typography.bodySmall, color: colors.text, width: 70 },
  deptTotal: { ...typography.bodySmall, color: colors.textSecondary, width: 50 },
  deptBonus: { ...typography.bodySmall, color: colors.textTertiary, width: 40, textAlign: 'right' },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  benefitInfo: { flex: 1 },
  benefitName: { ...typography.bodySmall, color: colors.text, fontWeight: '500' },
  benefitCount: { ...typography.caption, color: colors.textTertiary },
  benefitBarTrack: { width: 80, height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  benefitBarFill: { height: '100%', borderRadius: 3 },
  benefitPct: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: '600', width: 36, textAlign: 'right' },
});
