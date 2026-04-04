import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Button, ProgressBar, AnimatedCard } from '../../components';
import { useFadeIn, useSlideIn } from '../../utils/animations';
import { hapticFeedback } from '../../utils/haptics';

export const SelectDatesScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { leaveType } = route.params || {};
  const today = new Date();
  const [startDate, setStartDate] = useState(today.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);
  const fadeIn = useFadeIn(400);
  const slideUp = useSlideIn('up', 20, 500, 100);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getDaysCount = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;
    const current = new Date(start);
    while (current <= end) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    return count > 0 ? count : 1;
  };

  const incrementDate = (type, delta) => {
    hapticFeedback('light');
    const current = type === 'start' ? new Date(startDate) : new Date(endDate);
    current.setDate(current.getDate() + delta);
    const newDate = current.toISOString().split('T')[0];
    if (type === 'start') {
      setStartDate(newDate);
      if (newDate > endDate) setEndDate(newDate);
    } else {
      setEndDate(newDate);
      if (newDate < startDate) setStartDate(newDate);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Select Dates" onBack={() => navigation.goBack()} />
      <ProgressBar currentStep={2} totalSteps={4} title="Request Leave" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>When will you be on leave?</Text>
        {leaveType && <Text style={styles.subheading}>{leaveType} Leave</Text>}

        <View style={styles.dateCard}>
          <Text style={styles.dateLabel}>Start Date</Text>
          <View style={styles.datePicker}>
            <TouchableOpacity onPress={() => incrementDate('start', -1)} style={styles.dateButton} activeOpacity={0.7} accessible accessibilityLabel="Decrease start date" accessibilityRole="button">
              <Ionicons name="chevron-back" size={20} color={colors.primary} />
            </TouchableOpacity>
            <View style={styles.dateDisplay}>
              <Text style={styles.dateText}>{formatDate(startDate)}</Text>
            </View>
            <TouchableOpacity onPress={() => incrementDate('start', 1)} style={styles.dateButton} activeOpacity={0.7} accessible accessibilityLabel="Increase start date" accessibilityRole="button">
              <Ionicons name="chevron-forward" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.dateCard}>
          <Text style={styles.dateLabel}>End Date</Text>
          <View style={styles.datePicker}>
            <TouchableOpacity onPress={() => incrementDate('end', -1)} style={styles.dateButton} activeOpacity={0.7} accessible accessibilityLabel="Decrease end date" accessibilityRole="button">
              <Ionicons name="chevron-back" size={20} color={colors.primary} />
            </TouchableOpacity>
            <View style={styles.dateDisplay}>
              <Text style={styles.dateText}>{formatDate(endDate)}</Text>
            </View>
            <TouchableOpacity onPress={() => incrementDate('end', 1)} style={styles.dateButton} activeOpacity={0.7} accessible accessibilityLabel="Increase end date" accessibilityRole="button">
              <Ionicons name="chevron-forward" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Start</Text>
              <Text style={styles.summaryValue}>{formatDate(startDate)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>End</Text>
              <Text style={styles.summaryValue}>{formatDate(endDate)}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Days</Text>
            <Text style={styles.totalValue}>{getDaysCount()} Day{getDaysCount() > 1 ? 's' : ''}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Continue" onPress={() => { hapticFeedback('heavy'); navigation.navigate('UploadDocument', { leaveType, startDate, endDate, days: getDaysCount() }); }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  heading: { ...typography.h4, color: colors.text, marginBottom: spacing.xs },
  subheading: { ...typography.body, color: colors.primary, fontWeight: '600', marginBottom: spacing.lg },
  dateCard: { marginBottom: spacing.lg },
  dateLabel: { ...typography.label, color: colors.text, marginBottom: spacing.sm },
  datePicker: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, borderWidth: 1.5, borderColor: colors.border },
  dateButton: { padding: spacing.md },
  dateDisplay: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  dateText: { ...typography.body, color: colors.text, fontWeight: '600' },
  summaryCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  summaryItem: { flex: 1 },
  summaryLabel: { ...typography.caption, color: colors.textTertiary, marginBottom: spacing.xs },
  summaryValue: { ...typography.body, color: colors.text, fontWeight: '600' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { ...typography.body, color: colors.text },
  totalValue: { ...typography.h5, color: colors.primary },
  footer: { padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
});
