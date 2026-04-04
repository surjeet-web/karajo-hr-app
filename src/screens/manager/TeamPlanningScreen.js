import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card } from '../../components';
import { hapticFeedback } from '../../utils/haptics';

export const TeamPlanningScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const upcomingLeaves = [
    { name: 'Sarah Miller', dates: 'Feb 28 - Mar 3', days: 4, type: 'Annual' },
    { name: 'Michael Chen', dates: 'Mar 5 - Mar 6', days: 2, type: 'Sick' },
    { name: 'David Miller', dates: 'Mar 10', days: 1, type: 'Personal' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Team Planning" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Leaves</Text>
          {upcomingLeaves.map((leave, i) => (
            <Card key={i} style={styles.leaveCard} padding="md">
              <View style={styles.leaveRow}>
                <Ionicons name="calendar-clear" size={20} color={colors.primary} />
                <View style={styles.leaveInfo}>
                  <Text style={styles.leaveName}>{leave.name}</Text>
                  <Text style={styles.leaveDates}>{leave.dates} ({leave.days} days)</Text>
                </View>
                <Text style={styles.leaveType}>{leave.type}</Text>
              </View>
            </Card>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coverage Gaps</Text>
          <Card style={styles.gapCard} padding="md">
            <Ionicons name="warning" size={20} color={colors.warning} />
            <Text style={styles.gapText}>Feb 28 - Mar 3: Only 2 engineers available (Sarah on leave)</Text>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  leaveCard: { marginBottom: spacing.sm },
  leaveRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  leaveInfo: { flex: 1 },
  leaveName: { ...typography.body, color: colors.text, fontWeight: '600' },
  leaveDates: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  leaveType: { ...typography.caption, color: colors.primary, fontWeight: '600' },
  gapCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.warningLight },
  gapText: { ...typography.bodySmall, color: colors.warning, flex: 1 },
});
