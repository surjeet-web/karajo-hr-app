import React, { useState, useCallback } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Card, AnimatedListItem } from '../../components';
import { activityData } from '../../data/mockData';
import { hapticFeedback } from '../../utils/haptics';
import { useFadeIn, useSlideIn } from '../../utils/animations';

export const ActivityListScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<string>('daily');
  const [currentDate, setCurrentDate] = useState<Date>(new Date($3));
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDayLabel = (date) => {
    const today = new Date();
    const diff = Math.floor((date - today) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    if (diff === -1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const goPrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const goNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

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
          <TouchableOpacity onPress={goPrevDay} activeOpacity={0.7} accessibilityLabel="Previous day">
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{formatDate(currentDate)}</Text>
            <Text style={styles.dayText}>{getDayLabel(currentDate)}</Text>
          </View>
          <TouchableOpacity onPress={goNextDay} activeOpacity={0.7} accessibilityLabel="Next day">
            <Ionicons name="chevron-forward" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => {
            hapticFeedback('light');
            navigation.navigate('ActivityFilter');
          }}
          activeOpacity={0.7}
          accessibilityLabel="Filter activities"
        >
          <Ionicons name="options-outline" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'daily' && styles.activeTab]}
          onPress={() => {
            hapticFeedback('light');
            setActiveTab('daily');
          }}
          activeOpacity={0.7}
          accessibilityLabel="Daily view"
        >
          <Text style={[styles.tabText, activeTab === 'daily' && styles.activeTabText]}>
            Daily
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'weekly' && styles.activeTab]}
          onPress={() => {
            hapticFeedback('light');
            navigation.navigate('TimesheetWeekly');
          }}
          activeOpacity={0.7}
          accessibilityLabel="Weekly view"
        >
          <Text style={[styles.tabText, activeTab === 'weekly' && styles.activeTabText]}>
            Weekly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'monthly' && styles.activeTab]}
          onPress={() => {
            hapticFeedback('light');
            navigation.navigate('TimesheetMonthly');
          }}
          activeOpacity={0.7}
          accessibilityLabel="Monthly view"
        >
          <Text style={[styles.tabText, activeTab === 'monthly' && styles.activeTabText]}>
            Monthly
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {/* Today's Summary */}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{getDayLabel(currentDate)}</Text>
          <Text style={styles.summaryValue}>{activityData.today.total} Total</Text>
        </View>

        {/* Activity Cards */}
        {activityData.today.activities.map((activity, index) => (
          <AnimatedListItem key={activity.id} index={index} style={styles.activityCard} onPress={() => {
            hapticFeedback('medium');
            navigation.navigate('ActivityDetail', { activity });
          }}>
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
          </AnimatedListItem>
        ))}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          hapticFeedback('medium');
          navigation.navigate('AddActivity');
        }}
        activeOpacity={0.7}
        accessibilityLabel="Add new activity"
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  filterButton: {
    padding: spacing.xs,
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
