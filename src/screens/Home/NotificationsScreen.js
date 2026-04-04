import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header } from '../../components';
import { getState, subscribe, markNotificationRead, markAllNotificationsRead, deleteNotification } from '../../store';

export const NotificationsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [appState, setAppState] = useState(getState());

  useEffect(() => {
    const unsubscribe = subscribe(setAppState);
    return unsubscribe;
  }, []);

  const { notifications } = appState;
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIconName = (type) => {
    const iconMap = { reminder: 'time', warning: 'alert-circle', info: 'document-text', team: 'people', system: 'settings', success: 'checkmark-circle' };
    return iconMap[type] || 'notifications';
  };

  const getIconColor = (type) => {
    const colorMap = { reminder: colors.info, warning: colors.warning, info: colors.info, team: colors.accentPurple, system: colors.textTertiary, success: colors.success };
    return colorMap[type] || colors.primary;
  };

  const getIconBgColor = (type) => {
    const colorMap = { reminder: colors.infoLight, warning: colors.warningLight, info: colors.infoLight, team: `${colors.accentPurple}15`, system: colors.surfaceVariant, success: colors.successLight };
    return colorMap[type] || colors.primaryLighter;
  };

  const timeAgo = (isoString) => {
    const now = new Date();
    const then = new Date(isoString);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const today = notifications.filter(n => {
    const then = new Date(n.time);
    const now = new Date();
    return then.toDateString() === now.toDateString();
  });
  const older = notifications.filter(n => {
    const then = new Date(n.time);
    const now = new Date();
    return then.toDateString() !== now.toDateString();
  });

  const renderNotification = (notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[styles.notificationItem, !notification.read && styles.unreadItem]}
      onPress={() => markNotificationRead(notification.id)}
      activeOpacity={0.7}
    >
      <View style={[styles.notificationIcon, { backgroundColor: getIconBgColor(notification.type) }]}>
        <Ionicons name={getIconName(notification.type)} size={20} color={getIconColor(notification.type)} />
      </View>
      <View style={styles.notificationContent}>
        <Text style={[styles.notificationTitle, !notification.read && styles.unreadTitle]}>{notification.title}</Text>
        <Text style={styles.notificationMessage} numberOfLines={2}>{notification.message}</Text>
      </View>
      <View style={styles.notificationRight}>
        <TouchableOpacity onPress={() => deleteNotification(notification.id)} style={styles.deleteButton}>
          <Ionicons name="close" size={16} color={colors.textTertiary} />
        </TouchableOpacity>
        <Text style={styles.notificationTime}>{timeAgo(notification.time)}</Text>
        {!notification.read && <View style={styles.unreadDot} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header
        title="Notifications"
        onBack={() => navigation.goBack()}
        rightComponent={
          unreadCount > 0 ? (
            <TouchableOpacity onPress={markAllNotificationsRead}>
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          ) : null
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {today.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TODAY ({today.length})</Text>
            {today.map(renderNotification)}
          </View>
        )}

        {older.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>OLDER ({older.length})</Text>
            {older.map(renderNotification)}
          </View>
        )}

        {notifications.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={64} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySubtitle}>You're all caught up!</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  markAllText: { ...typography.bodySmall, color: colors.primary, fontWeight: '600' },
  scrollContent: { padding: spacing.lg },
  section: { marginBottom: spacing.xl },
  sectionTitle: { ...typography.label, color: colors.textTertiary, marginBottom: spacing.md },
  notificationItem: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm },
  unreadItem: { borderWidth: 1, borderColor: colors.primary },
  notificationIcon: { width: 44, height: 44, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  notificationContent: { flex: 1 },
  notificationTitle: { ...typography.body, color: colors.text, fontWeight: '600' },
  unreadTitle: { color: colors.primary },
  notificationMessage: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  notificationRight: { alignItems: 'flex-end', marginLeft: spacing.sm },
  deleteButton: { padding: 4, marginBottom: 4 },
  notificationTime: { ...typography.caption, color: colors.textTertiary },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: spacing.xs },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxxxl },
  emptyTitle: { ...typography.h4, color: colors.text, marginTop: spacing.md },
  emptySubtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
});
