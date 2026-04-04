import React, { useState, useEffect, useCallback } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Card, Badge, Button } from '../../components';
import { getState, subscribe, requestOvertime } from '../../store';
import { hapticFeedback } from '../../utils/haptics';
import { AnimatedListItem } from '../../components';

export const OvertimeHomeScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [appState, setAppState] = useState(getState());
  const [activeTab, setActiveTab] = useState<string>('all');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = subscribe(setAppState);
    return unsubscribe;
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setAppState(getState());
    setRefreshing(false);
  }, []);

  const { overtime } = appState;
  const filtered = activeTab === 'all' ? overtime.requests : overtime.requests.filter(r => r.status === activeTab);

  const handleSubmit = (): void => {
    const today = new Date().toISOString().split('T')[0];
    const overtimeData = { date: today, startTime: '18:00', endTime: '21:00', duration: 3, reason: 'Additional work hours' };
    requestOvertime(overtimeData);
    navigation.navigate('OvertimeSuccess', overtimeData);
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Overtime" onBack={() => navigation.goBack()} />

      <View style={styles.tabsContainer}>
        {['all', 'pending', 'approved', 'rejected'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => { hapticFeedback('light'); setActiveTab(tab); }}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === tab }}
            accessibilityLabel={`${tab} overtime requests`}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <Card style={styles.summaryCard} padding="lg">
          <Text style={styles.summaryLabel}>Total Approved OT</Text>
          <Text style={styles.summaryValue}>{overtime.totalApproved}h</Text>
          <View style={styles.changeRow}>
            <Ionicons name="time" size={14} color="rgba(255,255,255,0.7)" />
            <Text style={styles.changeText}>{overtime.totalPending}h pending approval</Text>
          </View>
        </Card>

        {filtered.map((request) => (
          <Card key={request.id} style={styles.requestCard} padding="md">
            <View style={styles.requestHeader}>
              <Text style={styles.requestDate}>{request.date}</Text>
              <Badge text={request.status.charAt(0).toUpperCase() + request.status.slice(1)} variant={getStatusVariant(request.status)} size="small" />
            </View>
            <Text style={styles.requestReason}>{request.reason}</Text>
            <View style={styles.timeRow}>
              <Ionicons name="time-outline" size={14} color={colors.textTertiary} />
              <Text style={styles.timeText}>{request.startTime} - {request.endTime}</Text>
            </View>
            <View style={styles.durationRow}>
              <Text style={styles.durationText}>{request.duration}h</Text>
            </View>
          </Card>
        ))}

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={64} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>No Overtime Records</Text>
            <Text style={styles.emptySubtitle}>Your overtime requests will appear here.</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Request Overtime"
          icon={<Ionicons name="add" size={20} color={colors.textInverse} />}
          onPress={() => { hapticFeedback('heavy'); handleSubmit(); }}
          accessibilityLabel="Request overtime"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  tabsContainer: { flexDirection: 'row', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.lg },
  tab: { paddingVertical: spacing.xs },
  activeTab: { borderBottomWidth: 2, borderBottomColor: colors.primary },
  tabText: { ...typography.body, color: colors.textSecondary },
  activeTabText: { color: colors.primary, fontWeight: '600' },
  scrollContent: { padding: spacing.lg },
  summaryCard: { backgroundColor: colors.primary, marginBottom: spacing.lg },
  summaryLabel: { ...typography.bodySmall, color: 'rgba(255,255,255,0.7)', marginBottom: spacing.sm },
  summaryValue: { ...typography.statNumber, color: colors.textInverse },
  changeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm },
  changeText: { ...typography.bodySmall, color: 'rgba(255,255,255,0.7)' },
  sectionTitle: { ...typography.label, color: colors.textTertiary, marginBottom: spacing.md },
  requestCard: { marginBottom: spacing.md },
  requestHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  requestDate: { ...typography.body, color: colors.text, fontWeight: '600' },
  requestReason: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.sm },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.sm },
  timeText: { ...typography.bodySmall, color: colors.textTertiary },
  durationRow: { alignItems: 'flex-end' },
  durationText: { ...typography.body, color: colors.text, fontWeight: '600' },
  footer: { padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxxxl },
  emptyTitle: { ...typography.h4, color: colors.text, marginTop: spacing.md },
  emptySubtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
});
