import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Card } from '../../components';
import { activityData } from '../../data/mockData';

export const ActivityListScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('daily');
  const today = activityData.today;

  const getCategoryColor = (category) => {
    const colorMap = {
      Development: colors.primary,
      Meeting: colors.accentPurple,
      Admin: colors.warning,
      Design: colors.accentPink,
      QA: colors.success,
    };
    return colorMap[category] || colors.textSecondary;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.dateNavigator}>
          <TouchableOpacity>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{today.date}</Text>
            <Text style={styles.dayText}>Today</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="chevron-forward" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'daily' && styles.activeTab]}
          onPress={() => setActiveTab('daily')}
        >
          <Text style={[styles.tabText, activeTab === 'daily' && styles.activeTabText]}>
            Daily
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'weekly' && styles.activeTab]}
          onPress={() => navigation.navigate('TimesheetWeekly')}
        >
          <Text style={[styles.tabText, activeTab === 'weekly' && styles.activeTabText]}>
            Weekly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'monthly' && styles.activeTab]}
          onPress={() => navigation.navigate('TimesheetMonthly')}
        >
          <Text style={[styles.tabText, activeTab === 'monthly' && styles.activeTabText]}>
            Monthly
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Today's Summary */}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Today</Text>
          <Text style={styles.summaryValue}>{today.total} Total</Text>
        </View>

        {/* Activity Cards */}
        {today.activities.map((activity) => (
          <Card
            key={activity.id}
            style={styles.activityCard}
            onPress={() => navigation.navigate('ActivityDetail', { activity })}
          >
            <View style={styles.activityHeader}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityDuration}>{activity.duration}</Text>
            </View>
            <View style={styles.activityMeta}>
              <View style={styles.categoryRow}>
                <View
                  style={[
                    styles.categoryDot,
                    { backgroundColor: getCategoryColor(activity.category) },
                  ]}
                />
                <Text style={styles.projectText}>{activity.project}</Text>
              </View>
            </View>
            <View style={styles.timeRow}>
              <Ionicons name="time-outline" size={14} color={colors.textTertiary} />
              <Text style={styles.timeText}>{activity.time}</Text>
            </View>
          </Card>
        ))}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddActivity')}
      >
        <Ionicons name="add" size={28} color={colors.textInverse} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  dateNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  dateContainer: {
    alignItems: 'center',
  },
  dateText: {
    ...typography.h5,
    color: colors.text,
  },
  dayText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  activeTab: {
    backgroundColor: colors.primaryLighter,
  },
  tabText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  scrollContent: {
    padding: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  summaryLabel: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  summaryValue: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  activityCard: {
    marginBottom: spacing.md,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  activityTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
  },
  activityDuration: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  activityMeta: {
    marginBottom: spacing.sm,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  projectText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  timeText: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg + 80,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
