import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Card, Badge } from '../../components';
import { StatCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';

const COMPLIANCE_ITEMS = [
  { category: 'Labor Law', status: 'compliant', lastAudit: 'Jan 15, 2026', nextAudit: 'Jul 15, 2026', score: 96 },
  { category: 'Data Privacy (GDPR)', status: 'compliant', lastAudit: 'Feb 20, 2026', nextAudit: 'Aug 20, 2026', score: 94 },
  { category: 'Workplace Safety (OSHA)', status: 'warning', lastAudit: 'Dec 10, 2025', nextAudit: 'Jun 10, 2026', score: 82 },
  { category: 'Equal Employment', status: 'compliant', lastAudit: 'Mar 5, 2026', nextAudit: 'Sep 5, 2026', score: 98 },
  { category: 'Benefits Compliance', status: 'compliant', lastAudit: 'Jan 28, 2026', nextAudit: 'Jul 28, 2026', score: 91 },
  { category: 'Tax & Payroll', status: 'at-risk', lastAudit: 'Nov 15, 2025', nextAudit: 'May 15, 2026', score: 68 },
];

const RISK_ITEMS = [
  { title: 'Payroll Tax Filing Delay', severity: 'high', desc: 'Q4 2025 state tax filing overdue', action: 'File immediately' },
  { title: 'OSHA Inspection Due', severity: 'medium', desc: 'Annual safety inspection overdue for Warehouse B', action: 'Schedule inspection' },
  { title: 'Policy Update Required', severity: 'low', desc: 'Remote work policy needs annual review', action: 'Update policy' },
];

const AUDIT_LOG = [
  { date: 'Mar 5, 2026', type: 'Equal Employment', result: 'Passed', score: 98 },
  { date: 'Feb 20, 2026', type: 'Data Privacy', result: 'Passed', score: 94 },
  { date: 'Jan 28, 2026', type: 'Benefits', result: 'Passed', score: 91 },
  { date: 'Jan 15, 2026', type: 'Labor Law', result: 'Passed', score: 96 },
];

export const CEOComplianceScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const compliantCount = COMPLIANCE_ITEMS.filter(c => c.status === 'compliant').length;
  const avgScore = Math.round(COMPLIANCE_ITEMS.reduce((s, c) => s + c.score, 0) / COMPLIANCE_ITEMS.length);

  useEffect(() => { hapticFeedback('medium'); }, []);

  const statusColor = (status: string) => {
    switch (status) {
      case 'compliant': return colors.success;
      case 'warning': return colors.warning;
      case 'at-risk': return colors.error;
      default: return colors.textTertiary;
    }
  };

  const severityColor = (sev: string) => {
    switch (sev) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.info;
      default: return colors.textTertiary;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Compliance & Risk" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <StatCard icon="shield-checkmark" label="Compliance Rate" value={`${compliantCount}/${COMPLIANCE_ITEMS.length}`} color={colors.success} delay={0} />
          <StatCard icon="star" label="Avg Score" value={`${avgScore}%`} color={colors.primary} delay={100} />
        </View>

        {/* Risk Alerts */}
        {RISK_ITEMS.length > 0 && (
          <Card style={styles.section} padding="lg">
            <View style={styles.sectionHeader}>
              <Ionicons name="warning" size={20} color={colors.error} />
              <Text style={styles.sectionTitle}>Active Risks ({RISK_ITEMS.length})</Text>
            </View>
            {RISK_ITEMS.map((risk, i) => (
              <View key={i} style={styles.riskCard}>
                <View style={[styles.severityDot, { backgroundColor: severityColor(risk.severity) }]} />
                <View style={styles.riskInfo}>
                  <Text style={styles.riskTitle}>{risk.title}</Text>
                  <Text style={styles.riskDesc}>{risk.desc}</Text>
                  <Text style={[styles.riskAction, { color: severityColor(risk.severity) }]}>{risk.action}</Text>
                </View>
                <Badge text={risk.severity} variant={risk.severity === 'high' ? 'error' : risk.severity === 'medium' ? 'warning' : 'info'} />
              </View>
            ))}
          </Card>
        )}

        {/* Compliance Categories */}
        <Card style={styles.section} padding="lg">
          <Text style={styles.sectionTitle}>Compliance Categories</Text>
          {COMPLIANCE_ITEMS.map((item, i) => (
            <View key={i} style={styles.complianceRow}>
              <View style={styles.complianceInfo}>
                <Text style={styles.complianceName}>{item.category}</Text>
                <Text style={styles.complianceDate}>Next audit: {item.nextAudit}</Text>
              </View>
              <View style={styles.complianceRight}>
                <Text style={[styles.complianceScore, { color: statusColor(item.status) }]}>{item.score}%</Text>
                <View style={[styles.statusDot, { backgroundColor: statusColor(item.status) }]} />
              </View>
            </View>
          ))}
        </Card>

        {/* Recent Audit Log */}
        <Card style={styles.section} padding="lg">
          <Text style={styles.sectionTitle}>Recent Audits</Text>
          {AUDIT_LOG.map((log, i) => (
            <View key={i} style={styles.auditRow}>
              <View style={styles.auditIcon}>
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              </View>
              <View style={styles.auditInfo}>
                <Text style={styles.auditType}>{log.type}</Text>
                <Text style={styles.auditDate}>{log.date}</Text>
              </View>
              <Text style={styles.auditScore}>{log.score}%</Text>
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
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  sectionTitle: { ...typography.h5, color: colors.text },
  riskCard: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  severityDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  riskInfo: { flex: 1 },
  riskTitle: { ...typography.bodySmall, color: colors.text, fontWeight: '600' },
  riskDesc: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  riskAction: { ...typography.caption, fontWeight: '600', marginTop: 4 },
  complianceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  complianceInfo: { flex: 1 },
  complianceName: { ...typography.bodySmall, color: colors.text, fontWeight: '500' },
  complianceDate: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
  complianceRight: { alignItems: 'flex-end', gap: 4 },
  complianceScore: { ...typography.bodySmall, fontWeight: '700' },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  auditRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  auditIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.success + '15', justifyContent: 'center', alignItems: 'center' },
  auditInfo: { flex: 1 },
  auditType: { ...typography.bodySmall, color: colors.text, fontWeight: '500' },
  auditDate: { ...typography.caption, color: colors.textTertiary },
  auditScore: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: '600' },
});
