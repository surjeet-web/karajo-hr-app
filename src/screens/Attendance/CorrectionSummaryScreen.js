import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Button, ProgressBar } from '../../components';
import { hapticFeedback } from '../../utils/haptics';
import { submitCorrection } from '../../store';
import { correctionReasons } from '../../data/mockData';
import { attendanceService } from '../../services';

export const CorrectionSummaryScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { selectedReason, checkInTime, checkOutTime, reason } = route?.params || {};

  const reasonLabel = correctionReasons.find(r => r.id === selectedReason)?.label || 'Not specified';
  const displayReason = reason || 'No additional details provided';

  const handleSubmit = () => {
    hapticFeedback('heavy');
    submitCorrection({
      date: 'Monday, Feb 23, 2023',
      reason: reasonLabel,
      checkIn: checkInTime,
      checkOut: checkOutTime,
      details: displayReason,
    });
    navigation.navigate('CorrectionSubmitted', {
      checkInTime,
      checkOutTime,
      reason: reasonLabel,
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Attendance Correction" onBack={() => navigation.goBack()} />
      <ProgressBar currentStep={3} totalSteps={3} title="Correction Progress" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Review your correction request</Text>
        <Text style={styles.subheading}>Please review the details below before submitting your request to HR.</Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Correction Summary</Text>

          <View style={styles.summaryItem}>
            <View style={styles.summaryIcon}>
              <Ionicons name="calendar" size={20} color={colors.primary} />
            </View>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryLabel}>Date</Text>
              <Text style={styles.summaryValue}>Monday, Feb 23, 2023</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryItem}>
            <View style={styles.summaryIcon}>
              <Ionicons name="log-in" size={20} color={colors.primary} />
            </View>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryLabel}>Check-In Time</Text>
              <Text style={styles.summaryValue}>{checkInTime || '09:00 AM'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryItem}>
            <View style={styles.summaryIcon}>
              <Ionicons name="log-out" size={20} color={colors.primary} />
            </View>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryLabel}>Check-Out Time</Text>
              <Text style={styles.summaryValue}>{checkOutTime || '05:00 PM'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryItem}>
            <View style={styles.summaryIcon}>
              <Ionicons name="help-circle" size={20} color={colors.primary} />
            </View>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryLabel}>Reason</Text>
              <Text style={styles.summaryValue}>{reasonLabel}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryItem}>
            <View style={styles.summaryIcon}>
              <Ionicons name="document-text" size={20} color={colors.primary} />
            </View>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryLabel}>Details</Text>
              <Text style={styles.summaryValue}>{displayReason}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={colors.info} />
          <Text style={styles.infoText}>
            By submitting this request, you confirm that the information provided is accurate. Your supervisor will be notified for approval.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Submit Correction Request" onPress={handleSubmit} accessibilityLabel="Submit correction request" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  heading: { ...typography.h4, color: colors.text, marginBottom: spacing.sm },
  subheading: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  summaryCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.lg },
  summaryTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.lg },
  summaryItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  summaryIcon: { width: 44, height: 44, borderRadius: borderRadius.md, backgroundColor: colors.primaryLighter, justifyContent: 'center', alignItems: 'center' },
  summaryInfo: { flex: 1 },
  summaryLabel: { ...typography.caption, color: colors.textTertiary },
  summaryValue: { ...typography.body, color: colors.text, fontWeight: '600', marginTop: spacing.xs },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  infoBox: { flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.infoLight, padding: spacing.md, borderRadius: borderRadius.lg },
  infoText: { ...typography.bodySmall, color: colors.info, flex: 1 },
  footer: { padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
});
