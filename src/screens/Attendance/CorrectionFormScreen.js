import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Button, ProgressBar } from '../../components';

export const CorrectionFormScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [reason, setReason] = useState('');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Attendance Correction" onBack={() => navigation.goBack()} />
      <ProgressBar currentStep={2} totalSteps={3} title="Correction Progress" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons name="calendar" size={24} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>Monday, Feb 23, 2023</Text>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Corrected Check-In Time</Text>
          <TouchableOpacity style={styles.timeInput}>
            <Text style={styles.timeText}>09:00 AM</Text>
            <Ionicons name="time" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Corrected Check-Out Time</Text>
          <TouchableOpacity style={styles.timeInput}>
            <Text style={styles.timeText}>05:00 PM</Text>
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
              maxLength={200}
            />
            <Text style={styles.charCount}>{reason.length}/200</Text>
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
        <Button title="Review Request" onPress={() => navigation.navigate('CorrectionSummary')} />
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
  infoBox: { flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.infoLight, padding: spacing.md, borderRadius: borderRadius.lg },
  infoText: { ...typography.bodySmall, color: colors.info, flex: 1 },
  footer: { padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
});
