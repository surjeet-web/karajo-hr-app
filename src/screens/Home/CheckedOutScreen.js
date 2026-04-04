import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Card, Badge } from '../../components';
import { currentUser, attendanceData, updates } from '../../data/mockData';

export const CheckedOutScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const today = attendanceData.today;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.dateText}>{getCurrentDate()}</Text>
          <Text style={styles.greetingText}>
            {getGreeting()},{'\n'}{currentUser.name} 👋
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
          <View style={styles.onlineIndicator} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Attendance Card - Checked Out State */}
        <Card style={styles.attendanceCard}>
          <View style={styles.attendanceHeader}>
            <Text style={styles.currentTimeLabel}>CURRENT TIME</Text>
            <Badge text="Checked Out" variant="default" size="small" />
          </View>
          
          <Text style={styles.currentTime}>12:45<Text style={styles.timePeriod}> PM</Text></Text>

          {/* Total Hours Display */}
          <View style={styles.hoursContainer}>
            <Text style={styles.totalHoursLabel}>TOTAL HOURS</Text>
            <View style={styles.hoursRow}>
              <Text style={styles.totalHours}>08</Text>
              <Text style={styles.hoursUnit}>h</Text>
              <Text style={styles.totalHours}>15</Text>
              <Text style={styles.hoursUnit}>m</Text>
            </View>
            <Text style={styles.hoursMessage}>Great job today! You've met your daily goal.</Text>
          </View>

          {/* Check In/Out Times */}
          <View style={styles.timesRow}>
            <View style={styles.timeItem}>
              <View style={styles.timeIconRow}>
                <Ionicons name="log-in-outline" size={16} color={colors.success} />
                <Text style={styles.timeLabel}>Check In</Text>
              </View>
              <Text style={styles.timeValue}>08:32 AM</Text>
            </View>
            <View style={styles.timeDivider} />
            <View style={styles.timeItem}>
              <View style={styles.timeIconRow}>
                <Ionicons name="log-out-outline" size={16} color={colors.error} />
                <Text style={styles.timeLabel}>Check Out</Text>
              </View>
              <Text style={styles.timeValue}>05:00 PM</Text>
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => navigation.navigate('AttendanceHistory')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.primaryLighter }]}>
                <Ionicons name="calendar" size={24} color={colors.primary} />
              </View>
              <Text style={styles.quickActionText}>Attendance</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => navigation.navigate('LeaveHome')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.warningLight }]}>
                <Ionicons name="umbrella" size={24} color={colors.warning} />
              </View>
              <Text style={styles.quickActionText}>Leave</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => navigation.navigate('PayslipHome')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.successLight }]}>
                <Ionicons name="document-text" size={24} color={colors.success} />
              </View>
              <Text style={styles.quickActionText}>Payslip</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => navigation.navigate('Shortcuts')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.surfaceVariant }]}>
                <Ionicons name="grid" size={24} color={colors.textSecondary} />
              </View>
              <Text style={styles.quickActionText}>More</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Updates */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Updates</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {updates.map((update) => (
            <Card key={update.id} style={styles.updateCard} padding="md">
              <View style={styles.updateRow}>
                <View style={[styles.updateIcon, { backgroundColor: update.type === 'leave' ? colors.successLight : colors.infoLight }]}>
                  <Ionicons
                    name={update.type === 'leave' ? 'checkmark-circle' : 'megaphone'}
                    size={20}
                    color={update.type === 'leave' ? colors.success : colors.info}
                  />
                </View>
                <View style={styles.updateContent}>
                  <Text style={styles.updateTitle}>{update.title}</Text>
                  <Text style={styles.updateMessage} numberOfLines={1}>
                    {update.message}
                  </Text>
                </View>
                <Text style={styles.updateTime}>{update.time}</Text>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  dateText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  greetingText: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.xs,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  attendanceCard: {
    marginBottom: spacing.xl,
  },
  attendanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  currentTimeLabel: {
    ...typography.label,
    color: colors.textTertiary,
  },
  currentTime: {
    ...typography.timeLarge,
    color: colors.text,
  },
  timePeriod: {
    ...typography.h4,
    color: colors.textSecondary,
  },
  hoursContainer: {
    backgroundColor: colors.surfaceVariant,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  totalHoursLabel: {
    ...typography.label,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  totalHours: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 44,
  },
  hoursUnit: {
    ...typography.h4,
    color: colors.textSecondary,
    marginHorizontal: spacing.xs,
    marginBottom: spacing.xs,
  },
  hoursMessage: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  timesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  timeItem: {
    flex: 1,
    alignItems: 'center',
  },
  timeIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  timeLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  timeValue: {
    ...typography.h4,
    color: colors.text,
  },
  timeDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h5,
    color: colors.text,
  },
  viewAllText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionText: {
    ...typography.bodySmall,
    color: colors.text,
  },
  updateCard: {
    marginBottom: spacing.sm,
  },
  updateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  updateIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateContent: {
    flex: 1,
  },
  updateTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  updateMessage: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  updateTime: {
    ...typography.caption,
    color: colors.textTertiary,
  },
});
