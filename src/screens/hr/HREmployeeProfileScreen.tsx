import React, { useState, useEffect } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Avatar, Card, Badge, StatusTimeline } from '../../components';
import { StatCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';
import { getState, subscribe, setState } from '../../store';
import { formatCurrency } from '../../utils/calculations';

export const HREmployeeProfileScreen: React.FC<any> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [state, setStateLocal] = useState(getState());
  const employee = route.params?.employee;

  useEffect(() => {
    const unsub = subscribe(setStateLocal);
    return unsub;
  }, []);

  if (!employee) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Header title="Employee Profile" onBack={() => navigation.goBack()} />
        <View style={styles.emptyState}>
          <Ionicons name="person-outline" size={64} color={colors.textTertiary} />
          <Text style={styles.emptyTitle}>No Employee Selected</Text>
        </View>
      </View>
    );
  }

  const empLeave = state.leave.requests.filter(r => r.delegate?.toLowerCase().includes(employee.name.toLowerCase()) || r.status === 'pending');
  const empExpenses = state.expenses.requests;
  const totalLeaveDays = empLeave.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.days, 0);
  const pendingRequests = empLeave.filter(r => r.status === 'pending').length;

  const handleEditEmployee = (): void => {
    hapticFeedback('medium');
    Alert.alert('Edit Employee', `Edit ${employee.name}'s details?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Edit', onPress: () => Alert.alert('Coming Soon', 'Employee editing form will be available soon.') },
    ]);
  };

  const handleDeactivate = (): void => {
    hapticFeedback('medium');
    Alert.alert(
      'Deactivate Employee',
      `Are you sure you want to deactivate ${employee.name}? This will revoke their access.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: () => {
            setState(prev => ({
              employees: prev.employees.map(e => e.id === employee.id ? { ...e, status: 'inactive' } : e),
            }));
            setStateLocal(getState());
            hapticFeedback('error');
            Alert.alert('Deactivated', `${employee.name} has been deactivated.`);
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Employee Profile" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Card style={styles.profileCard} padding="lg">
          <Avatar source={{ uri: employee.avatar }} name={employee.name} size="xlarge" />
          <Text style={styles.profileName}>{employee.name}</Text>
          <Text style={styles.profileRole}>{employee.role}</Text>
          <Badge text={employee.status} variant={employee.status === 'active' ? 'success' : employee.status === 'onboarding' ? 'warning' : 'error'} size="medium" />
        </Card>

        <View style={styles.statsRow}>
          <StatCard icon="star" label="Rating" value={(employee.rating || 0).toString()} color={colors.warning} delay={0} />
          <StatCard icon="trending-up" label="KPI Score" value={(employee.kpiScore || 0).toString()} color={colors.success} delay={100} />
          <StatCard icon="umbrella" label="Leave Used" value={`${totalLeaveDays}d`} color={colors.accentPurple} delay={200} />
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleEditEmployee}>
            <Ionicons name="create-outline" size={18} color={colors.primary} />
            <Text style={styles.actionBtnText}>Edit Details</Text>
          </TouchableOpacity>
          {employee.status === 'active' && (
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.errorLight }]} onPress={handleDeactivate}>
              <Ionicons name="close-circle-outline" size={18} color={colors.error} />
              <Text style={[styles.actionBtnText, { color: colors.error }]}>Deactivate</Text>
            </TouchableOpacity>
          )}
        </View>

        <Card style={styles.infoCard} padding="lg">
          <Text style={styles.infoTitle}>Contact Information</Text>
          <TouchableOpacity style={styles.infoRow} onPress={() => Linking.openURL(`mailto:${employee.email}`)}>
            <Ionicons name="mail-outline" size={20} color={colors.primary} />
            <Text style={styles.infoText}>{employee.email}</Text>
            <Ionicons name="open-outline" size={16} color={colors.textTertiary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.infoRow} onPress={() => Linking.openURL(`tel:${employee.phone}`)}>
            <Ionicons name="call-outline" size={20} color={colors.primary} />
            <Text style={styles.infoText}>{employee.phone}</Text>
            <Ionicons name="open-outline" size={16} color={colors.textTertiary} />
          </TouchableOpacity>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color={colors.primary} />
            <Text style={styles.infoText}>{employee.location}</Text>
          </View>
        </Card>

        <Card style={styles.infoCard} padding="lg">
          <Text style={styles.infoTitle}>Employment Details</Text>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Department</Text><Text style={styles.detailValue}>{employee.department}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Manager</Text><Text style={styles.detailValue}>{employee.manager}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Employment Type</Text><Text style={styles.detailValue}>{employee.employmentType}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Join Date</Text><Text style={styles.detailValue}>{employee.joinDate}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Employee ID</Text><Text style={styles.detailValue}>EMP-{employee.id}</Text></View>
        </Card>

        {employee.salary && (
          <Card style={styles.infoCard} padding="lg">
            <Text style={styles.infoTitle}>Salary Information</Text>
            <View style={styles.detailRow}><Text style={styles.detailLabel}>Basic</Text><Text style={styles.detailValue}>{formatCurrency(employee.salary.basic)}</Text></View>
            <View style={styles.detailRow}><Text style={styles.detailLabel}>HRA</Text><Text style={styles.detailValue}>{formatCurrency(employee.salary.hra)}</Text></View>
            <View style={styles.detailRow}><Text style={styles.detailLabel}>Allowances</Text><Text style={styles.detailValue}>{formatCurrency(employee.salary.allowances)}</Text></View>
            <View style={styles.detailRow}><Text style={styles.detailLabel}>Deductions</Text><Text style={[styles.detailValue, { color: colors.error }]}>-{formatCurrency(employee.salary.deductions)}</Text></View>
            <View style={styles.detailRow}><Text style={styles.detailLabel}>Tax</Text><Text style={[styles.detailValue, { color: colors.error }]}>-{formatCurrency(employee.salary.tax)}</Text></View>
            <View style={[styles.detailRow, styles.totalRow]}><Text style={styles.totalLabel}>Net Pay</Text><Text style={styles.totalValue}>{formatCurrency(employee.salary.basic + employee.salary.hra + employee.salary.allowances - employee.salary.deductions - employee.salary.tax)}</Text></View>
          </Card>
        )}

        <Card style={styles.infoCard} padding="lg">
          <Text style={styles.infoTitle}>Recent Activity</Text>
          <StatusTimeline items={[
            { status: 'Checked In', label: 'Attendance', by: 'System', date: 'Today, 09:00' },
            { status: 'Leave Approved', label: 'Annual Leave', by: 'HR', date: 'Feb 25' },
            { status: 'Review Completed', label: 'Q4 Review', by: employee.manager, date: 'Feb 20' },
          ]} />
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  profileCard: { alignItems: 'center', marginBottom: spacing.md },
  profileName: { ...typography.h4, color: colors.text, marginTop: spacing.md },
  profileRole: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  actionButtons: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.lg, padding: spacing.md },
  actionBtnText: { ...typography.bodySmall, color: colors.primary, fontWeight: '600' },
  infoCard: { marginBottom: spacing.md },
  infoTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  infoText: { ...typography.body, color: colors.text, flex: 1 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  detailLabel: { ...typography.bodySmall, color: colors.textSecondary },
  detailValue: { ...typography.bodySmall, color: colors.text, fontWeight: '600' },
  totalRow: { borderBottomWidth: 0, marginTop: spacing.sm },
  totalLabel: { ...typography.body, color: colors.text, fontWeight: '700' },
  totalValue: { ...typography.h5, color: colors.success, fontWeight: '700' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { ...typography.h4, color: colors.text, marginTop: spacing.md },
});
