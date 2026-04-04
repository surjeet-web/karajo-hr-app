import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Badge, StatusTimeline } from '../../components';
import { expenseData } from '../../data/mockData';

export const ExpenseDetailScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const detail = expenseData.detail;

  const timeline = [
    { status: 'Submitted', label: 'Request created by', by: 'Sarah Miller', date: 'Feb 28, 09:00 PM' },
    { status: 'Finance Review', label: 'Reviewed by', by: 'Alex Johnson', date: 'Feb 28, 09:20 PM' },
    { status: 'Revision Requested', label: 'Request created by', by: 'Alex Johnson', date: 'Feb 28, 09:20 PM' },
    { status: 'Correction Needed', label: 'Request created by', by: 'Alex Johnson', date: 'Feb 28, 09:20 PM', active: true },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Expense Detail" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Text style={styles.expenseId}>{detail.id}</Text>
          <Badge text="Revision Requested" variant="warning" />
        </View>

        <Text style={styles.amount}>${detail.amount.toFixed(2)}</Text>

        <View style={styles.categoryRow}>
          <View style={styles.categoryIcon}>
            <Ionicons name="restaurant" size={20} color={colors.primary} />
          </View>
          <Text style={styles.categoryText}>{detail.category}</Text>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Merchant</Text>
            <Text style={styles.detailValue}>{detail.merchant}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{detail.date}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Description</Text>
            <Text style={styles.detailValue}>{detail.description}</Text>
          </View>
        </View>

        <View style={styles.attachmentCard}>
          <View style={styles.attachmentHeader}>
            <Ionicons name="document-attach" size={20} color={colors.primary} />
            <Text style={styles.attachmentTitle}>Attachment</Text>
          </View>
          <View style={styles.attachmentFile}>
            <Ionicons name="document-text" size={32} color={colors.error} />
            <View style={styles.attachmentInfo}>
              <Text style={styles.attachmentName}>{detail.attachment.name}</Text>
              <Text style={styles.attachmentMeta}>{detail.attachment.size} • Uploaded {detail.attachment.uploaded}</Text>
            </View>
          </View>
        </View>

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
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  expenseId: { ...typography.bodySmall, color: colors.textTertiary },
  amount: { ...typography.statNumber, color: colors.text, marginBottom: spacing.md },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
  categoryIcon: { width: 44, height: 44, borderRadius: borderRadius.md, backgroundColor: colors.primaryLighter, justifyContent: 'center', alignItems: 'center' },
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
