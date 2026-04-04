import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card, Avatar, Badge } from '../../components';
import { StatCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';

const NEW_HIRES = [
  { id: 1, name: 'Rachel Green', role: 'Junior Developer', department: 'Engineering', startDate: 'Jan 09, 2024', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop', progress: 65, buddy: 'Sarah Miller', status: 'in-progress' },
  { id: 2, name: 'Tom Brown', role: 'DevOps Engineer', department: 'Engineering', startDate: 'Aug 30, 2023', avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=200&h=200&fit=crop', progress: 100, buddy: 'James Wilson', status: 'completed' },
  { id: 3, name: 'Lisa Wang', role: 'Marketing Analyst', department: 'Marketing', startDate: 'Feb 15, 2024', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop', progress: 30, buddy: 'Emma Wilson', status: 'in-progress' },
];

export const HROnboardingManagementScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const inProgress = NEW_HIRES.filter(h => h.status === 'in-progress').length;
  const completed = NEW_HIRES.filter(h => h.status === 'completed').length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Onboarding Management" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <StatCard icon="people" label="New Hires" value={NEW_HIRES.length} color={colors.primary} delay={0} />
          <StatCard icon="hourglass" label="In Progress" value={inProgress} color={colors.warning} delay={100} />
          <StatCard icon="checkmark-circle" label="Completed" value={completed} color={colors.success} delay={200} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>New Hires</Text>
          {NEW_HIRES.map((hire, i) => (
            <Card key={hire.id} style={styles.hireCard} padding="md">
              <View style={styles.hireHeader}>
                <Avatar source={{ uri: hire.avatar }} name={hire.name} size="medium" />
                <View style={styles.hireInfo}>
                  <Text style={styles.hireName}>{hire.name}</Text>
                  <Text style={styles.hireRole}>{hire.role} • {hire.department}</Text>
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
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Onboarding Checklist</Text>
          {[
            { category: 'IT Setup', items: ['Email account', 'Laptop configured', 'Software licenses', 'Slack/Teams access'] },
            { category: 'HR Paperwork', items: ['Employment contract', 'Tax forms', 'Direct deposit', 'Benefits enrollment'] },
            { category: 'Orientation', items: ['Company overview', 'Office tour', 'Team introductions', 'Policy handbook'] },
          ].map((section, i) => (
            <Card key={i} style={styles.checklistCard} padding="md">
              <Text style={styles.checklistCategory}>{section.category}</Text>
              {section.items.map((item, j) => (
                <View key={j} style={styles.checklistItem}>
                  <Ionicons name={j < 2 ? 'checkmark-circle' : 'ellipse-outline'} size={18} color={j < 2 ? colors.success : colors.textTertiary} />
                  <Text style={[styles.checklistText, j < 2 && styles.checklistDone]}>{item}</Text>
                </View>
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
});
