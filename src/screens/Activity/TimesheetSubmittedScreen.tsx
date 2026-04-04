import React, { useEffect } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Button, Badge } from '../../components';
import { hapticFeedback } from '../../utils/haptics';
import { getState } from '../../store';

export const TimesheetSubmittedScreen: React.FC<any> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { period, hours, activityCount } = route.params || {};
  const state = getState();
  const submissions = state.activities.submissions || [];
  const latestSubmission = submissions[0];

  useEffect(() => {
    hapticFeedback('success');
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark" size={40} color={colors.textInverse} />
        </View>
        <Text style={styles.title}>Timesheet Submitted Successfully</Text>
        <Text style={styles.subtitle}>Your timesheet for {period || latestSubmission?.period || 'this week'} has been forwarded for approval.</Text>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Hours Recorded</Text>
          <Text style={styles.hoursValue}>{hours || latestSubmission?.hours || '40'}<Text style={styles.hoursUnit}> hrs</Text></Text>
          <Badge text="Pending Approval" variant="warning" style={styles.badge} />
          {activityCount && <Text style={styles.activityCount}>{activityCount} activities submitted</Text>}
        </View>
      </View>
      <View style={styles.footer}>
        <Button title="Back to Activity" onPress={() => { hapticFeedback('medium'); navigation.navigate('ActivityList'); }} style={styles.primaryButton} />
        <Button title="Go to approval" variant="outline" onPress={() => { hapticFeedback('medium'); navigation.navigate('ApprovalStatus'); }} style={styles.secondaryButton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  successIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.xl },
  title: { ...typography.h3, color: colors.text, textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xxl },
  summaryCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.xl, alignItems: 'center', width: '100%', borderWidth: 1, borderColor: colors.border },
  summaryLabel: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.sm },
  hoursValue: { ...typography.statNumber, color: colors.text, marginBottom: spacing.md },
  hoursUnit: { ...typography.h4, color: colors.textSecondary },
  badge: { marginTop: spacing.sm },
  activityCount: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.sm },
  footer: { padding: spacing.lg, gap: spacing.md },
  primaryButton: { width: '100%' },
  secondaryButton: { width: '100%' },
});
