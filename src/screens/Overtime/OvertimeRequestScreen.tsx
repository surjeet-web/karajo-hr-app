import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Button } from '../../components';
import { hapticFeedback } from '../../utils/haptics';

export const OvertimeRequestScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('21:00');
  const [reason, setReason] = useState('');

  useEffect(() => { hapticFeedback('medium'); }, []);

  const calculateDuration = (): number => {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const duration = (endH + endM / 60) - (startH + startM / 60);
    return duration > 0 ? Math.round(duration * 10) / 10 : 0;
  };

  const duration = calculateDuration();

  const handleContinue = (): void => {
    hapticFeedback('medium');
    if (!reason.trim()) {
      Alert.alert('Missing Information', 'Please provide a reason for overtime.');
      return;
    }
    if (duration <= 0) {
      Alert.alert('Invalid Time', 'End time must be after start time.');
      return;
    }
    navigation.navigate('OvertimeReview', {
      date,
      startTime,
      endTime,
      duration,
      reason: reason.trim(),
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Request Overtime" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Overtime Details</Text>
        <Text style={styles.subheading}>Fill in the details for your overtime request.</Text>

        <View style={styles.field}>
          <View style={styles.fieldHeader}>
            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
            <Text style={styles.fieldLabel}>Date</Text>
          </View>
          <View style={styles.fieldValue}>
            <Text style={styles.fieldText}>{date}</Text>
          </View>
        </View>

        <View style={styles.field}>
          <View style={styles.fieldHeader}>
            <Ionicons name="time-outline" size={20} color={colors.primary} />
            <Text style={styles.fieldLabel}>Start Time</Text>
          </View>
          <TextInput
            style={styles.timeInput}
            value={startTime}
            onChangeText={setStartTime}
            placeholder="HH:MM"
            keyboardType="numbers-and-punctuation"
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        <View style={styles.field}>
          <View style={styles.fieldHeader}>
            <Ionicons name="time-outline" size={20} color={colors.primary} />
            <Text style={styles.fieldLabel}>End Time</Text>
          </View>
          <TextInput
            style={styles.timeInput}
            value={endTime}
            onChangeText={setEndTime}
            placeholder="HH:MM"
            keyboardType="numbers-and-punctuation"
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        {duration > 0 && (
          <View style={styles.durationCard}>
            <Ionicons name="timer" size={20} color={colors.success} />
            <Text style={styles.durationText}>Duration: {duration}h</Text>
          </View>
        )}

        <View style={styles.field}>
          <View style={styles.fieldHeader}>
            <Ionicons name="document-text-outline" size={20} color={colors.primary} />
            <Text style={styles.fieldLabel}>Reason</Text>
          </View>
          <TextInput
            style={styles.reasonInput}
            value={reason}
            onChangeText={setReason}
            placeholder="Enter reason for overtime..."
            placeholderTextColor={colors.textTertiary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={colors.info} />
          <Text style={styles.infoText}>
            Overtime requests must be approved by your supervisor. Maximum 3 hours per day.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Continue" onPress={handleContinue} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  heading: { ...typography.h4, color: colors.text, marginBottom: spacing.xs },
  subheading: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  field: { marginBottom: spacing.md },
  fieldHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  fieldLabel: { ...typography.body, color: colors.text, fontWeight: '600' },
  fieldValue: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  fieldText: { ...typography.body, color: colors.text },
  timeInput: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border, ...typography.body, color: colors.text },
  reasonInput: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border, minHeight: 100, ...typography.body, color: colors.text },
  durationCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.successLight, padding: spacing.md, borderRadius: borderRadius.lg, marginBottom: spacing.md },
  durationText: { ...typography.body, color: colors.success, fontWeight: '600' },
  infoBox: { flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.infoLight, padding: spacing.md, borderRadius: borderRadius.lg, marginTop: spacing.md },
  infoText: { ...typography.bodySmall, color: colors.info, flex: 1 },
  footer: { padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
});
