import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card, Badge } from '../../components';
import { StatCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';

const OFFBOARDING = [
  { id: 1, name: 'John Doe', role: 'Software Engineer', department: 'Engineering', lastDay: 'Mar 15, 2024', reason: 'Resignation', status: 'in-progress', progress: 60 },
  { id: 2, name: 'Jane Smith', role: 'Marketing Manager', department: 'Marketing', lastDay: 'Feb 28, 2024', reason: 'End of Contract', status: 'completed', progress: 100 },
];

export const HROffboardingScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Offboarding" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <StatCard icon="exit" label="Active" value={OFFBOARDING.filter(o => o.status === 'in-progress').length} color={colors.warning} delay={0} />
          <StatCard icon="checkmark-circle" label="Completed" value={OFFBOARDING.filter(o => o.status === 'completed').length} color={colors.success} delay={100} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exit Checklist</Text>
          {[
            { category: 'Asset Recovery', items: ['Laptop returned', 'Access badge collected', 'Company phone returned', 'Parking pass returned'] },
            { category: 'Final Settlement', items: ['Last paycheck processed', 'PTO payout calculated', 'Benefits termination', '401k rollover info'] },
            { category: 'Knowledge Transfer', items: ['Documentation updated', 'Handover meeting scheduled', 'Project status documented', 'Client contacts transferred'] },
            { category: 'Exit Interview', items: ['Interview scheduled', 'Feedback collected', 'NDA reminder sent', 'Alumni network invite'] },
          ].map((section, i) => (
            <Card key={i} style={styles.checklistCard} padding="md">
              <Text style={styles.checklistCategory}>{section.category}</Text>
              {section.items.map((item, j) => (
                <View key={j} style={styles.checklistItem}>
                  <Ionicons name={j < 1 ? 'checkmark-circle' : 'ellipse-outline'} size={18} color={j < 1 ? colors.success : colors.textTertiary} />
                  <Text style={[styles.checklistText, j < 1 && styles.checklistDone]}>{item}</Text>
                </View>
              ))}
            </Card>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Offboarding</Text>
          {OFFBOARDING.map((emp, i) => (
            <Card key={emp.id} style={styles.empCard} padding="md">
              <View style={styles.empHeader}>
                <View>
                  <Text style={styles.empName}>{emp.name}</Text>
                  <Text style={styles.empRole}>{emp.role} • {emp.department}</Text>
                </View>
                <Badge text={emp.status} variant={emp.status === 'completed' ? 'success' : 'warning'} size="small" />
              </View>
              <Text style={styles.empLastDay}>Last Day: {emp.lastDay}</Text>
              <Text style={styles.empReason}>Reason: {emp.reason}</Text>
              <View style={styles.progressRow}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${emp.progress}%`, backgroundColor: emp.progress === 100 ? colors.success : colors.primary }]} />
                </View>
                <Text style={styles.progressText}>{emp.progress}%</Text>
              </View>
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
  checklistCard: { marginBottom: spacing.sm },
  checklistCategory: { ...typography.body, color: colors.text, fontWeight: '600', marginBottom: spacing.sm },
  checklistItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xs },
  checklistText: { ...typography.bodySmall, color: colors.text },
  checklistDone: { textDecorationLine: 'line-through', color: colors.textTertiary },
  empCard: { marginBottom: spacing.sm },
  empHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm },
  empName: { ...typography.body, color: colors.text, fontWeight: '600' },
  empRole: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  empLastDay: { ...typography.bodySmall, color: colors.textSecondary },
  empReason: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  progressBar: { flex: 1, height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  progressText: { ...typography.caption, color: colors.textSecondary, fontWeight: '600', width: 35, textAlign: 'right' },
});
