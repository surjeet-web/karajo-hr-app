import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card, Badge } from '../../components';
import { StatCard } from '../../components/management';

export const WorkforcePlanningScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Workforce Planning" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <StatCard icon="people" label="Current" value="247" color={colors.primary} delay={0} />
          <StatCard icon="trending-up" label="Target" value="280" color={colors.success} delay={100} />
          <StatCard icon="briefcase" label="To Hire" value="33" color={colors.warning} delay={200} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hiring Pipeline</Text>
          {[
            { role: 'Senior Backend Engineer', department: 'Engineering', stage: 'Interview', candidates: 5 },
            { role: 'Product Designer', department: 'Design', stage: 'Screening', candidates: 12 },
            { role: 'Sales Manager', department: 'Sales', stage: 'Offer', candidates: 2 },
            { role: 'Marketing Analyst', department: 'Marketing', stage: 'Sourcing', candidates: 20 },
          ].map((position, i) => (
            <Card key={i} style={styles.positionCard} padding="md">
              <View style={styles.positionHeader}>
                <Text style={styles.positionRole}>{position.role}</Text>
                <Badge text={position.stage} variant={position.stage === 'Offer' ? 'success' : position.stage === 'Interview' ? 'primary' : 'warning'} size="small" />
              </View>
              <Text style={styles.positionDept}>{position.department} • {position.candidates} candidates</Text>
            </Card>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills Gap Analysis</Text>
          {[
            { skill: 'Cloud Architecture', gap: 'High', needed: 3 },
            { skill: 'Data Science', gap: 'Medium', needed: 2 },
            { skill: 'DevOps', gap: 'Low', needed: 1 },
          ].map((gap, i) => (
            <Card key={i} style={styles.gapCard} padding="md">
              <View style={styles.gapRow}>
                <Text style={styles.gapSkill}>{gap.skill}</Text>
                <Badge text={gap.gap} variant={gap.gap === 'High' ? 'error' : gap.gap === 'Medium' ? 'warning' : 'success'} size="small" />
              </View>
              <Text style={styles.gapNeeded}>{gap.needed} positions needed</Text>
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
  positionCard: { marginBottom: spacing.sm },
  positionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  positionRole: { ...typography.body, color: colors.text, fontWeight: '600' },
  positionDept: { ...typography.bodySmall, color: colors.textSecondary },
  gapCard: { marginBottom: spacing.sm },
  gapRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  gapSkill: { ...typography.body, color: colors.text, fontWeight: '600' },
  gapNeeded: { ...typography.bodySmall, color: colors.textSecondary },
});
