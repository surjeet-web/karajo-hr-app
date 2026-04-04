import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Card, Badge } from '../../components';
import { getState, subscribe, checkIn, checkOut } from '../../store';
import { currentUser } from '../../data/mockData';

export const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [appState, setAppState] = useState(getState());

  useEffect(() => {
    const unsubscribe = subscribe(setAppState);
    return unsubscribe;
  }, []);

  const { user, attendance, notifications, leave, permission, overtime } = appState;
  const today = attendance.today;
  const unreadCount = notifications.filter(n => !n.read).length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' });
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatHours = (hours) => {
    if (!hours || hours === 0) return '--:--';
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m > 0 ? m + 'm' : ''}`;
  };

  const statusConfig = {
    'not-checked-in': { text: 'Not Checked In', color: colors.textTertiary, icon: 'time-outline' },
    'on-time': { text: 'On Time', color: colors.success, icon: 'checkmark-circle' },
    'late': { text: 'Late', color: colors.warning, icon: 'warning' },
    'overtime': { text: 'Overtime', color: colors.accentPurple, icon: 'flash' },
    'checked-out': { text: 'Checked Out', color: colors.textSecondary, icon: 'log-out-outline' },
  };

  const currentStatus = statusConfig[today.status] || statusConfig['not-checked-in'];

  const pendingItems = [
    { label: 'Leave', count: leave.requests.filter(r => r.status === 'pending').length, screen: 'LeaveHome' },
    { label: 'Permission', count: permission.requests.filter(r => r.status === 'pending').length, screen: 'PermissionHome' },
    { label: 'Overtime', count: overtime.requests.filter(r => r.status === 'pending').length, screen: 'OvertimeHome' },
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
            <TouchableOpacity style={styles.notificationBadge} onPress={() => navigation.navigate('Notifications')}>
              <Ionicons name="notifications" size={18} color={colors.textInverse} />
              <View style={styles.badgeDot}><Text style={styles.badgeText}>{unreadCount}</Text></View>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
            <View style={styles.onlineIndicator} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.attendanceCard}>
          <View style={styles.attendanceHeader}>
            <Text style={styles.currentTimeLabel}>CURRENT TIME</Text>
            <Badge text={currentStatus.text} variant={today.status === 'on-time' ? 'success' : today.status === 'late' ? 'warning' : 'default'} size="small" />
          </View>

          <Text style={styles.currentTime}>{getCurrentTime()}</Text>

          <View style={styles.scheduleRow}>
            <Ionicons name="time-outline" size={14} color={colors.primary} />
            <Text style={styles.scheduleText}>09:00 - 17:00 Work Schedule</Text>
          </View>

          {today.status === 'not-checked-in' ? (
            <TouchableOpacity style={styles.slideButton} onPress={() => { checkIn(); }}>
              <View style={styles.slideButtonInner}>
                <Ionicons name="log-in-outline" size={20} color={colors.primary} />
              </View>
              <Text style={styles.slideButtonText}>Tap to Check In</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textInverse} />
            </TouchableOpacity>
          ) : today.checkOut ? (
            <View style={styles.checkedOutBanner}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={styles.checkedOutText}>Checked out at {today.checkOut}</Text>
            </View>
          ) : (
            <TouchableOpacity style={[styles.slideButton, { backgroundColor: colors.error }]} onPress={() => { checkOut(); }}>
              <View style={[styles.slideButtonInner, { backgroundColor: colors.surface }]}>
                <Ionicons name="log-out-outline" size={20} color={colors.error} />
              </View>
              <Text style={styles.slideButtonText}>Tap to Check Out</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textInverse} />
            </TouchableOpacity>
          )}

          <Text style={styles.statusText}>Status: {currentStatus.text}</Text>

          <View style={styles.timesRow}>
            <View style={styles.timeItem}>
              <View style={styles.timeIconRow}>
                <Ionicons name="log-in-outline" size={16} color={colors.success} />
                <Text style={styles.timeLabel}>Check In</Text>
              </View>
              <Text style={styles.timeValue}>{today.checkIn || '--:--'}</Text>
            </View>
            <View style={styles.timeDivider} />
            <View style={styles.timeItem}>
              <View style={styles.timeIconRow}>
                <Ionicons name="log-out-outline" size={16} color={colors.error} />
                <Text style={styles.timeLabel}>Check Out</Text>
              </View>
              <Text style={styles.timeValue}>{today.checkOut || '--:--'}</Text>
            </View>
            <View style={styles.timeDivider} />
            <View style={styles.timeItem}>
              <View style={styles.timeIconRow}>
                <Ionicons name="hourglass-outline" size={16} color={colors.primary} />
                <Text style={styles.timeLabel}>Total</Text>
              </View>
              <Text style={styles.timeValue}>{formatHours(today.totalHours)}</Text>
            </View>
          </View>
        </Card>

        {pendingItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pending Requests</Text>
            {pendingItems.map(item => (
              <Card key={item.label} style={styles.pendingCard} padding="md" onPress={() => navigation.navigate(item.screen)}>
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
              <TouchableOpacity key={action.label} style={styles.quickAction} onPress={() => navigation.navigate(action.screen)}>
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
            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </View>
          {attendance.history.slice(0, 3).map((record, i) => (
            <Card key={i} style={styles.updateCard} padding="md">
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
            </Card>
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
  scheduleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs },
  scheduleText: { ...typography.bodySmall, color: colors.textSecondary },
  slideButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, borderRadius: borderRadius.xl, marginTop: spacing.lg, marginBottom: spacing.md, padding: spacing.xs, height: 56 },
  slideButtonInner: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' },
  slideButtonText: { ...typography.button, color: colors.textInverse, flex: 1, textAlign: 'center', marginLeft: -44 },
  statusText: { ...typography.bodySmall, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.lg },
  checkedOutBanner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.successLight, padding: spacing.md, borderRadius: borderRadius.lg, marginTop: spacing.lg, marginBottom: spacing.md },
  checkedOutText: { ...typography.body, color: colors.success, fontWeight: '600' },
  timesRow: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md },
  timeItem: { flex: 1, alignItems: 'center' },
  timeIconRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xs },
  timeLabel: { ...typography.bodySmall, color: colors.textSecondary },
  timeValue: { ...typography.h4, color: colors.text },
  timeDivider: { width: 1, height: 40, backgroundColor: colors.border },
  section: { marginBottom: spacing.xl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { ...typography.h5, color: colors.text },
  quickActionsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  quickAction: { alignItems: 'center', gap: spacing.sm },
  quickActionIcon: { width: 56, height: 56, borderRadius: borderRadius.lg, justifyContent: 'center', alignItems: 'center' },
  quickActionText: { ...typography.bodySmall, color: colors.text },
  updateCard: { marginBottom: spacing.sm },
  updateRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  updateIcon: { width: 40, height: 40, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center' },
  updateContent: { flex: 1 },
  updateTitle: { ...typography.body, color: colors.text, fontWeight: '600' },
  updateMessage: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  pendingCard: { marginBottom: spacing.sm },
  pendingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  pendingIcon: { width: 36, height: 36, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center' },
  pendingText: { ...typography.body, color: colors.text, flex: 1 },
});
