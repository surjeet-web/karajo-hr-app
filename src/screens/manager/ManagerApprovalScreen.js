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

const MOCK_APPROVALS = [
  { id: 1, type: 'leave', requesterName: 'Sarah Miller', date: 'Feb 28 - Mar 3', days: 4, reason: 'Family vacation', status: 'pending' },
  { id: 2, type: 'permission', requesterName: 'Michael Chen', date: 'Feb 28', days: 2, reason: 'Doctor appointment', status: 'pending' },
  { id: 3, type: 'overtime', requesterName: 'David Miller', date: 'Feb 27', days: 3, reason: 'Project deadline', status: 'pending' },
];

export const ManagerApprovalScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [approvals, setApprovals] = useState(MOCK_APPROVALS);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [showSheet, setShowSheet] = useState(false);

  const onRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 800); };
  const handleApprove = (a) => setApprovals(prev => prev.map(x => x.id === a.id ? { ...x, status: 'approved' } : x));
  const handleReject = (a) => setApprovals(prev => prev.map(x => x.id === a.id ? { ...x, status: 'rejected' } : x));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Team Approvals" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        <View style={styles.statsRow}>
          <StatCard icon="hourglass" label="Pending" value={approvals.filter(a => a.status === 'pending').length} color={colors.warning} delay={0} />
          <StatCard icon="checkmark-circle" label="Approved" value={approvals.filter(a => a.status === 'approved').length} color={colors.success} delay={100} />
          <StatCard icon="close-circle" label="Rejected" value={approvals.filter(a => a.status === 'rejected').length} color={colors.error} delay={200} />
        </View>
        {approvals.map((a, i) => (
          <ApprovalCard key={a.id} request={a} onPress={() => { setSelectedApproval(a); setShowSheet(true); }} delay={300 + i * 80} />
        ))}
      </ScrollView>
      <ApprovalSheet visible={showSheet} onClose={() => setShowSheet(false)} onApprove={handleApprove} onReject={handleReject} request={selectedApproval} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
});
