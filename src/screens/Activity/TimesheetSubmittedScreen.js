import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Button, Badge } from '../../components';

export const TimesheetSubmittedScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark" size={40} color={colors.textInverse} />
        </View>
        
        <Text style={styles.title}>Timesheet Submitted Successfully</Text>
        <Text style={styles.subtitle}>Your timesheet for Feb 22 - 28 has been forwarded for approval.</Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Hours Recorded</Text>
          <Text style={styles.hoursValue}>40:00<Text style={styles.hoursUnit}> hrs</Text></Text>
          <Badge text="Pending Approval" variant="warning" style={styles.badge} />
        </View>
      </View>

      <View style={styles.footer}>
        <Button title="Back to Activity" onPress={() => navigation.navigate('ActivityList')} style={styles.primaryButton} />
        <Button title="Go to approval" variant="outline" onPress={() => navigation.navigate('ApprovalStatus')} style={styles.secondaryButton} />
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
  footer: { padding: spacing.lg, gap: spacing.md },
  primaryButton: { width: '100%' },
  secondaryButton: { width: '100%' },
});
