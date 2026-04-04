import React, { useEffect } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card, Badge } from '../../components';
import { hapticFeedback } from '../../utils/haptics';

const PAYROLL_HISTORY = [
  { id: 1, month: 'February 2026', status: 'completed', total: '$485,200', employees: 247, processedOn: 'Mar 1', processedBy: 'Finance Team' },
  { id: 2, month: 'January 2026', status: 'completed', total: '$478,500', employees: 245, processedOn: 'Feb 1', processedBy: 'Finance Team' },
  { id: 3, month: 'December 2025', status: 'completed', total: '$492,100', employees: 243, processedOn: 'Jan 1', processedBy: 'Finance Team' },
  { id: 4, month: 'November 2025', status: 'completed', total: '$475,800', employees: 241, processedOn: 'Dec 1', processedBy: 'Finance Team' },
];

export const PayrollHistoryScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  useEffect(() => { hapticFeedback('medium'); }, []);
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Payroll History" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {PAYROLL_HISTORY.map((run, i) => (
          <TouchableOpacity key={run.id} style={[styles.runCard, shadows.sm]} onPress={() => hapticFeedback('medium')} activeOpacity={0.7}>
            <View style={styles.runInfo}>
              <Text style={styles.runMonth}>{run.month}</Text>
              <Text style={styles.runDetails}>{run.employees} employees • {run.processedBy}</Text>
            </View>
            <View style={styles.runAmount}>
              <Text style={styles.runTotal}>{run.total}</Text>
              <Badge text={run.status} variant="success" size="small" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  runCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm },
  runInfo: { flex: 1 },
  runMonth: { ...typography.body, color: colors.text, fontWeight: '600' },
  runDetails: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  runAmount: { alignItems: 'flex-end', gap: spacing.xs },
  runTotal: { ...typography.h5, color: colors.success, fontWeight: '700' },
});
