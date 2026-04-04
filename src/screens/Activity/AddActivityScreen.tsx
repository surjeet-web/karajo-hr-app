import React, { useState } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Input, Button, AnimatedCard } from '../../components';
import { activityCategories, projects } from '../../data/mockData';
import { addActivity } from '../../store';
import { hapticFeedback } from '../../utils/haptics';
import { useFadeIn, useSlideIn } from '../../utils/animations';

export const AddActivityScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [startTime, setStartTime] = useState<string>('9:00 AM');
  const [endTime, setEndTime] = useState<string>('10:30 AM');
  const [selectedCategory, setSelectedCategory] = useState<string>('development');
  const [description, setDescription] = useState<string>('');

  const getIconName = (icon) => {
    const iconMap = {
      code: 'code-slash',
      users: 'people',
      clipboard: 'clipboard',
      'pen-tool': 'create',
      search: 'search',
    };
    return iconMap[icon] || 'apps';
  };

  const calculateDuration = () => {
    return '1h 30m';
  };

  const handleSave = (): void => {
    hapticFeedback('heavy');
    addActivity({
      title,
      project: selectedProject ? selectedProject.name : 'Unassigned',
      startTime,
      endTime,
      category: selectedCategory,
      description,
      duration: calculateDuration(),
    });
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Add Activity Log" onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Activity Title */}
        <View style={styles.field}>
          <Text style={styles.label}>Activity Title</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="document-text-outline" size={20} color={colors.textTertiary} />
            <TextInput
              style={styles.input}
              placeholder="What did you work on?"
              placeholderTextColor={colors.textTertiary}
              value={title}
              onChangeText={setTitle}
              accessibilityLabel="Activity title"
            />
          </View>
        </View>

        {/* Project Selection */}
        <View style={styles.field}>
          <Text style={styles.label}>Project or Client</Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => Alert.alert('Coming Soon', 'Project selection will be available in the next update.')} activeOpacity={0.7} accessibilityLabel="Select project">
            <Text style={selectedProject ? styles.dropdownText : styles.dropdownPlaceholderText}>
              {selectedProject ? selectedProject.name : 'Select a project...'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Time Selection */}
        <View style={styles.timeRow}>
          <View style={[styles.field, styles.timeField]}>
            <Text style={styles.label}>Start Time</Text>
            <TouchableOpacity style={styles.timeInput} onPress={() => Alert.alert('Coming Soon', 'Time picker will be available in the next update.')} activeOpacity={0.7} accessibilityLabel="Select start time">
              <Text style={styles.timeText}>{startTime}</Text>
              <Ionicons name="time-outline" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
          <View style={[styles.field, styles.timeField]}>
            <Text style={styles.label}>End Time</Text>
            <TouchableOpacity style={styles.timeInput} onPress={() => Alert.alert('Coming Soon', 'Time picker will be available in the next update.')} activeOpacity={0.7} accessibilityLabel="Select end time">
              <Text style={styles.timeText}>{endTime}</Text>
              <Ionicons name="time-outline" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Total Duration */}
        <View style={styles.durationRow}>
          <Text style={styles.durationLabel}>Total Duration</Text>
          <View style={styles.durationBadge}>
            <Ionicons name="time-outline" size={14} color={colors.primary} />
            <Text style={styles.durationText}>{calculateDuration()}</Text>
          </View>
        </View>

        {/* Category Selection */}
        <View style={styles.field}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoriesRow}>
            {activityCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.activeCategoryChip,
                ]}
                onPress={() => {
                  hapticFeedback('light');
                  setSelectedCategory(category.id);
                }}
                activeOpacity={0.7}
                accessibilityLabel={`${category.name} category`}
              >
                <Ionicons
                  name={getIconName(category.icon)}
                  size={14}
                  color={selectedCategory === category.id ? colors.textInverse : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.id && styles.activeCategoryText,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="Add any details or notes about this work session..."
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
              maxLength={200}
              accessibilityLabel="Activity description"
            />
            <Text style={styles.charCount}>{description.length}/200</Text>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <Button
          title="Save Log"
          onPress={handleSave}
          style={styles.saveButton}
          accessibilityLabel="Save activity log"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  dropdownText: {
    ...typography.body,
    color: colors.text,
  },
  dropdownPlaceholderText: {
    ...typography.body,
    color: colors.textTertiary,
  },
  timeRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  timeField: {
    flex: 1,
  },
  timeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  timeText: {
    ...typography.body,
    color: colors.text,
  },
  durationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  durationLabel: {
    ...typography.body,
    color: colors.text,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primaryLighter,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  durationText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  activeCategoryChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  activeCategoryText: {
    color: colors.textInverse,
    fontWeight: '600',
  },
  textAreaContainer: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  textArea: {
    ...typography.body,
    color: colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveButton: {
    width: '100%',
  },
});
