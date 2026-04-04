import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card, Badge } from '../../components';
import { StatCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';
import { getState, subscribe, setState } from '../../store';

export const HROffboardingScreen: React.FC<any> = ({ navigation }) => {
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

  const [checklistState, setChecklistState] = useState([
    { category: 'Asset Recovery', items: ['Laptop returned', 'Access badge collected', 'Company phone returned', 'Parking pass returned'], completed: [true, true, false, false] },
    { category: 'Final Settlement', items: ['Last paycheck processed', 'PTO payout calculated', 'Benefits termination', '401k rollover info'], completed: [false, false, false, false] },
    { category: 'Knowledge Transfer', items: ['Documentation updated', 'Handover meeting scheduled', 'Project status documented', 'Client contacts transferred'], completed: [true, false, false, false] },
    { category: 'Exit Interview', items: ['Interview scheduled', 'Feedback collected', 'NDA reminder sent', 'Alumni network invite'], completed: [false, false, false, false] },
  ]);

  const inactiveEmployees = state.employees.filter(e => e.status === 'inactive');
  const activeEmployees = state.employees.filter(e => e.status === 'active');

  const offboardingList = [
    ...inactiveEmployees.map(e => ({
      id: e.id,
      name: e.name,
      role: e.role,
      department: e.department,
      lastDay: e.joinDate,
      reason: 'Resignation',
      status: 'in-progress',
      progress: 30,
    })),
    { id: 99, name: 'Jane Smith', role: 'Marketing Manager', department: 'Marketing', lastDay: 'Feb 28, 2026', reason: 'End of Contract', status: 'completed', progress: 100 },
  ];

  const inProgressCount = offboardingList.filter(o => o.status === 'in-progress').length;
  const completedCount = offboardingList.filter(o => o.status === 'completed').length;

  const toggleChecklistItem = (sectionIndex, itemIndex) => {
    hapticFeedback('light');
    setChecklistState(prev => prev.map((section, si) =>
      si === sectionIndex
        ? { ...section, completed: section.completed.map((done, ii) => ii === itemIndex ? !done : done) }
        : section
    ));
  };

  const handleStartOffboarding = (): void => {
    hapticFeedback('medium');
    Alert.alert(
      'Start Offboarding',
      'Select an employee to begin the offboarding process.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: () => {
            Alert.prompt('Employee Name', 'Enter employee name:', (name) => {
              if (name) {
                Alert.prompt('Reason', 'Enter reason for leaving:', (reason) => {
                  if (reason) {
                    Alert.prompt('Last Day', 'Enter last working day:', (lastDay) => {
                      if (lastDay) {
                        hapticFeedback('success');
                        Alert.alert('Offboarding Started', `Offboarding process initiated for ${name}.`);
                      }
                    });
                  }
                });
              }
            });
          },
        },
      ]
    );
  };

  const totalChecklistItems = checklistState.reduce((sum, s) => sum + s.items.length, 0);
  const completedChecklistItems = checklistState.reduce((sum, s) => sum + s.completed.filter(Boolean).length, 0);
  const checklistProgress = totalChecklistItems > 0 ? Math.round((completedChecklistItems / totalChecklistItems) * 100) : 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Offboarding" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        <View style={styles.statsRow}>
          <StatCard icon="exit" label="In Progress" value={inProgressCount.toString()} color={colors.warning} delay={0} />
          <StatCard icon="checkmark-circle" label="Completed" value={completedCount.toString()} color={colors.success} delay={100} />
          <StatCard icon="list" label="Checklist" value={`${checklistProgress}%`} color={colors.primary} delay={200} />
        </View>

        <TouchableOpacity style={[styles.startBtn, shadows.md]} onPress={handleStartOffboarding} activeOpacity={0.7}>
          <Ionicons name="exit-outline" size={20} color={colors.textInverse} />
          <Text style={styles.startBtnText}>Start Offboarding Process</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exit Checklist</Text>
          {checklistState.map((section, si) => (
            <Card key={si} style={styles.checklistCard} padding="md">
              <Text style={styles.checklistCategory}>{section.category}</Text>
              {section.items.map((item, ii) => (
                <TouchableOpacity key={ii} style={styles.checklistItem} onPress={() => toggleChecklistItem(si, ii)} activeOpacity={0.7}>
                  <Ionicons name={section.completed[ii] ? 'checkmark-circle' : 'ellipse-outline'} size={18} color={section.completed[ii] ? colors.success : colors.textTertiary} />
                  <Text style={[styles.checklistText, section.completed[ii] && styles.checklistDone]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </Card>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Offboarding Records ({offboardingList.length})</Text>
          {offboardingList.map((emp, i) => (
            <Card key={emp.id} style={styles.empCard} padding="md">
              <View style={styles.empHeader}>
                <View>
                  <Text style={styles.empName}>{emp.name}</Text>
                  <Text style={styles.empRole}>{emp.role} - {emp.department}</Text>
                </View>
                <Badge text={emp.status} variant={emp.status === 'completed' ? 'success' : 'warning'} size="small" />
              </View>
              <Text style={styles.empLastDay}>Last Day: {emp.lastDay}</Text>
              <Text style={styles.empReason}>Reason: {emp.reason}</Text>
              <View style={styles.progressRow}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${emp.progress}%`, backgroundColor: emp.progress === 100 ? colors.success : colors.primary }]} />
                </View>
                <Text style={styles.progressText}>{emp.progress}%</Text>
              </View>
            </Card>
          ))}
          {offboardingList.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="exit-outline" size={48} color={colors.textTertiary} />
              <Text style={styles.emptyTitle}>No Offboarding Records</Text>
              <Text style={styles.emptySubtitle}>Offboarding records will appear here.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.error, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.lg },
  startBtnText: { ...typography.button, color: colors.textInverse },
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  checklistCard: { marginBottom: spacing.sm },
  checklistCategory: { ...typography.body, color: colors.text, fontWeight: '600', marginBottom: spacing.sm },
  checklistItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xs },
  checklistText: { ...typography.bodySmall, color: colors.text },
  checklistDone: { textDecorationLine: 'line-through', color: colors.textTertiary },
  empCard: { marginBottom: spacing.sm },
  empHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm },
  empName: { ...typography.body, color: colors.text, fontWeight: '600' },
  empRole: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  empLastDay: { ...typography.bodySmall, color: colors.textSecondary },
  empReason: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  progressBar: { flex: 1, height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  progressText: { ...typography.caption, color: colors.textSecondary, fontWeight: '600', width: 35, textAlign: 'right' },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxxxl },
  emptyTitle: { ...typography.h4, color: colors.text, marginTop: spacing.md },
  emptySubtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
});
