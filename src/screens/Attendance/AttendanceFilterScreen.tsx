import React, { useState } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Button } from '../../components';
import { hapticFeedback } from '../../utils/haptics';

export const AttendanceFilterScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [startDate, setStartDate] = useState<string>('Jan 18, 2026');
  const [endDate, setEndDate] = useState<string>('Feb 18, 2026');
  const [statusFilters, setStatusFilters] = useState(['Present']);
  const [shiftFilters, setShiftFilters] = useState(['Regular']);
  const [locationFilter, setLocationFilter] = useState<string>('Office');

  const toggleStatus = (status) => {
    setStatusFilters(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const toggleShift = (shift) => {
    setShiftFilters(prev =>
      prev.includes(shift) ? prev.filter(s => s !== shift) : [...prev, shift]
    );
  };

  const activeCount = statusFilters.length + shiftFilters.length + (locationFilter ? 1 : 0);

  const handleApply = (): void => {
    navigation.goBack();
  };

  const handleClear = (): void => {
    setStatusFilters([]);
    setShiftFilters([]);
    setLocationFilter(null);
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.handleContainer}>
        <View style={styles.handle} />
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Filter Attendance</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Close filter">
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Period</Text>
          <View style={styles.dateRow}>
            <View style={styles.dateField}>
              <Text style={styles.dateLabel}>Start Date</Text>
              <TouchableOpacity style={styles.dateInput} onPress={() => {}} accessibilityLabel="Select start date">
                <Text style={styles.dateText}>{startDate}</Text>
                <Ionicons name="calendar" size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>
            <View style={styles.dateField}>
              <Text style={styles.dateLabel}>End Date</Text>
              <TouchableOpacity style={styles.dateInput} onPress={() => {}} accessibilityLabel="Select end date">
                <Text style={styles.dateText}>{endDate}</Text>
                <Ionicons name="calendar" size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attendance Status</Text>
          <View style={styles.chipRow}>
            {['Present', 'Late', 'Absent', 'On Leave'].map((status) => {
              const isActive = statusFilters.includes(status);
              return (
                <TouchableOpacity
                  key={status}
                  style={[styles.chip, isActive && styles.chipActive]}
                  onPress={() => { hapticFeedback('light'); toggleStatus(status); }}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isActive }}
                  accessibilityLabel={`${status} ${isActive ? 'selected' : 'not selected'}`}
                >
                  {isActive && <Ionicons name="checkmark" size={14} color={colors.textInverse} />}
                  <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{status}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shift Type</Text>
          <View style={styles.chipRow}>
            {['Regular', 'Overtime', 'Night Shift'].map((shift) => {
              const isActive = shiftFilters.includes(shift);
              return (
                <TouchableOpacity
                  key={shift}
                  style={[styles.chip, isActive && styles.chipActive]}
                  onPress={() => { hapticFeedback('light'); toggleShift(shift); }}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isActive }}
                  accessibilityLabel={`${shift} ${isActive ? 'selected' : 'not selected'}`}
                >
                  {isActive && <Ionicons name="checkmark" size={14} color={colors.textInverse} />}
                  <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{shift}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Location</Text>
          <View style={styles.locationRow}>
            {['Office', 'Remote'].map((loc) => {
              const isActive = locationFilter === loc;
              return (
                <TouchableOpacity
                  key={loc}
                  style={[styles.locationChip, isActive && styles.locationChipActive]}
                  onPress={() => setLocationFilter(isActive ? null : loc)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isActive }}
                  accessibilityLabel={`${loc} ${isActive ? 'selected' : 'not selected'}`}
                >
                  <Ionicons name={loc === 'Office' ? 'business' : 'home'} size={18} color={isActive ? colors.primary : colors.textSecondary} />
                  <Text style={[styles.locationText, isActive && styles.locationTextActive]}>{loc}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <TouchableOpacity onPress={handleClear} accessibilityLabel="Clear all filters">
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
          <Button
            title={`Apply Filters (${activeCount})`}
            onPress={handleApply}
            accessibilityLabel={`Apply ${activeCount} filters`}
          />
        </View>
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
  sectionTitle: { ...typography.label, color: colors.text, marginBottom: spacing.md },
  dateRow: { flexDirection: 'row', gap: spacing.md },
  dateField: { flex: 1 },
  dateLabel: { ...typography.caption, color: colors.textTertiary, marginBottom: spacing.xs },
  dateInput: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, height: 48 },
  dateText: { ...typography.body, color: colors.text },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: colors.surfaceVariant, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full },
  chipActive: { backgroundColor: colors.primary },
  chipText: { ...typography.bodySmall, color: colors.text },
  chipTextActive: { color: colors.textInverse, fontWeight: '600' },
  locationRow: { flexDirection: 'row', gap: spacing.md },
  locationChip: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.surfaceVariant, paddingVertical: spacing.md, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border },
  locationChipActive: { backgroundColor: colors.primaryLighter, borderColor: colors.primary },
  locationText: { ...typography.body, color: colors.textSecondary },
  locationTextActive: { color: colors.primary, fontWeight: '600' },
  footer: { padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border },
  footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  clearText: { ...typography.body, color: colors.textSecondary, fontWeight: '600' },
});
