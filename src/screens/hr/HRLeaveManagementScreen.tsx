import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card, Badge } from '../../components';
import { StatCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';
import { getState, subscribe } from '../../store';

export const HRLeaveManagementScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [appState, setAppState] = useState(getState());
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => { const unsub = subscribe(setAppState); return unsub; }, []);
  const onRefresh = (): void => { setRefreshing(true); setAppState(getState()); setRefreshing(false); };

  const { leave } = appState;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Leave Management" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        <View style={styles.statsRow}>
          <StatCard icon="umbrella" label="Annual" value={leave.balances[0]?.remaining || 0} color={colors.primary} delay={0} />
          <StatCard icon="medkit" label="Sick" value={leave.balances[1]?.remaining || 0} color={colors.error} delay={100} />
          <StatCard icon="person" label="Personal" value={leave.balances[2]?.remaining || 0} color={colors.accentPurple} delay={200} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Leave Balances</Text>
          {leave.balances.map((balance, i) => (
            <Card key={balance.type} style={styles.balanceCard} padding="md">
              <View style={styles.balanceHeader}>
                <View style={[styles.balanceIcon, { backgroundColor: `${balance.color}15` }]}>
                  <Ionicons name={balance.icon} size={20} color={balance.color} />
                </View>
                <View style={styles.balanceInfo}>
                  <Text style={styles.balanceType}>{balance.type} Leave</Text>
                  <Text style={styles.balanceSubtext}>{balance.total !== null ? balance.total + ' days allocated' : 'Unlimited'}</Text>
                </View>
                <Text style={[styles.balanceRemaining, { color: balance.color }]}>{balance.remaining !== null ? balance.remaining : '∞'}</Text>
              </View>
              {balance.total !== null && (
                <View style={styles.balanceBar}>
                  <View style={[styles.balanceFill, { width: `${(balance.used / balance.total) * 100}%`, backgroundColor: balance.color }]} />
                </View>
              )}
            </Card>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Leave Requests</Text>
          {leave.requests.slice(0, 5).map((request, i) => (
            <TouchableOpacity key={request.id} style={[styles.requestRow, shadows.sm]} activeOpacity={0.7}>
              <View style={styles.requestInfo}>
                <Text style={styles.requestType}>{request.type} Leave</Text>
                <Text style={styles.requestDates}>{request.startDate} to {request.endDate} ({request.days} days)</Text>
              </View>
              <Badge text={request.status} variant={request.status === 'approved' ? 'success' : request.status === 'pending' ? 'warning' : 'error'} size="small" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  balanceCard: { marginBottom: spacing.sm },
  balanceHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm },
  balanceIcon: { width: 40, height: 40, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center' },
  balanceInfo: { flex: 1 },
  balanceType: { ...typography.body, color: colors.text, fontWeight: '600' },
  balanceSubtext: { ...typography.bodySmall, color: colors.textSecondary },
  balanceRemaining: { ...typography.h4, fontWeight: '700' },
  balanceBar: { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  balanceFill: { height: '100%', borderRadius: 3 },
  requestRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm },
  requestInfo: { flex: 1 },
  requestType: { ...typography.body, color: colors.text, fontWeight: '600' },
  requestDates: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
});
