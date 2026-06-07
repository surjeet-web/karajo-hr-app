import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Card, Avatar } from '../../components';
import { StatCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';

const SUCCESSION_PLANS = [
  {
    role: 'CEO',
    incumbent: 'Current',
    readiness: 'N/A',
    candidates: [
      { name: 'Sarah Chen', currentRole: 'COO', readiness: 'Ready Now', score: 92 },
      { name: 'Michael Torres', currentRole: 'CFO', readiness: '1-2 Years', score: 78 },
    ],
  },
  {
    role: 'CTO',
    incumbent: 'James Wilson',
    readiness: 'Stable',
    candidates: [
      { name: 'David Park', currentRole: 'VP Engineering', readiness: 'Ready Now', score: 85 },
      { name: 'Lisa Wang', currentRole: 'Engineering Director', readiness: '2-3 Years', score: 68 },
    ],
  },
  {
    role: 'VP of Sales',
    incumbent: 'Robert Kim',
    readiness: 'At Risk',
    candidates: [
      { name: 'Jessica Lee', currentRole: 'Sales Director', readiness: 'Ready Now', score: 80 },
      { name: 'Ryan Scott', currentRole: 'Senior Account Exec', readiness: '1-2 Years', score: 62 },
    ],
  },
];

const RISK_METRICS = [
  { role: 'VP of Sales', risk: 'high', reason: 'Retirement eligible in 2027' },
  { role: 'Head of Design', risk: 'medium', reason: 'Market demand high, 2 competing offers' },
  { role: 'CFO', risk: 'low', reason: 'Strong engagement, no flight risk' },
];

export const CEOSuccessionScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const readyNow = SUCCESSION_PLANS.reduce((count, plan) => count + plan.candidates.filter(c => c.readiness === 'Ready Now').length, 0);
  const atRisk = RISK_METRICS.filter(r => r.risk === 'high').length;

  useEffect(() => { hapticFeedback('medium'); }, []);

  const riskColor = (risk: string) => {
    switch (risk) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.textTertiary;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Succession Planning" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <StatCard icon="people" label="Key Roles" value={SUCCESSION_PLANS.length.toString()} color={colors.primary} delay={0} />
          <StatCard icon="checkmark-circle" label="Ready Now" value={readyNow.toString()} color={colors.success} delay={100} />
        </View>
        <View style={styles.statsRow}>
          <StatCard icon="warning" label="At Risk" value={atRisk.toString()} color={colors.error} delay={200} />
          <StatCard icon="trending-up" label="Pipeline Health" value="74%" color={colors.accentPurple} delay={300} />
        </View>

        {/* Risk Alerts */}
        {RISK_METRICS.filter(r => r.risk === 'high' || r.risk === 'medium').length > 0 && (
          <Card style={styles.section} padding="lg">
            <View style={styles.sectionHeader}>
              <Ionicons name="warning" size={20} color={colors.warning} />
              <Text style={styles.sectionTitle}>Succession Risks</Text>
            </View>
            {RISK_METRICS.filter(r => r.risk === 'high' || r.risk === 'medium').map((risk, i) => (
              <View key={i} style={styles.riskRow}>
                <View style={[styles.riskDot, { backgroundColor: riskColor(risk.risk) }]} />
                <View style={styles.riskInfo}>
                  <Text style={styles.riskRole}>{risk.role}</Text>
                  <Text style={styles.riskReason}>{risk.reason}</Text>
                </View>
                <Text style={[styles.riskBadge, { color: riskColor(risk.risk) }]}>{risk.risk}</Text>
              </View>
            ))}
          </Card>
        )}

        {/* Succession Plans */}
        <Text style={styles.sectionTitle}>Succession Plans</Text>
        {SUCCESSION_PLANS.map((plan, i) => (
          <Card key={i} style={styles.planCard} padding="lg">
            <View style={styles.planHeader}>
              <View style={styles.planInfo}>
                <Text style={styles.planRole}>{plan.role}</Text>
                <Text style={styles.planIncumbent}>Incumbent: {plan.incumbent}</Text>
              </View>
              <View style={[styles.planStatus, { backgroundColor: plan.readiness === 'At Risk' ? colors.error + '15' : plan.readiness === 'Stable' ? colors.success + '15' : colors.border }]}>
                <Text style={[styles.planStatusText, { color: plan.readiness === 'At Risk' ? colors.error : plan.readiness === 'Stable' ? colors.success : colors.textSecondary }]}>
                  {plan.readiness}
                </Text>
              </View>
            </View>

            <Text style={styles.candidatesTitle}>Candidates</Text>
            {plan.candidates.map((candidate, j) => (
              <View key={j} style={styles.candidateRow}>
                <Avatar name={candidate.name.split(' ').map(n => n[0]).join('')} size="small" />
                <View style={styles.candidateInfo}>
                  <Text style={styles.candidateName}>{candidate.name}</Text>
                  <Text style={styles.candidateCurrentRole}>{candidate.currentRole}</Text>
                </View>
                <View style={styles.candidateRight}>
                  <Text style={styles.candidateScore}>{candidate.score}%</Text>
                  <Text style={[styles.candidateReadiness, { color: candidate.readiness === 'Ready Now' ? colors.success : colors.warning }]}>
                    {candidate.readiness}
                  </Text>
                </View>
              </View>
            ))}
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  section: { marginBottom: spacing.md },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  riskRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  riskDot: { width: 8, height: 8, borderRadius: 4 },
  riskInfo: { flex: 1 },
  riskRole: { ...typography.bodySmall, color: colors.text, fontWeight: '600' },
  riskReason: { ...typography.caption, color: colors.textSecondary },
  riskBadge: { ...typography.caption, fontWeight: '700', textTransform: 'uppercase' },
  planCard: { marginBottom: spacing.md },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md },
  planInfo: { flex: 1 },
  planRole: { ...typography.h5, color: colors.text },
  planIncumbent: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  planStatus: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: borderRadius.full },
  planStatusText: { ...typography.caption, fontWeight: '600' },
  candidatesTitle: { ...typography.label, color: colors.textSecondary, marginBottom: spacing.sm },
  candidateRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  candidateInfo: { flex: 1 },
  candidateName: { ...typography.bodySmall, color: colors.text, fontWeight: '600' },
  candidateCurrentRole: { ...typography.caption, color: colors.textSecondary },
  candidateRight: { alignItems: 'flex-end' },
  candidateScore: { ...typography.bodySmall, color: colors.text, fontWeight: '700' },
  candidateReadiness: { ...typography.caption, fontWeight: '500' },
});
