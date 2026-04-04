import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header } from '../../components';
import { ApprovalCard, ApprovalSheet, StatCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';

const MOCK_EXPENSES = [
  { id: 1, type: 'expense', requesterName: 'James Wilson', department: 'Engineering', date: 'Feb 27', amount: 450, reason: 'Flight to NYC', status: 'pending' },
  { id: 2, type: 'expense', requesterName: 'Rachel Green', department: 'Engineering', date: 'Feb 26', amount: 85, reason: 'Client lunch', status: 'pending' },
  { id: 3, type: 'expense', requesterName: 'Tom Brown', department: 'Engineering', date: 'Feb 25', amount: 32, reason: 'Office supplies', status: 'approved' },
  { id: 4, type: 'expense', requesterName: 'Emma Wilson', department: 'Marketing', date: 'Feb 24', amount: 1200, reason: 'Conference registration', status: 'pending' },
];

export const FinanceExpenseManagementScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [expenses, setExpenses] = useState(MOCK_EXPENSES);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showSheet, setShowSheet] = useState(false);

  const onRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 800); };
  const handleApprove = (a) => setExpenses(prev => prev.map(x => x.id === a.id ? { ...x, status: 'approved' } : x));
  const handleReject = (a) => setExpenses(prev => prev.map(x => x.id === a.id ? { ...x, status: 'rejected' } : x));

  const pendingTotal = expenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);
  const approvedTotal = expenses.filter(e => e.status === 'approved').reduce((sum, e) => sum + e.amount, 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Expense Management" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        <View style={styles.statsRow}>
          <StatCard icon="hourglass" label="Pending" value={`$${pendingTotal}`} color={colors.warning} delay={0} />
          <StatCard icon="checkmark-circle" label="Approved" value={`$${approvedTotal}`} color={colors.success} delay={100} />
          <StatCard icon="receipt" label="Total" value={expenses.length} color={colors.primary} delay={200} />
        </View>

        {expenses.map((exp, i) => (
          <ApprovalCard key={exp.id} request={exp} onPress={() => { setSelected(exp); setShowSheet(true); }} delay={300 + i * 80} />
        ))}
      </ScrollView>
      <ApprovalSheet visible={showSheet} onClose={() => setShowSheet(false)} onApprove={handleApprove} onReject={handleReject} request={selected} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
});
