import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Avatar, Badge, Card } from '../../components';
import { StatCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';
import { getState, subscribe } from '../../store';

export const HREmployeeManagementScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [appState, setAppState] = useState(getState());
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { const unsub = subscribe(setAppState); return unsub; }, []);
  const onRefresh = () => { setRefreshing(true); setAppState(getState()); setRefreshing(false); };

  const { employees } = appState;
  const filtered = search ? employees.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.department.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase())) : employees;
  const activeCount = employees.filter(e => e.status === 'active').length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Employee Management" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        <View style={styles.statsRow}>
          <StatCard icon="people" label="Total" value={employees.length} color={colors.primary} delay={0} />
          <StatCard icon="checkmark-circle" label="Active" value={activeCount} color={colors.success} delay={100} />
          <StatCard icon="person-add" label="Onboarding" value={employees.filter(e => e.status === 'onboarding').length} color={colors.warning} delay={200} />
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.textTertiary} />
          <TextInput style={styles.searchInput} placeholder="Search employees..." value={search} onChangeText={setSearch} placeholderTextColor={colors.textTertiary} />
          {search ? <TouchableOpacity onPress={() => setSearch('')}><Ionicons name="close-circle" size={20} color={colors.textTertiary} /></TouchableOpacity> : null}
        </View>

        {filtered.map((emp, i) => (
          <TouchableOpacity key={emp.id} style={[styles.empCard, shadows.sm]} onPress={() => { hapticFeedback('medium'); navigation.navigate('EmployeeDetail', { employee: emp }); }} activeOpacity={0.7}>
            <Avatar source={{ uri: emp.avatar }} name={emp.name} size="medium" />
            <View style={styles.empInfo}>
              <Text style={styles.empName}>{emp.name}</Text>
              <Text style={styles.empRole}>{emp.role}</Text>
              <Text style={styles.empDept}>{emp.department} • {emp.location}</Text>
            </View>
            <Badge text={emp.status} variant={emp.status === 'active' ? 'success' : 'warning'} size="small" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, height: 48, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border, gap: spacing.sm },
  searchInput: { flex: 1, ...typography.body, color: colors.text },
  empCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.md },
  empInfo: { flex: 1 },
  empName: { ...typography.body, color: colors.text, fontWeight: '600' },
  empRole: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  empDept: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
});
