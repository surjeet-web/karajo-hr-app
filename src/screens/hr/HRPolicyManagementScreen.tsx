import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card, Badge } from '../../components';
import { StatCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';
import { getState, subscribe } from '../../store';

export const HRPolicyManagementScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [state, setStateLocal] = useState(getState());
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    const unsub = subscribe(setStateLocal);
    return unsub;
  }, []);

  const onRefresh = (): void => {
    setRefreshing(true);
    setStateLocal(getState());
    setRefreshing(false);
  };

  const employees = state.employees || [];
  const activeEmployees = employees.filter(e => e.status === 'active').length;

  const [policies, setPolicies] = useState([
    { id: 1, title: 'Leave Policy', category: 'HR', version: 'v2.1', updated: 'Jan 15, 2026', acknowledged: Math.floor(activeEmployees * 0.95), total: activeEmployees },
    { id: 2, title: 'Remote Work Policy', category: 'HR', version: 'v1.3', updated: 'Feb 01, 2026', acknowledged: Math.floor(activeEmployees * 0.8), total: activeEmployees },
    { id: 3, title: 'Expense Policy', category: 'Finance', version: 'v3.0', updated: 'Dec 20, 2025', acknowledged: activeEmployees, total: activeEmployees },
    { id: 4, title: 'Code of Conduct', category: 'Compliance', version: 'v2.0', updated: 'Nov 10, 2025', acknowledged: activeEmployees, total: activeEmployees },
    { id: 5, title: 'IT Security Policy', category: 'IT', version: 'v1.5', updated: 'Jan 30, 2026', acknowledged: Math.floor(activeEmployees * 0.85), total: activeEmployees },
    { id: 6, title: 'Attendance Policy', category: 'HR', version: 'v1.0', updated: 'Mar 01, 2026', acknowledged: Math.floor(activeEmployees * 0.6), total: activeEmployees },
  ]);

  const completeCount = policies.filter(p => p.acknowledged === p.total).length;
  const pendingCount = policies.filter(p => p.acknowledged < p.total).length;

  const handleCreatePolicy = (): void => {
    hapticFeedback('medium');
    Alert.prompt('Create Policy', 'Enter policy title:', (title) => {
      if (title) {
        Alert.prompt('Category', 'Enter category (HR/Finance/IT/Compliance):', (category) => {
          if (category) {
            const newPolicy = {
              id: Date.now(),
              title,
              category: category || 'HR',
              version: 'v1.0',
              updated: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
              acknowledged: 0,
              total: activeEmployees,
            };
            setPolicies(prev => [newPolicy, ...prev]);
            hapticFeedback('success');
            Alert.alert('Success', `Policy "${title}" has been created.`);
          }
        });
      }
    });
  };

  const handlePublishPolicy = (policy) => {
    hapticFeedback('medium');
    Alert.alert(
      'Publish Policy',
      `Publish ${policy.title} to all ${activeEmployees} employees?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Publish',
          onPress: () => {
            setPolicies(prev => prev.map(p =>
              p.id === policy.id ? { ...p, version: `v${parseFloat(p.version.slice(1)) + 0.1}.0`, updated: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) } : p
            ));
            hapticFeedback('success');
            Alert.alert('Published', `${policy.title} has been published to all employees.`);
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Policy Management" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        <View style={styles.statsRow}>
          <StatCard icon="document-text" label="Policies" value={policies.length.toString()} color={colors.primary} delay={0} />
          <StatCard icon="checkmark-circle" label="Complete" value={completeCount.toString()} color={colors.success} delay={100} />
          <StatCard icon="hourglass" label="Pending" value={pendingCount.toString()} color={colors.warning} delay={200} />
        </View>

        <TouchableOpacity style={[styles.createBtn, shadows.md]} onPress={handleCreatePolicy} activeOpacity={0.7}>
          <Ionicons name="add-circle" size={24} color={colors.textInverse} />
          <Text style={styles.createBtnText}>Create New Policy</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Company Policies ({policies.length})</Text>
          {policies.map((policy, i) => {
            const ackPct = policy.total > 0 ? Math.round((policy.acknowledged / policy.total) * 100) : 0;
            return (
              <TouchableOpacity key={policy.id} style={[styles.policyCard, shadows.sm]} onPress={() => handlePublishPolicy(policy)} activeOpacity={0.7}>
                <View style={styles.policyHeader}>
                  <View style={styles.policyInfo}>
                    <Text style={styles.policyTitle}>{policy.title}</Text>
                    <Text style={styles.policyMeta}>{policy.category} - {policy.version} - Updated {policy.updated}</Text>
                  </View>
                  <Badge text={policy.acknowledged === policy.total ? 'Complete' : `${ackPct}%`} variant={policy.acknowledged === policy.total ? 'success' : 'warning'} size="small" />
                </View>
                <View style={styles.ackRow}>
                  <Text style={styles.ackText}>{policy.acknowledged}/{policy.total} acknowledged</Text>
                  <View style={styles.ackBar}>
                    <View style={[styles.ackFill, { width: `${ackPct}%`, backgroundColor: ackPct === 100 ? colors.success : colors.primary }]} />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
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
