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

export const FinanceReportDetailScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Report Detail" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <StatCard icon="wallet" label="Total Spent" value="$1.23M" color={colors.primary} delay={0} />
          <StatCard icon="trending-up" label="Budget Used" value="83%" color={colors.warning} delay={100} />
          <StatCard icon="receipt" label="Expenses" value="156" color={colors.success} delay={200} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spending by Department</Text>
          {[
            { name: 'Engineering', spent: '$380K', budget: '$450K', pct: 84 },
            { name: 'Sales', spent: '$290K', budget: '$320K', pct: 91 },
            { name: 'Operations', spent: '$210K', budget: '$280K', pct: 75 },
            { name: 'Marketing', spent: '$165K', budget: '$200K', pct: 82 },
          ].map((dept, i) => (
            <Card key={dept.name} style={styles.deptCard} padding="md">
              <View style={styles.deptHeader}>
                <Text style={styles.deptName}>{dept.name}</Text>
                <Text style={styles.deptSpent}>{dept.spent} / {dept.budget}</Text>
              </View>
              <View style={styles.deptBar}>
                <View style={[styles.deptFill, { width: `${dept.pct}%`, backgroundColor: dept.pct > 90 ? colors.error : colors.success }]} />
              </View>
            </Card>
          ))}
        </View>

        <TouchableOpacity style={[styles.exportBtn, shadows.md]} onPress={() => hapticFeedback('medium')} activeOpacity={0.7}>
          <Ionicons name="download" size={20} color={colors.textInverse} />
          <Text style={styles.exportBtnText}>Export Report</Text>
        </TouchableOpacity>
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
  deptCard: { marginBottom: spacing.sm },
  deptHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  deptName: { ...typography.body, color: colors.text, fontWeight: '600' },
  deptSpent: { ...typography.bodySmall, color: colors.textSecondary },
  deptBar: { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  deptFill: { height: '100%', borderRadius: 3 },
  exportBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.primary, borderRadius: borderRadius.lg, padding: spacing.md },
  exportBtnText: { ...typography.button, color: colors.textInverse },
});
