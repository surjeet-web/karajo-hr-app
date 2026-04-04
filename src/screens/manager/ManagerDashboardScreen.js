import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Badge, Card } from '../../components';
import { StatCard, ApprovalCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';
import { getState, subscribe } from '../../store';

export const ManagerDashboardScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [appState, setAppState] = useState(getState());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { const unsub = subscribe(setAppState); return unsub; }, []);
  const onRefresh = () => { setRefreshing(true); setAppState(getState()); setRefreshing(false); };

  const { leave, permission, overtime, employees } = appState;
  const pendingLeave = leave.requests.filter(r => r.status === 'pending').length;
  const pendingPermission = permission.requests.filter(r => r.status === 'pending').length;
  const pendingOvertime = overtime.requests.filter(r => r.status === 'pending').length;
  const totalPending = pendingLeave + pendingPermission + pendingOvertime;
  const teamMembers = employees.slice(0, 5);
  const presentToday = teamMembers.filter(() => Math.random() > 0.2).length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Manager Dashboard" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        <View style={styles.statsRow}>
          <StatCard icon="people" label="Team" value={teamMembers.length} color={colors.primary} delay={0} />
          <StatCard icon="checkmark-circle" label="Present" value={presentToday} color={colors.success} delay={100} />
          <StatCard icon="hourglass" label="Pending" value={totalPending} color={colors.warning} delay={200} />
          <StatCard icon="calendar" label="On Leave" value={pendingLeave} color={colors.accentPurple} delay={300} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            {[
              { icon: 'checkmark-circle', label: 'Approvals', color: colors.success, screen: 'ManagerApproval' },
              { icon: 'people', label: 'My Team', color: colors.primary, screen: 'MyTeam' },
              { icon: 'calendar', label: 'Planning', color: colors.warning, screen: 'TeamPlanning' },
              { icon: 'bar-chart', label: 'Reports', color: colors.accentPurple, screen: 'TeamReports' },
            ].map(action => (
              <TouchableOpacity key={action.label} style={[styles.quickAction, { backgroundColor: `${action.color}10` }]}
                onPress={() => { hapticFeedback('medium'); navigation.navigate(action.screen); }} activeOpacity={0.7}>
                <Ionicons name={action.icon} size={24} color={action.color} />
                <Text style={[styles.quickActionLabel, { color: action.color }]}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Team Overview</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MyTeam')}><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
          </View>
          {teamMembers.map((emp, i) => (
            <TouchableOpacity key={emp.id} style={[styles.teamRow, shadows.sm]} onPress={() => { hapticFeedback('medium'); navigation.navigate('EmployeeDetail', { employee: emp }); }} activeOpacity={0.7}>
              <Ionicons name="person-circle" size={36} color={colors.primary} />
              <View style={styles.teamInfo}>
                <Text style={styles.teamName}>{emp.name}</Text>
                <Text style={styles.teamRole}>{emp.role}</Text>
              </View>
              <Badge text={Math.random() > 0.3 ? 'Present' : 'On Leave'} variant={Math.random() > 0.3 ? 'success' : 'warning'} size="small" />
            </TouchableOpacity>
          ))}
        </View>

        {totalPending > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pending Approvals</Text>
            {leave.requests.filter(r => r.status === 'pending').slice(0, 2).map((r, i) => (
              <ApprovalCard key={r.id} request={{ type: 'leave', requesterName: r.delegate || 'Team Member', date: `${r.startDate} to ${r.endDate}`, days: r.days, status: 'pending' }}
                onPress={() => navigation.navigate('ManagerApproval')} delay={500 + i * 80} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.xl },
  section: { marginBottom: spacing.xl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  viewAll: { ...typography.bodySmall, color: colors.primary, fontWeight: '600' },
  quickActions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  quickAction: { width: '47%', borderRadius: borderRadius.lg, padding: spacing.lg, alignItems: 'center', gap: spacing.sm, ...shadows.sm },
  quickActionLabel: { ...typography.label, fontWeight: '600' },
  teamRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.md },
  teamInfo: { flex: 1 },
  teamName: { ...typography.body, color: colors.text, fontWeight: '600' },
  teamRole: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
});
