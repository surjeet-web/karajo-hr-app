import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Button } from '../../components';
import { penaltyData } from '../../data/mockData';
import { appealPenalty } from '../../store';
import { hapticFeedback } from '../../animations/hooks';

export const PenaltyReviewScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { penalty, appealType, explanation, supportingDoc } = route.params || {};

  const getAppealTypeLabel = (id) => {
    const type = penaltyData.appealTypes.find(t => t.id === id);
    return type ? type.label : 'Unknown';
  };

  const summaryItems = [
    { icon: 'alert-circle', label: 'Penalty Type', value: penalty?.type || 'N/A' },
    { icon: 'document-outline', label: 'Reference', value: penalty?.reference || 'N/A' },
    { icon: 'help-circle', label: 'Appeal Reason', value: getAppealTypeLabel(appealType) },
    { icon: 'calendar-outline', label: 'Appeal Deadline', value: penalty?.appealDeadline || 'N/A' },
  ];

  const handleSubmit = () => {
    hapticFeedback('medium');
    appealPenalty({
      penaltyId: penalty?.id,
      penaltyType: penalty?.type,
      type: getAppealTypeLabel(appealType),
      explanation,
      supportingDoc,
    });
    navigation.navigate('PenaltySuccess');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Review Appeal" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Ionicons name="document-text" size={24} color={colors.primary} />
          </View>
          <Text style={styles.summaryTitle}>Appeal Summary</Text>
          <Text style={styles.summarySubtitle}>Please review your appeal details before submitting</Text>
        </View>

        {summaryItems.map((item, index) => (
          <View key={index} style={styles.summaryRow}>
            <View style={styles.summaryRowIcon}>
              <Ionicons name={item.icon} size={18} color={colors.textTertiary} />
            </View>
            <View style={styles.summaryRowText}>
              <Text style={styles.summaryRowLabel}>{item.label}</Text>
              <Text style={styles.summaryRowValue}>{item.value}</Text>
            </View>
          </View>
        ))}

        <View style={styles.explanationCard}>
          <Text style={styles.explanationLabel}>Your Explanation</Text>
          <Text style={styles.explanationText}>{explanation || 'No explanation provided.'}</Text>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="shield-checkmark" size={20} color={colors.success} />
          <Text style={styles.infoText}>
            Once submitted, your appeal will be reviewed by the HR department. You will be notified of the outcome within 5-7 business days.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Confirm & Submit" onPress={handleSubmit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  summaryCard: { alignItems: 'center', marginBottom: spacing.xl, padding: spacing.lg },
  summaryIcon: { width: 56, height: 56, borderRadius: borderRadius.lg, backgroundColor: colors.primaryLighter, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md },
  summaryTitle: { ...typography.h4, color: colors.text, marginBottom: spacing.xs },
  summarySubtitle: { ...typography.bodySmall, color: colors.textSecondary, textAlign: 'center' },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  summaryRowIcon: { width: 36, height: 36, borderRadius: borderRadius.md, backgroundColor: colors.surfaceVariant, justifyContent: 'center', alignItems: 'center' },
  summaryRowText: { flex: 1 },
  summaryRowLabel: { ...typography.caption, color: colors.textTertiary, marginBottom: spacing.xs },
  summaryRowValue: { ...typography.body, color: colors.text, fontWeight: '600' },
  explanationCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginTop: spacing.lg, borderWidth: 1, borderColor: colors.border },
  explanationLabel: { ...typography.label, color: colors.textTertiary, marginBottom: spacing.sm },
  explanationText: { ...typography.body, color: colors.textSecondary, lineHeight: 22 },
  infoBox: { flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.successLight, padding: spacing.md, borderRadius: borderRadius.lg, marginTop: spacing.lg },
  infoText: { ...typography.bodySmall, color: colors.success, flex: 1 },
  footer: { padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
});
