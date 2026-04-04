import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Button, ProgressBar } from '../../components';
import { hapticFeedback } from '../../utils/haptics';
import { requestLeave } from '../../store';

export const LeaveReviewScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { leaveType, startDate, endDate, days, reason, delegate } = route.params || {};

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const handleSubmit = () => {
    hapticFeedback('heavy');
    requestLeave({ type: leaveType, startDate, endDate, reason: reason || 'Leave request', delegate });
    navigation.navigate('LeaveSuccess', { leaveType, startDate, endDate, days, reason });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Review Summary" onBack={() => navigation.goBack()} />
      <ProgressBar currentStep={4} totalSteps={4} title="Request Leave" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Review your request</Text>
        <Text style={styles.subheading}>Please review all details before submitting.</Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <View style={styles.summaryIcon}>
              <Ionicons name="umbrella" size={20} color={colors.primary} />
            </View>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryLabel}>Leave Type</Text>
              <Text style={styles.summaryValue}>{leaveType || '-'}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <View style={styles.summaryIcon}>
              <Ionicons name="calendar" size={20} color={colors.primary} />
            </View>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryLabel}>Date Range</Text>
              <Text style={styles.summaryValue}>{formatDate(startDate)} – {formatDate(endDate)}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <View style={styles.summaryIcon}>
              <Ionicons name="time" size={20} color={colors.primary} />
            </View>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryLabel}>Total Duration</Text>
              <Text style={styles.summaryValue}>{days || '-'} Day{(days || 0) > 1 ? 's' : ''}</Text>
            </View>
          </View>
          {reason && (
            <>
              <View style={styles.divider} />
              <View style={styles.summaryItem}>
                <View style={styles.summaryIcon}>
                  <Ionicons name="document-text" size={20} color={colors.primary} />
                </View>
                <View style={styles.summaryInfo}>
                  <Text style={styles.summaryLabel}>Reason</Text>
                  <Text style={styles.summaryValue}>{reason}</Text>
                </View>
              </View>
            </>
          )}
          {delegate && (
            <>
              <View style={styles.divider} />
              <View style={styles.summaryItem}>
                <View style={styles.summaryIcon}>
                  <Ionicons name="people" size={20} color={colors.primary} />
                </View>
                <View style={styles.summaryInfo}>
                  <Text style={styles.summaryLabel}>Delegate</Text>
                  <Text style={styles.summaryValue}>{delegate}</Text>
                </View>
              </View>
            </>
          )}
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={colors.info} />
          <Text style={styles.infoText}>
            Your supervisor will be notified for approval. Leave balance will be updated upon approval.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Submit Leave Request" onPress={handleSubmit} accessible accessibilityLabel="Submit leave request" accessibilityRole="button" />
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
