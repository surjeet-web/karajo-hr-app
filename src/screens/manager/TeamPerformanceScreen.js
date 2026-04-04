import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card } from '../../components';
import { StatCard } from '../../components/management';

export const TeamPerformanceScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Team Performance" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <StatCard icon="star" label="Avg Rating" value="4.3" trend="up" trendValue="+0.2" color={colors.warning} delay={0} />
          <StatCard icon="trending-up" label="Avg KPI" value="89" trend="up" trendValue="+3" color={colors.success} delay={100} />
          <StatCard icon="clipboard" label="Reviews Due" value="3" color={colors.primary} delay={200} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Team KPIs</Text>
          {[
            { name: 'Code Quality', target: '95%', current: '92%', status: 'on-track' },
            { name: 'Sprint Completion', target: '90%', current: '88%', status: 'on-track' },
            { name: 'Bug Resolution', target: '< 24h', current: '18h', status: 'exceeding' },
            { name: 'Team Collaboration', target: '4.0/5', current: '4.5/5', status: 'exceeding' },
          ].map((kpi, i) => (
            <Card key={i} style={styles.kpiCard} padding="md">
              <View style={styles.kpiHeader}>
                <Text style={styles.kpiName}>{kpi.name}</Text>
                <Text style={[styles.kpiStatus, { color: kpi.status === 'exceeding' ? colors.success : colors.primary }]}>{kpi.status}</Text>
              </View>
              <Text style={styles.kpiValues}>Current: {kpi.current} / Target: {kpi.target}</Text>
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
  kpiCard: { marginBottom: spacing.sm },
  kpiHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  kpiName: { ...typography.body, color: colors.text, fontWeight: '600' },
  kpiStatus: { ...typography.caption, fontWeight: '600' },
  kpiValues: { ...typography.bodySmall, color: colors.textSecondary },
});
