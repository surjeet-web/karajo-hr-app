import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card, Badge } from '../../components';
import { StatCard } from '../../components/management';

export const HRComplianceScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Compliance" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <StatCard icon="shield-checkmark" label="Compliance Score" value="94%" color={colors.success} delay={0} />
          <StatCard icon="warning" label="Open Issues" value="3" color={colors.warning} delay={100} />
          <StatCard icon="document-text" label="Audits" value="12" color={colors.primary} delay={200} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compliance Items</Text>
          {[
            { title: 'I-9 Verification', status: 'compliant', desc: 'All employee I-9 forms up to date', icon: 'checkmark-circle', color: colors.success },
            { title: 'EEOC Reporting', status: 'pending', desc: 'Annual report due Mar 31, 2024', icon: 'time', color: colors.warning },
            { title: 'OSHA Compliance', status: 'compliant', desc: 'Workplace safety standards met', icon: 'checkmark-circle', color: colors.success },
            { title: 'FLSA Classification', status: 'compliant', desc: 'All employees properly classified', icon: 'checkmark-circle', color: colors.success },
            { title: 'Benefits Compliance', status: 'review', desc: 'ACA reporting review needed', icon: 'warning', color: colors.warning },
            { title: 'Data Privacy (GDPR)', status: 'compliant', desc: 'EU employee data protected', icon: 'checkmark-circle', color: colors.success },
          ].map((item, i) => (
            <Card key={i} style={styles.complianceCard} padding="md">
              <View style={styles.complianceRow}>
                <Ionicons name={item.icon} size={24} color={item.color} />
                <View style={styles.complianceInfo}>
                  <Text style={styles.complianceTitle}>{item.title}</Text>
                  <Text style={styles.complianceDesc}>{item.desc}</Text>
                </View>
                <Badge text={item.status} variant={item.status === 'compliant' ? 'success' : 'warning'} size="small" />
              </View>
            </Card>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Audit Log</Text>
          {[
            { action: 'Policy Updated', by: 'HR Manager', date: 'Feb 25, 2024', type: 'info' },
            { action: 'I-9 Audit Completed', by: 'System', date: 'Feb 20, 2024', type: 'success' },
            { action: 'Compliance Review', by: 'HR Specialist', date: 'Feb 15, 2024', type: 'info' },
          ].map((log, i) => (
            <View key={i} style={styles.logRow}>
              <Ionicons name={log.type === 'success' ? 'checkmark-circle' : 'information-circle'} size={18} color={log.type === 'success' ? colors.success : colors.info} />
              <View style={styles.logInfo}>
                <Text style={styles.logAction}>{log.action}</Text>
                <Text style={styles.logMeta}>{log.by} • {log.date}</Text>
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
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  complianceCard: { marginBottom: spacing.sm },
  complianceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  complianceInfo: { flex: 1 },
  complianceTitle: { ...typography.body, color: colors.text, fontWeight: '600' },
  complianceDesc: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  logRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  logInfo: { flex: 1 },
  logAction: { ...typography.bodySmall, color: colors.text, fontWeight: '500' },
  logMeta: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
});
