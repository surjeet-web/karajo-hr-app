import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card } from '../../components';
import { StatCard } from '../../components/management';

export const CEOAnalyticsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Company Analytics" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <StatCard icon="trending-up" label="Headcount Growth" value="+12%" color={colors.success} delay={0} />
          <StatCard icon="trending-down" label="Attrition Rate" value="3.2%" color={colors.warning} delay={100} />
          <StatCard icon="people" label="Avg Tenure" value="2.4yr" color={colors.primary} delay={200} />
          <StatCard icon="star" label="eNPS Score" value="72" trend="up" trendValue="+5" color={colors.accentPurple} delay={300} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Department Costs</Text>
          {[
            { name: 'Engineering', cost: '$450K', pct: 38, color: colors.primary },
            { name: 'Sales', cost: '$320K', pct: 27, color: colors.success },
            { name: 'Operations', cost: '$280K', pct: 23, color: colors.warning },
            { name: 'Marketing', cost: '$200K', pct: 12, color: colors.accentPurple },
          ].map((dept, i) => (
            <Card key={i} style={styles.costCard} padding="md">
              <View style={styles.costHeader}>
                <Text style={styles.costName}>{dept.name}</Text>
                <Text style={styles.costAmount}>{dept.cost}</Text>
              </View>
              <View style={styles.costBar}>
                <View style={[styles.costFill, { width: `${dept.pct}%`, backgroundColor: dept.color }]} />
              </View>
            </Card>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          {[
            { label: 'Revenue per Employee', value: '$285K', change: '+8%', positive: true },
            { label: 'Cost per Hire', value: '$4,200', change: '-12%', positive: true },
            { label: 'Time to Fill', value: '32 days', change: '-5 days', positive: true },
            { label: 'Offer Acceptance Rate', value: '89%', change: '+3%', positive: true },
          ].map((metric, i) => (
            <View key={i} style={styles.metricRow}>
              <Text style={styles.metricLabel}>{metric.label}</Text>
              <View style={styles.metricValues}>
                <Text style={styles.metricValue}>{metric.value}</Text>
                <Text style={[styles.metricChange, { color: metric.positive ? colors.success : colors.error }]}>{metric.change}</Text>
              </View>
            </View>
          ))}
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
  costCard: { marginBottom: spacing.sm },
  costHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  costName: { ...typography.body, color: colors.text, fontWeight: '600' },
  costAmount: { ...typography.body, color: colors.text, fontWeight: '700' },
  costBar: { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  costFill: { height: '100%', borderRadius: 3 },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, ...shadows.sm },
  metricLabel: { ...typography.body, color: colors.text, flex: 1 },
  metricValues: { alignItems: 'flex-end' },
  metricValue: { ...typography.body, color: colors.text, fontWeight: '600' },
  metricChange: { ...typography.caption, fontWeight: '600' },
});
