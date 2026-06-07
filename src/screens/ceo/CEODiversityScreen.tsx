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

const DIVERSITY_METRICS = [
  { label: 'Gender Diversity', value: '42% Women', progress: 42, target: 50 },
  { label: 'Leadership Diversity', value: '35% Women', progress: 35, target: 40 },
  { label: 'Ethnic Diversity', value: '38% Underrepresented', progress: 38, target: 45 },
  { label: 'Age Diversity', value: 'Avg 34.2 years', progress: 65, target: 70 },
];

const DEPT_BREAKDOWN = [
  { dept: 'Engineering', total: 89, men: 62, women: 24, other: 3 },
  { dept: 'Design', total: 24, men: 8, women: 14, other: 2 },
  { dept: 'Marketing', total: 32, men: 12, women: 18, other: 2 },
  { dept: 'Sales', total: 45, men: 28, women: 15, other: 2 },
  { dept: 'Finance', total: 18, men: 7, women: 10, other: 1 },
  { dept: 'HR', total: 15, men: 3, women: 11, other: 1 },
];

const INCLUSION_SCORES = [
  { metric: 'Belonging Index', score: 82, trend: '+3' },
  { metric: 'Fairness Index', score: 78, trend: '+5' },
  { metric: 'Growth Opportunity', score: 74, trend: '+2' },
  { metric: 'Voice & Input', score: 80, trend: '+4' },
];

export const CEODiversityScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const totalEmployees = DEPT_BREAKDOWN.reduce((s, d) => s + d.total, 0);
  const totalWomen = DEPT_BREAKDOWN.reduce((s, d) => s + d.women, 0);
  const womenPct = Math.round((totalWomen / totalEmployees) * 100);

  useEffect(() => { hapticFeedback('medium'); }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Diversity & Inclusion" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <StatCard icon="people" label="Total" value={totalEmployees.toString()} color={colors.primary} delay={0} />
          <StatCard icon="female" label="Women" value={`${womenPct}%`} color={colors.accentPurple} delay={100} />
        </View>
        <View style={styles.statsRow}>
          <StatCard icon="shield-checkmark" label="Inclusion Score" value="79" color={colors.success} delay={200} />
          <StatCard icon="trending-up" label="YoY Change" value="+4%" color={colors.info} delay={300} />
        </View>

        <Card style={styles.section} padding="lg">
          <Text style={styles.sectionTitle}>Diversity Targets</Text>
          {DIVERSITY_METRICS.map((m, i) => (
            <View key={i} style={styles.metricRow}>
              <View style={styles.metricInfo}>
                <Text style={styles.metricLabel}>{m.label}</Text>
                <Text style={styles.metricValue}>{m.value}</Text>
              </View>
              <View style={styles.progressContainer}>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${m.progress}%`, backgroundColor: m.progress >= m.target ? colors.success : colors.primary }]} />
                </View>
                <Text style={styles.targetText}>Target: {m.target}%</Text>
              </View>
            </View>
          ))}
        </Card>

        <Card style={styles.section} padding="lg">
          <Text style={styles.sectionTitle}>Department Breakdown</Text>
          {DEPT_BREAKDOWN.map((d, i) => (
            <View key={i} style={styles.deptRow}>
              <Text style={styles.deptName}>{d.dept}</Text>
              <View style={styles.deptBars}>
                <View style={styles.barSegment}>
                  <View style={[styles.barPiece, { width: `${(d.men / d.total) * 100}%`, backgroundColor: colors.primary }]} />
                </View>
                <View style={styles.barSegment}>
                  <View style={[styles.barPiece, { width: `${(d.women / d.total) * 100}%`, backgroundColor: colors.accentPurple }]} />
                </View>
              </View>
              <Text style={styles.deptCount}>{d.total}</Text>
            </View>
          ))}
          <View style={styles.legend}>
            <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: colors.primary }]} /><Text style={styles.legendText}>Men</Text></View>
            <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: colors.accentPurple }]} /><Text style={styles.legendText}>Women</Text></View>
          </View>
        </Card>

        <Card style={styles.section} padding="lg">
          <Text style={styles.sectionTitle}>Inclusion Scores</Text>
          {INCLUSION_SCORES.map((s, i) => (
            <View key={i} style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>{s.metric}</Text>
              <View style={styles.scoreRight}>
                <Text style={styles.scoreValue}>{s.score}</Text>
                <Text style={styles.scoreTrend}>+{s.trend}</Text>
              </View>
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
  metricRow: { marginBottom: spacing.md },
  metricInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  metricLabel: { ...typography.bodySmall, color: colors.text, fontWeight: '500' },
  metricValue: { ...typography.bodySmall, color: colors.textSecondary },
  progressContainer: { gap: 4 },
  targetText: { ...typography.caption, color: colors.textTertiary },
  deptRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, gap: spacing.sm },
  deptName: { ...typography.bodySmall, color: colors.text, width: 80 },
  deptBars: { flex: 1, gap: 2 },
  barSegment: { height: 8, borderRadius: 4, overflow: 'hidden', backgroundColor: colors.border },
  barPiece: { height: '100%', borderRadius: 4 },
  deptCount: { ...typography.bodySmall, color: colors.textSecondary, width: 30, textAlign: 'right' },
  legend: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md, justifyContent: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { ...typography.caption, color: colors.textSecondary },
  progressTrack: { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden', marginBottom: 4 },
  progressFill: { height: '100%', borderRadius: 3 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  scoreLabel: { ...typography.bodySmall, color: colors.text },
  scoreRight: { alignItems: 'flex-end' },
  scoreValue: { ...typography.bodySmall, color: colors.text, fontWeight: '600' },
  scoreTrend: { ...typography.caption, color: colors.success },
});
