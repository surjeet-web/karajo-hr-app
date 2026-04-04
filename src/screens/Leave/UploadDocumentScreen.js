import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Button, ProgressBar } from '../../components';

export const UploadDocumentScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { leaveType, startDate, endDate, days } = route.params || {};
  const [reason, setReason] = useState('');
  const [delegate, setDelegate] = useState('');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Additional Details" onBack={() => navigation.goBack()} />
      <ProgressBar currentStep={3} totalSteps={4} title="Request Leave" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Provide additional details</Text>
        <Text style={styles.subheading}>Add a reason and optional delegate for your leave request.</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Reason for Leave</Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="Briefly explain the reason for your leave..."
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={4}
              value={reason}
              onChangeText={setReason}
              maxLength={300}
            />
            <Text style={styles.charCount}>{reason.length}/300</Text>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Delegate (Optional)</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={colors.textTertiary} />
            <TextInput
              style={styles.input}
              placeholder="Who will cover your responsibilities?"
              placeholderTextColor={colors.textTertiary}
              value={delegate}
              onChangeText={setDelegate}
            />
          </View>
        </View>

        <View style={styles.uploadArea}>
          <Ionicons name="cloud-upload" size={32} color={colors.primary} />
          <Text style={styles.uploadTitle}>Upload Document (Optional)</Text>
          <Text style={styles.uploadSubtitle}>PDF, JPG, PNG (max 5MB)</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Continue" onPress={() => navigation.navigate('LeaveReview', { leaveType, startDate, endDate, days, reason, delegate })} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  heading: { ...typography.h4, color: colors.text, marginBottom: spacing.sm },
  subheading: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  field: { marginBottom: spacing.lg },
  label: { ...typography.label, color: colors.text, marginBottom: spacing.sm },
  textAreaContainer: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: borderRadius.lg, padding: spacing.md },
  textArea: { ...typography.body, color: colors.text, minHeight: 100, textAlignVertical: 'top' },
  charCount: { ...typography.caption, color: colors.textTertiary, textAlign: 'right', marginTop: spacing.xs },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, height: 48, gap: spacing.sm },
  input: { flex: 1, ...typography.body, color: colors.text },
  uploadArea: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.xl, alignItems: 'center', borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed', marginBottom: spacing.lg },
  uploadTitle: { ...typography.h5, color: colors.text, marginTop: spacing.md, marginBottom: spacing.xs },
  uploadSubtitle: { ...typography.bodySmall, color: colors.textTertiary },
  footer: { padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
});
