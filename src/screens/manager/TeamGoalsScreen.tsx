import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card, Badge } from '../../components';
import { StatCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';
import { getState, subscribe, setState } from '../../store';

export const TeamGoalsScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [state, setStateLocal] = useState(getState());
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    const unsub = subscribe(setStateLocal);
    return unsub;
  }, []);

  const onRefresh = (): void => {
    setRefreshing(true);
    setStateLocal(getState());
    setRefreshing(false);
  };

  const goals = state.performance.goals || [];
  const onTrack = goals.filter(g => g.status === 'on-track').length;
  const completed = goals.filter(g => g.status === 'completed').length;
  const behind = goals.filter(g => g.status === 'behind').length;
  const avgProgress = goals.length > 0 ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length) : 0;

  const handleUpdateProgress = (goal) => {
    hapticFeedback('medium');
    Alert.prompt(
      'Update Progress',
      `Enter new progress for "${goal.title}" (current: ${goal.progress}%):`,
      (value) => {
        if (value && !isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 100) {
          setState(prev => ({
            performance: {
              ...prev.performance,
              goals: prev.performance.goals.map(g => g.id === goal.id ? { ...g, progress: Number(value), status: Number(value) >= 100 ? 'completed' : Number(value) < 30 ? 'behind' : 'on-track' } : g),
            },
          }));
          setStateLocal(getState());
          hapticFeedback('success');
        }
      },
      'numeric',
      goal.progress.toString()
    );
  };

  const handleAddGoal = (): void => {
    hapticFeedback('medium');
    Alert.prompt('Add Goal', 'Enter goal title:', (title) => {
      if (title) {
        Alert.prompt('Deadline', 'Enter deadline:', (deadline) => {
          if (deadline) {
            Alert.prompt('Priority', 'Enter priority (high/medium/low):', (priority) => {
              setState(prev => ({
                performance: {
                  ...prev.performance,
                  goals: [...prev.performance.goals, { id: Date.now(), title, progress: 0, deadline: deadline || 'TBD', status: 'on-track', priority: priority || 'medium', category: 'Team' }],
                },
              }));
              setStateLocal(getState());
              hapticFeedback('success');
            });
          }
        });
      }
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Team Goals" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        <View style={styles.statsRow}>
          <StatCard icon="flag" label="Total Goals" value={goals.length.toString()} color={colors.primary} delay={0} />
          <StatCard icon="checkmark-circle" label="Completed" value={completed.toString()} color={colors.success} delay={100} />
          <StatCard icon="trending-up" label="Avg Progress" value={`${avgProgress}%`} color={colors.accentPurple} delay={200} />
          <StatCard icon="warning" label="Behind" value={behind.toString()} color={colors.warning} delay={300} />
        </View>

        <TouchableOpacity style={[styles.addBtn, shadows.md]} onPress={handleAddGoal} activeOpacity={0.7}>
          <Ionicons name="add-circle" size={20} color={colors.textInverse} />
          <Text style={styles.addBtnText}>Add New Goal</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Goals ({goals.length})</Text>
          {goals.map((goal, i) => (
            <TouchableOpacity key={goal.id} style={[styles.goalCard, shadows.sm]} onPress={() => handleUpdateProgress(goal)} activeOpacity={0.7}>
              <View style={styles.goalHeader}>
                <View style={styles.goalInfo}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Text style={styles.goalDeadline}>Due: {goal.deadline}</Text>
                </View>
                <View style={[styles.priorityDot, { backgroundColor: goal.priority === 'high' ? colors.error : goal.priority === 'medium' ? colors.warning : colors.success }]} />
              </View>
              <View style={styles.progressRow}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${goal.progress}%`, backgroundColor: goal.progress >= 100 ? colors.success : goal.progress >= 60 ? colors.primary : goal.progress >= 30 ? colors.warning : colors.error }]} />
                </View>
                <Text style={styles.progressText}>{goal.progress}%</Text>
              </View>
              <View style={styles.goalFooter}>
                <Badge text={goal.status} variant={goal.status === 'completed' ? 'success' : goal.status === 'behind' ? 'error' : 'primary'} size="small" />
                <Text style={styles.updateHint}>Tap to update progress</Text>
              </View>
            </TouchableOpacity>
          ))}
          {goals.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="flag-outline" size={64} color={colors.textTertiary} />
              <Text style={styles.emptyTitle}>No Goals Set</Text>
              <Text style={styles.emptySubtitle}>Add a new goal to get started.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.lg },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.primary, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.lg },
  addBtnText: { ...typography.button, color: colors.textInverse },
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  goalCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm },
  goalInfo: { flex: 1 },
  goalTitle: { ...typography.body, color: colors.text, fontWeight: '600' },
  goalDeadline: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  priorityDot: { width: 10, height: 10, borderRadius: 5 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  progressBar: { flex: 1, height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  progressText: { ...typography.caption, color: colors.textSecondary, fontWeight: '600', width: 35, textAlign: 'right' },
  goalFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  updateHint: { ...typography.caption, color: colors.textTertiary },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxxxl },
  emptyTitle: { ...typography.h4, color: colors.text, marginTop: spacing.md },
  emptySubtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
});
