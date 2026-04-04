import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card, Badge } from '../../components';
import { StatCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';
import { getState, subscribe } from '../../store';

export const HRComplianceScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [state, setStateLocal] = useState(getState());
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    const unsub = subscribe(setStateLocal);
    return unsub;
  }, []);

  const onRefresh = (): void => {
    setRefreshing(true);
    setStateLocal(getState());
    setRefreshing(false);
  };

  const employees = state.employees || [];
  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const penalties = state.penalties.records || [];
  const leaveRequests = state.leave.requests || [];
  const attendanceHistory = state.attendance.history || [];

  const complianceItems = [
    { id: 1, title: 'I-9 Verification', status: activeEmployees > 0 ? 'compliant' : 'pending', desc: `${activeEmployees} employee forms verified`, icon: 'checkmark-circle', color: activeEmployees > 0 ? colors.success : colors.warning },
    { id: 2, title: 'EEOC Reporting', status: 'pending', desc: 'Annual report due Mar 31, 2026', icon: 'time', color: colors.warning },
    { id: 3, title: 'OSHA Compliance', status: 'compliant', desc: 'Workplace safety standards met', icon: 'checkmark-circle', color: colors.success },
    { id: 4, title: 'FLSA Classification', status: 'compliant', desc: `${activeEmployees} employees properly classified`, icon: 'checkmark-circle', color: colors.success },
    { id: 5, title: 'Benefits Compliance', status: 'review', desc: 'ACA reporting review needed', icon: 'warning', color: colors.warning },
    { id: 6, title: 'Data Privacy (GDPR)', status: 'compliant', desc: 'Employee data protected', icon: 'checkmark-circle', color: colors.success },
    { id: 7, title: 'Leave Compliance', status: leaveRequests.filter(r => r.status === 'pending').length > 5 ? 'review' : 'compliant', desc: `${leaveRequests.filter(r => r.status === 'pending').length} pending leave requests`, icon: leaveRequests.filter(r => r.status === 'pending').length > 5 ? 'warning' : 'checkmark-circle', color: leaveRequests.filter(r => r.status === 'pending').length > 5 ? colors.warning : colors.success },
    { id: 8, title: 'Attendance Compliance', status: 'compliant', desc: `${attendanceHistory.length} records tracked`, icon: 'checkmark-circle', color: colors.success },
  ];

  const compliantCount = complianceItems.filter(i => i.status === 'compliant').length;
  const openIssues = complianceItems.filter(i => i.status !== 'compliant').length;
  const complianceScore = Math.round((compliantCount / complianceItems.length) * 100);

  const auditLog = [
    { action: 'Policy Updated', by: 'HR Manager', date: 'Feb 25, 2026', type: 'info' },
    { action: 'I-9 Audit Completed', by: 'System', date: 'Feb 20, 2026', type: 'success' },
    { action: 'Compliance Review', by: 'HR Specialist', date: 'Feb 15, 2026', type: 'info' },
    { action: 'EEOC Report Filed', by: 'HR Manager', date: 'Feb 10, 2026', type: 'success' },
    { action: 'OSHA Inspection Passed', by: 'System', date: 'Feb 05, 2026', type: 'success' },
  ];

  const handleReviewItem = (item) => {
    hapticFeedback('medium');
    Alert.alert(
      item.title,
      item.desc,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Mark Compliant', onPress: () => { hapticFeedback('success'); Alert.alert('Updated', `${item.title} marked as compliant.`); } },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Compliance" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        <View style={styles.statsRow}>
          <StatCard icon="shield-checkmark" label="Compliance Score" value={`${complianceScore}%`} color={complianceScore >= 80 ? colors.success : colors.warning} delay={0} />
          <StatCard icon="warning" label="Open Issues" value={openIssues.toString()} color={colors.warning} delay={100} />
          <StatCard icon="checkmark-circle" label="Compliant" value={compliantCount.toString()} color={colors.success} delay={200} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compliance Items</Text>
          {complianceItems.map((item, i) => (
            <TouchableOpacity key={item.id} style={[styles.complianceCard, shadows.sm]} onPress={() => handleReviewItem(item)} activeOpacity={0.7}>
              <View style={styles.complianceRow}>
                <View style={[styles.complianceIcon, { backgroundColor: item.color + '15' }]}>
                  <Ionicons name={item.icon} size={24} color={item.color} />
                </View>
                <View style={styles.complianceInfo}>
                  <Text style={styles.complianceTitle}>{item.title}</Text>
                  <Text style={styles.complianceDesc}>{item.desc}</Text>
                </View>
                <Badge text={item.status} variant={item.status === 'compliant' ? 'success' : 'warning'} size="small" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Audit Log</Text>
          {auditLog.map((log, i) => (
            <View key={i} style={styles.logRow}>
              <Ionicons name={log.type === 'success' ? 'checkmark-circle' : 'information-circle'} size={18} color={log.type === 'success' ? colors.success : colors.info} />
              <View style={styles.logInfo}>
                <Text style={styles.logAction}>{log.action}</Text>
                <Text style={styles.logMeta}>{log.by} - {log.date}</Text>
              </View>
            </View>
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
  complianceCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm },
  complianceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  complianceIcon: { width: 44, height: 44, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center' },
  complianceInfo: { flex: 1 },
  complianceTitle: { ...typography.body, color: colors.text, fontWeight: '600' },
  complianceDesc: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  logRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  logInfo: { flex: 1 },
  logAction: { ...typography.bodySmall, color: colors.text, fontWeight: '500' },
  logMeta: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
});
