import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Badge, Button } from '../../components';
import { StatCard, ApprovalSheet } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';
import { getState, subscribe, submitExpense } from '../../store';
import { formatCurrency } from '../../utils/calculations';

const EXPENSE_CATEGORIES = [
  { id: 'travel', name: 'Travel', icon: 'airplane', color: colors.primary },
  { id: 'meals', name: 'Meals', icon: 'restaurant', color: colors.success },
  { id: 'supplies', name: 'Supplies', icon: 'briefcase', color: colors.warning },
  { id: 'hotel', name: 'Hotel', icon: 'bed', color: colors.accentPurple },
  { id: 'transport', name: 'Transport', icon: 'car', color: colors.info },
  { id: 'other', name: 'Other', icon: 'ellipsis-horizontal', color: colors.textTertiary },
];

export const FinanceExpenseManagementScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [state, setStateLocal] = useState(getState());
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [showSheet, setShowSheet] = useState<boolean>(false);

  useEffect(() => {
    const unsub = subscribe(setStateLocal);
    return unsub;
  }, []);

  const onRefresh = (): void => {
    setRefreshing(true);
    setStateLocal(getState());
    setRefreshing(false);
  };

  const expenses = state.expenses.requests;
  const filteredExpenses = activeTab === 'all' ? expenses : expenses.filter(e => e.status === activeTab);

  const pendingTotal = expenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);
  const approvedTotal = expenses.filter(e => e.status === 'approved').reduce((sum, e) => sum + e.amount, 0);
  const rejectedTotal = expenses.filter(e => e.status === 'rejected').reduce((sum, e) => sum + e.amount, 0);

  const handleApprove = (expense, comment) => {
    setStateLocal(prev => ({
      expenses: {
        ...prev.expenses,
        requests: prev.expenses.requests.map(e => e.id === expense.id ? { ...e, status: 'approved', approvedBy: state.user?.name, approvedComment: comment } : e),
      },
    }));
    hapticFeedback('success');
  };

  const handleReject = (expense, comment) => {
    if (!comment.trim()) {
      Alert.alert('Rejection Reason', 'Please provide a reason for rejection.');
      return;
    }
    setStateLocal(prev => ({
      expenses: {
        ...prev.expenses,
        requests: prev.expenses.requests.map(e => e.id === expense.id ? { ...e, status: 'rejected', rejectedBy: state.user?.name, rejectionReason: comment } : e),
      },
    }));
    hapticFeedback('error');
  };

  const handleNewExpense = (): void => {
    hapticFeedback('medium');
    Alert.alert(
      'New Expense',
      'Fill in the expense details.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: () => {
            Alert.prompt('Expense Title', 'Enter expense title:', (title) => {
              if (title) {
                Alert.prompt('Amount', 'Enter amount ($):', (amount) => {
                  if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
                    Alert.prompt('Category', 'Enter category (travel/meals/supplies/hotel/transport/other):', (category) => {
                      submitExpense({
                        title,
                        amount: parseFloat(amount),
                        category: category || 'other',
                        date: new Date().toISOString().split('T')[0],
                        description: 'Expense submission',
                      });
                      setStateLocal(getState());
                      hapticFeedback('success');
                      Alert.alert('Success', 'Expense submitted for approval.');
                    }, 'plain-text');
                  } else {
                    Alert.alert('Error', 'Please enter a valid amount.');
                  }
                }, 'numeric');
              }
            });
          },
        },
      ]
    );
  };

  const getCategoryIcon = (category) => {
    const cat = EXPENSE_CATEGORIES.find(c => c.id === category?.toLowerCase());
    return cat?.icon || 'receipt';
  };

  const getCategoryColor = (category) => {
    const cat = EXPENSE_CATEGORIES.find(c => c.id === category?.toLowerCase());
    return cat?.color || colors.textTertiary;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Expense Management" />

      <View style={styles.tabBar}>
        {['all', 'pending', 'approved', 'rejected'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => { hapticFeedback('light'); setActiveTab(tab); }}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>

        <View style={styles.statsRow}>
          <StatCard icon="hourglass" label="Pending" value={formatCurrency(pendingTotal)} color={colors.warning} delay={0} />
          <StatCard icon="checkmark-circle" label="Approved" value={formatCurrency(approvedTotal)} color={colors.success} delay={100} />
          <StatCard icon="close-circle" label="Rejected" value={formatCurrency(rejectedTotal)} color={colors.error} delay={200} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Expenses ({filteredExpenses.length})</Text>
          <Button title="New Expense" variant="outline" onPress={handleNewExpense} />
        </View>

        {filteredExpenses.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>No Expenses</Text>
            <Text style={styles.emptySubtitle}>No {activeTab === 'all' ? '' : activeTab + ' '}expenses found.</Text>
          </View>
        ) : (
          filteredExpenses.map((expense, i) => {
            const catIcon = getCategoryIcon(expense.category);
            const catColor = getCategoryColor(expense.category);
            return (
              <TouchableOpacity key={expense.id} style={[styles.expenseCard, shadows.sm]}
                onPress={() => { hapticFeedback('medium'); setSelectedExpense(expense); setShowSheet(true); }}
                activeOpacity={0.7}>
                <View style={[styles.expenseIcon, { backgroundColor: catColor + '15' }]}>
                  <Ionicons name={catIcon} size={22} color={catColor} />
                </View>
                <View style={styles.expenseInfo}>
                  <Text style={styles.expenseTitle}>{expense.title}</Text>
                  <Text style={styles.expenseMeta}>{expense.category} - {expense.date}</Text>
                  {expense.description && <Text style={styles.expenseDesc} numberOfLines={1}>{expense.description}</Text>}
                </View>
                <View style={styles.expenseAmount}>
                  <Text style={styles.expenseValue}>{formatCurrency(expense.amount)}</Text>
                  <Badge text={expense.status} variant={expense.status === 'approved' ? 'success' : expense.status === 'pending' ? 'warning' : 'error'} size="small" />
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <ApprovalSheet
        visible={showSheet}
        onClose={() => setShowSheet(false)}
        onApprove={handleApprove}
        onReject={handleReject}
        request={selectedExpense ? {
          type: 'expense',
          requesterName: selectedExpense.title,
          date: selectedExpense.date,
          amount: selectedExpense.amount,
          reason: selectedExpense.description,
          status: selectedExpense.status,
        } : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  tabBar: { flexDirection: 'row', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.surface },
  tab: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: colors.surfaceVariant },
  activeTab: { backgroundColor: colors.primary },
  tabText: { ...typography.label, color: colors.textSecondary },
  activeTabText: { color: colors.textInverse },
  scrollContent: { padding: spacing.lg },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  expenseCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.md },
  expenseIcon: { width: 44, height: 44, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center' },
  expenseInfo: { flex: 1 },
  expenseTitle: { ...typography.body, color: colors.text, fontWeight: '600' },
  expenseMeta: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
  expenseDesc: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  expenseAmount: { alignItems: 'flex-end', gap: spacing.xs },
  expenseValue: { ...typography.body, color: colors.text, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxxxl },
  emptyTitle: { ...typography.h4, color: colors.text, marginTop: spacing.md },
  emptySubtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
});
