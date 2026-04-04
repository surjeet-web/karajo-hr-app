import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card, Badge } from '../../components';
import { StatCard } from '../../components/management';
import { getState, subscribe } from '../../store';

export const TeamPerformanceScreen: React.FC<any> = ({ navigation }) => {
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
  const teamMembers = employees.filter(e => e.status === 'active');
  const performance = state.performance;
  const reviews = performance.reviews || [];
  const goals = performance.goals || [];
  const feedback = performance.feedback || [];

  const avgRating = teamMembers.length > 0 ? (teamMembers.reduce((sum, e) => sum + (e.rating || 0), 0) / teamMembers.length).toFixed(1) : 0;
  const avgKpi = teamMembers.length > 0 ? Math.round(teamMembers.reduce((sum, e) => sum + (e.kpiScore || 0), 0) / teamMembers.length) : 0;
  const pendingReviews = teamMembers.reduce((sum, e) => sum + (e.pendingReviews || 0), 0);
  const completedGoals = goals.filter(g => g.progress >= 100).length;

  const kpis = performance.kpis || [
    { name: 'Code Quality', target: '95%', current: '92%', status: 'on-track', trend: 'up' },
    { name: 'Sprint Completion', target: '90%', current: '88%', status: 'on-track', trend: 'up' },
    { name: 'Bug Resolution', target: '< 24h', current: '18h', status: 'exceeding', trend: 'up' },
    { name: 'Team Collaboration', target: '4.0/5', current: '4.5/5', status: 'exceeding', trend: 'stable' },
    { name: 'Documentation', target: '100%', current: '78%', status: 'at-risk', trend: 'down' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Team Performance" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        <View style={styles.statsRow}>
          <StatCard icon="star" label="Avg Rating" value={avgRating.toString()} trend="up" trendValue="+0.2" color={colors.warning} delay={0} />
          <StatCard icon="trending-up" label="Avg KPI" value={avgKpi.toString()} trend="up" trendValue="+3" color={colors.success} delay={100} />
          <StatCard icon="clipboard" label="Reviews Due" value={pendingReviews.toString()} color={colors.primary} delay={200} />
          <StatCard icon="flag" label="Goals Done" value={`${completedGoals}/${goals.length}`} color={colors.accentPurple} delay={300} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Team KPIs</Text>
          {kpis.map((kpi, i) => (
            <Card key={i} style={styles.kpiCard} padding="md">
              <View style={styles.kpiHeader}>
                <View style={styles.kpiInfo}>
                  <Text style={styles.kpiName}>{kpi.name}</Text>
                  <Text style={styles.kpiValues}>Current: {kpi.current} / Target: {kpi.target}</Text>
                </View>
                <View style={styles.kpiRight}>
                  <Ionicons name={kpi.trend === 'up' ? 'trending-up' : kpi.trend === 'down' ? 'trending-down' : 'remove'} size={16} color={kpi.trend === 'up' ? colors.success : kpi.trend === 'down' ? colors.error : colors.textTertiary} />
                  <Badge text={kpi.status} variant={kpi.status === 'exceeding' ? 'success' : kpi.status === 'on-track' ? 'primary' : 'error'} size="small" />
                </View>
              </View>
            </Card>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Team Members Performance</Text>
          {teamMembers.slice(0, 5).map((emp, i) => (
            <Card key={emp.id} style={styles.memberCard} padding="md">
              <View style={styles.memberRow}>
                <Ionicons name="person-circle" size={36} color={colors.primary} />
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{emp.name}</Text>
                  <Text style={styles.memberRole}>{emp.role}</Text>
                </View>
                <View style={styles.memberValues}>
                  <Text style={styles.memberRating}>Rating: {emp.rating || 'N/A'}</Text>
                  <Text style={styles.memberKpi}>KPI: {emp.kpiScore || 'N/A'}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Reviews</Text>
          {reviews.slice(0, 3).map((review, i) => (
            <Card key={review.id} style={styles.reviewCard} padding="md">
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewReviewer}>{review.reviewer}</Text>
                <Badge text={`${review.rating}/5`} variant={review.rating >= 4 ? 'success' : review.rating >= 3 ? 'warning' : 'error'} size="small" />
              </View>
              <Text style={styles.reviewType}>{review.type} - {review.date}</Text>
              <Text style={styles.reviewSummary}>{review.summary}</Text>
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
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.lg },
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  kpiCard: { marginBottom: spacing.sm },
  kpiHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  kpiInfo: { flex: 1 },
  kpiName: { ...typography.body, color: colors.text, fontWeight: '600' },
  kpiValues: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  kpiRight: { alignItems: 'flex-end', gap: spacing.xs },
  memberCard: { marginBottom: spacing.sm },
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  memberInfo: { flex: 1 },
  memberName: { ...typography.body, color: colors.text, fontWeight: '600' },
  memberRole: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  memberValues: { alignItems: 'flex-end' },
  memberRating: { ...typography.bodySmall, color: colors.text, fontWeight: '600' },
  memberKpi: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  reviewCard: { marginBottom: spacing.sm },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  reviewReviewer: { ...typography.body, color: colors.text, fontWeight: '600' },
  reviewType: { ...typography.caption, color: colors.textTertiary, marginBottom: spacing.xs },
  reviewSummary: { ...typography.bodySmall, color: colors.textSecondary },
});
