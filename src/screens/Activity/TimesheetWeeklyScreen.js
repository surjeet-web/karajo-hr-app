import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Card, Badge } from '../../components';
import { activityData } from '../../data/mockData';

export const TimesheetWeeklyScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const weekly = activityData.weekly;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.dateNavigator}>
          <TouchableOpacity>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>Feb 22 - Feb 28</Text>
            <Text style={styles.dayText}>This Week</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="chevron-forward" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('ActivityList')}>
          <Text style={styles.tabText}>Daily</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Weekly</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('TimesheetMonthly')}>
          <Text style={styles.tabText}>Monthly</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.summaryCard} padding="lg">
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.totalHours}>{weekly.totalLogged}</Text>
              <Text style={styles.totalLabel}>Total Logged</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.workDays}>{weekly.workDays} Days</Text>
              <Text style={styles.workDaysLabel}>Work week</Text>
            </View>
          </View>
          
          <View style={styles.goalRow}>
            <Text style={styles.goalText}>Weekly Goal</Text>
            <Text style={styles.goalValue}>{weekly.weeklyGoal}</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '95%' }]} />
          </View>
        </Card>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard} padding="md">
            <View style={styles.statIconRow}>
              <Ionicons name="calendar-outline" size={16} color={colors.textTertiary} />
              <Text style={styles.statLabel}>WORK DAYS</Text>
            </View>
            <Text style={styles.statValue}>{weekly.workDays} Days</Text>
          </Card>
          <Card style={styles.statCard} padding="md">
            <View style={styles.statIconRow}>
              <Ionicons name="time-outline" size={16} color={colors.textTertiary} />
              <Text style={styles.statLabel}>AVG DAILY</Text>
            </View>
            <Text style={styles.statValue}>{weekly.avgDaily}</Text>
          </Card>
        </View>

        <View style={styles.overtimeCard}>
          <View style={styles.overtimeRow}>
            <View style={styles.overtimeIcon}>
              <Ionicons name="time-outline" size={20} color={colors.warning} />
            </View>
            <View>
              <Text style={styles.overtimeLabel}>Total Overtime</Text>
              <Text style={styles.overtimeValue}>{weekly.overtime}</Text>
            </View>
          </View>
          <Badge text={weekly.overtimeStatus} variant="warning" size="small" />
        </View>

        {weekly.days.map((day, index) => (
          <View key={index} style={styles.daySection}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayTitle}>{day.day}</Text>
              <Text style={styles.dayTotal}>{day.total} Total</Text>
            </View>
            {day.activities.map((activity, actIndex) => (
              <Card key={actIndex} style={styles.activityCard} padding="md">
                <View style={styles.activityHeader}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDuration}>{activity.duration}</Text>
                </View>
                <View style={styles.activityMeta}>
                  <View style={styles.categoryRow}>
                    <View style={[styles.categoryDot, { backgroundColor: colors.primary }]} />
                    <Text style={styles.projectText}>{activity.project}</Text>
                  </View>
                </View>
                <View style={styles.timeRow}>
                  <Ionicons name="time-outline" size={14} color={colors.textTertiary} />
                  <Text style={styles.timeText}>{activity.time}</Text>
                </View>
              </Card>
            ))}
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={() => navigation.navigate('SubmitConfirmation')}>
          <Ionicons name="play" size={18} color={colors.textInverse} />
          <Text style={styles.submitButtonText}>Submit Timesheet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddActivity')}>
          <Ionicons name="add" size={24} color={colors.textInverse} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  dateNavigator: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  dateContainer: { alignItems: 'center' },
  dateText: { ...typography.h5, color: colors.text },
  dayText: { ...typography.bodySmall, color: colors.textSecondary },
  tabsContainer: { flexDirection: 'row', backgroundColor: colors.surface, marginHorizontal: spacing.lg, borderRadius: borderRadius.lg, padding: spacing.xs, marginBottom: spacing.lg },
  tab: { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', borderRadius: borderRadius.md },
  activeTab: { backgroundColor: colors.primaryLighter },
  tabText: { ...typography.bodySmall, color: colors.textSecondary },
  activeTabText: { color: colors.primary, fontWeight: '600' },
  scrollContent: { padding: spacing.lg },
  summaryCard: { marginBottom: spacing.lg, backgroundColor: colors.primary },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  totalHours: { ...typography.statNumber, color: colors.textInverse },
  totalLabel: { ...typography.bodySmall, color: 'rgba(255,255,255,0.7)' },
  workDays: { ...typography.h4, color: colors.textInverse },
  workDaysLabel: { ...typography.bodySmall, color: 'rgba(255,255,255,0.7)' },
  goalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  goalText: { ...typography.bodySmall, color: 'rgba(255,255,255,0.7)' },
  goalValue: { ...typography.bodySmall, color: colors.textInverse },
  progressBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.warning, borderRadius: 3 },
  statsGrid: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  statCard: { flex: 1 },
  statIconRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xs },
  statLabel: { ...typography.caption, color: colors.textTertiary },
  statValue: { ...typography.h5, color: colors.text },
  overtimeCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border },
  overtimeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  overtimeIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.warningLight, justifyContent: 'center', alignItems: 'center' },
  overtimeLabel: { ...typography.bodySmall, color: colors.textSecondary },
  overtimeValue: { ...typography.h5, color: colors.text },
  daySection: { marginBottom: spacing.lg },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  dayTitle: { ...typography.body, color: colors.text, fontWeight: '600' },
  dayTotal: { ...typography.body, color: colors.primary, fontWeight: '600' },
  activityCard: { marginBottom: spacing.sm },
  activityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm },
  activityTitle: { ...typography.body, color: colors.text, fontWeight: '600', flex: 1 },
  activityDuration: { ...typography.body, color: colors.text, fontWeight: '600' },
  activityMeta: { marginBottom: spacing.sm },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  categoryDot: { width: 8, height: 8, borderRadius: 4 },
  projectText: { ...typography.bodySmall, color: colors.textSecondary },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  timeText: { ...typography.bodySmall, color: colors.textTertiary },
  footer: { flexDirection: 'row', padding: spacing.lg, gap: spacing.md, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
  submitButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.primary, borderRadius: borderRadius.lg, height: 48 },
  submitButtonText: { ...typography.button, color: colors.textInverse },
  fab: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
});
