import React, { useState } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Button, ProgressBar } from '../../components';
import { hapticFeedback } from '../../utils/haptics';

export const CorrectionFormScreen: React.FC<any> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { selectedReason } = route?.params || {};
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  const [checkInTime, setCheckInTime] = useState<string>('09:00 AM');
  const [checkOutTime, setCheckOutTime] = useState<string>('05:00 PM');
  const [reason, setReason] = useState<string>('');
  const MAX_CHARS = 200;

  const handleReview = (): void => {
    hapticFeedback('heavy');
    navigation.navigate('CorrectionSummary', {
      selectedReason,
      date: today,
      checkInTime,
      checkOutTime,
      reason,
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Attendance Correction" onBack={() => navigation.goBack()} />
      <ProgressBar currentStep={2} totalSteps={4} title="Correction Progress" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons name="calendar" size={24} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{today}</Text>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Corrected Check-In Time</Text>
          <TouchableOpacity style={styles.timeInput} onPress={() => { hapticFeedback('light'); Alert.alert('Time Picker', 'Time picker coming soon'); }} activeOpacity={0.7} accessibilityLabel="Select check-in time">
            <Text style={styles.timeText}>{checkInTime}</Text>
            <Ionicons name="time" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Corrected Check-Out Time</Text>
          <TouchableOpacity style={styles.timeInput} onPress={() => { hapticFeedback('light'); Alert.alert('Time Picker', 'Time picker coming soon'); }} activeOpacity={0.7} accessibilityLabel="Select check-out time">
            <Text style={styles.timeText}>{checkOutTime}</Text>
            <Ionicons name="time" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Reason for Correction</Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="Please provide a detailed explanation for this correction request..."
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={4}
              value={reason}
              onChangeText={setReason}
              maxLength={MAX_CHARS}
              accessibilityLabel="Reason for correction"
            />
            <Text style={[styles.charCount, reason.length >= MAX_CHARS && styles.charCountMax]}>
              {reason.length}/{MAX_CHARS}
            </Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={colors.info} />
          <Text style={styles.infoText}>
            Your correction request will be sent to your direct supervisor for approval. Please ensure all details are accurate before proceeding.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Review Request" onPress={handleReview} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  infoCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border },
  infoIcon: { width: 48, height: 48, borderRadius: borderRadius.md, backgroundColor: colors.primaryLighter, justifyContent: 'center', alignItems: 'center' },
  infoLabel: { ...typography.caption, color: colors.textTertiary },
  infoValue: { ...typography.body, color: colors.text, fontWeight: '600', marginTop: spacing.xs },
  field: { marginBottom: spacing.lg },
  label: { ...typography.label, color: colors.text, marginBottom: spacing.sm },
  timeInput: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, height: 48 },
  timeText: { ...typography.body, color: colors.text },
  textAreaContainer: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: borderRadius.lg, padding: spacing.md },
  textArea: { ...typography.body, color: colors.text, minHeight: 100, textAlignVertical: 'top' },
  charCount: { ...typography.caption, color: colors.textTertiary, textAlign: 'right', marginTop: spacing.xs },
  charCountMax: { color: colors.error },
  infoBox: { flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.infoLight, padding: spacing.md, borderRadius: borderRadius.lg },
  infoText: { ...typography.bodySmall, color: colors.info, flex: 1 },
  footer: { padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
});
