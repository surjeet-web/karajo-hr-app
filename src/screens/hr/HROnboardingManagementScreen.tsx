import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card, Avatar, Badge } from '../../components';
import { StatCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';
import { getState, subscribe, setState } from '../../store';

export const HROnboardingManagementScreen: React.FC<any> = ({ navigation }) => {
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

  const onboardingEmployees = state.employees.filter(e => e.status === 'onboarding');
  const activeEmployees = state.employees.filter(e => e.status === 'active');
  const completedCount = activeEmployees.filter(e => {
    const joinDate = new Date(e.joinDate);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return joinDate >= thirtyDaysAgo;
  }).length;

  const newHires = [
    ...onboardingEmployees.map(e => ({
      id: e.id,
      name: e.name,
      role: e.role,
      department: e.department,
      startDate: e.joinDate,
      avatar: e.avatar,
      progress: Math.floor(Math.random() * 60) + 20,
      buddy: e.manager || 'HR Manager',
      status: 'in-progress',
    })),
    ...completedCount > 0 ? [{
      id: 999,
      name: 'Recently Completed',
      role: 'Various Roles',
      department: 'Multiple',
      startDate: 'Last 30 days',
      avatar: '',
      progress: 100,
      buddy: 'HR Team',
      status: 'completed',
    }] : [],
  ];

  const checklistItems = [
    { category: 'IT Setup', items: ['Email account', 'Laptop configured', 'Software licenses', 'Slack/Teams access'] },
    { category: 'HR Paperwork', items: ['Employment contract', 'Tax forms', 'Direct deposit', 'Benefits enrollment'] },
    { category: 'Orientation', items: ['Company overview', 'Office tour', 'Team introductions', 'Policy handbook'] },
    { category: 'Training', items: ['Security training', 'Compliance training', 'Product knowledge', 'Role-specific training'] },
  ];

  const [checklistState, setChecklistState] = useState(
    checklistItems.map(section => ({
      ...section,
      completed: section.items.map((_, i) => i < Math.floor(Math.random() * 3) + 1),
    }))
  );

  const toggleChecklistItem = (sectionIndex, itemIndex) => {
    hapticFeedback('light');
    setChecklistState(prev => prev.map((section, si) =>
      si === sectionIndex
        ? { ...section, completed: section.completed.map((done, ii) => ii === itemIndex ? !done : done) }
        : section
    ));
  };

  const handleAddNewHire = (): void => {
    hapticFeedback('medium');
    Alert.prompt('Add New Hire', 'Enter employee name:', (name) => {
      if (name) {
        Alert.prompt('Role', 'Enter role:', (role) => {
          if (role) {
            Alert.prompt('Department', 'Enter department:', (department) => {
              if (department) {
                setState(prev => ({
                  employees: [...prev.employees, {
                    id: Date.now(),
                    name,
                    role,
                    department,
                    manager: 'HR Manager',
                    email: `${name.toLowerCase().replace(/\s/g, '.')}@karajo.com`,
                    phone: '+1 (555) 000-0000',
                    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
                    joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                    status: 'onboarding',
                    location: 'Remote',
                    employmentType: 'Full-time',
                    rating: 0,
                    kpiScore: 0,
                    pendingReviews: 0,
                    salary: { basic: 5000, hra: 2000, allowances: 1500, deductions: 800, tax: 450 },
                  }],
                }));
                setStateLocal(getState());
                hapticFeedback('success');
                Alert.alert('Success', `${name} has been added to onboarding.`);
              }
            });
          }
        });
      }
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Onboarding Management" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        <View style={styles.statsRow}>
          <StatCard icon="people" label="New Hires" value={onboardingEmployees.length.toString()} color={colors.primary} delay={0} />
          <StatCard icon="hourglass" label="In Progress" value={onboardingEmployees.length.toString()} color={colors.warning} delay={100} />
          <StatCard icon="checkmark-circle" label="Completed" value={completedCount.toString()} color={colors.success} delay={200} />
        </View>

        <TouchableOpacity style={[styles.addBtn, shadows.md]} onPress={handleAddNewHire} activeOpacity={0.7}>
          <Ionicons name="person-add" size={20} color={colors.textInverse} />
          <Text style={styles.addBtnText}>Add New Hire</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>New Hires ({newHires.length})</Text>
          {newHires.map((hire, i) => (
            <Card key={hire.id} style={styles.hireCard} padding="md">
              <View style={styles.hireHeader}>
                <Avatar source={{ uri: hire.avatar }} name={hire.name} size="medium" />
                <View style={styles.hireInfo}>
                  <Text style={styles.hireName}>{hire.name}</Text>
                  <Text style={styles.hireRole}>{hire.role} - {hire.department}</Text>
                  <Text style={styles.hireStart}>Started: {hire.startDate}</Text>
                </View>
                <Badge text={hire.status} variant={hire.status === 'completed' ? 'success' : 'warning'} size="small" />
              </View>
              <View style={styles.progressRow}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${hire.progress}%`, backgroundColor: hire.progress === 100 ? colors.success : colors.primary }]} />
                </View>
                <Text style={styles.progressText}>{hire.progress}%</Text>
              </View>
              <Text style={styles.buddyText}>Buddy: {hire.buddy}</Text>
            </Card>
          ))}
          {newHires.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="person-add-outline" size={48} color={colors.textTertiary} />
              <Text style={styles.emptyTitle}>No New Hires</Text>
              <Text style={styles.emptySubtitle}>Add a new hire to start onboarding.</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Onboarding Checklist</Text>
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.primary, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.lg },
  addBtnText: { ...typography.button, color: colors.textInverse },
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  hireCard: { marginBottom: spacing.sm },
  hireHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  hireInfo: { flex: 1 },
  hireName: { ...typography.body, color: colors.text, fontWeight: '600' },
  hireRole: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  hireStart: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  progressBar: { flex: 1, height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  progressText: { ...typography.caption, color: colors.textSecondary, fontWeight: '600', width: 35, textAlign: 'right' },
  buddyText: { ...typography.bodySmall, color: colors.textSecondary },
  checklistCard: { marginBottom: spacing.sm },
  checklistCategory: { ...typography.body, color: colors.text, fontWeight: '600', marginBottom: spacing.sm },
  checklistItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xs },
  checklistText: { ...typography.bodySmall, color: colors.text },
  checklistDone: { textDecorationLine: 'line-through', color: colors.textTertiary },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxxxl },
  emptyTitle: { ...typography.h4, color: colors.text, marginTop: spacing.md },
  emptySubtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
});
