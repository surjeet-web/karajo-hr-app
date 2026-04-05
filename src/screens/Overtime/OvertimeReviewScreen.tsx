import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Button } from '../../components';
import { requestOvertime } from '../../store';
import { hapticFeedback } from '../../utils/haptics';

export const OvertimeReviewScreen: React.FC<any> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { date, startTime, endTime, duration, reason } = route.params || {};

  useEffect(() => { hapticFeedback('medium'); }, []);

  if (!date) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Header title="Review Overtime" onBack={() => navigation.goBack()} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
          <Text style={styles.errorText}>No overtime request data found.</Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} variant="outline" />
        </View>
      </View>
    );
  }

  const handleConfirm = (): void => {
    hapticFeedback('heavy');
    Alert.alert(
      'Confirm Overtime Request',
      `Submit ${duration}h overtime for ${date}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            requestOvertime({
              date,
              startTime,
              endTime,
              duration,
              reason,
            });
            navigation.navigate('OvertimeSuccess', {
              date,
              startTime,
              endTime,
              duration,
              reason,
            });
          },
        },
      ]
    );
  };

  const summaryItems = [
    { icon: 'calendar', label: 'Date', value: date },
    { icon: 'time', label: 'Time', value: `${startTime} - ${endTime}` },
    { icon: 'timer', label: 'Duration', value: `${duration}h` },
    { icon: 'document-text', label: 'Reason', value: reason },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Review Overtime" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Review your request</Text>
        <Text style={styles.subheading}>Please review all details before submitting your overtime request.</Text>

        <View style={styles.summaryCard}>
          {summaryItems.map((item, index) => (
            <React.Fragment key={index}>
              <View style={styles.summaryItem}>
                <View style={styles.summaryIcon}>
                  <Ionicons name={item.icon} size={20} color={colors.primary} />
                </View>
                <View style={styles.summaryInfo}>
                  <Text style={styles.summaryLabel}>{item.label}</Text>
                  <Text style={styles.summaryValue}>{item.value}</Text>
                </View>
              </View>
              {index < summaryItems.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={colors.info} />
          <Text style={styles.infoText}>
            By submitting this request, you confirm that all information provided is accurate. Your supervisor will be notified for approval.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Submit Overtime Request" onPress={handleConfirm} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  errorText: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
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
