import React, { useState, useEffect } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, RefreshControl, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Avatar, Badge, Card } from '../../components';
import { StatCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';
import { getState, subscribe, setState } from '../../store';
import { validateEmployee } from '../../utils/validators';

export const HREmployeeManagementScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [appState, setAppState] = useState(getState());
  const [search, setSearch] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => { const unsub = subscribe(setAppState); return unsub; }, []);
  const onRefresh = (): void => { setRefreshing(true); setAppState(getState()); setRefreshing(false); };

  const { employees } = appState;
  const departments = [...new Set(employees.map(e => e.department))];

  const filtered = employees.filter(e => {
    const matchesSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.department.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'all' || e.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const activeCount = employees.filter(e => e.status === 'active').length;
  const onboardingCount = employees.filter(e => e.status === 'onboarding').length;

  const handleAddEmployee = (): void => {
    hapticFeedback('medium');
    Alert.prompt('Add Employee', 'Enter employee name:', (name) => {
      if (name) {
        Alert.prompt('Role', 'Enter role:', (role) => {
          if (role) {
            Alert.prompt('Department', 'Enter department:', (department) => {
              if (department) {
                const newEmployee = {
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
                };
                setState(prev => ({
                  employees: [...prev.employees, newEmployee],
                }));
                setAppState(getState());
                hapticFeedback('success');
                Alert.alert('Success', `${name} has been added to ${department} department.`);
              }
            });
          }
        });
      }
    });
  };

  const handleDeactivateEmployee = (emp) => {
    hapticFeedback('medium');
    Alert.alert(
      'Deactivate Employee',
      `Are you sure you want to deactivate ${emp.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: () => {
            setState(prev => ({
              employees: prev.employees.map(e => e.id === emp.id ? { ...e, status: 'inactive' } : e),
            }));
            setAppState(getState());
            hapticFeedback('error');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Employee Management" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        <View style={styles.statsRow}>
          <StatCard icon="people" label="Total" value={employees.length.toString()} color={colors.primary} delay={0} />
          <StatCard icon="checkmark-circle" label="Active" value={activeCount.toString()} color={colors.success} delay={100} />
          <StatCard icon="person-add" label="Onboarding" value={onboardingCount.toString()} color={colors.warning} delay={200} />
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.textTertiary} />
          <TextInput style={styles.searchInput} placeholder="Search employees..." value={search} onChangeText={setSearch} placeholderTextColor={colors.textTertiary} />
          {search ? <TouchableOpacity onPress={() => setSearch('')}><Ionicons name="close-circle" size={20} color={colors.textTertiary} /></TouchableOpacity> : null}
        </View>

        <View style={styles.departmentFilter}>
          <TouchableOpacity style={[styles.deptChip, selectedDept === 'all' && styles.deptChipActive]} onPress={() => { hapticFeedback('light'); setSelectedDept('all'); }}>
            <Text style={[styles.deptChipText, selectedDept === 'all' && styles.deptChipTextActive]}>All</Text>
          </TouchableOpacity>
          {departments.map(dept => (
            <TouchableOpacity key={dept} style={[styles.deptChip, selectedDept === dept && styles.deptChipActive]} onPress={() => { hapticFeedback('light'); setSelectedDept(dept); }}>
              <Text style={[styles.deptChipText, selectedDept === dept && styles.deptChipTextActive]}>{dept}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.addBtn, shadows.md]} onPress={handleAddEmployee} activeOpacity={0.7}>
          <Ionicons name="person-add" size={20} color={colors.textInverse} />
          <Text style={styles.addBtnText}>Add New Employee</Text>
        </TouchableOpacity>

        {filtered.map((emp, i) => (
          <TouchableOpacity key={emp.id} style={[styles.empCard, shadows.sm]} onPress={() => { hapticFeedback('medium'); navigation.navigate('HREmployeeProfile', { employee: emp }); }} activeOpacity={0.7}>
            <Avatar source={{ uri: emp.avatar }} name={emp.name} size="medium" />
            <View style={styles.empInfo}>
              <Text style={styles.empName}>{emp.name}</Text>
              <Text style={styles.empRole}>{emp.role}</Text>
              <Text style={styles.empDept}>{emp.department} - {emp.location}</Text>
            </View>
            <View style={styles.empActions}>
              <Badge text={emp.status} variant={emp.status === 'active' ? 'success' : emp.status === 'onboarding' ? 'warning' : 'error'} size="small" />
              {emp.status === 'active' && (
                <TouchableOpacity style={styles.deactivateBtn} onPress={() => handleDeactivateEmployee(emp)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Ionicons name="close-circle" size={18} color={colors.error} />
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        ))}

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>No Employees Found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your search or filter.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, height: 48, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border, gap: spacing.sm },
  searchInput: { flex: 1, ...typography.body, color: colors.text },
  departmentFilter: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  deptChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: colors.surfaceVariant },
  deptChipActive: { backgroundColor: colors.primary },
  deptChipText: { ...typography.label, color: colors.textSecondary },
  deptChipTextActive: { color: colors.textInverse },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.primary, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.lg },
  addBtnText: { ...typography.button, color: colors.textInverse },
  empCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.md },
  empInfo: { flex: 1 },
  empName: { ...typography.body, color: colors.text, fontWeight: '600' },
  empRole: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  empDept: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
  empActions: { alignItems: 'flex-end', gap: spacing.xs },
  deactivateBtn: { padding: spacing.xs },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxxxl },
  emptyTitle: { ...typography.h4, color: colors.text, marginTop: spacing.md },
  emptySubtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
});
