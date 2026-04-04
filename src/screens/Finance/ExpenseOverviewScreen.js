import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Card, Badge, Button } from '../../components';
import { getState, subscribe, submitExpense } from '../../store';

export const ExpenseOverviewScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [appState, setAppState] = useState(getState());
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const unsubscribe = subscribe(setAppState);
    return unsubscribe;
  }, []);

  const { expenses } = appState;
  const requests = expenses.requests;
  const filtered = activeTab === 'all' ? requests : requests.filter(r => r.status === activeTab);

  const pendingTotal = requests.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0);
  const approvedTotal = requests.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.amount, 0);
  const rejectedTotal = requests.filter(r => r.status === 'rejected').reduce((sum, r) => sum + r.amount, 0);

  const getIconName = (category) => {
    const iconMap = { Travel: 'car', Meals: 'restaurant', Supplies: 'cart', Hotel: 'bed', Other: 'cash' };
    return iconMap[category] || 'cash';
  };

  const getIconColor = (category) => {
    const colorMap = { Travel: colors.primary, Meals: colors.warning, Supplies: colors.accentPurple, Hotel: colors.accentTeal, Other: colors.textSecondary };
    return colorMap[category] || colors.textSecondary;
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
      <Header title="Expenses" onBack={() => navigation.goBack()} />

      <View style={styles.summaryRow}>
        <TouchableOpacity style={[styles.summaryItem, activeTab === 'pending' && styles.summaryItemActive]} onPress={() => setActiveTab('pending')}>
          <Text style={styles.summaryLabel}>Pending</Text>
          <Text style={styles.summaryValue}>${pendingTotal.toLocaleString()}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.summaryItem, styles.summaryItemPrimary, activeTab === 'approved' && styles.summaryItemActive]} onPress={() => setActiveTab('approved')}>
          <Text style={[styles.summaryLabel, styles.summaryLabelLight]}>Approved</Text>
          <Text style={[styles.summaryValue, styles.summaryValueLight]}>${approvedTotal.toLocaleString()}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.summaryItem, activeTab === 'rejected' && styles.summaryItemActive]} onPress={() => setActiveTab('rejected')}>
          <Text style={styles.summaryLabel}>Rejected</Text>
          <Text style={styles.summaryValue}>${rejectedTotal.toLocaleString()}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.tabRow}>
          {['all', 'pending', 'approved', 'rejected'].map(tab => (
            <TouchableOpacity key={tab} style={[styles.tabChip, activeTab === tab && styles.tabChipActive]} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabChipText, activeTab === tab && styles.tabChipTextActive]}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {filtered.map((expense) => (
          <TouchableOpacity key={expense.id} style={styles.expenseItem} onPress={() => navigation.navigate('ExpenseDetail', { expense })}>
            <View style={[styles.expenseIcon, { backgroundColor: `${getIconColor(expense.category)}15` }]}>
              <Ionicons name={getIconName(expense.category)} size={20} color={getIconColor(expense.category)} />
            </View>
            <View style={styles.expenseInfo}>
              <Text style={styles.expenseTitle}>{expense.title}</Text>
              <Text style={styles.expenseCategory}>{expense.category} • {expense.date}</Text>
            </View>
            <View style={styles.expenseRight}>
              <Text style={styles.expenseAmount}>${expense.amount.toLocaleString()}</Text>
              <Badge text={expense.status.charAt(0).toUpperCase() + expense.status.slice(1)} variant={getStatusVariant(expense.status)} size="small" />
            </View>
          </TouchableOpacity>
        ))}

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>No Expenses</Text>
            <Text style={styles.emptySubtitle}>Your expense requests will appear here.</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Create Expense Request" icon={<Ionicons name="add" size={20} color={colors.textInverse} />} onPress={() => navigation.navigate('ExpenseOverview')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  summaryRow: { flexDirection: 'row', padding: spacing.lg, gap: spacing.sm },
  summaryItem: { flex: 1, alignItems: 'center', padding: spacing.md, backgroundColor: colors.surface, borderRadius: borderRadius.lg },
  summaryItemPrimary: { backgroundColor: colors.primary },
  summaryItemActive: { borderWidth: 2, borderColor: colors.primary },
  summaryLabel: { ...typography.caption, color: colors.textTertiary, marginBottom: spacing.xs },
  summaryLabelLight: { color: 'rgba(255,255,255,0.7)' },
  summaryValue: { ...typography.h5, color: colors.text },
  summaryValueLight: { color: colors.textInverse },
  tabRow: { flexDirection: 'row', paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: spacing.sm },
  tabChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, backgroundColor: colors.surfaceVariant },
  tabChipActive: { backgroundColor: colors.primary },
  tabChipText: { ...typography.bodySmall, color: colors.textSecondary },
  tabChipTextActive: { color: colors.textInverse, fontWeight: '600' },
  scrollContent: { padding: spacing.lg },
  expenseItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border },
  expenseIcon: { width: 44, height: 44, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  expenseInfo: { flex: 1 },
  expenseTitle: { ...typography.body, color: colors.text, fontWeight: '600' },
  expenseCategory: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  expenseRight: { alignItems: 'flex-end' },
  expenseAmount: { ...typography.body, color: colors.text, fontWeight: '600' },
  footer: { padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxxxl },
  emptyTitle: { ...typography.h4, color: colors.text, marginTop: spacing.md },
  emptySubtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
});
