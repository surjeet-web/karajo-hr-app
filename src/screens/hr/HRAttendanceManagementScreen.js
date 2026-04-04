import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Badge, Card } from '../../components';
import { StatCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';
import { getState, subscribe } from '../../store';

export const HRAttendanceManagementScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [appState, setAppState] = useState(getState());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { const unsub = subscribe(setAppState); return unsub; }, []);
  const onRefresh = () => { setRefreshing(true); setAppState(getState()); setRefreshing(false); };

  const { attendance } = appState;
  const today = attendance.today;
  const lateCount = attendance.history.filter(r => r.status === 'late').length;
  const absentCount = attendance.history.filter(r => r.status === 'absent').length;
  const corrections = attendance.corrections || [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Attendance Management" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        <View style={styles.statsRow}>
          <StatCard icon="calendar" label="Today" value={today.checkIn || '--:--'} color={colors.primary} delay={0} />
          <StatCard icon="warning" label="Late" value={lateCount} color={colors.warning} delay={100} />
          <StatCard icon="close-circle" label="Absent" value={absentCount} color={colors.error} delay={200} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Status</Text>
          <Card style={styles.todayCard} padding="lg">
            <View style={styles.todayRow}>
              <Ionicons name={today.status === 'not-checked-in' ? 'time-outline' : 'checkmark-circle'} size={24} color={today.status === 'not-checked-in' ? colors.textTertiary : colors.success} />
              <View style={styles.todayInfo}>
                <Text style={styles.todayStatus}>{today.status === 'not-checked-in' ? 'Not Checked In' : today.status === 'on-time' ? 'On Time' : today.status}</Text>
                <Text style={styles.todayTime}>Check In: {today.checkIn || '--:--'} {today.checkOut ? `• Check Out: ${today.checkOut}` : ''}</Text>
              </View>
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Attendance</Text>
          {attendance.history.slice(0, 5).map((record, i) => (
            <TouchableOpacity key={i} style={[styles.recordRow, shadows.sm]} activeOpacity={0.7}>
              <View style={styles.recordDate}>
                <Text style={styles.recordDateText}>{record.date}</Text>
              </View>
              <View style={styles.recordInfo}>
                <Text style={styles.recordTime}>{record.checkIn || '--:--'} - {record.checkOut || '--:--'}</Text>
                <Text style={styles.recordHours}>{record.totalHours > 0 ? record.totalHours + 'h' : '-'}</Text>
              </View>
              <Badge text={record.status} variant={record.status === 'on-time' ? 'success' : record.status === 'late' ? 'warning' : 'error'} size="small" />
            </TouchableOpacity>
          ))}
        </View>

        {corrections.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Correction Requests ({corrections.length})</Text>
            {corrections.map((c, i) => (
              <Card key={c.id} style={styles.correctionCard} padding="md">
                <Text style={styles.correctionDate}>{c.date}</Text>
                <Text style={styles.correctionReason}>{c.reason}</Text>
                <Badge text={c.status} variant="warning" size="small" />
              </Card>
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
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  todayCard: { marginBottom: spacing.sm },
  todayRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  todayInfo: { flex: 1 },
  todayStatus: { ...typography.body, color: colors.text, fontWeight: '600' },
  todayTime: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  recordRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.md },
  recordDate: { width: 80 },
  recordDateText: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: '500' },
  recordInfo: { flex: 1 },
  recordTime: { ...typography.body, color: colors.text },
  recordHours: { ...typography.caption, color: colors.textTertiary },
  correctionCard: { marginBottom: spacing.sm },
  correctionDate: { ...typography.body, color: colors.text, fontWeight: '600' },
  correctionReason: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
});
