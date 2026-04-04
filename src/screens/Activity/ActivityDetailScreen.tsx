import React, { useState, useEffect } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Badge, StatusTimeline } from '../../components';
import { hapticFeedback } from '../../utils/haptics';
import { getState, subscribe } from '../../store';

export const ActivityDetailScreen: React.FC<any> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [state, setStateLocal] = useState(getState());
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => { const unsub = subscribe(setStateLocal); return unsub; }, []);
  const onRefresh = (): void => { setRefreshing(true); setStateLocal(getState()); setRefreshing(false); };

  const activity = route.params?.activity;
  const activities = state.activities.items;
  const foundActivity = activity || activities.find(a => a.id === route.params?.id) || activities[0];

  const timeline = [
    { status: 'Created', label: 'Activity created by', by: 'You', date: foundActivity?.date || 'Today' },
    { status: 'Reviewed', label: 'Reviewed by manager', by: 'James Wilson', date: foundActivity?.date || 'Today' },
    { status: 'Finalized', label: 'Synced to timesheet', by: 'System', date: foundActivity?.date || 'Today' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Activity Record" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        <View style={styles.headerRow}>
          <Badge text="Submitted" variant="info" />
          <Text style={styles.recordId}>#ACT-{foundActivity?.id || '0000'}</Text>
        </View>
        <Text style={styles.title}>{foundActivity?.title || 'Activity'}</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <View style={styles.infoIconRow}><Ionicons name="briefcase" size={16} color={colors.primary} /><Text style={styles.infoLabel}>Project</Text></View>
            <Text style={styles.infoValue}>{foundActivity?.project || '-'}</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoIconRow}><Ionicons name="calendar" size={16} color={colors.primary} /><Text style={styles.infoLabel}>Date</Text></View>
            <Text style={styles.infoValue}>{foundActivity?.date || '-'}</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoIconRow}><Ionicons name="time" size={16} color={colors.primary} /><Text style={styles.infoLabel}>Duration</Text></View>
            <Text style={styles.infoValue}>{foundActivity?.duration || '-'}</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoIconRow}><Ionicons name="alarm" size={16} color={colors.primary} /><Text style={styles.infoLabel}>Time</Text></View>
            <Text style={styles.infoValue}>{foundActivity?.time || '-'}</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoIconRow}><Ionicons name="pricetag" size={16} color={colors.primary} /><Text style={styles.infoLabel}>Category</Text></View>
            <Text style={styles.infoValue}>{foundActivity?.category || '-'}</Text>
          </View>
        </View>
        {foundActivity?.description && (
          <View style={styles.descriptionCard}>
            <Text style={styles.descLabel}>Description</Text>
            <Text style={styles.descText}>{foundActivity.description}</Text>
          </View>
        )}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={colors.info} />
          <Text style={styles.infoBoxText}>This record has been finalized and synced with the central timesheet system.</Text>
        </View>
        <View style={styles.timelineSection}>
          <Text style={styles.timelineTitle}>History Log</Text>
          <StatusTimeline items={timeline} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  recordId: { ...typography.bodySmall, color: colors.textTertiary },
  title: { ...typography.h3, color: colors.text, marginBottom: spacing.lg },
  infoGrid: { gap: spacing.md, marginBottom: spacing.lg },
  infoItem: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md },
  infoIconRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xs },
  infoLabel: { ...typography.bodySmall, color: colors.textSecondary },
  infoValue: { ...typography.body, color: colors.text, fontWeight: '600' },
  descriptionCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.lg },
  descLabel: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.sm },
  descText: { ...typography.body, color: colors.text },
  infoBox: { flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.infoLight, padding: spacing.md, borderRadius: borderRadius.lg, marginBottom: spacing.lg },
  infoBoxText: { ...typography.bodySmall, color: colors.info, flex: 1 },
  timelineSection: { marginTop: spacing.md },
  timelineTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
});
