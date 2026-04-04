import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Button } from '../../components';

export const AttendanceFilterScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.handleContainer}>
        <View style={styles.handle} />
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Filter Attendance</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Period</Text>
          <View style={styles.dateRow}>
            <View style={styles.dateField}>
              <Text style={styles.dateLabel}>Start Date</Text>
              <TouchableOpacity style={styles.dateInput}>
                <Text style={styles.dateText}>Jan 18, 2026</Text>
                <Ionicons name="calendar" size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>
            <View style={styles.dateField}>
              <Text style={styles.dateLabel}>End Date</Text>
              <TouchableOpacity style={styles.dateInput}>
                <Text style={styles.dateText}>Feb 18, 2026</Text>
                <Ionicons name="calendar" size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attendance Status</Text>
          <View style={styles.chipRow}>
            <TouchableOpacity style={[styles.chip, styles.chipActive]}>
              <Ionicons name="checkmark" size={14} color={colors.textInverse} />
              <Text style={[styles.chipText, styles.chipTextActive]}>Present</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chip}>
              <Text style={styles.chipText}>Late</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chip}>
              <Text style={styles.chipText}>Absent</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chip}>
              <Text style={styles.chipText}>On Leave</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shift Type</Text>
          <View style={styles.chipRow}>
            <TouchableOpacity style={[styles.chip, styles.chipActive]}>
              <Ionicons name="checkmark" size={14} color={colors.textInverse} />
              <Text style={[styles.chipText, styles.chipTextActive]}>Regular</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chip}>
              <Text style={styles.chipText}>Overtime</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chip}>
              <Text style={styles.chipText}>Night Shift</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Location</Text>
          <View style={styles.locationRow}>
            <TouchableOpacity style={[styles.locationChip, styles.locationChipActive]}>
              <Ionicons name="business" size={18} color={colors.primary} />
              <Text style={[styles.locationText, styles.locationTextActive]}>Office</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.locationChip}>
              <Ionicons name="home" size={18} color={colors.textSecondary} />
              <Text style={styles.locationText}>Remote</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Apply Filters (3)" onPress={() => navigation.goBack()} />
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
});
