import React, { useState } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Card, StatusTimeline, Button, Badge, AnimatedListItem } from '../../components';
import { hapticFeedback } from '../../utils/haptics';
import { useFadeIn, useSlideIn } from '../../utils/animations';

export const ApprovalStatusScreen: React.FC<any> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const weekData = route.params?.week;
  const [breakdownExpanded, setBreakdownExpanded] = useState<boolean>(false);
  const fadeAnim = useFadeIn();
  const slideAnim = useSlideIn();

  const timeline = [
    { status: 'Submitted', label: 'Request created by', by: 'Sarah Miller', date: 'Feb 28, 09:00 PM' },
    { status: 'HR Review', label: 'Reviewed by', by: 'Alex Johnson', date: 'Feb 28, 09:20 PM' },
    { status: 'Revision Requested', label: 'Request created by', by: 'Alex Johnson', date: 'Feb 28, 09:20 PM' },
    { status: 'Correction Needed', label: 'Request created by', by: 'Alex Johnson', date: 'Feb 28, 09:20 PM', active: true },
  ];

  const weeks = [
    { period: 'Feb 22 - Feb 28', week: 'Week 4', hours: '40h 30m', status: 'pending' },
    { period: 'Feb 15 - Feb 21', week: 'Week 3', hours: '42h 00m', status: 'approved' },
    { period: 'Feb 08 - Feb 14', week: 'Week 2', hours: '40h 00m', status: 'approved' },
    { period: 'Feb 01 - Feb 07', week: 'Week 1', hours: '46h 00m', status: 'approved' },
  ];

  const getStatusBadge = (status) => {
    const variantMap = {
      approved: 'success',
      pending: 'warning',
      rejected: 'error',
    };
    return variantMap[status] || 'info';
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="February 2026" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.summaryCard} padding="lg">
          <Text style={styles.periodLabel}>Weekly Period</Text>
          <Text style={styles.periodText}>{weekData?.period || 'Feb 1 - Feb 7, 2026'}</Text>
          <View style={styles.hoursRow}>
            <View>
              <Text style={styles.totalHours}>{weekData?.hours || '40h 00m'}</Text>
              <Text style={styles.totalLabel}>Total Logged</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.workDays}>5 Days</Text>
              <Text style={styles.workDaysLabel}>Work week</Text>
            </View>
          </View>
          <View style={styles.statusRow}>
            <Badge
              text={weekData?.status ? weekData.status.charAt(0).toUpperCase() + weekData.status.slice(1) : 'Pending'}
              variant={getStatusBadge(weekData?.status || 'pending')}
            />
          </View>
        </Card>

        <TouchableOpacity
          style={styles.breakdownRow}
          onPress={() => {
            hapticFeedback('light');
            setBreakdownExpanded(!breakdownExpanded);
          }}
          activeOpacity={0.7}
          accessibilityLabel="View timesheet breakdown"
        >
          <View style={styles.breakdownIconRow}>
            <Ionicons name="document-text" size={18} color={colors.primary} />
            <Text style={styles.breakdownText}>View Timesheet Breakdown</Text>
          </View>
          <Ionicons name={breakdownExpanded ? 'chevron-up' : 'chevron-down'} size={20} color={colors.textTertiary} />
        </TouchableOpacity>

        <View style={styles.weeksSection}>
          {weeks.map((week, index) => (
            <AnimatedListItem key={index} index={index} style={styles.weekRow} onPress={() => {
              hapticFeedback('medium');
            }}>
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
            </AnimatedListItem>
          ))}
        </View>

        <View style={styles.timelineSection}>
          <Text style={styles.timelineTitle}>Approval Timeline</Text>
          <StatusTimeline items={timeline} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Edit Activity" onPress={() => { hapticFeedback('medium'); navigation.navigate('EditActivity'); }} icon={<Ionicons name="create-outline" size={18} color={colors.textInverse} />} accessibilityLabel="Edit activity" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  summaryCard: { marginBottom: spacing.lg, backgroundColor: colors.primary },
  periodLabel: { ...typography.bodySmall, color: 'rgba(255,255,255,0.7)', marginBottom: spacing.xs },
  periodText: { ...typography.body, color: colors.textInverse, marginBottom: spacing.lg },
  hoursRow: { flexDirection: 'row', justifyContent: 'space-between' },
  totalHours: { ...typography.statNumber, color: colors.textInverse },
  totalLabel: { ...typography.bodySmall, color: 'rgba(255,255,255,0.7)' },
  workDays: { ...typography.h4, color: colors.textInverse },
  workDaysLabel: { ...typography.bodySmall, color: 'rgba(255,255,255,0.7)' },
  statusRow: { marginTop: spacing.md },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface, padding: spacing.md, borderRadius: borderRadius.lg, marginBottom: spacing.lg },
  breakdownIconRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  breakdownText: { ...typography.body, color: colors.text, fontWeight: '600' },
  weeksSection: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', marginBottom: spacing.lg },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  weekDate: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  weekBadge: { width: 44, height: 44, borderRadius: borderRadius.md, backgroundColor: colors.warningLight, justifyContent: 'center', alignItems: 'center' },
  weekBadgeText: { ...typography.caption, color: colors.warning, fontWeight: '600' },
  weekBadgeDay: { ...typography.h5, color: colors.warning, fontWeight: '700' },
  weekPeriod: { ...typography.body, color: colors.text, fontWeight: '600' },
  weekInfo: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  weekHoursRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  weekHours: { ...typography.body, color: colors.text, fontWeight: '600' },
  timelineSection: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  timelineTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  footer: { padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
});
