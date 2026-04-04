import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card, ProgressBar } from '../../components';
import { StatCard } from '../../components/management';

export const CompanyGoalsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const goals = [
    { title: 'Increase Revenue by 25%', progress: 68, deadline: 'Dec 31, 2026', priority: 'high', department: 'Company-wide' },
    { title: 'Reduce Attrition to < 5%', progress: 45, deadline: 'Jun 30, 2026', priority: 'high', department: 'HR' },
    { title: 'Launch New Product Line', progress: 32, deadline: 'Sep 30, 2026', priority: 'medium', department: 'Engineering' },
    { title: 'Expand to 2 New Markets', progress: 15, deadline: 'Dec 31, 2026', priority: 'medium', department: 'Sales' },
    { title: 'Achieve 90% Employee Satisfaction', progress: 78, deadline: 'Dec 31, 2026', priority: 'low', department: 'HR' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Company Goals" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <StatCard icon="flag" label="Total Goals" value="5" color={colors.primary} delay={0} />
          <StatCard icon="checkmark-circle" label="On Track" value="3" color={colors.success} delay={100} />
          <StatCard icon="warning" label="At Risk" value="2" color={colors.warning} delay={200} />
        </View>

        {goals.map((goal, i) => (
          <Card key={i} style={styles.goalCard} padding="md">
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>{goal.title}</Text>
              <View style={[styles.priorityDot, { backgroundColor: goal.priority === 'high' ? colors.error : goal.priority === 'medium' ? colors.warning : colors.success }]} />
            </View>
            <Text style={styles.goalDept}>{goal.department} • Due {goal.deadline}</Text>
            <View style={styles.progressRow}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${goal.progress}%`, backgroundColor: goal.progress >= 60 ? colors.success : goal.progress >= 30 ? colors.warning : colors.error }]} />
              </View>
              <Text style={styles.progressText}>{goal.progress}%</Text>
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
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  goalCard: { marginBottom: spacing.sm },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  goalTitle: { ...typography.body, color: colors.text, fontWeight: '600', flex: 1 },
  priorityDot: { width: 10, height: 10, borderRadius: 5 },
  goalDept: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.sm },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  progressBar: { flex: 1, height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  progressText: { ...typography.caption, color: colors.textSecondary, fontWeight: '600', width: 35, textAlign: 'right' },
});
