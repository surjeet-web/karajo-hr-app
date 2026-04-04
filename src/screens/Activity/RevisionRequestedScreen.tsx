import React, { useState, useEffect } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Avatar, Button, Card } from '../../components';
import { hapticFeedback } from '../../utils/haptics';
import { getState, subscribe } from '../../store';

export const RevisionRequestedScreen: React.FC<any> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [state, setStateLocal] = useState(getState());
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => { const unsub = subscribe(setStateLocal); return unsub; }, []);
  const onRefresh = (): void => { setRefreshing(true); setStateLocal(getState()); setRefreshing(false); };

  const revisionData = route.params?.revision;
  const activities = state.activities.items;
  const submissions = state.activities.submissions;

  const entries = revisionData?.entries || [
    { day: 'Monday', hours: '8.0 hrs', status: 'ok' },
    { day: 'Tuesday', hours: '7.5 hrs', status: 'ok' },
    { day: 'Wednesday', hours: 'Correction Needed', status: 'error', activities: activities.slice(0, 2) },
    { day: 'Thursday', hours: '8.0 hrs', status: 'ok' },
    { day: 'Friday', hours: '7.0 hrs', status: 'ok' },
  ];

  const handleResubmit = (): void => {
    hapticFeedback('heavy');
    navigation.navigate('TimesheetSubmitted', { period: 'This Week', hours: '40.5', activityCount: activities.length });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Revision Requested" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        <Card style={styles.reviewerCard} padding="lg">
          <View style={styles.reviewerRow}>
            <Avatar name="James Wilson" size="large" />
            <View style={styles.reviewerInfo}>
              <Text style={styles.reviewerName}>James Wilson</Text>
              <Text style={styles.reviewerRole}>Engineering Manager</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.messageCard} padding="lg">
          <View style={styles.messageRow}>
            <Ionicons name="chatbubble-ellipses" size={24} color={colors.warning} />
            <Text style={styles.messageText}>Please update the activity descriptions for Wednesday. The current entries need more detail for client billing purposes.</Text>
          </View>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Entries</Text>
          {entries.map((entry, i) => (
            <TouchableOpacity key={i} style={[styles.entryRow, shadows.sm]} onPress={() => entry.status === 'error' && navigation.navigate('EditActivity')} activeOpacity={0.7}>
              <View style={styles.entryInfo}>
                <Text style={styles.entryDay}>{entry.day}</Text>
                <Text style={styles.entryHours}>{entry.hours}</Text>
              </View>
              {entry.status === 'error' ? (
                <TouchableOpacity style={styles.editBtn} onPress={() => { hapticFeedback('medium'); navigation.navigate('EditActivity'); }}>
                  <Ionicons name="create" size={18} color={colors.error} />
                  <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>
              ) : (
                <Ionicons name="checkmark-circle" size={24} color={colors.success} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Button title="Resubmit Timesheet" onPress={handleResubmit} style={styles.resubmitBtn} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  reviewerCard: { marginBottom: spacing.md },
  reviewerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  reviewerInfo: { flex: 1 },
  reviewerName: { ...typography.body, color: colors.text, fontWeight: '600' },
  reviewerRole: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  messageCard: { marginBottom: spacing.lg, backgroundColor: colors.warningLight },
  messageRow: { flexDirection: 'row', gap: spacing.sm },
  messageText: { ...typography.body, color: colors.warning, flex: 1 },
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  entryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm },
  entryInfo: { flex: 1 },
  entryDay: { ...typography.body, color: colors.text, fontWeight: '600' },
  entryHours: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.errorLight, borderRadius: borderRadius.md },
  editBtnText: { ...typography.bodySmall, color: colors.error, fontWeight: '600' },
  resubmitBtn: { marginTop: spacing.md },
});
