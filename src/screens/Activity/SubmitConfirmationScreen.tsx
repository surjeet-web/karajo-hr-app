import React, { useState } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Button, ProgressBar, AnimatedCard } from '../../components';
import { submitTimesheet } from '../../store';
import { hapticFeedback } from '../../utils/haptics';
import { useFadeIn, useSlideIn } from '../../utils/animations';

export const SubmitConfirmationScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [breakdownExpanded, setBreakdownExpanded] = useState<boolean>(false);
  const fadeAnim = useFadeIn();
  const slideAnim = useSlideIn();

  const handleSubmit = (): void => {
    if (!confirmed) return;
    hapticFeedback('heavy');
    submitTimesheet({
      hours: 38.5,
      period: 'Feb 22 - 28',
      activities: 14,
    });
    navigation.navigate('TimesheetSubmitted');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Submit Timesheet" onBack={() => navigation.goBack()} />
      <ProgressBar currentStep={1} totalSteps={2} title="Submit Timesheet" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Ready to submit?</Text>
        <Text style={styles.subheading}>Please review your summary for Feb 22 - 28. Once submitted, changes require approval.</Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Hours</Text>
            <View style={styles.hoursRow}>
              <Text style={styles.hoursValue}>38.5h</Text>
              <View style={styles.hoursIcon}>
                <Ionicons name="time" size={24} color={colors.primary} />
              </View>
            </View>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <View style={styles.infoIconRow}>
                <Ionicons name="document-text" size={16} color={colors.primary} />
                <Text style={styles.infoLabel}>Activities</Text>
              </View>
              <Text style={styles.infoValue}>14</Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.infoIconRow}>
                <Ionicons name="calendar" size={16} color={colors.primary} />
                <Text style={styles.infoLabel}>Date Range</Text>
              </View>
              <Text style={styles.infoValue}>Feb 22 - 28</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.breakdownRow}
            onPress={() => {
              hapticFeedback('light');
              setBreakdownExpanded(!breakdownExpanded);
            }}
            activeOpacity={0.7}
            accessibilityLabel="View activity breakdown"
          >
            <View style={styles.breakdownIconRow}>
              <Ionicons name="document-text" size={18} color={colors.primary} />
              <Text style={styles.breakdownText}>View Activity Breakdown</Text>
            </View>
            <Ionicons name={breakdownExpanded ? 'chevron-up' : 'chevron-down'} size={20} color={colors.textTertiary} />
          </TouchableOpacity>

          {breakdownExpanded && (
            <View style={styles.activitiesList}>
              {['Frontend Development', 'Sprint Planning', 'Design System Update', 'Code Review & Merge'].map((activity, index) => (
                <View key={index} style={styles.activityItem}>
                  <Text style={styles.activityName}>{activity}</Text>
                  <Text style={styles.activityHours}>3h 15m</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => {
            hapticFeedback('light');
            setConfirmed(!confirmed);
          }}
          activeOpacity={0.7}
          accessibilityLabel={confirmed ? 'Unconfirm accuracy' : 'Confirm accuracy'}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: confirmed }}
        >
          <View style={[styles.checkbox, confirmed && styles.checkboxChecked]}>
            {confirmed && <Ionicons name="checkmark" size={16} color={colors.textInverse} />}
          </View>
          <Text style={styles.checkboxText}>I confirm these entries are accurate and comply with company policy.</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Submit Timesheet"
          onPress={handleSubmit}
          style={[styles.submitButton, !confirmed && styles.disabledButton]}
          icon={<Ionicons name="play" size={18} color={colors.textInverse} />}
          disabled={!confirmed}
          accessibilityLabel="Submit timesheet"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  heading: { ...typography.h3, color: colors.text, marginBottom: spacing.sm },
  subheading: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  summaryCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  summaryItem: { marginBottom: spacing.lg },
  summaryLabel: { ...typography.label, color: colors.textTertiary, marginBottom: spacing.sm },
  hoursRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  hoursValue: { ...typography.statNumber, color: colors.primary },
  hoursIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primaryLighter, justifyContent: 'center', alignItems: 'center' },
  infoGrid: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  infoItem: { flex: 1, backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.lg, padding: spacing.md },
  infoIconRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xs },
  infoLabel: { ...typography.caption, color: colors.textTertiary },
  infoValue: { ...typography.h5, color: colors.text },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  breakdownIconRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  breakdownText: { ...typography.body, color: colors.text, fontWeight: '600' },
  activitiesList: { paddingTop: spacing.md },
  activityItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm },
  activityName: { ...typography.body, color: colors.text },
  activityHours: { ...typography.body, color: colors.textSecondary },
  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginTop: spacing.lg },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: colors.border, marginTop: 2 },
  checkboxChecked: { backgroundColor: colors.primary, borderColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  checkboxText: { ...typography.bodySmall, color: colors.textSecondary, flex: 1 },
  footer: { padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
  submitButton: { width: '100%' },
  disabledButton: { opacity: 0.5 },
});
