import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Card, Badge, Button, AnimatedListItem } from '../../components';
import { hapticFeedback } from '../../utils/haptics';
import { getState, subscribe } from '../../store';

export const AttendanceHistoryScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [appState, setAppState] = useState(getState());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribe(setAppState);
    return unsubscribe;
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setAppState(getState());
      setRefreshing(false);
    }, 1000);
  }, []);

  const { attendance } = appState;
  const today = attendance.today;
  const history = attendance.history;

  const totalHours = history.reduce((sum, r) => sum + r.totalHours, 0);
  const onTimeDays = history.filter(r => r.status === 'on-time').length;
  const lateDays = history.filter(r => r.status === 'late').length;
  const absentDays = history.filter(r => r.status === 'absent').length;
  const overtimeHours = history.filter(r => r.status === 'overtime').reduce((sum, r) => sum + (r.totalHours - 8), 0);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'on-time': return { text: 'On Time', variant: 'success' };
      case 'late': return { text: 'Late', variant: 'warning' };
      case 'overtime': return { text: 'Overtime', variant: 'primary' };
      case 'absent': return { text: 'Absent', variant: 'error' };
      default: return { text: status, variant: 'default' };
    }
  };

  const handleHistoryPress = (record) => {
    hapticFeedback('medium');
    navigation.navigate('AttendanceDetail', { record });
  };

  const handleFilterPress = () => {
    hapticFeedback('light');
    navigation.navigate('AttendanceFilter');
  };

  const handleCorrectionPress = () => {
    hapticFeedback('medium');
    navigation.navigate('CorrectionReason');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header
        title="Attendance"
        onBack={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity onPress={handleFilterPress} activeOpacity={0.7} accessibilityLabel="Filter attendance">
            <Ionicons name="filter" size={22} color={colors.primary} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
        }
      >
        {today.status !== 'not-checked-in' && (
          <Card padding="lg" style={styles.todayCard}>
            <View style={styles.todayHeader}>
              <Text style={styles.todayLabel}>TODAY</Text>
              <Badge text={today.status.replace(/-/g, ' ')} variant={today.status === 'on-time' ? 'success' : today.status === 'late' ? 'warning' : 'default'} size="small" />
            </View>
            <View style={styles.todayTimes}>
              <View style={styles.todayTimeItem}>
                <Ionicons name="log-in-outline" size={20} color={colors.success} />
                <Text style={styles.todayTimeLabel}>Check In</Text>
                <Text style={styles.todayTimeValue}>{today.checkIn || '--:--'}</Text>
              </View>
              <View style={styles.todayTimeItem}>
                <Ionicons name="log-out-outline" size={20} color={colors.error} />
                <Text style={styles.todayTimeLabel}>Check Out</Text>
                <Text style={styles.todayTimeValue}>{today.checkOut || '--:--'}</Text>
              </View>
              <View style={styles.todayTimeItem}>
                <Ionicons name="hourglass-outline" size={20} color={colors.primary} />
                <Text style={styles.todayTimeLabel}>Total</Text>
                <Text style={styles.todayTimeValue}>{today.totalHours > 0 ? today.totalHours + 'h' : '--'}</Text>
              </View>
            </View>
            {today.location && (
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={14} color={colors.textTertiary} />
                <Text style={styles.locationText}>{today.location}</Text>
              </View>
            )}
          </Card>
        )}

        <View style={styles.statsRow}>
          <Card style={styles.statCard} padding="md">
            <Text style={[styles.statValue, { color: colors.primary }]}>{totalHours.toFixed(1)}h</Text>
            <Text style={styles.statLabel}>Total Hours</Text>
          </Card>
          <Card style={styles.statCard} padding="md">
            <Text style={[styles.statValue, { color: colors.success }]}>{onTimeDays}</Text>
            <Text style={styles.statLabel}>On Time</Text>
          </Card>
          <Card style={styles.statCard} padding="md">
            <Text style={[styles.statValue, { color: colors.warning }]}>{lateDays}</Text>
            <Text style={styles.statLabel}>Late</Text>
          </Card>
        </View>

        {overtimeHours > 0 && (
          <Card style={styles.overtimeBanner} padding="md">
            <View style={styles.overtimeRow}>
              <Ionicons name="flash" size={20} color={colors.accentPurple} />
              <Text style={styles.overtimeText}>{overtimeHours.toFixed(1)}h overtime this month</Text>
            </View>
          </Card>
        )}

        <View style={styles.historyHeaderRow}>
          <Text style={styles.sectionTitle}>History</Text>
          <TouchableOpacity onPress={handleFilterPress} activeOpacity={0.7} accessibilityLabel="Filter history">
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>
        {history.map((record, i) => {
          const badge = getStatusBadge(record.status);
          return (
            <AnimatedListItem key={i} index={i} onPress={() => handleHistoryPress(record)} accessibilityLabel={`Attendance record for ${record.date}`}>
              <Card style={styles.historyCard} padding="md">
                <View style={styles.historyHeader}>
                  <Text style={styles.historyDate}>{record.date}</Text>
                  <Badge text={badge.text} variant={badge.variant} size="small" />
                </View>
                <View style={styles.historyDetails}>
                  <View style={styles.historyDetail}>
                    <Ionicons name="log-in-outline" size={14} color={colors.success} />
                    <Text style={styles.historyDetailText}>{record.checkIn || '-'}</Text>
                  </View>
                  <View style={styles.historyDetail}>
                    <Ionicons name="log-out-outline" size={14} color={colors.error} />
                    <Text style={styles.historyDetailText}>{record.checkOut || '-'}</Text>
                  </View>
                  <View style={styles.historyDetail}>
                    <Ionicons name="hourglass-outline" size={14} color={colors.primary} />
                    <Text style={styles.historyDetailText}>{record.totalHours > 0 ? record.totalHours + 'h' : '-'}</Text>
                  </View>
                </View>
              </Card>
            </AnimatedListItem>
          );
        })}

        <View style={styles.footer}>
          <Button title="Request Correction" variant="outline" onPress={() => navigation.navigate('CorrectionReason')} accessibilityLabel="Request attendance correction" />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  todayCard: { marginBottom: spacing.md },
  todayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  todayLabel: { ...typography.label, color: colors.textTertiary },
  todayTimes: { flexDirection: 'row', gap: spacing.md },
  todayTimeItem: { flex: 1, alignItems: 'center', gap: spacing.xs },
  todayTimeLabel: { ...typography.caption, color: colors.textTertiary },
  todayTimeValue: { ...typography.h5, color: colors.text, fontWeight: '700' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  locationText: { ...typography.bodySmall, color: colors.textSecondary },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  statCard: { flex: 1, alignItems: 'center' },
  statValue: { ...typography.h3, color: colors.text },
  statLabel: { ...typography.caption, color: colors.textTertiary },
  overtimeBanner: { marginBottom: spacing.md, backgroundColor: `${colors.accentPurple}10` },
  overtimeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  overtimeText: { ...typography.body, color: colors.accentPurple, fontWeight: '600' },
  historyHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md, marginTop: spacing.lg },
  sectionTitle: { ...typography.label, color: colors.textTertiary },
  filterText: { ...typography.bodySmall, color: colors.primary, fontWeight: '600' },
  historyCard: { marginBottom: spacing.md },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  historyDate: { ...typography.body, color: colors.text, fontWeight: '600' },
  historyDetails: { flexDirection: 'row', gap: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md },
  historyDetail: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  historyDetailText: { ...typography.bodySmall, color: colors.textSecondary },
  footer: { padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
});
