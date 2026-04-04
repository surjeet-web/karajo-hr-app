import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card, Badge } from '../../components';
import { StatCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';

const PAYROLL_RUNS = [
  { id: 1, month: 'February 2026', status: 'completed', total: '$485,200', employees: 247, processedOn: 'Mar 1' },
  { id: 2, month: 'January 2026', status: 'completed', total: '$478,500', employees: 245, processedOn: 'Feb 1' },
  { id: 3, month: 'December 2025', status: 'completed', total: '$492,100', employees: 243, processedOn: 'Jan 1' },
];

export const PayrollManagementScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 800); };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Payroll Management" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        <View style={styles.statsRow}>
          <StatCard icon="wallet" label="Total Payroll" value="$1.2M" color={colors.primary} delay={0} />
          <StatCard icon="people" label="Employees" value="247" color={colors.success} delay={100} />
          <StatCard icon="calendar" label="Next Run" value="Apr 1" color={colors.warning} delay={200} />
        </View>

        <TouchableOpacity style={[styles.runBtn, shadows.md]} onPress={() => hapticFeedback('heavy')} activeOpacity={0.7}>
          <Ionicons name="play-circle" size={24} color={colors.textInverse} />
          <Text style={styles.runBtnText}>Start New Payroll Run</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payroll History</Text>
          {PAYROLL_RUNS.map((run, i) => (
            <TouchableOpacity key={run.id} style={[styles.runCard, shadows.sm]} activeOpacity={0.7}>
              <View style={styles.runInfo}>
                <Text style={styles.runMonth}>{run.month}</Text>
                <Text style={styles.runDetails}>{run.employees} employees • Processed {run.processedOn}</Text>
              </View>
              <View style={styles.runAmount}>
                <Text style={styles.runTotal}>{run.total}</Text>
                <Badge text={run.status} variant="success" size="small" />
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
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  runBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.primary, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.lg },
  runBtnText: { ...typography.button, color: colors.textInverse },
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  runCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm },
  runInfo: { flex: 1 },
  runMonth: { ...typography.body, color: colors.text, fontWeight: '600' },
  runDetails: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  runAmount: { alignItems: 'flex-end', gap: spacing.xs },
  runTotal: { ...typography.h5, color: colors.success, fontWeight: '700' },
});
