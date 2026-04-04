import React, { useState, useEffect } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Card, Badge } from '../../components';
import { hapticFeedback } from '../../utils/haptics';
import { getState, subscribe } from '../../store';
import { formatDuration } from '../../utils/calculations';

export const CheckedOutScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [appState, setAppState] = useState(getState());
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => { const unsub = subscribe(setAppState); return unsub; }, []);

  const onRefresh = (): void => { setRefreshing(true); setAppState(getState()); setRefreshing(false); };

  const { user, attendance, leave, permission, overtime, notifications } = appState;
  const today = attendance.today;
  const totalHours = formatDuration(today.totalHours || 8.25);
  const unreadCount = notifications.filter(n => !n.read).length;
  const pendingLeave = leave.requests.filter(r => r.status === 'pending').length;
  const pendingPermission = permission.requests.filter(r => r.status === 'pending').length;
  const pendingOvertime = overtime.requests.filter(r => r.status === 'pending').length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getCurrentDate = () => new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' });

  const pendingItems = [
    { label: 'Leave', count: pendingLeave, screen: 'LeaveHome' },
    { label: 'Permission', count: pendingPermission, screen: 'PermissionHome' },
    { label: 'Overtime', count: pendingOvertime, screen: 'OvertimeHome' },
  ].filter(item => item.count > 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.dateText}>{getCurrentDate()}</Text>
          <Text style={styles.greetingText}>{getGreeting()},{'\n'}{user.name} 👋</Text>
        </View>
        <View style={styles.headerRight}>
          {unreadCount > 0 && (
            <TouchableOpacity style={styles.notificationBadge} onPress={() => { hapticFeedback('light'); navigation.navigate('Notifications'); }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="notifications" size={18} color={colors.textInverse} />
              <View style={styles.badgeDot}><Text style={styles.badgeText}>{unreadCount}</Text></View>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => { hapticFeedback('light'); navigation.navigate('Profile'); }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <View style={styles.onlineIndicator} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        <Card style={styles.attendanceCard}>
          <View style={styles.attendanceHeader}>
            <Text style={styles.currentTimeLabel}>CURRENT TIME</Text>
            <Badge text="Checked Out" variant="default" size="small" />
          </View>
          <Text style={styles.currentTime}>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</Text>
          <View style={styles.hoursContainer}>
            <Text style={styles.totalHoursLabel}>TOTAL HOURS</Text>
            <View style={styles.hoursRow}>
              <Text style={styles.totalHours}>{today.totalHours ? Math.floor(today.totalHours) : 8}</Text>
              <Text style={styles.hoursUnit}>h</Text>
              <Text style={styles.totalHours}>{today.totalHours ? Math.round((today.totalHours % 1) * 60) : 15}</Text>
              <Text style={styles.hoursUnit}>m</Text>
            </View>
            <Text style={styles.hoursMessage}>Great job today! You've met your daily goal.</Text>
          </View>
          <View style={styles.timesRow}>
            <View style={styles.timeItem}>
              <View style={styles.timeIconRow}>
                <Ionicons name="log-in-outline" size={16} color={colors.success} />
                <Text style={styles.timeLabel}>Check In</Text>
              </View>
              <Text style={styles.timeValue}>{today.checkIn || '08:32 AM'}</Text>
            </View>
            <View style={styles.timeDivider} />
            <View style={styles.timeItem}>
              <View style={styles.timeIconRow}>
                <Ionicons name="log-out-outline" size={16} color={colors.error} />
                <Text style={styles.timeLabel}>Check Out</Text>
              </View>
              <Text style={styles.timeValue}>{today.checkOut || '05:00 PM'}</Text>
            </View>
          </View>
        </Card>

        {pendingItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pending Requests</Text>
            {pendingItems.map(item => (
              <Card key={item.label} style={styles.pendingCard} padding="md" onPress={() => { hapticFeedback('medium'); navigation.navigate(item.screen); }}>
                <View style={styles.pendingRow}>
                  <View style={[styles.pendingIcon, { backgroundColor: `${colors.warning}15` }]}>
                    <Ionicons name="time" size={18} color={colors.warning} />
                  </View>
                  <Text style={styles.pendingText}>{item.count} {item.label} request{item.count > 1 ? 's' : ''} pending</Text>
                  <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
                </View>
              </Card>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsRow}>
            {[
              { icon: 'calendar', label: 'Attendance', color: colors.primary, bg: colors.primaryLighter, screen: 'AttendanceHistory' },
              { icon: 'umbrella', label: 'Leave', color: colors.warning, bg: colors.warningLight, screen: 'LeaveHome' },
              { icon: 'document-text', label: 'Payslip', color: colors.success, bg: colors.successLight, screen: 'PayslipHome' },
              { icon: 'grid', label: 'More', color: colors.textSecondary, bg: colors.surfaceVariant, screen: 'Shortcuts' },
            ].map(action => (
              <TouchableOpacity key={action.label} style={styles.quickAction} onPress={() => { hapticFeedback('medium'); navigation.navigate(action.screen); }} activeOpacity={0.7}>
                <View style={[styles.quickActionIcon, { backgroundColor: action.bg }]}>
                  <Ionicons name={action.icon} size={24} color={action.color} />
                </View>
                <Text style={styles.quickActionText}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Updates</Text>
            <TouchableOpacity onPress={() => { hapticFeedback('light'); navigation.navigate('AttendanceHistory'); }}><Text style={styles.viewAllText}>View All</Text></TouchableOpacity>
          </View>
          {attendance.history.slice(0, 3).map((record, i) => (
            <TouchableOpacity key={i} style={[styles.updateCard, shadows.sm]} onPress={() => { hapticFeedback('medium'); navigation.navigate('AttendanceDetail', { record }); }} activeOpacity={0.7}>
              <View style={styles.updateRow}>
                <View style={[styles.updateIcon, { backgroundColor: record.status === 'on-time' ? colors.successLight : record.status === 'late' ? colors.warningLight : record.status === 'overtime' ? `${colors.accentPurple}15` : colors.errorLight }]}>
                  <Ionicons name={record.status === 'absent' ? 'close-circle' : 'calendar-outline'} size={20} color={record.status === 'on-time' ? colors.success : record.status === 'late' ? colors.warning : record.status === 'overtime' ? colors.accentPurple : colors.error} />
                </View>
                <View style={styles.updateContent}>
                  <Text style={styles.updateTitle}>{record.date}</Text>
                  <Text style={styles.updateMessage}>{record.checkIn ? `${record.checkIn} - ${record.checkOut}` : 'Absent'} • {record.totalHours > 0 ? record.totalHours + 'h' : '-'}</Text>
                </View>
                <Badge text={record.status} variant={record.status === 'on-time' ? 'success' : record.status === 'late' ? 'warning' : record.status === 'overtime' ? 'primary' : 'error'} size="small" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md },
  dateText: { ...typography.body, color: colors.textSecondary },
  greetingText: { ...typography.h2, color: colors.text, marginTop: spacing.xs },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  notificationBadge: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  badgeDot: { position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: colors.error, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
  badgeText: { ...typography.caption, color: colors.textInverse, fontWeight: '700' },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  onlineIndicator: { position: 'absolute', bottom: 0, right: 0, width: 14, height: 14, borderRadius: 7, backgroundColor: colors.success, borderWidth: 2, borderColor: colors.background },
  scrollContent: { padding: spacing.lg },
  attendanceCard: { marginBottom: spacing.xl },
  attendanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  currentTimeLabel: { ...typography.label, color: colors.textTertiary },
  currentTime: { ...typography.timeLarge, color: colors.text },
  hoursContainer: { backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.lg, padding: spacing.lg, marginTop: spacing.lg, marginBottom: spacing.lg },
  totalHoursLabel: { ...typography.label, color: colors.primary, marginBottom: spacing.sm },
  hoursRow: { flexDirection: 'row', alignItems: 'flex-end' },
  totalHours: { fontSize: 40, fontWeight: '700', color: colors.text, lineHeight: 44 },
  hoursUnit: { ...typography.h4, color: colors.textSecondary, marginHorizontal: spacing.xs, marginBottom: spacing.xs },
  hoursMessage: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.sm },
  timesRow: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md },
  timeItem: { flex: 1, alignItems: 'center' },
  timeIconRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xs },
  timeLabel: { ...typography.bodySmall, color: colors.textSecondary },
  timeValue: { ...typography.h4, color: colors.text },
  timeDivider: { width: 1, height: 40, backgroundColor: colors.border },
  section: { marginBottom: spacing.xl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  viewAllText: { ...typography.bodySmall, color: colors.primary, fontWeight: '600' },
  quickActionsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  quickAction: { alignItems: 'center', gap: spacing.sm },
  quickActionIcon: { width: 56, height: 56, borderRadius: borderRadius.lg, justifyContent: 'center', alignItems: 'center' },
  quickActionText: { ...typography.bodySmall, color: colors.text },
  pendingCard: { marginBottom: spacing.sm },
  pendingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  pendingIcon: { width: 36, height: 36, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center' },
  pendingText: { ...typography.body, color: colors.text, flex: 1 },
  updateCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm },
  updateRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  updateIcon: { width: 40, height: 40, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center' },
  updateContent: { flex: 1 },
  updateTitle: { ...typography.body, color: colors.text, fontWeight: '600' },
  updateMessage: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
});
