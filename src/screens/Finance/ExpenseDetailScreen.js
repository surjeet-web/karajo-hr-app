import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Badge, StatusTimeline, AnimatedCard, AnimatedListItem } from '../../components';
import { hapticFeedback } from '../../utils/haptics';
import { useFadeIn, useSlideIn } from '../../utils/animations';

const buildTimeline = (expense) => {
  if (!expense) return [];

  const baseDate = expense.date || 'Unknown';
  const timeline = [
    {
      status: 'Submitted',
      label: 'Request created by',
      by: 'Sarah Miller',
      date: `${baseDate}, 09:00 AM`,
      completed: true,
    },
  ];

  if (expense.status === 'approved') {
    timeline.push(
      {
        status: 'Finance Review',
        label: 'Reviewed by',
        by: 'Alex Johnson',
        date: `${baseDate}, 02:00 PM`,
        completed: true,
      },
      {
        status: 'Approved',
        label: 'Approved by',
        by: 'Finance Team',
        date: `${baseDate}, 04:00 PM`,
        completed: true,
        active: true,
      }
    );
  } else if (expense.status === 'rejected') {
    timeline.push(
      {
        status: 'Finance Review',
        label: 'Reviewed by',
        by: 'Alex Johnson',
        date: `${baseDate}, 02:00 PM`,
        completed: true,
      },
      {
        status: 'Rejected',
        label: 'Rejected by',
        by: 'Finance Team',
        date: `${baseDate}, 04:00 PM`,
        completed: true,
        active: true,
      }
    );
  } else if (expense.status === 'pending') {
    timeline.push({
      status: 'Pending Review',
      label: 'Awaiting review by',
      by: 'Finance Team',
      date: 'Pending',
      active: true,
    });
  }

  return timeline;
};

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

export const ExpenseDetailScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const expense = route.params?.expense;
  const [refreshing, setRefreshing] = useState(false);
  const fadeIn = useFadeIn();
  const slideIn = useSlideIn();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshing(false);
  }, []);

  if (!expense) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Header title="Expense Detail" onBack={() => navigation.goBack()} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
          <Text style={styles.errorText}>No expense data found.</Text>
        </View>
      </View>
    );
  }

  const timeline = buildTimeline(expense);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Expense Detail" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <View style={styles.headerRow}>
          <Text style={styles.expenseId}>EXP-{String(expense.id).padStart(3, '0')}</Text>
          <Badge
            text={expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
            variant={getStatusVariant(expense.status)}
          />
        </View>

        <Text style={styles.amount}>${expense.amount.toFixed(2)}</Text>

        <View style={styles.categoryRow}>
          <View style={[styles.categoryIcon, { backgroundColor: `${getIconColor(expense.category)}15` }]}>
            <Ionicons name={getIconName(expense.category)} size={20} color={getIconColor(expense.category)} />
          </View>
          <Text style={styles.categoryText}>{expense.category}</Text>
        </View>

        <AnimatedCard delay={0}>
          <View style={styles.detailsCard}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Title</Text>
              <Text style={styles.detailValue}>{expense.title}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{expense.date}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Description</Text>
              <Text style={styles.detailValue}>{expense.description || 'No description provided.'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>{expense.category}</Text>
            </View>
          </View>
        </AnimatedCard>

        {expense.receipt && (
          <AnimatedCard delay={100}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                hapticFeedback('medium');
                Alert.alert(
                  'Receipt',
                  expense.receipt.name || 'Receipt',
                  [{ text: 'OK' }]
                );
              }}
              accessibilityRole="button"
              accessibilityLabel="View receipt attachment"
            >
              <View style={styles.attachmentCard}>
                <View style={styles.attachmentHeader}>
                  <Ionicons name="document-attach" size={20} color={colors.primary} />
                  <Text style={styles.attachmentTitle}>Receipt</Text>
                </View>
                <View style={styles.attachmentFile}>
                  <Ionicons name="image" size={32} color={colors.primary} />
                  <View style={styles.attachmentInfo}>
                    <Text style={styles.attachmentName}>{expense.receipt.name || 'Receipt'}</Text>
                    <Text style={styles.attachmentMeta}>Uploaded {expense.date}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </AnimatedCard>
        )}

        <View style={styles.timelineSection}>
          <Text style={styles.timelineTitle}>Approval Timeline</Text>
          <StatusTimeline items={timeline} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  errorText: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  expenseId: { ...typography.bodySmall, color: colors.textTertiary },
  amount: { ...typography.statNumber, color: colors.text, marginBottom: spacing.md },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
  categoryIcon: { width: 44, height: 44, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center' },
  categoryText: { ...typography.body, color: colors.text, fontWeight: '600' },
  detailsCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.lg },
  detailItem: { paddingVertical: spacing.sm },
  detailLabel: { ...typography.caption, color: colors.textTertiary, marginBottom: spacing.xs },
  detailValue: { ...typography.body, color: colors.text },
  divider: { height: 1, backgroundColor: colors.border },
  attachmentCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.lg },
  attachmentHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  attachmentTitle: { ...typography.h5, color: colors.text },
  attachmentFile: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.lg, padding: spacing.md },
  attachmentInfo: { flex: 1 },
  attachmentName: { ...typography.body, color: colors.text, fontWeight: '600' },
  attachmentMeta: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  timelineSection: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  timelineTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
});
