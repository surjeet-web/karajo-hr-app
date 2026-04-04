import React, { useState, useCallback } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Card, Badge, Button, ProgressBar } from '../../components';
import { performanceData } from '../../data/mockData';
import { addGoal, updateGoalProgress } from '../../store';
import { hapticFeedback } from '../../animations/hooks';

export const GoalSettingScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [editProgress, setEditProgress] = useState<string>('');
  const [newGoal, setNewGoal] = useState({ title: '', deadline: '', priority: 'medium', category: 'Technical' });
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

  const handleGoalPress = (goal) => {
    hapticFeedback('light');
    setEditingGoal(goal);
    setEditProgress(goal.progress.toString());
  };

  const handleSaveProgress = (): void => {
    const progress = parseInt(editProgress, 10);
    if (isNaN(progress) || progress < 0 || progress > 100) {
      Alert.alert('Invalid Progress', 'Please enter a value between 0 and 100.');
      return;
    }
    updateGoalProgress(editingGoal.id, progress);
    setEditingGoal(null);
    setEditProgress('');
    Alert.alert('Progress Updated', `${editingGoal.title} is now at ${progress}%`);
  };

  const handleAddGoal = (): void => {
    if (!newGoal.title.trim()) {
      Alert.alert('Missing Title', 'Please enter a goal title.');
      return;
    }
    if (!newGoal.deadline.trim()) {
      Alert.alert('Missing Deadline', 'Please enter a deadline.');
      return;
    }
    addGoal({
      title: newGoal.title.trim(),
      deadline: newGoal.deadline.trim(),
      priority: newGoal.priority,
      category: newGoal.category,
    });
    setNewGoal({ title: '', deadline: '', priority: 'medium', category: 'Technical' });
    setShowAddForm(false);
    Alert.alert('Goal Added', 'Your new goal has been created.');
  };

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
            <Text style={[styles.overviewStat, { color: colors.primary }]}>{performanceData.goals.filter(g => g.status === 'completed').length} completed</Text>
          </View>
        </Card>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={styles.catContainer}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.catChip, selectedCategory === cat && styles.catChipActive]}
              onPress={() => { hapticFeedback('light'); setSelectedCategory(cat); }}
              accessibilityRole="button"
              accessibilityLabel={`Filter by ${cat}`}
              accessibilityState={{ selected: selectedCategory === cat }}
            >
              <Text style={[styles.catChipText, selectedCategory === cat && styles.catChipTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filteredGoals.map(goal => {
          const badge = getStatusBadge(goal.status);
          return (
            <TouchableOpacity
              key={goal.id}
              activeOpacity={0.7}
              onPress={() => handleGoalPress(goal)}
              accessibilityRole="button"
              accessibilityLabel={`${goal.title}, ${goal.progress}% complete, ${badge.text}`}
            >
              <Card style={styles.goalCard} padding="md">
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
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Add New Goal" icon={<Ionicons name="add" size={20} color={colors.textInverse} />} onPress={() => { hapticFeedback('medium'); setShowAddForm(true); }} />
      </View>

      <Modal visible={editingGoal !== null} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Progress</Text>
              <TouchableOpacity onPress={() => setEditingGoal(null)} accessibilityRole="button" accessibilityLabel="Close">
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            {editingGoal && (
              <>
                <Text style={styles.modalGoalTitle}>{editingGoal.title}</Text>
                <Text style={styles.modalGoalCurrent}>Current: {editingGoal.progress}%</Text>
                <View style={styles.modalInputContainer}>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Enter new progress (0-100)"
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="number-pad"
                    value={editProgress}
                    onChangeText={setEditProgress}
                    accessibilityLabel="New progress percentage"
                  />
                </View>
                <View style={styles.quickProgressRow}>
                  {[0, 25, 50, 75, 100].map(val => (
                    <TouchableOpacity
                      key={val}
                      style={[styles.quickProgressBtn, parseInt(editProgress) === val && styles.quickProgressBtnActive]}
                      onPress={() => setEditProgress(val.toString())}
                      accessibilityRole="button"
                      accessibilityLabel={`Set progress to ${val}%`}
                    >
                      <Text style={[styles.quickProgressText, parseInt(editProgress) === val && styles.quickProgressTextActive]}>{val}%</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Button title="Save Progress" onPress={handleSaveProgress} />
              </>
            )}
          </View>
        </View>
      </Modal>

      <Modal visible={showAddForm} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Goal</Text>
              <TouchableOpacity onPress={() => setShowAddForm(false)} accessibilityRole="button" accessibilityLabel="Close">
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Title</Text>
              <View style={styles.formInputContainer}>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter goal title..."
                  placeholderTextColor={colors.textTertiary}
                  value={newGoal.title}
                  onChangeText={(text) => setNewGoal(prev => ({ ...prev, title: text }))}
                  accessibilityLabel="Goal title"
                />
              </View>
            </View>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Deadline</Text>
              <View style={styles.formInputContainer}>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g. Dec 31, 2026"
                  placeholderTextColor={colors.textTertiary}
                  value={newGoal.deadline}
                  onChangeText={(text) => setNewGoal(prev => ({ ...prev, deadline: text }))}
                  accessibilityLabel="Goal deadline"
                />
              </View>
            </View>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Priority</Text>
              <View style={styles.priorityRow}>
                {['low', 'medium', 'high'].map(p => (
                  <TouchableOpacity
                    key={p}
                    style={[styles.priorityChip, newGoal.priority === p && { backgroundColor: getPriorityColor(p) }]}
                    onPress={() => setNewGoal(prev => ({ ...prev, priority: p }))}
                    accessibilityRole="button"
                    accessibilityLabel={`Set priority to ${p}`}
                    accessibilityState={{ selected: newGoal.priority === p }}
                  >
                    <Text style={[styles.priorityChipText, newGoal.priority === p && { color: colors.textInverse }]}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Category</Text>
              <View style={styles.categoryRow}>
                {['Technical', 'Leadership', 'Growth'].map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.categoryChip, newGoal.category === cat && styles.categoryChipActive]}
                    onPress={() => setNewGoal(prev => ({ ...prev, category: cat }))}
                    accessibilityRole="button"
                    accessibilityLabel={`Set category to ${cat}`}
                    accessibilityState={{ selected: newGoal.category === cat }}
                  >
                    <Text style={[styles.categoryChipText, newGoal.category === cat && styles.categoryChipTextActive]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <Button title="Create Goal" onPress={handleAddGoal} />
          </View>
        </View>
      </Modal>
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
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: borderRadius.xl, borderTopRightRadius: borderRadius.xl, padding: spacing.lg, paddingBottom: spacing.xl },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  modalTitle: { ...typography.h5, color: colors.text, fontWeight: '700' },
  modalGoalTitle: { ...typography.body, color: colors.text, fontWeight: '600', marginBottom: spacing.xs },
  modalGoalCurrent: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.md },
  modalInputContainer: { backgroundColor: colors.background, borderRadius: borderRadius.lg, borderWidth: 1.5, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.md },
  modalInput: { ...typography.body, color: colors.text },
  quickProgressRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  quickProgressBtn: { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', borderRadius: borderRadius.md, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  quickProgressBtnActive: { backgroundColor: colors.accentPink, borderColor: colors.accentPink },
  quickProgressText: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: '600' },
  quickProgressTextActive: { color: colors.textInverse },
  formField: { marginBottom: spacing.lg },
  formLabel: { ...typography.label, color: colors.text, marginBottom: spacing.sm },
  formInputContainer: { backgroundColor: colors.background, borderRadius: borderRadius.lg, borderWidth: 1.5, borderColor: colors.border, padding: spacing.md },
  formInput: { ...typography.body, color: colors.text },
  priorityRow: { flexDirection: 'row', gap: spacing.sm },
  priorityChip: { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', borderRadius: borderRadius.md, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  priorityChipText: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: '600' },
  categoryRow: { flexDirection: 'row', gap: spacing.sm },
  categoryChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  categoryChipActive: { backgroundColor: colors.accentPink, borderColor: colors.accentPink },
  categoryChipText: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: '600' },
  categoryChipTextActive: { color: colors.textInverse },
});
