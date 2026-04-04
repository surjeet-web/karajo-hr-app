import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Input, Button } from '../../components';
import { activityCategories, projects } from '../../data/mockData';

export const AddActivityScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [startTime, setStartTime] = useState('9:00 AM');
  const [endTime, setEndTime] = useState('10:30 AM');
  const [selectedCategory, setSelectedCategory] = useState('development');
  const [description, setDescription] = useState('');

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
            />
          </View>
        </View>

        {/* Project Selection */}
        <View style={styles.field}>
          <Text style={styles.label}>Project or Client</Text>
          <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>Select a project...</Text>
            <Ionicons name="chevron-down" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Time Selection */}
        <View style={styles.timeRow}>
          <View style={[styles.field, styles.timeField]}>
            <Text style={styles.label}>Start Time</Text>
            <TouchableOpacity style={styles.timeInput}>
              <Text style={styles.timeText}>{startTime}</Text>
              <Ionicons name="time-outline" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
          <View style={[styles.field, styles.timeField]}>
            <Text style={styles.label}>End Time</Text>
            <TouchableOpacity style={styles.timeInput}>
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
            <Text style={styles.durationText}>1h 30m</Text>
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
                onPress={() => setSelectedCategory(category.id)}
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
            />
            <Text style={styles.charCount}>0/200</Text>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <Button
          title="Save Log"
          onPress={() => navigation.goBack()}
          style={styles.saveButton}
        />
      </View>
    </View>
  );
};

import { TextInput } from 'react-native';

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
