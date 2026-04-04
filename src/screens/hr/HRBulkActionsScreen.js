import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card, Badge } from '../../components';
import { hapticFeedback } from '../../utils/haptics';

export const HRBulkActionsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState([]);

  const employees = [
    { id: 1, name: 'Sarah Miller', department: 'Engineering', status: 'active' },
    { id: 2, name: 'James Wilson', department: 'Engineering', status: 'active' },
    { id: 3, name: 'Hanna Jenkins', department: 'Operations', status: 'active' },
    { id: 4, name: 'Michael Chen', department: 'Design', status: 'onboarding' },
    { id: 5, name: 'Emma Wilson', department: 'Marketing', status: 'active' },
  ];

  const toggleSelect = (id) => {
    hapticFeedback('light');
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Bulk Actions" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.actionButtons}>
          {[
            { icon: 'checkmark-circle', label: 'Approve All', color: colors.success },
            { icon: 'swap-horizontal', label: 'Transfer', color: colors.primary },
            { icon: 'cash', label: 'Salary Adjust', color: colors.warning },
            { icon: 'close-circle', label: 'Deactivate', color: colors.error },
          ].map(action => (
            <TouchableOpacity key={action.label} style={[styles.actionBtn, { backgroundColor: `${action.color}15` }]} onPress={() => hapticFeedback('medium')} activeOpacity={0.7}>
              <Ionicons name={action.icon} size={24} color={action.color} />
              <Text style={[styles.actionBtnLabel, { color: action.color }]}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Select Employees ({selected.length})</Text>
        {employees.map(emp => (
          <TouchableOpacity key={emp.id} style={[styles.empRow, selected.includes(emp.id) && styles.empRowSelected, shadows.sm]} onPress={() => toggleSelect(emp.id)} activeOpacity={0.7}>
            <View style={[styles.checkbox, selected.includes(emp.id) && styles.checkboxSelected]}>
              {selected.includes(emp.id) && <Ionicons name="checkmark" size={14} color={colors.textInverse} />}
            </View>
            <View style={styles.empInfo}>
              <Text style={styles.empName}>{emp.name}</Text>
              <Text style={styles.empDept}>{emp.department}</Text>
            </View>
            <Badge text={emp.status} variant={emp.status === 'active' ? 'success' : 'warning'} size="small" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selected.length > 0 && (
        <View style={styles.bottomBar}>
          <Text style={styles.selectedCount}>{selected.length} selected</Text>
          <TouchableOpacity style={styles.applyBtn} onPress={() => hapticFeedback('heavy')} activeOpacity={0.7}>
            <Text style={styles.applyBtnText}>Apply Action</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg, paddingBottom: 80 },
  actionButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.lg },
  actionBtn: { width: '47%', borderRadius: borderRadius.lg, padding: spacing.lg, alignItems: 'center', gap: spacing.sm },
  actionBtnLabel: { ...typography.label, fontWeight: '600' },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  empRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.md },
  empRowSelected: { borderWidth: 2, borderColor: colors.primary },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  checkboxSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  empInfo: { flex: 1 },
  empName: { ...typography.body, color: colors.text, fontWeight: '600' },
  empDept: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
  selectedCount: { ...typography.body, color: colors.text, fontWeight: '600' },
  applyBtn: { backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: borderRadius.lg },
  applyBtnText: { ...typography.button, color: colors.textInverse },
});
