import React, { useState } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Button, ProgressBar } from '../../components';
import { hapticFeedback } from '../../utils/haptics';
import { correctionReasons } from '../../data/mockData';
import { attendanceService } from '../../services';

export const CorrectionReasonScreen: React.FC<any> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [selectedReason, setSelectedReason] = useState<any>(null);

  const handleReasonSelect = (id) => {
    hapticFeedback('light');
    setSelectedReason(id);
  };

  const handleContinue = (): void => {
    if (!selectedReason) return;
    hapticFeedback('heavy');
    navigation.navigate('CorrectionForm', { selectedReason });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Attendance Correction" onBack={() => navigation.goBack()} />
      <ProgressBar currentStep={1} totalSteps={3} title="Correction Progress" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Why are you correcting your attendance?</Text>
        <Text style={styles.subheading}>Select the most accurate reason for this request to help our HR team process it quickly.</Text>

        <Text style={styles.sectionLabel}>SELECT REASON</Text>

        <View style={styles.reasonsList}>
          {correctionReasons.map((reason) => {
            const isSelected = selectedReason === reason.id;
            return (
              <TouchableOpacity
                key={reason.id}
                style={[styles.reasonItem, isSelected && styles.reasonItemSelected]}
                onPress={() => handleReasonSelect(reason.id)}
                activeOpacity={0.7}
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
                accessibilityLabel={`${reason.label}${isSelected ? ', selected' : ''}`}
              >
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
                <Text style={[styles.reasonText, isSelected && styles.reasonTextSelected]}>
                  {reason.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={colors.info} />
          <Text style={styles.infoText}>
            Your correction request will be sent to your direct supervisor for approval. Please ensure all details are accurate before proceeding.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedReason}
          accessibilityLabel="Continue to correction form"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  heading: { ...typography.h4, color: colors.text, marginBottom: spacing.sm },
  subheading: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  sectionLabel: { ...typography.label, color: colors.textTertiary, marginBottom: spacing.md },
  reasonsList: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', marginBottom: spacing.lg },
  reasonItem: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  reasonItemSelected: { backgroundColor: colors.primaryLighter },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.border, marginRight: spacing.md, justifyContent: 'center', alignItems: 'center' },
  radioSelected: { borderColor: colors.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  reasonText: { ...typography.body, color: colors.text },
  reasonTextSelected: { fontWeight: '600' },
  infoBox: { flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.infoLight, padding: spacing.md, borderRadius: borderRadius.lg },
  infoText: { ...typography.bodySmall, color: colors.info, flex: 1 },
  footer: { padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
});
