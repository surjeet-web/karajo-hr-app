import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card } from '../../components';
import { StatCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';
import { 
  getHeadcountMetrics,
  getDepartmentMetrics,
  getWorkforcePipeline,
  getFinancialMetrics
} from '../../services';
import { formatCurrency } from '../../utils/calculations';

export const CEOAnalyticsScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  useEffect(() => { hapticFeedback('medium'); }, []);

  const headcount = getHeadcountMetrics();
  const departmentMetrics = getDepartmentMetrics();
  const pipeline = getWorkforcePipeline();
  const financial = getFinancialMetrics();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Company Analytics" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <StatCard icon="trending-up" label="Headcount Growth" value={`${headcount.growth}%`} color={headcount.growth >= 0 ? colors.success : colors.error} delay={0} />
          <StatCard icon="trending-down" label="Attrition Rate" value={`${headcount.attrition}%`} color={colors.warning} delay={100} />
          <StatCard icon="people" label="Total Active" value={headcount.active.toString()} color={colors.primary} delay={200} />
          <StatCard icon="star" label="New Hires" value={headcount.newHires.toString()} trend="up" trendValue="+3" color={colors.accentPurple} delay={300} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Department Costs</Text>
          {departmentMetrics.map((dept, i) => {
            const pct = Math.round((dept.totalExpenses / financial.totalPayroll) * 100);
            const colorsList = [colors.primary, colors.success, colors.warning, colors.accentPurple, colors.accentPink, colors.info];
            return (
              <TouchableOpacity 
                key={dept.id} 
                onPress={() => { hapticFeedback('light'); navigation.navigate('DepartmentDetail', { department: dept }); }} 
                activeOpacity={0.7}
              >
                <Card style={styles.costCard} padding="md">
                  <View style={styles.costHeader}>
                    <Text style={styles.costName}>{dept.name}</Text>
                    <Text style={styles.costAmount}>{formatCurrency(dept.totalExpenses)}</Text>
                  </View>
                  <View style={styles.costBar}>
                    <View 
                      style={[
                        styles.costFill, 
                        { 
                          width: `${pct}%`, 
                          backgroundColor: colorsList[i % colorsList.length] 
                        }
                      ]} 
                    />
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          {[
            { label: 'Revenue per Employee', value: '$285K', change: '+8%', positive: true, screen: 'CEOFinancial' },
            { label: 'Cost per Hire', value: '$4,200', change: '-12%', positive: true, screen: 'WorkforcePlanning' },
            { label: 'Time to Fill', value: '32 days', change: '-5 days', positive: true, screen: 'WorkforcePlanning' },
            { label: 'Offer Acceptance Rate', value: '89%', change: '+3%', positive: true, screen: 'CEODiversity' },
          ].map((metric, i) => (
            <TouchableOpacity key={i} onPress={() => { hapticFeedback('light'); navigation.navigate(metric.screen); }} activeOpacity={0.7}>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <View style={styles.metricValues}>
                  <Text style={styles.metricValue}>{metric.value}</Text>
                  <Text style={[styles.metricChange, { color: metric.positive ? colors.success : colors.error }]}>{metric.change}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} style={{ marginLeft: 8 }} />
              </View>
            </TouchableOpacity>
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
