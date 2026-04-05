import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { hapticFeedback } from '../../utils/haptics';

interface Department {
  name: string;
  head?: string;
  headcount?: number;
  openPositions?: number;
  budget?: number;
}

interface DepartmentCardProps {
  department: Department;
  onPress?: (department: Department) => void;
  delay?: number;
}

export const DepartmentCard: React.FC<DepartmentCardProps> = ({ department, onPress, delay = 0 }) => (
  <TouchableOpacity
    style={[styles.card, shadows.sm]}
    onPress={() => { hapticFeedback('medium'); onPress?.(department); }}
    activeOpacity={0.7}
  >
    <View style={styles.header}>
      <View style={styles.headAvatar}>
        <Ionicons name="person-circle" size={28} color={colors.primary} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{department.name}</Text>
        <Text style={styles.head}>{department.head || 'No head assigned'}</Text>
      </View>
    </View>
    <View style={styles.stats}>
      <View style={styles.stat}>
        <Text style={styles.statValue}>{department.headcount}</Text>
        <Text style={styles.statLabel}>Employees</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.stat}>
        <Text style={[styles.statValue, { color: colors.success }]}>{department.openPositions}</Text>
        <Text style={styles.statLabel}>Open</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.stat}>
        <Text style={styles.statValue}>{department.budget ? `$${department.budget}k` : '-'}</Text>
        <Text style={styles.statLabel}>Budget</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  headAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primaryLighter, justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1 },
  name: { ...typography.body, color: colors.text, fontWeight: '600' },
  head: { ...typography.caption, color: colors.textTertiary },
  stats: { flexDirection: 'row', alignItems: 'center' },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { ...typography.h5, color: colors.text },
  statLabel: { ...typography.caption, color: colors.textTertiary },
  divider: { width: 1, height: 30, backgroundColor: colors.border },
});
