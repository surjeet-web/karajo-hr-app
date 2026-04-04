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

export const TeamReportsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Team Reports" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <StatCard icon="checkmark-circle" label="Attendance Rate" value="94%" trend="up" trendValue="+2%" color={colors.success} delay={0} />
          <StatCard icon="umbrella" label="Leave Used" value="62%" color={colors.warning} delay={100} />
          <StatCard icon="trending-up" label="Avg Performance" value="4.3" trend="up" trendValue="+0.2" color={colors.primary} delay={200} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Team Reports</Text>
          {[
            { title: 'Attendance Summary', desc: 'Monthly attendance overview', icon: 'calendar' },
            { title: 'Leave Utilization', desc: 'Team leave usage report', icon: 'umbrella' },
            { title: 'Performance Summary', desc: 'Team performance metrics', icon: 'trending-up' },
          ].map((report, i) => (
            <TouchableOpacity key={i} style={[styles.reportCard, shadows.sm]} onPress={() => hapticFeedback('medium')} activeOpacity={0.7}>
              <Ionicons name={report.icon} size={24} color={colors.primary} />
              <View style={styles.reportInfo}>
                <Text style={styles.reportTitle}>{report.title}</Text>
                <Text style={styles.reportDesc}>{report.desc}</Text>
              </View>
              <Ionicons name="download-outline" size={20} color={colors.textTertiary} />
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
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  reportCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.md },
  reportInfo: { flex: 1 },
  reportTitle: { ...typography.body, color: colors.text, fontWeight: '600' },
  reportDesc: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
});
