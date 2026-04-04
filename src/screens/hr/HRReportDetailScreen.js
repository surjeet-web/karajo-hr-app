import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card } from '../../components';
import { StatCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';

export const HRReportDetailScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Report Detail" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <StatCard icon="people" label="Total Employees" value="247" color={colors.primary} delay={0} />
          <StatCard icon="checkmark-circle" label="Active" value="234" color={colors.success} delay={100} />
          <StatCard icon="calendar" label="On Leave" value="8" color={colors.warning} delay={200} />
          <StatCard icon="person-add" label="Onboarding" value="5" color={colors.accentPurple} delay={300} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Department Breakdown</Text>
          {[
            { name: 'Engineering', count: 89, pct: 36 },
            { name: 'Sales', count: 56, pct: 23 },
            { name: 'Operations', count: 42, pct: 17 },
            { name: 'Marketing', count: 34, pct: 14 },
            { name: 'Design', count: 18, pct: 7 },
            { name: 'HR', count: 8, pct: 3 },
          ].map((dept, i) => (
            <Card key={dept.name} style={styles.deptCard} padding="md">
              <View style={styles.deptHeader}>
                <Text style={styles.deptName}>{dept.name}</Text>
                <Text style={styles.deptCount}>{dept.count} employees</Text>
              </View>
              <View style={styles.deptBar}>
                <View style={[styles.deptFill, { width: `${dept.pct * 2.5}%`, backgroundColor: colors.primary }]} />
              </View>
            </Card>
          ))}
        </View>

        <TouchableOpacity style={[styles.exportBtn, shadows.md]} onPress={() => hapticFeedback('medium')} activeOpacity={0.7}>
          <Ionicons name="download" size={20} color={colors.textInverse} />
          <Text style={styles.exportBtnText}>Export as PDF</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.lg },
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  deptCard: { marginBottom: spacing.sm },
  deptHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  deptName: { ...typography.body, color: colors.text, fontWeight: '600' },
  deptCount: { ...typography.bodySmall, color: colors.textSecondary },
  deptBar: { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  deptFill: { height: '100%', borderRadius: 3 },
  exportBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.primary, borderRadius: borderRadius.lg, padding: spacing.md },
  exportBtnText: { ...typography.button, color: colors.textInverse },
});
