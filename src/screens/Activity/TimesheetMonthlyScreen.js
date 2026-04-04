import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Card, Badge } from '../../components';
import { activityData } from '../../data/mockData';

export const TimesheetMonthlyScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const monthly = activityData.monthly;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.dateNavigator}>
          <TouchableOpacity>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{monthly.period}</Text>
            <Text style={styles.dayText}>Current period</Text>
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
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('TimesheetWeekly')}>
          <Text style={styles.tabText}>Weekly</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Monthly</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.summaryCard} padding="lg">
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.totalHours}>{monthly.totalLogged}</Text>
              <Text style={styles.totalLabel}>Total Logged</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.workDays}>{monthly.workDays} Days</Text>
              <Text style={styles.workDaysLabel}>Work month</Text>
            </View>
          </View>
        </Card>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard} padding="md">
            <View style={styles.statIconRow}>
              <Ionicons name="time-outline" size={16} color={colors.textTertiary} />
              <Text style={styles.statLabel}>Regular</Text>
            </View>
            <Text style={styles.statValue}>{monthly.regular}</Text>
          </Card>
          <Card style={styles.statCard} padding="md">
            <View style={styles.statIconRow}>
              <Ionicons name="time-outline" size={16} color={colors.warning} />
              <Text style={styles.statLabel}>Overtime</Text>
            </View>
            <Text style={styles.statValue}>{monthly.overtime}</Text>
          </Card>
        </View>

        <View style={styles.weeksSection}>
          {monthly.weeks.map((week, index) => (
            <TouchableOpacity key={index} style={styles.weekRow} onPress={() => navigation.navigate('ApprovalStatus')}>
              <View style={styles.weekDate}>
                <View style={styles.weekBadge}>
                  <Text style={styles.weekBadgeText}>FEB</Text>
                  <Text style={styles.weekBadgeDay}>{28 - index * 7}</Text>
                </View>
                <View>
                  <Text style={styles.weekPeriod}>{week.period}</Text>
                  <Text style={styles.weekInfo}>{week.week} • <Text style={{ color: week.status === 'approved' ? colors.success : colors.warning }}>{week.status.charAt(0).toUpperCase() + week.status.slice(1)}</Text></Text>
                </View>
              </View>
              <View style={styles.weekHoursRow}>
                <Text style={styles.weekHours}>{week.hours}</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
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
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  totalHours: { ...typography.statNumber, color: colors.textInverse },
  totalLabel: { ...typography.bodySmall, color: 'rgba(255,255,255,0.7)' },
  workDays: { ...typography.h4, color: colors.textInverse },
  workDaysLabel: { ...typography.bodySmall, color: 'rgba(255,255,255,0.7)' },
  statsGrid: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  statCard: { flex: 1 },
  statIconRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xs },
  statLabel: { ...typography.caption, color: colors.textTertiary },
  statValue: { ...typography.h5, color: colors.text },
  weeksSection: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  weekDate: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  weekBadge: { width: 44, height: 44, borderRadius: borderRadius.md, backgroundColor: colors.warningLight, justifyContent: 'center', alignItems: 'center' },
  weekBadgeText: { ...typography.caption, color: colors.warning, fontWeight: '600' },
  weekBadgeDay: { ...typography.h5, color: colors.warning, fontWeight: '700' },
  weekPeriod: { ...typography.body, color: colors.text, fontWeight: '600' },
  weekInfo: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  weekHoursRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  weekHours: { ...typography.body, color: colors.text, fontWeight: '600' },
});
