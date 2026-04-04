import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card, Badge } from '../../components';
import { hapticFeedback } from '../../utils/haptics';

const POLICIES = [
  { id: 1, title: 'Leave Policy', category: 'HR', version: 'v2.1', updated: 'Jan 15, 2024', acknowledged: 234, total: 247 },
  { id: 2, title: 'Remote Work Policy', category: 'HR', version: 'v1.3', updated: 'Feb 01, 2024', acknowledged: 198, total: 247 },
  { id: 3, title: 'Expense Policy', category: 'Finance', version: 'v3.0', updated: 'Dec 20, 2023', acknowledged: 247, total: 247 },
  { id: 4, title: 'Code of Conduct', category: 'Compliance', version: 'v2.0', updated: 'Nov 10, 2023', acknowledged: 247, total: 247 },
  { id: 5, title: 'IT Security Policy', category: 'IT', version: 'v1.5', updated: 'Jan 30, 2024', acknowledged: 210, total: 247 },
];

export const HRPolicyManagementScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Policy Management" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={[styles.createBtn, shadows.md]} onPress={() => hapticFeedback('medium')} activeOpacity={0.7}>
          <Ionicons name="add-circle" size={24} color={colors.textInverse} />
          <Text style={styles.createBtnText}>Create New Policy</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Company Policies</Text>
          {POLICIES.map((policy, i) => (
            <TouchableOpacity key={policy.id} style={[styles.policyCard, shadows.sm]} onPress={() => hapticFeedback('medium')} activeOpacity={0.7}>
              <View style={styles.policyHeader}>
                <View style={styles.policyInfo}>
                  <Text style={styles.policyTitle}>{policy.title}</Text>
                  <Text style={styles.policyMeta}>{policy.category} • {policy.version} • Updated {policy.updated}</Text>
                </View>
                <Badge text={policy.acknowledged === policy.total ? 'Complete' : 'Pending'} variant={policy.acknowledged === policy.total ? 'success' : 'warning'} size="small" />
              </View>
              <View style={styles.ackRow}>
                <Text style={styles.ackText}>{policy.acknowledged}/{policy.total} acknowledged</Text>
                <View style={styles.ackBar}>
                  <View style={[styles.ackFill, { width: `${(policy.acknowledged / policy.total) * 100}%`, backgroundColor: policy.acknowledged === policy.total ? colors.success : colors.primary }]} />
                </View>
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
  createBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.primary, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.lg },
  createBtnText: { ...typography.button, color: colors.textInverse },
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  policyCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm },
  policyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm },
  policyInfo: { flex: 1 },
  policyTitle: { ...typography.body, color: colors.text, fontWeight: '600' },
  policyMeta: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
  ackRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  ackText: { ...typography.caption, color: colors.textSecondary, width: 120 },
  ackBar: { flex: 1, height: 4, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden' },
  ackFill: { height: '100%', borderRadius: 2 },
});
