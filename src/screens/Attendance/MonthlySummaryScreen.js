import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Card, Button } from '../../components';
import { attendanceData } from '../../data/mockData';

export const MonthlySummaryScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const summary = attendanceData.monthlySummary;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Monthly Summary" onBack={() => navigation.goBack()} rightComponent={<Ionicons name="download-outline" size={24} color={colors.primary} />} />

      <View style={styles.monthNavigator}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.monthContainer}>
          <Text style={styles.monthText}>February 2026</Text>
          <Text style={styles.weekText}>Current Period</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="chevron-forward" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.scoreCard} padding="lg">
          <Text style={styles.scoreLabel}>Monthly Productivity Score</Text>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreValue}>{summary.productivityScore}<Text style={styles.scoreTotal}>/100</Text></Text>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreBadgeText}>{summary.scoreChange}</Text>
            </View>
          </View>
          <Text style={styles.scoreMessage}>Excellent! You're above the team average.</Text>
          <View style={styles.scoreBar}>
            {[...Array(7)].map((_, i) => (
              <View key={i} style={[styles.scoreBarSegment, i < 6 && styles.scoreBarActive]} />
            ))}
          </View>
        </Card>

        <Card style={styles.hoursCard} padding="lg">
          <Text style={styles.hoursLabel}>TOTAL HOURS</Text>
          <Text style={styles.hoursValue}>{summary.totalHours}</Text>
          <View style={styles.hoursChange}>
            <Ionicons name="arrow-up" size={14} color={colors.success} />
            <Text style={styles.hoursChangeText}>{summary.hoursChange} vs last month</Text>
          </View>
        </Card>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard} padding="md">
            <Text style={styles.statLabel}>Work Days</Text>
            <Text style={styles.statValue}>{summary.workDays} Days</Text>
            <Text style={styles.statSubtext}>{summary.onTimeDays} On-time</Text>
          </Card>
          <Card style={styles.statCard} padding="md">
            <Text style={styles.statLabel}>Avg. Clock-In</Text>
            <Text style={styles.statValue}>{summary.avgClockIn}</Text>
            <Text style={[styles.statSubtext, { color: colors.success }]}>{summary.earlyBy}</Text>
          </Card>
        </View>

        <Card style={styles.chartCard} padding="lg">
          <Text style={styles.chartTitle}>Weekly Activity</Text>
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
              <Text style={styles.legendText}>Actual</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.border }]} />
              <Text style={styles.legendText}>Target</Text>
            </View>
          </View>
          <View style={styles.chartBars}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
              <View key={day} style={styles.chartBarContainer}>
                <View style={styles.chartBarGroup}>
                  <View style={[styles.chartBarTarget, { height: 60 }]} />
                  <View style={[styles.chartBarActual, { height: [50, 65, 35, 55, 45][i] }]} />
                </View>
                <Text style={styles.chartBarLabel}>{day}</Text>
              </View>
            ))}
          </View>
        </Card>

        <View style={styles.summaryList}>
          {[
            { icon: 'time', color: colors.info, title: 'Overtime', subtitle: 'Approved extra hours', value: summary.overtime, status: summary.overtimeStatus, statusColor: colors.success },
            { icon: 'umbrella', color: colors.warning, title: 'Leave Taken', subtitle: 'Annual & Sick leave', value: `${summary.leaveTaken} Day`, status: summary.leaveType, statusColor: colors.textSecondary },
            { icon: 'alert-circle', color: colors.error, title: 'Late Arrivals', subtitle: 'Clock-in past 9:00 AM', value: `${summary.lateArrivals} Days`, status: summary.lateMinutes, statusColor: colors.error },
          ].map((item, index) => (
            <TouchableOpacity key={index} style={styles.summaryItem}>
              <View style={[styles.summaryIcon, { backgroundColor: `${item.color}15` }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryTitle}>{item.title}</Text>
                <Text style={styles.summarySubtitle}>{item.subtitle}</Text>
              </View>
              <View style={styles.summaryRight}>
                <Text style={styles.summaryValue}>{item.value}</Text>
                <Text style={[styles.summaryStatus, { color: item.statusColor }]}>{item.status}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Download Full Reports" icon={<Ionicons name="download" size={18} color={colors.textInverse} />} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  monthNavigator: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.lg, paddingVertical: spacing.md },
  monthContainer: { alignItems: 'center' },
  monthText: { ...typography.h5, color: colors.text },
  weekText: { ...typography.bodySmall, color: colors.textSecondary },
  scrollContent: { padding: spacing.lg },
  scoreCard: { backgroundColor: colors.primary, marginBottom: spacing.lg },
  scoreLabel: { ...typography.bodySmall, color: 'rgba(255,255,255,0.7)', marginBottom: spacing.sm },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm },
  scoreValue: { ...typography.statNumber, color: colors.textInverse },
  scoreTotal: { ...typography.h4, color: 'rgba(255,255,255,0.7)' },
  scoreBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.sm },
  scoreBadgeText: { ...typography.bodySmall, color: colors.textInverse, fontWeight: '600' },
  scoreMessage: { ...typography.bodySmall, color: 'rgba(255,255,255,0.7)', marginBottom: spacing.md },
  scoreBar: { flexDirection: 'row', gap: spacing.xs },
  scoreBarSegment: { flex: 1, height: 8, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 4 },
  scoreBarActive: { backgroundColor: 'rgba(255,255,255,0.8)' },
  hoursCard: { marginBottom: spacing.lg },
  hoursLabel: { ...typography.label, color: colors.textTertiary, marginBottom: spacing.sm },
  hoursValue: { ...typography.statNumber, color: colors.text },
  hoursChange: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm },
  hoursChangeText: { ...typography.bodySmall, color: colors.success },
  statsGrid: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  statCard: { flex: 1 },
  statLabel: { ...typography.caption, color: colors.textTertiary, marginBottom: spacing.xs },
  statValue: { ...typography.h4, color: colors.text },
  statSubtext: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  chartCard: { marginBottom: spacing.lg },
  chartTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  chartLegend: { flexDirection: 'row', gap: spacing.lg, marginBottom: spacing.lg },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { ...typography.bodySmall, color: colors.textSecondary },
  chartBars: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 80 },
  chartBarContainer: { alignItems: 'center' },
  chartBarGroup: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  chartBarTarget: { width: 12, backgroundColor: colors.border, borderRadius: 2 },
  chartBarActual: { width: 12, backgroundColor: colors.primary, borderRadius: 2 },
  chartBarLabel: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
  summaryList: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  summaryItem: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  summaryIcon: { width: 44, height: 44, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  summaryInfo: { flex: 1 },
  summaryTitle: { ...typography.body, color: colors.text, fontWeight: '600' },
  summarySubtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  summaryRight: { alignItems: 'flex-end', marginRight: spacing.sm },
  summaryValue: { ...typography.body, color: colors.text, fontWeight: '600' },
  summaryStatus: { ...typography.bodySmall, marginTop: spacing.xs },
  footer: { padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
});
