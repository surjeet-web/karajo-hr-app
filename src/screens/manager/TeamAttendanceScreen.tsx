import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card, Badge } from '../../components';
import { StatCard } from '../../components/management';
import { getState, subscribe } from '../../store';

export const TeamAttendanceScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [appState, setAppState] = useState(getState());
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => { const unsub = subscribe(setAppState); return unsub; }, []);
  const onRefresh = (): void => { setRefreshing(true); setAppState(getState()); setRefreshing(false); };

  const { employees, attendance } = appState;
  const team = employees.slice(0, 6);
  const presentCount = Math.ceil(team.length * 0.7);
  const lateCount = Math.ceil(team.length * 0.1);
  const absentCount = team.length - presentCount - lateCount;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Team Attendance" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        <View style={styles.statsRow}>
          <StatCard icon="checkmark-circle" label="Present" value={presentCount} color={colors.success} delay={0} />
          <StatCard icon="warning" label="Late" value={lateCount} color={colors.warning} delay={100} />
          <StatCard icon="close-circle" label="Absent" value={absentCount} color={colors.error} delay={200} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Team Status Today</Text>
          {team.map((emp, i) => {
            const status = i < presentCount ? 'Present' : i < presentCount + lateCount ? 'Late' : 'Absent';
            const variant = status === 'Present' ? 'success' : status === 'Late' ? 'warning' : 'error';
            return (
              <Card key={emp.id} style={styles.attCard} padding="md">
                <View style={styles.attRow}>
                  <Ionicons name="person-circle" size={36} color={colors.primary} />
                  <View style={styles.attInfo}>
                    <Text style={styles.attName}>{emp.name}</Text>
                    <Text style={styles.attRole}>{emp.role}</Text>
                  </View>
                  <Badge text={status} variant={variant} size="small" />
                </View>
              </Card>
            );
          })}
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
  attCard: { marginBottom: spacing.sm },
  attRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  attInfo: { flex: 1 },
  attName: { ...typography.body, color: colors.text, fontWeight: '600' },
  attRole: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
});
