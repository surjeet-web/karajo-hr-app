import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header } from '../../components';
import { ApprovalCard, ApprovalSheet, StatCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';
import { getState, subscribe, setState } from '../../store';

export const ManagerApprovalScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [state, setStateLocal] = useState(getState());
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedApproval, setSelectedApproval] = useState<any>(null);
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

  const { leave, permission, overtime, expenses } = state;

  const allApprovals = [
    ...leave.requests.filter(r => r.status === 'pending').map(r => ({ type: 'leave', id: r.id, requesterName: r.delegate || 'Team Member', date: `${r.startDate} to ${r.endDate}`, days: r.days, reason: r.reason, status: r.status })),
    ...permission.requests.filter(r => r.status === 'pending').map(r => ({ type: 'permission', id: r.id, requesterName: 'Team Member', date: r.date, days: r.duration, reason: r.reason, status: r.status })),
    ...overtime.requests.filter(r => r.status === 'pending').map(r => ({ type: 'overtime', id: r.id, requesterName: 'Team Member', date: r.date, days: r.duration, reason: r.reason, status: r.status })),
    ...expenses.requests.filter(e => e.status === 'pending').map(e => ({ type: 'expense', id: e.id, requesterName: e.title, date: e.date, amount: e.amount, reason: e.description, status: e.status })),
  ];

  const filteredApprovals = activeTab === 'all' ? allApprovals : allApprovals.filter(a => a.status === activeTab);

  const handleApprove = (approval, comment) => {
    setState(prev => {
      const newState = { ...prev };
      if (approval.type === 'leave') {
        newState.leave = { ...prev.leave, requests: prev.leave.requests.map(r => r.id === approval.id ? { ...r, status: 'approved', approvedBy: 'Manager', comment } : r) };
      } else if (approval.type === 'permission') {
        newState.permission = { ...prev.permission, requests: prev.permission.requests.map(r => r.id === approval.id ? { ...r, status: 'approved', approvedBy: 'Manager', comment } : r) };
      } else if (approval.type === 'overtime') {
        newState.overtime = { ...prev.overtime, requests: prev.overtime.requests.map(r => r.id === approval.id ? { ...r, status: 'approved', approvedBy: 'Manager', comment } : r) };
      } else if (approval.type === 'expense') {
        newState.expenses = { ...prev.expenses, requests: prev.expenses.requests.map(e => e.id === approval.id ? { ...e, status: 'approved', approvedBy: 'Manager', comment } : e) };
      }
      newState.notifications = [{ id: Date.now(), title: `${approval.type.charAt(0).toUpperCase() + approval.type.slice(1)} Approved`, message: `Your ${approval.type} request has been approved.`, time: new Date().toISOString(), type: 'success', read: false }, ...prev.notifications];
      return newState;
    });
    setStateLocal(getState());
    hapticFeedback('success');
  };

  const handleReject = (approval, comment) => {
    if (!comment.trim()) {
      Alert.alert('Rejection Reason', 'Please provide a reason for rejection.');
      return;
    }
    setState(prev => {
      const newState = { ...prev };
      if (approval.type === 'leave') {
        newState.leave = { ...prev.leave, requests: prev.leave.requests.map(r => r.id === approval.id ? { ...r, status: 'rejected', rejectedBy: 'Manager', rejectionReason: comment } : r) };
      } else if (approval.type === 'permission') {
        newState.permission = { ...prev.permission, requests: prev.permission.requests.map(r => r.id === approval.id ? { ...r, status: 'rejected', rejectedBy: 'Manager', rejectionReason: comment } : r) };
      } else if (approval.type === 'overtime') {
        newState.overtime = { ...prev.overtime, requests: prev.overtime.requests.map(r => r.id === approval.id ? { ...r, status: 'rejected', rejectedBy: 'Manager', rejectionReason: comment } : r) };
      } else if (approval.type === 'expense') {
        newState.expenses = { ...prev.expenses, requests: prev.expenses.requests.map(e => e.id === approval.id ? { ...e, status: 'rejected', rejectedBy: 'Manager', rejectionReason: comment } : e) };
      }
      newState.notifications = [{ id: Date.now(), title: `${approval.type.charAt(0).toUpperCase() + approval.type.slice(1)} Rejected`, message: `Your ${approval.type} request has been rejected.`, time: new Date().toISOString(), type: 'error', read: false }, ...prev.notifications];
      return newState;
    });
    setStateLocal(getState());
    hapticFeedback('error');
  };

  const pendingCount = allApprovals.filter(a => a.status === 'pending').length;
  const approvedCount = allApprovals.filter(a => a.status === 'approved').length;
  const rejectedCount = allApprovals.filter(a => a.status === 'rejected').length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Team Approvals" />

      <View style={styles.tabBar}>
        {[
          { id: 'all', label: 'All', count: allApprovals.length },
          { id: 'pending', label: 'Pending', count: pendingCount },
          { id: 'approved', label: 'Approved', count: approvedCount },
          { id: 'rejected', label: 'Rejected', count: rejectedCount },
        ].map(tab => (
          <TouchableOpacity key={tab.id} style={[styles.tab, activeTab === tab.id && styles.activeTab]} onPress={() => { hapticFeedback('light'); setActiveTab(tab.id); }} activeOpacity={0.7}>
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>{tab.label}</Text>
            {tab.count > 0 && (
              <View style={[styles.tabBadge, activeTab === tab.id ? { backgroundColor: colors.textInverse } : { backgroundColor: colors.primary }]}>
                <Text style={[styles.tabBadgeText, activeTab === tab.id ? { color: colors.primary } : { color: colors.textInverse }]}>{tab.count}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        <View style={styles.statsRow}>
          <StatCard icon="hourglass" label="Pending" value={pendingCount.toString()} color={colors.warning} delay={0} />
          <StatCard icon="checkmark-circle" label="Approved" value={approvedCount.toString()} color={colors.success} delay={100} />
          <StatCard icon="close-circle" label="Rejected" value={rejectedCount.toString()} color={colors.error} delay={200} />
        </View>
        {filteredApprovals.length > 0 ? filteredApprovals.map((a, i) => (
          <ApprovalCard key={`${a.type}-${a.id}`} request={a} onPress={() => { setSelectedApproval(a); setShowSheet(true); }} delay={300 + i * 80} />
        )) : (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle" size={64} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>No Approvals</Text>
            <Text style={styles.emptySubtitle}>No {activeTab === 'all' ? '' : activeTab + ' '}approvals found.</Text>
          </View>
        )}
      </ScrollView>
      <ApprovalSheet visible={showSheet} onClose={() => setShowSheet(false)} onApprove={handleApprove} onReject={handleReject} request={selectedApproval} />
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
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxxxl },
  emptyTitle: { ...typography.h4, color: colors.text, marginTop: spacing.md },
  emptySubtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
});
