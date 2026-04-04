import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Card, Badge, AnimatedListItem } from '../../components';
import { useFadeIn, useStaggerList } from '../../utils/animations';
import { hapticFeedback } from '../../utils/haptics';
import { getState, subscribe } from '../../store';

export const LeaveHistoryScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [appState, setAppState] = useState(getState());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribe(setAppState);
    return unsubscribe;
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setAppState(getState());
    setRefreshing(false);
  }, []);

  const { leave } = appState;
  const requests = leave.requests;
  const fadeIn = useFadeIn(400);
  const staggerAnims = useStaggerList(requests.length, 80);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getMonthLabel = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const grouped = requests.reduce((acc, req) => {
    const month = getMonthLabel(req.startDate);
    if (!acc[month]) acc[month] = [];
    acc[month].push(req);
    return acc;
  }, {});

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Leave History" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
        }
      >
        {Object.entries(grouped).map(([month, items]) => (
          <View key={month}>
            <Text style={styles.sectionTitle}>{month}</Text>
            {items.map((item, idx) => {
              const globalIdx = Object.entries(grouped).reduce((acc, [m, arr]) => {
                if (m === month) return acc;
                return acc + arr.length;
              }, 0) + idx;
              const startMonth = new Date(item.startDate).toLocaleString('default', { month: 'short' }).toUpperCase();
              const startDay = new Date(item.startDate).getDate();
              return (
                <AnimatedListItem key={item.id} style={styles.historyCard} animation={staggerAnims[globalIdx]} onPress={() => hapticFeedback('medium')}>
                  <View style={styles.historyHeader}>
                    <View style={styles.historyLeft}>
                      <View style={styles.dateBadge}>
                        <Text style={styles.dateMonth}>{startMonth}</Text>
                        <Text style={styles.dateDay}>{startDay}</Text>
                      </View>
                      <View>
                        <Text style={styles.historyType}>{item.type} Leave</Text>
                        <Text style={styles.historySubtype}>{item.reason}</Text>
                      </View>
                    </View>
                    <Badge text={item.status.charAt(0).toUpperCase() + item.status.slice(1)} variant={getStatusVariant(item.status)} size="small" />
                  </View>
                  <View style={styles.historyDetails}>
                    <Text style={styles.historyDates}>{item.startDate} to {item.endDate} ({item.days} days)</Text>
                    <Text style={styles.appliedDate}>Applied: {item.appliedOn}</Text>
                  </View>
                </AnimatedListItem>
              );
            })}
          </View>
        ))}

        {requests.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-clear-outline" size={64} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>No Leave History</Text>
            <Text style={styles.emptySubtitle}>Your leave requests will appear here.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  sectionTitle: { ...typography.label, color: colors.textTertiary, marginBottom: spacing.md, marginTop: spacing.lg },
  historyCard: { marginBottom: spacing.md },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm },
  historyLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  dateBadge: { width: 44, height: 44, borderRadius: borderRadius.md, backgroundColor: colors.warningLight, justifyContent: 'center', alignItems: 'center' },
  dateMonth: { ...typography.caption, color: colors.warning, fontWeight: '600' },
  dateDay: { ...typography.h5, color: colors.warning, fontWeight: '700' },
  historyType: { ...typography.body, color: colors.text, fontWeight: '600' },
  historySubtype: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  historyDetails: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm, marginTop: spacing.sm },
  historyDates: { ...typography.bodySmall, color: colors.textSecondary },
  appliedDate: { ...typography.caption, color: colors.textTertiary },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxxxl },
  emptyTitle: { ...typography.h4, color: colors.text, marginTop: spacing.md },
  emptySubtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
});
