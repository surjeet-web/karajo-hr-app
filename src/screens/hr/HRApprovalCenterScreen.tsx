import React, { useState, useEffect } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Badge } from '../../components';
import { ApprovalCard, ApprovalSheet, StatCard, ApprovalBadge, EmptyApproval } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';
import { getState, subscribe } from '../../store';

const MOCK_APPROVALS = [
  { id: 1, type: 'leave', requesterName: 'Sarah Miller', department: 'Engineering', date: 'Feb 28 - Mar 3', days: 4, reason: 'Family vacation to Hawaii', status: 'pending', appliedOn: 'Feb 25' },
  { id: 2, type: 'expense', requesterName: 'James Wilson', department: 'Engineering', date: 'Feb 27', amount: 450, reason: 'Flight to NYC for client meeting', status: 'pending', appliedOn: 'Feb 26' },
  { id: 3, type: 'overtime', requesterName: 'Michael Chen', department: 'Design', date: 'Feb 26', days: 3, reason: 'UI redesign deadline', status: 'pending', appliedOn: 'Feb 25' },
  { id: 4, type: 'correction', requesterName: 'Emma Wilson', department: 'Marketing', date: 'Feb 25', reason: 'Forgot to check out', status: 'pending', appliedOn: 'Feb 26' },
  { id: 5, type: 'permission', requesterName: 'Hanna Jenkins', department: 'Operations', date: 'Feb 28', days: 2, reason: 'Doctor appointment', status: 'pending', appliedOn: 'Feb 27' },
  { id: 6, type: 'leave', requesterName: 'David Miller', department: 'Engineering', date: 'Mar 1 - Mar 2', days: 2, reason: 'Personal matters', status: 'approved', appliedOn: 'Feb 24' },
  { id: 7, type: 'expense', requesterName: 'Rachel Green', department: 'Engineering', date: 'Feb 20', amount: 85, reason: 'Client lunch', status: 'approved', appliedOn: 'Feb 21' },
  { id: 8, type: 'leave', requesterName: 'Tom Brown', department: 'Engineering', date: 'Feb 15', days: 1, reason: 'Bank work', status: 'rejected', appliedOn: 'Feb 14' },
];

export const HRApprovalCenterScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [approvals, setApprovals] = useState(MOCK_APPROVALS);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedApproval, setSelectedApproval] = useState<any>(null);
  const [showApprovalSheet, setShowApprovalSheet] = useState<boolean>(false);

  const tabs = [
    { id: 'all', label: 'All', count: approvals.length },
    { id: 'pending', label: 'Pending', count: approvals.filter(a => a.status === 'pending').length },
    { id: 'approved', label: 'Approved', count: approvals.filter(a => a.status === 'approved').length },
    { id: 'rejected', label: 'Rejected', count: approvals.filter(a => a.status === 'rejected').length },
  ];

  const filteredApprovals = activeTab === 'all' ? approvals : approvals.filter(a => a.status === activeTab);

  const onRefresh = (): void => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleApprovalPress = (approval) => {
    hapticFeedback('medium');
    setSelectedApproval(approval);
    setShowApprovalSheet(true);
  };

  const handleApprove = (approval, comment) => {
    setApprovals(prev => prev.map(a => a.id === approval.id ? { ...a, status: 'approved', comment } : a));
  };

  const handleReject = (approval, comment) => {
    setApprovals(prev => prev.map(a => a.id === approval.id ? { ...a, status: 'rejected', comment } : a));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Approval Center" onBack={() => navigation.goBack()} />

      <View style={styles.tabBar}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => { hapticFeedback('light'); setActiveTab(tab.id); }}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>{tab.label}</Text>
            {tab.count > 0 && (
              <View style={[styles.tabBadge, activeTab === tab.id ? { backgroundColor: colors.textInverse } : { backgroundColor: colors.primary }]}>
                <Text style={[styles.tabBadgeText, activeTab === tab.id ? { color: colors.primary } : { color: colors.textInverse }]}>{tab.count}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}
      >
        <View style={styles.statsRow}>
          <StatCard icon="hourglass" label="Pending" value={tabs.find(t => t.id === 'pending')?.count || 0} color={colors.warning} delay={0} />
          <StatCard icon="checkmark-circle" label="Approved" value={tabs.find(t => t.id === 'approved')?.count || 0} color={colors.success} delay={100} />
          <StatCard icon="close-circle" label="Rejected" value={tabs.find(t => t.id === 'rejected')?.count || 0} color={colors.error} delay={200} />
        </View>

        {filteredApprovals.length === 0 ? (
          <EmptyApproval type="approvals" />
        ) : (
          filteredApprovals.map((approval, i) => (
            <ApprovalCard key={approval.id} request={approval} onPress={handleApprovalPress} delay={300 + i * 80} />
          ))
        )}
      </ScrollView>

      <ApprovalSheet
        visible={showApprovalSheet}
        onClose={() => setShowApprovalSheet(false)}
        onApprove={handleApprove}
        onReject={handleReject}
        request={selectedApproval}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  tabBar: { flexDirection: 'row', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.surface },
  tab: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: colors.surfaceVariant, gap: spacing.xs },
  activeTab: { backgroundColor: colors.primary },
  tabText: { ...typography.label, color: colors.textSecondary },
  activeTabText: { color: colors.textInverse },
  tabBadge: { minWidth: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
  tabBadgeText: { ...typography.caption, fontWeight: '700' },
  scrollContent: { padding: spacing.lg },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
});
