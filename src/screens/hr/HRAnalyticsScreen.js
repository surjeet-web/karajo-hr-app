import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card } from '../../components';
import { StatCard } from '../../components/management';

export const HRAnalyticsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="HR Analytics" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <StatCard icon="trending-up" label="Headcount Growth" value="+12%" trend="up" trendValue="YoY" color={colors.success} delay={0} />
          <StatCard icon="trending-down" label="Turnover Rate" value="3.2%" trend="down" trendValue="-1.5%" color={colors.warning} delay={100} />
          <StatCard icon="people" label="Avg Tenure" value="2.4yr" color={colors.primary} delay={200} />
          <StatCard icon="star" label="eNPS Score" value="72" trend="up" trendValue="+5" color={colors.accentPurple} delay={300} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Headcount Trends</Text>
          <Card style={styles.chartCard} padding="lg">
            <Text style={styles.chartTitle}>Monthly Headcount</Text>
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => {
              const values = [220, 228, 232, 238, 242, 247];
              const max = Math.max(...values);
              return (
                <View key={month} style={styles.barRow}>
                  <Text style={styles.barLabel}>{month}</Text>
                  <View style={styles.barContainer}>
                    <View style={[styles.bar, { width: `${(values[i] / max) * 100}%`, backgroundColor: colors.primary }]} />
                  </View>
                  <Text style={styles.barValue}>{values[i]}</Text>
                </View>
              );
            })}
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Department Distribution</Text>
          {[
            { name: 'Engineering', count: 89, pct: 36, color: colors.primary },
            { name: 'Sales', count: 56, pct: 23, color: colors.success },
            { name: 'Operations', count: 42, pct: 17, color: colors.warning },
            { name: 'Marketing', count: 34, pct: 14, color: colors.accentPurple },
            { name: 'Design', count: 18, pct: 7, color: colors.info },
            { name: 'HR', count: 8, pct: 3, color: colors.textTertiary },
          ].map((dept, i) => (
            <Card key={dept.name} style={styles.deptDistCard} padding="md">
              <View style={styles.deptDistHeader}>
                <Text style={styles.deptDistName}>{dept.name}</Text>
                <Text style={styles.deptDistCount}>{dept.count} ({dept.pct}%)</Text>
              </View>
              <View style={styles.deptDistBar}>
                <View style={[styles.deptDistFill, { width: `${dept.pct * 2.5}%`, backgroundColor: dept.color }]} />
              </View>
            </Card>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Diversity Metrics</Text>
          <View style={styles.diversityGrid}>
            {[
              { label: 'Gender Ratio', value: '52:48', sub: 'M:F' },
              { label: 'Avg Age', value: '34', sub: 'years' },
              { label: 'Remote', value: '28%', sub: 'of workforce' },
              { label: 'Promotions', value: '18', sub: 'this quarter' },
            ].map((metric, i) => (
              <Card key={i} style={styles.diversityCard} padding="md">
                <Text style={styles.diversityValue}>{metric.value}</Text>
                <Text style={styles.diversityLabel}>{metric.label}</Text>
                <Text style={styles.diversitySub}>{metric.sub}</Text>
              </Card>
            ))}
          </View>
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
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  chartCard: { marginBottom: spacing.sm },
  chartTitle: { ...typography.body, color: colors.text, fontWeight: '600', marginBottom: spacing.md },
  barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, gap: spacing.sm },
  barLabel: { width: 30, ...typography.caption, color: colors.textSecondary },
  barContainer: { flex: 1, height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' },
  bar: { height: '100%', borderRadius: 4 },
  barValue: { width: 35, ...typography.caption, color: colors.text, fontWeight: '600', textAlign: 'right' },
  deptDistCard: { marginBottom: spacing.sm },
  deptDistHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  deptDistName: { ...typography.body, color: colors.text, fontWeight: '600' },
  deptDistCount: { ...typography.bodySmall, color: colors.textSecondary },
  deptDistBar: { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  deptDistFill: { height: '100%', borderRadius: 3 },
  diversityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  diversityCard: { width: '47%', alignItems: 'center' },
  diversityValue: { ...typography.statNumberSmall, color: colors.text },
  diversityLabel: { ...typography.bodySmall, color: colors.text, fontWeight: '600', marginTop: spacing.xs },
  diversitySub: { ...typography.caption, color: colors.textTertiary },
});
