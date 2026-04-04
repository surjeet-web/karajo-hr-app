import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header } from '../../components';
import { StatCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';

export const FinanceReportsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const reports = [
    { title: 'Payroll Report', desc: 'Monthly payroll breakdown', icon: 'card', color: colors.primary },
    { title: 'Expense Report', desc: 'All expense claims summary', icon: 'receipt', color: colors.success },
    { title: 'Budget Report', desc: 'Department budget vs actual', icon: 'wallet', color: colors.warning },
    { title: 'Tax Report', desc: 'Tax filings and compliance', icon: 'document-text', color: colors.accentPurple },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Finance Reports" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <StatCard icon="wallet" label="Total Spent" value="$1.2M" color={colors.primary} delay={0} />
          <StatCard icon="trending-up" label="Budget Used" value="78%" color={colors.warning} delay={100} />
        </View>

        {reports.map((report, i) => (
          <TouchableOpacity key={i} style={[styles.reportCard, shadows.sm]} onPress={() => hapticFeedback('medium')} activeOpacity={0.7}>
            <View style={[styles.reportIcon, { backgroundColor: `${report.color}15` }]}>
              <Ionicons name={report.icon} size={24} color={report.color} />
            </View>
            <View style={styles.reportInfo}>
              <Text style={styles.reportTitle}>{report.title}</Text>
              <Text style={styles.reportDesc}>{report.desc}</Text>
            </View>
            <Ionicons name="download-outline" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  reportCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.md },
  reportIcon: { width: 48, height: 48, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center' },
  reportInfo: { flex: 1 },
  reportTitle: { ...typography.body, color: colors.text, fontWeight: '600' },
  reportDesc: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
});
