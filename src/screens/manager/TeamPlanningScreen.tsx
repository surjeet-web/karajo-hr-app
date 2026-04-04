import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card } from '../../components';
import { StatCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';
import { getState, subscribe } from '../../store';

export const TeamPlanningScreen: React.FC<any> = ({ navigation }) => {
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

  const { leave, employees, permission } = state;
  const upcomingLeaves = leave.requests.filter(r => r.status === 'approved' || r.status === 'pending');
  const upcomingPermissions = permission.requests.filter(r => r.status === 'approved' || r.status === 'pending');
  const teamMembers = employees.filter(e => e.status === 'active');

  const coverageGaps = [];
  upcomingLeaves.forEach(l => {
    const teamInDept = teamMembers.filter(e => e.department === 'Engineering').length;
    if (teamInDept <= 2) {
      coverageGaps.push({
        dates: `${l.startDate} to ${l.endDate}`,
        message: `${l.days} day(s) - ${l.type} leave for ${l.delegate || 'Employee'}. Limited coverage in department.`,
        severity: l.days > 3 ? 'high' : 'medium',
      });
    }
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Team Planning" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        <View style={styles.statsRow}>
          <StatCard icon="people" label="Team Size" value={teamMembers.length.toString()} color={colors.primary} delay={0} />
          <StatCard icon="umbrella" label="Upcoming Leave" value={upcomingLeaves.length.toString()} color={colors.warning} delay={100} />
          <StatCard icon="time" label="Permissions" value={upcomingPermissions.length.toString()} color={colors.info} delay={200} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Leaves ({upcomingLeaves.length})</Text>
          {upcomingLeaves.length > 0 ? upcomingLeaves.map((l, i) => (
            <Card key={l.id} style={styles.leaveCard} padding="md">
              <View style={styles.leaveRow}>
                <Ionicons name="calendar-clear" size={20} color={colors.primary} />
                <View style={styles.leaveInfo}>
                  <Text style={styles.leaveName}>{l.delegate || 'Team Member'}</Text>
                  <Text style={styles.leaveDates}>{l.startDate} to {l.endDate} ({l.days} days)</Text>
                </View>
                <Text style={styles.leaveType}>{l.type}</Text>
              </View>
            </Card>
          )) : (
            <Card style={styles.emptyCard} padding="lg">
              <Ionicons name="checkmark-circle" size={32} color={colors.success} />
              <Text style={styles.emptyText}>No upcoming leaves planned.</Text>
            </Card>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Permissions ({upcomingPermissions.length})</Text>
          {upcomingPermissions.length > 0 ? upcomingPermissions.map((p, i) => (
            <Card key={p.id} style={styles.leaveCard} padding="md">
              <View style={styles.leaveRow}>
                <Ionicons name="time" size={20} color={colors.info} />
                <View style={styles.leaveInfo}>
                  <Text style={styles.leaveName}>Permission Request</Text>
                  <Text style={styles.leaveDates}>{p.date} - {p.startTime} to {p.endTime} ({p.duration}h)</Text>
                </View>
                <Text style={styles.leaveType}>{p.reason}</Text>
              </View>
            </Card>
          )) : (
            <Card style={styles.emptyCard} padding="lg">
              <Ionicons name="checkmark-circle" size={32} color={colors.success} />
              <Text style={styles.emptyText}>No upcoming permissions.</Text>
            </Card>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coverage Gaps</Text>
          {coverageGaps.length > 0 ? coverageGaps.map((gap, i) => (
            <Card key={i} style={[styles.gapCard, gap.severity === 'high' && { backgroundColor: colors.errorLight }]} padding="md">
              <Ionicons name={gap.severity === 'high' ? 'warning' : 'information-circle'} size={20} color={gap.severity === 'high' ? colors.error : colors.warning} />
              <View style={styles.gapInfo}>
                <Text style={[styles.gapText, gap.severity === 'high' && { color: colors.error }]}>{gap.message}</Text>
                <Text style={styles.gapDates}>{gap.dates}</Text>
              </View>
            </Card>
          )) : (
            <Card style={styles.emptyCard} padding="lg">
              <Ionicons name="checkmark-circle" size={32} color={colors.success} />
              <Text style={styles.emptyText}>No coverage gaps detected.</Text>
            </Card>
          )}
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
  leaveCard: { marginBottom: spacing.sm },
  leaveRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  leaveInfo: { flex: 1 },
  leaveName: { ...typography.body, color: colors.text, fontWeight: '600' },
  leaveDates: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  leaveType: { ...typography.caption, color: colors.primary, fontWeight: '600' },
  gapCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.warningLight, marginBottom: spacing.sm },
  gapInfo: { flex: 1 },
  gapText: { ...typography.bodySmall, color: colors.warning, fontWeight: '500' },
  gapDates: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
  emptyCard: { alignItems: 'center', gap: spacing.sm },
  emptyText: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
});
