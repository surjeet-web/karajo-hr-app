import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card } from '../../components';
import { DepartmentCard, StatCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';

export const DepartmentOverviewScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const departments = [
    { name: 'Engineering', headcount: 89, openPositions: 5, head: 'James Wilson', budget: 450, score: 92 },
    { name: 'Marketing', headcount: 34, openPositions: 3, head: 'Emma Wilson', budget: 200, score: 87 },
    { name: 'Sales', headcount: 56, openPositions: 4, head: 'Alex Johnson', budget: 320, score: 95 },
    { name: 'Operations', headcount: 42, openPositions: 2, head: 'Hanna Jenkins', budget: 280, score: 89 },
    { name: 'Design', headcount: 18, openPositions: 1, head: 'Michael Chen', budget: 150, score: 91 },
    { name: 'HR', headcount: 8, openPositions: 0, head: 'Lisa Park', budget: 80, score: 88 },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Department Overview" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <StatCard icon="business" label="Departments" value="6" color={colors.primary} delay={0} />
          <StatCard icon="people" label="Total Headcount" value="247" color={colors.success} delay={100} />
          <StatCard icon="briefcase" label="Open Positions" value="15" color={colors.warning} delay={200} />
        </View>

        {departments.map((dept, i) => (
          <TouchableOpacity key={dept.name} style={[styles.deptCard, shadows.sm]} onPress={() => { hapticFeedback('medium'); navigation.navigate('DepartmentDetail'); }} activeOpacity={0.7}>
            <DepartmentCard department={dept} />
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
  deptCard: { marginBottom: spacing.sm },
});
