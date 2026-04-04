import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Button } from '../../components';
import { activityCategories, projects } from '../../data/mockData';

export const ActivityFilterScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const getIconName = (icon) => {
    const iconMap = { code: 'code-slash', users: 'people', clipboard: 'clipboard', 'pen-tool': 'create', search: 'search' };
    return iconMap[icon] || 'apps';
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.handleContainer}>
        <View style={styles.handle} />
      </View>
      
      <View style={styles.header}>
        <Text style={styles.title}>Filter Activities</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Category</Text>
            <TouchableOpacity>
              <Text style={styles.selectAllText}>Select All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.categoriesRow}>
            {activityCategories.map((cat) => (
              <TouchableOpacity key={cat.id} style={[styles.categoryChip, cat.active && styles.activeCategoryChip]}>
                <Ionicons name={getIconName(cat.icon)} size={14} color={cat.active ? colors.textInverse : colors.textSecondary} />
                <Text style={[styles.categoryText, cat.active && styles.activeCategoryText]}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project or Client</Text>
          <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>Dirga Corp - Mobile App Redesign</Text>
            <Ionicons name="chevron-down" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.statusRow}>
            <TouchableOpacity style={styles.statusChip}>
              <Text style={styles.statusText}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.statusChip, styles.activeStatusChip]}>
              <Text style={[styles.statusText, styles.activeStatusText]}>Completed</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Apply Filters (3)" onPress={() => navigation.goBack()} style={styles.applyButton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface, borderTopLeftRadius: borderRadius.xxl, borderTopRightRadius: borderRadius.xxl },
  handleContainer: { alignItems: 'center', paddingVertical: spacing.md },
  handle: { width: 40, height: 4, backgroundColor: colors.border, borderRadius: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  title: { ...typography.h4, color: colors.text },
  scrollContent: { padding: spacing.lg },
  section: { marginBottom: spacing.xl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { ...typography.label, color: colors.text, marginBottom: spacing.md },
  selectAllText: { ...typography.bodySmall, color: colors.primary, fontWeight: '600' },
  categoriesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  categoryChip: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  activeCategoryChip: { backgroundColor: colors.primary, borderColor: colors.primary },
  categoryText: { ...typography.bodySmall, color: colors.textSecondary },
  activeCategoryText: { color: colors.textInverse, fontWeight: '600' },
  dropdown: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, height: 48 },
  dropdownText: { ...typography.body, color: colors.text },
  statusRow: { flexDirection: 'row', gap: spacing.sm },
  statusChip: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm, backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.lg },
  activeStatusChip: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.primary },
  statusText: { ...typography.bodySmall, color: colors.textSecondary },
  activeStatusText: { color: colors.primary, fontWeight: '600' },
  footer: { padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border },
  applyButton: { width: '100%' },
});
