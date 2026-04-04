import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Card, Badge, Button, AnimatedCard, AnimatedListItem } from '../../components';
import { useFadeIn, useSlideIn, useStaggerList } from '../../utils/animations';
import { hapticFeedback } from '../../utils/haptics';
import { getState, subscribe } from '../../store';

export const LeaveHomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [appState, setAppState] = useState(getState());
  const [refreshing, setRefreshing] = useState(false);
  const fadeIn = useFadeIn(400);
  const slideUp = useSlideIn('up', 20, 500, 100);

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
  const balances = leave.balances;
  const requests = leave.requests;
  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const totalUsed = balances.reduce((sum, b) => sum + (b.used || 0), 0);
  const totalRemaining = balances.reduce((sum, b) => sum + (b.remaining || 0), 0);
  const staggerAnims = useStaggerList(requests.length, 80);

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
      <Header title="Leave" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
        }
      >
        <Text style={styles.sectionTitle}>Leave Balance</Text>

        {balances.map((balance, i) => (
          <AnimatedCard key={balance.type} style={styles.balanceCard} padding="lg" delay={i * 100}>
            <View style={styles.balanceHeader}>
              <View style={[styles.balanceIcon, { backgroundColor: `${balance.color}15` }]}>
                <Ionicons name={balance.icon} size={20} color={balance.color} />
              </View>
              <View style={styles.balanceInfo}>
                <Text style={styles.balanceType}>{balance.type} Leave</Text>
                <Text style={styles.balanceSubtext}>{balance.total !== null ? balance.total + ' days allocated' : 'Unlimited'}</Text>
              </View>
            </View>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceValue}>{balance.remaining !== null ? balance.remaining : '∞'}</Text>
              <Text style={styles.balanceUnit}>Days Remaining</Text>
            </View>
            {balance.total !== null && (
              <>
                <View style={styles.balanceBar}>
                  <View style={[styles.balanceFill, { width: `${(balance.used / balance.total) * 100}%`, backgroundColor: balance.color }]} />
                </View>
                <View style={styles.balanceStats}>
                  <Text style={styles.balanceStat}>{balance.used} Used</Text>
                  <Text style={styles.balanceStat}>{balance.total} Total</Text>
                </View>
              </>
            )}
          </AnimatedCard>
        ))}

        <View style={styles.statsGrid}>
          <Card style={styles.statCard} padding="md">
            <View style={styles.statIconRow}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text style={styles.statLabel}>TOTAL USED</Text>
            </View>
            <Text style={styles.statValue}>{totalUsed} Days</Text>
          </Card>
          <Card style={styles.statCard} padding="md">
            <View style={styles.statIconRow}>
              <Ionicons name="time" size={16} color={colors.warning} />
              <Text style={styles.statLabel}>PENDING</Text>
            </View>
            <Text style={styles.statValue}>{pendingCount}</Text>
          </Card>
        </View>

        <View style={styles.requestsSection}>
          <View style={styles.requestsHeader}>
            <Text style={styles.requestsTitle}>Recent Requests</Text>
            <TouchableOpacity onPress={() => { hapticFeedback('medium'); navigation.navigate('LeaveHistory'); }} activeOpacity={0.7} accessible accessibilityLabel="View all leave requests" accessibilityRole="button">
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {requests.map((request, i) => (
            <AnimatedListItem key={request.id} style={styles.requestCard} animation={staggerAnims[i]} onPress={() => { hapticFeedback('medium'); }}>
              <View style={styles.requestDate}>
                <View style={styles.dateBadge}>
                  <Text style={styles.dateMonth}>{new Date(request.startDate).toLocaleString('default', { month: 'short' })}</Text>
                  <Text style={styles.dateDay}>{new Date(request.startDate).getDate()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.requestType}>{request.type} Leave</Text>
                  <Text style={styles.requestDates}>{request.startDate} to {request.endDate} ({request.days} days)</Text>
                  {request.status === 'pending' && (
                    <Text style={styles.requestReason}>{request.reason}</Text>
                  )}
                </View>
              </View>
              <View style={styles.requestFooter}>
                <Badge text={request.status.charAt(0).toUpperCase() + request.status.slice(1)} variant={getStatusVariant(request.status)} size="small" />
                <Text style={styles.appliedDate}>Applied: {request.appliedOn}</Text>
              </View>
            </AnimatedListItem>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Request Leave" icon={<Ionicons name="add" size={20} color={colors.textInverse} />} onPress={() => { hapticFeedback('heavy'); navigation.navigate('SelectLeaveType'); }} accessible accessibilityLabel="Request a new leave" accessibilityRole="button" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  balanceCard: { marginBottom: spacing.md },
  balanceHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  balanceIcon: { width: 40, height: 40, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center' },
  balanceInfo: { flex: 1 },
  balanceType: { ...typography.body, color: colors.text, fontWeight: '600' },
  balanceSubtext: { ...typography.bodySmall, color: colors.textSecondary },
  balanceRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs, marginTop: spacing.sm },
  balanceValue: { ...typography.statNumberSmall, color: colors.text },
  balanceUnit: { ...typography.bodySmall, color: colors.textSecondary },
  balanceBar: { height: 6, backgroundColor: colors.border, borderRadius: 3, marginTop: spacing.md, overflow: 'hidden' },
  balanceFill: { height: '100%', borderRadius: 3 },
  balanceStats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm },
  balanceStat: { ...typography.caption, color: colors.textTertiary },
  statsGrid: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  statCard: { flex: 1 },
  statIconRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xs },
  statLabel: { ...typography.caption, color: colors.textTertiary },
  statValue: { ...typography.h5, color: colors.text },
  requestsSection: { marginBottom: spacing.lg },
  requestsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  requestsTitle: { ...typography.h5, color: colors.text },
  viewAllText: { ...typography.bodySmall, color: colors.primary, fontWeight: '600' },
  requestCard: { marginBottom: spacing.sm },
  requestDate: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm },
  dateBadge: { width: 44, height: 44, borderRadius: borderRadius.md, backgroundColor: colors.primaryLighter, justifyContent: 'center', alignItems: 'center' },
  dateMonth: { ...typography.caption, color: colors.primary, fontWeight: '600' },
  dateDay: { ...typography.h5, color: colors.primary, fontWeight: '700' },
  requestType: { ...typography.body, color: colors.text, fontWeight: '600' },
  requestDates: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  requestReason: { ...typography.caption, color: colors.textTertiary, marginTop: spacing.xs },
  requestFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm },
  appliedDate: { ...typography.caption, color: colors.textTertiary },
  footer: { padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
});
