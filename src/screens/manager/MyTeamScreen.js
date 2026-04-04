import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Avatar, Badge } from '../../components';
import { StatCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';
import { getState, subscribe } from '../../store';

export const MyTeamScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [appState, setAppState] = useState(getState());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { const unsub = subscribe(setAppState); return unsub; }, []);
  const onRefresh = () => { setRefreshing(true); setAppState(getState()); setRefreshing(false); };

  const { employees } = appState;
  const team = employees.slice(0, 6);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="My Team" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        <View style={styles.statsRow}>
          <StatCard icon="people" label="Team Size" value={team.length} color={colors.primary} delay={0} />
          <StatCard icon="checkmark-circle" label="Present" value={Math.ceil(team.length * 0.7)} color={colors.success} delay={100} />
          <StatCard icon="umbrella" label="On Leave" value={Math.ceil(team.length * 0.2)} color={colors.warning} delay={200} />
        </View>

        {team.map((emp, i) => (
          <TouchableOpacity key={emp.id} style={[styles.empCard, shadows.sm]} onPress={() => { hapticFeedback('medium'); navigation.navigate('EmployeeDetail', { employee: emp }); }} activeOpacity={0.7}>
            <Avatar source={{ uri: emp.avatar }} name={emp.name} size="medium" />
            <View style={styles.empInfo}>
              <Text style={styles.empName}>{emp.name}</Text>
              <Text style={styles.empRole}>{emp.role}</Text>
              <Text style={styles.empDept}>{emp.department}</Text>
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
  empCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.md },
  empInfo: { flex: 1 },
  empName: { ...typography.body, color: colors.text, fontWeight: '600' },
  empRole: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  empDept: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
});
