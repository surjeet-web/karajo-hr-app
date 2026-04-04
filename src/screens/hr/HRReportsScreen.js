import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card } from '../../components';
import { hapticFeedback } from '../../utils/haptics';

const REPORTS = [
  { id: 1, title: 'Attendance Summary', desc: 'Monthly attendance overview', icon: 'calendar', color: colors.primary },
  { id: 2, title: 'Leave Utilization', desc: 'Leave balance and usage report', icon: 'umbrella', color: colors.warning },
  { id: 3, title: 'Headcount Report', desc: 'Employee count by department', icon: 'people', color: colors.success },
  { id: 4, title: 'Turnover Analysis', desc: 'Attrition trends and reasons', icon: 'trending-down', color: colors.error },
  { id: 5, title: 'Diversity Report', desc: 'Workforce diversity metrics', icon: 'globe', color: colors.accentPurple },
  { id: 6, title: 'Payroll Summary', desc: 'Monthly payroll breakdown', icon: 'wallet', color: colors.info },
];

export const HRReportsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="HR Reports" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Generate Reports</Text>
        {REPORTS.map((report, i) => (
          <TouchableOpacity key={report.id} style={[styles.reportCard, shadows.sm]} onPress={() => { hapticFeedback('medium'); }} activeOpacity={0.7}>
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
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  reportCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.md },
  reportIcon: { width: 48, height: 48, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center' },
  reportInfo: { flex: 1 },
  reportTitle: { ...typography.body, color: colors.text, fontWeight: '600' },
  reportDesc: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
});
