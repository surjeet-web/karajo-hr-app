import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';

export const EmptyApproval = ({ type = 'approvals', actionLabel, onAction }) => (
  <View style={styles.container}>
    <View style={styles.iconBox}>
      {type === 'approvals' ? '📋' : type === 'expenses' ? '💰' : '📊'}
    </View>
    <Text style={styles.title}>No {type} yet</Text>
    <Text style={styles.subtitle}>
      {type === 'approvals' ? 'All caught up! No pending requests.' : type === 'expenses' ? 'No expenses to display.' : 'No data available.'}
    </Text>
    {actionLabel && onAction && (
      <Text style={styles.actionText} onPress={onAction}>{actionLabel}</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: spacing.xxxxl, paddingHorizontal: spacing.xl },
  iconBox: { fontSize: 48, marginBottom: spacing.md },
  title: { ...typography.h4, color: colors.text, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  actionText: { ...typography.body, color: colors.primary, fontWeight: '600', marginTop: spacing.lg },
});
