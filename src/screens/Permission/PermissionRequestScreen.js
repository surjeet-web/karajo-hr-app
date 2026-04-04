import { hapticFeedback } from '../../utils/haptics';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Button } from '../../components';
import { getState, subscribe, requestPermission } from '../../store';

export const PermissionRequestScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [appState, setAppState] = useState(getState());
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:30');
  const [reason, setReason] = useState('');

  useEffect(() => {
    const unsubscribe = subscribe(setAppState);
    return unsubscribe;
  }, []);

  const remaining = Math.max(0, appState.permission.monthlyAllowance - appState.permission.totalHoursUsed);

  const calcDuration = () => {
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const diff = (eh * 60 + em) - (sh * 60 + sm);
    return diff > 0 ? (diff / 60).toFixed(1) : 0;
  };

  const duration = calcDuration();

  const handleSubmit = () => {
    if (!reason.trim()) return;
    const parsedDuration = parseFloat(duration);
    requestPermission({ date, startTime, endTime, duration: parsedDuration, reason: reason.trim() });
    navigation.navigate('PermissionSuccess', { date, startTime, endTime, duration: parsedDuration, reason: reason.trim() });
  };

  const isFormValid = reason.trim().length > 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Permission Request" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.remainingBanner}>
          <Ionicons name="time-outline" size={18} color={remaining > 4 ? colors.success : colors.error} />
          <Text style={[styles.remainingText, { color: remaining > 4 ? colors.success : colors.error }]}>
            {remaining}h remaining this month
          </Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Date</Text>
          <View style={styles.dateInput}>
            <Text style={styles.dateText}>{date}</Text>
            <Ionicons name="calendar" size={20} color={colors.textTertiary} />
          </View>
        </View>

        <View style={styles.timeRow}>
          <View style={[styles.field, styles.timeField]}>
            <Text style={styles.label}>Start Time</Text>
            <TextInput
              style={styles.timeInputField}
              value={startTime}
              onChangeText={setStartTime}
              keyboardType="numbers-and-punctuation"
              placeholder="HH:MM"
              placeholderTextColor={colors.textTertiary}
              accessibilityLabel="Start time"
            />
          </View>
          <View style={[styles.field, styles.timeField]}>
            <Text style={styles.label}>End Time</Text>
            <TextInput
              style={styles.timeInputField}
              value={endTime}
              onChangeText={setEndTime}
              keyboardType="numbers-and-punctuation"
              placeholder="HH:MM"
              placeholderTextColor={colors.textTertiary}
              accessibilityLabel="End time"
            />
          </View>
        </View>

        <View style={styles.durationRow}>
          <Text style={styles.durationLabel}>Total Duration</Text>
          <View style={styles.durationBadge}>
            <Ionicons name="time" size={14} color={colors.primary} />
            <Text style={styles.durationText}>{duration}h</Text>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Reason</Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="Please provide a reason for your permission request..."
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={4}
              value={reason}
              onChangeText={setReason}
              maxLength={200}
              accessibilityLabel="Reason for permission request"
            />
            <Text style={styles.charCount}>{reason.length}/200</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={colors.info} />
          <Text style={styles.infoText}>
            Permission requests are subject to supervisor approval. Please ensure your reason is clear and valid.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Submit Request"
          onPress={() => { hapticFeedback('heavy'); handleSubmit(); }}
          disabled={!isFormValid}
          accessibilityLabel="Submit permission request"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  remainingBanner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderRadius: borderRadius.lg, marginBottom: spacing.lg, backgroundColor: colors.successLight },
  remainingText: { ...typography.body, fontWeight: '600' },
  field: { marginBottom: spacing.lg },
  label: { ...typography.label, color: colors.text, marginBottom: spacing.sm },
  dateInput: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, height: 48 },
  dateText: { ...typography.body, color: colors.text },
  timeRow: { flexDirection: 'row', gap: spacing.md },
  timeField: { flex: 1 },
  timeInputField: { ...typography.body, color: colors.text, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, height: 48 },
  durationRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  durationLabel: { ...typography.body, color: colors.text },
  durationBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: colors.primaryLighter, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full },
  durationText: { ...typography.bodySmall, color: colors.primary, fontWeight: '600' },
  textAreaContainer: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: borderRadius.lg, padding: spacing.md },
  textArea: { ...typography.body, color: colors.text, minHeight: 100, textAlignVertical: 'top' },
  charCount: { ...typography.caption, color: colors.textTertiary, textAlign: 'right', marginTop: spacing.xs },
  infoBox: { flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.infoLight, padding: spacing.md, borderRadius: borderRadius.lg },
  infoText: { ...typography.bodySmall, color: colors.info, flex: 1 },
  footer: { padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
});
