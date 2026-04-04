import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Card, Badge, Button, ProgressBar } from '../../components';
import { performanceData } from '../../data/mockData';

export const GoalSettingScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', ...new Set(performanceData.goals.map(g => g.category))];
  const filteredGoals = selectedCategory === 'All' ? performanceData.goals : performanceData.goals.filter(g => g.category === selectedCategory);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.textTertiary;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'on-track': return { text: 'On Track', variant: 'success' };
      case 'behind': return { text: 'Behind', variant: 'error' };
      case 'completed': return { text: 'Completed', variant: 'info' };
      default: return { text: status, variant: 'default' };
    }
  };

  const overallProgress = Math.round(performanceData.goals.reduce((sum, g) => sum + g.progress, 0) / performanceData.goals.length);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Goal Setting" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card padding="lg" style={styles.overviewCard}>
          <View style={styles.overviewHeader}>
            <Ionicons name="flag" size={24} color={colors.accentPink} />
            <View style={styles.overviewText}>
              <Text style={styles.overviewTitle}>Overall Progress</Text>
              <Text style={styles.overviewValue}>{overallProgress}%</Text>
            </View>
          </View>
          <ProgressBar currentStep={overallProgress} totalSteps={100} />
          <View style={styles.overviewStats}>
            <Text style={styles.overviewStat}>{performanceData.goals.filter(g => g.status === 'on-track').length} on track</Text>
            <Text style={[styles.overviewStat, { color: colors.error }]}>{performanceData.goals.filter(g => g.status === 'behind').length} behind</Text>
          </View>
        </Card>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={styles.catContainer}>
          {categories.map(cat => (
            <TouchableOpacity key={cat} style={[styles.catChip, selectedCategory === cat && styles.catChipActive]} onPress={() => setSelectedCategory(cat)}>
              <Text style={[styles.catChipText, selectedCategory === cat && styles.catChipTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filteredGoals.map(goal => {
          const badge = getStatusBadge(goal.status);
          return (
            <Card key={goal.id} style={styles.goalCard} padding="md">
              <View style={styles.goalHeader}>
                <View style={styles.goalTitleRow}>
                  <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(goal.priority) }]} />
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                </View>
                <Badge text={badge.text} variant={badge.variant} size="small" />
              </View>

              <View style={styles.goalMeta}>
                <View style={styles.goalMetaItem}>
                  <Ionicons name="calendar-outline" size={14} color={colors.textTertiary} />
                  <Text style={styles.goalMetaText}>Deadline: {goal.deadline}</Text>
                </View>
                <View style={styles.goalMetaItem}>
                  <Ionicons name="pricetag-outline" size={14} color={colors.textTertiary} />
                  <Text style={styles.goalMetaText}>{goal.category}</Text>
                </View>
              </View>

              <View style={styles.goalProgress}>
                <Text style={styles.goalProgressLabel}>{goal.progress}% complete</Text>
                <ProgressBar currentStep={goal.progress} totalSteps={100} />
              </View>
            </Card>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Add New Goal" icon={<Ionicons name="add" size={20} color={colors.textInverse} />} onPress={() => {}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  overviewCard: { marginBottom: spacing.lg },
  overviewHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  overviewText: { flex: 1 },
  overviewTitle: { ...typography.label, color: colors.textTertiary },
  overviewValue: { ...typography.h3, color: colors.accentPink, fontWeight: '700' },
  overviewStats: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.sm },
  overviewStat: { ...typography.bodySmall, color: colors.success },
  catScroll: { maxHeight: 44 },
  catContainer: { gap: spacing.sm, paddingBottom: spacing.sm },
  catChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, backgroundColor: colors.surfaceVariant },
  catChipActive: { backgroundColor: colors.accentPink },
  catChipText: { ...typography.bodySmall, color: colors.textSecondary },
  catChipTextActive: { color: colors.textInverse, fontWeight: '600' },
  goalCard: { marginBottom: spacing.md },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md },
  goalTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
  goalTitle: { ...typography.body, color: colors.text, fontWeight: '600', flex: 1 },
  goalMeta: { flexDirection: 'row', gap: spacing.lg, marginBottom: spacing.md },
  goalMetaItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  goalMetaText: { ...typography.bodySmall, color: colors.textSecondary },
  goalProgress: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md },
  goalProgressLabel: { ...typography.bodySmall, color: colors.text, fontWeight: '600', marginBottom: spacing.sm },
  footer: { padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
});
