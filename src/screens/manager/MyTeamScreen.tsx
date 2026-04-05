import React, { useState, useEffect } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Avatar, Badge } from '../../components';
import { StatCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';
import { getState, subscribe } from '../../store';
import { useAuth } from '../../context/AuthContext';

export const MyTeamScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { hasFeature } = useAuth();
  const [appState, setAppState] = useState(getState());
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('all');

  useEffect(() => { const unsub = subscribe(setAppState); return unsub; }, []);
  const onRefresh = (): void => { setRefreshing(true); setAppState(getState()); setRefreshing(false); };

  const { employees, attendance } = appState;
  const canManageAllTeams = hasFeature('canManageAllTeams');
  const departments = [...new Set(employees.filter(e => e.status === 'active').map(e => e.department))];
  
  // Manager can see ALL teams across departments
  const team = employees.filter(e => e.status === 'active');
  const deptFiltered = selectedDept === 'all' ? team : team.filter(e => e.department === selectedDept);
  const filtered = search ? deptFiltered.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase()) || e.department.toLowerCase().includes(search.toLowerCase())) : deptFiltered;
  const attendanceHistory = attendance.history || [];
  const onTimeCount = attendanceHistory.filter(a => a.status === 'on-time').length;
  const lateCount = attendanceHistory.filter(a => a.status === 'late').length;
  const absentCount = attendanceHistory.filter(a => a.status === 'absent').length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title={canManageAllTeams ? "All Teams" : "My Team"} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        <View style={styles.statsRow}>
          <StatCard icon="people" label={canManageAllTeams ? "All Teams" : "Team Size"} value={team.length.toString()} color={colors.primary} delay={0} />
          <StatCard icon="checkmark-circle" label="On Time" value={onTimeCount.toString()} color={colors.success} delay={100} />
          <StatCard icon="warning" label="Late" value={lateCount.toString()} color={colors.warning} delay={200} />
          <StatCard icon="close-circle" label="Absent" value={absentCount.toString()} color={colors.error} delay={300} />
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.textTertiary} />
          <TextInput style={styles.searchInput} placeholder={canManageAllTeams ? "Search all teams..." : "Search team members..."} value={search} onChangeText={setSearch} placeholderTextColor={colors.textTertiary} />
          {search ? <TouchableOpacity onPress={() => setSearch('')}><Ionicons name="close-circle" size={20} color={colors.textTertiary} /></TouchableOpacity> : null}
        </View>

        {canManageAllTeams && (
          <View style={styles.departmentFilter}>
            <TouchableOpacity style={[styles.deptChip, selectedDept === 'all' && styles.deptChipActive]} onPress={() => { hapticFeedback('light'); setSelectedDept('all'); }}>
              <Text style={[styles.deptChipText, selectedDept === 'all' && styles.deptChipTextActive]}>All Departments</Text>
            </TouchableOpacity>
            {departments.map(dept => (
              <TouchableOpacity key={dept} style={[styles.deptChip, selectedDept === dept && styles.deptChipActive]} onPress={() => { hapticFeedback('light'); setSelectedDept(dept); }}>
                <Text style={[styles.deptChipText, selectedDept === dept && styles.deptChipTextActive]}>{dept}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {filtered.map((emp, i) => {
          const empAttendance = attendanceHistory[i % attendanceHistory.length];
          const status = empAttendance?.status === 'on-time' ? 'Present' : empAttendance?.status === 'late' ? 'Late' : empAttendance?.status === 'absent' ? 'Absent' : 'Present';
          const variant = status === 'Present' ? 'success' : status === 'Late' ? 'warning' : 'error';
          return (
            <TouchableOpacity key={emp.id} style={[styles.empCard, shadows.sm]} onPress={() => { hapticFeedback('medium'); navigation.navigate('EmployeeDetail', { employee: emp }); }} activeOpacity={0.7}>
              <Avatar source={{ uri: emp.avatar }} name={emp.name} size="medium" />
              <View style={styles.empInfo}>
                <Text style={styles.empName}>{emp.name}</Text>
                <Text style={styles.empRole}>{emp.role}</Text>
                <Text style={styles.empDept}>{emp.department} - {emp.location}</Text>
                <View style={styles.empMetrics}>
                  {emp.rating && (
                    <View style={styles.metricBadge}>
                      <Ionicons name="star" size={10} color={colors.warning} />
                      <Text style={styles.metricText}>{emp.rating.toFixed(1)}</Text>
                    </View>
                  )}
                  {emp.kpiScore && (
                    <View style={[styles.metricBadge, { backgroundColor: colors.primaryLighter }]}>
                      <Ionicons name="speedometer" size={10} color={colors.primary} />
                      <Text style={[styles.metricText, { color: colors.primary }]}>{emp.kpiScore}%</Text>
                    </View>
                  )}
                </View>
              </View>
              <Badge text={status} variant={variant} size="small" />
            </TouchableOpacity>
          );
        })}

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>No Team Members Found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your search.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, height: 48, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border, gap: spacing.sm },
  searchInput: { flex: 1, ...typography.body, color: colors.text },
  departmentFilter: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  deptChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: colors.surfaceVariant },
  deptChipActive: { backgroundColor: colors.primary },
  deptChipText: { ...typography.label, color: colors.textSecondary },
  deptChipTextActive: { color: colors.textInverse },
  empCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.md },
  empInfo: { flex: 1 },
  empName: { ...typography.body, color: colors.text, fontWeight: '600' },
  empRole: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  empDept: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
  empMetrics: { flexDirection: 'row', gap: spacing.xs, marginTop: spacing.xs },
  metricBadge: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: colors.warningLight, paddingHorizontal: spacing.xs, paddingVertical: 2, borderRadius: borderRadius.full },
  metricText: { ...typography.caption, color: colors.warning, fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxxxl },
  emptyTitle: { ...typography.h4, color: colors.text, marginTop: spacing.md },
  emptySubtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
});
