import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Avatar, Button, AnimatedListItem } from '../../components';
import { submitTimesheet } from '../../store';
import { hapticFeedback } from '../../utils/haptics';
import { useFadeIn, useSlideIn } from '../../utils/animations';

export const RevisionRequestedScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const revisionData = route.params?.revision;

  const entries = revisionData?.entries || [
    { day: 'Monday, Oct 23', hours: '8.0 hrs', status: 'ok' },
    { day: 'Tuesday, Oct 24', hours: '7.5 hrs', status: 'ok' },
    { day: 'Friday, Oct 27', hours: 'Correction Needed', status: 'error', activities: [{ name: 'UX Research', project: 'Project Alpha', hours: '4.0h' }, { name: 'Design System', project: 'Internal Ops', hours: '4.0h' }] },
  ];

  const handleResubmit = () => {
    hapticFeedback('heavy');
    submitTimesheet({
      hours: 23.5,
      period: 'Oct 23 - Oct 27',
      activities: entries.length,
    });
    navigation.navigate('TimesheetSubmitted');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Revision Requested" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.reviewerCard}>
          <Avatar source="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" size="large" />
          <View style={styles.reviewerInfo}>
            <Text style={styles.reviewerName}>Alex Washington</Text>
            <Text style={styles.reviewerRole}>Reviewer</Text>
          </View>
        </View>

        <View style={styles.messageCard}>
          <Text style={styles.messageText}>
            "Please double-check the project assignment for Friday. The hours seem correct but the project code might be mismatched."
          </Text>
          <Text style={styles.messageTime}>Sent today at 9:42 AM</Text>
        </View>

        <View style={styles.entriesSection}>
          <View style={styles.entriesHeader}>
            <Text style={styles.entriesTitle}>WEEKLY ENTRIES</Text>
            <Text style={styles.entriesPeriod}>Oct 23 - Oct 27</Text>
          </View>

          {entries.map((entry, index) => (
            <AnimatedListItem key={index} index={index} style={styles.entryRow} onPress={() => {
              hapticFeedback('medium');
            }}>
              <View style={styles.entryLeft}>
                <Ionicons name="calendar-outline" size={18} color={colors.textTertiary} />
                <View>
                  <Text style={styles.entryDay}>{entry.day}</Text>
                  <Text style={[styles.entryHours, entry.status === 'error' && styles.entryHoursError]}>{entry.hours}</Text>
                </View>
              </View>
              {entry.status === 'ok' ? (
                <View style={styles.checkIcon}>
                  <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                </View>
              ) : (
                <TouchableOpacity style={styles.editIcon} onPress={() => {
                  hapticFeedback('medium');
                  navigation.navigate('EditActivity');
                }} activeOpacity={0.7} accessibilityLabel="Edit entry">
                  <Ionicons name="create" size={18} color={colors.warning} />
                </TouchableOpacity>
              )}
            </AnimatedListItem>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Resubmit" onPress={handleResubmit} icon={<Ionicons name="play" size={18} color={colors.textInverse} />} accessibilityLabel="Resubmit timesheet" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  reviewerCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
  reviewerInfo: { flex: 1 },
  reviewerName: { ...typography.h5, color: colors.text },
  reviewerRole: { ...typography.bodySmall, color: colors.textSecondary },
  messageCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border },
  messageText: { ...typography.body, color: colors.text, lineHeight: 24, marginBottom: spacing.md },
  messageTime: { ...typography.caption, color: colors.textTertiary, textAlign: 'right' },
  entriesSection: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  entriesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  entriesTitle: { ...typography.label, color: colors.textTertiary },
  entriesPeriod: { ...typography.bodySmall, color: colors.textSecondary },
  entryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  entryLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  entryDay: { ...typography.body, color: colors.text, fontWeight: '600' },
  entryHours: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  entryHoursError: { color: colors.warning },
  checkIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.successLight, justifyContent: 'center', alignItems: 'center' },
  editIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.warningLight, justifyContent: 'center', alignItems: 'center' },
  footer: { padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
});
