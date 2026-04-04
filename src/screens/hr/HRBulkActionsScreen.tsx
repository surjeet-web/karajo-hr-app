import React, { useState, useEffect } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card, Badge } from '../../components';
import { hapticFeedback } from '../../utils/haptics';
import { getState, subscribe, setState } from '../../store';

export const HRBulkActionsScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [state, setStateLocal] = useState(getState());
  const [selected, setSelected] = useState<any[]>([]);
  const [activeAction, setActiveAction] = useState<any>(null);

  useEffect(() => {
    const unsub = subscribe(setStateLocal);
    return unsub;
  }, []);

  const employees = state.employees || [];

  const toggleSelect = (id) => {
    hapticFeedback('light');
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSelectAll = (): void => {
    hapticFeedback('light');
    if (selected.length === employees.length) {
      setSelected([]);
    } else {
      setSelected(employees.map(e => e.id));
    }
  };

  const handleBulkAction = (action) => {
    hapticFeedback('medium');
    setActiveAction(action);
    const actionLabels = {
      approve: 'Approve All Pending Requests',
      transfer: 'Transfer Employees',
      salary: 'Adjust Salaries',
      deactivate: 'Deactivate Employees',
    };

    Alert.alert(
      actionLabels[action],
      `Apply this action to ${selected.length} selected employee(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Apply',
          onPress: () => {
            if (action === 'deactivate') {
              setState(prev => ({
                employees: prev.employees.map(e => selected.includes(e.id) ? { ...e, status: 'inactive' } : e),
              }));
              setStateLocal(getState());
            }
            hapticFeedback('success');
            Alert.alert('Success', `Action applied to ${selected.length} employee(s).`);
            setSelected([]);
            setActiveAction(null);
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Bulk Actions" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.actionButtons}>
          {[
            { icon: 'checkmark-circle', label: 'Approve All', color: colors.success, action: 'approve' },
            { icon: 'swap-horizontal', label: 'Transfer', color: colors.primary, action: 'transfer' },
            { icon: 'cash', label: 'Salary Adjust', color: colors.warning, action: 'salary' },
            { icon: 'close-circle', label: 'Deactivate', color: colors.error, action: 'deactivate' },
          ].map(action => (
            <TouchableOpacity key={action.label} style={[styles.actionBtn, { backgroundColor: `${action.color}15` }]} onPress={() => selected.length > 0 ? handleBulkAction(action.action) : Alert.alert('Select Employees', 'Please select employees first.')} activeOpacity={0.7}>
              <Ionicons name={action.icon} size={24} color={action.color} />
              <Text style={[styles.actionBtnLabel, { color: action.color }]}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.selectHeader}>
          <Text style={styles.sectionTitle}>Select Employees ({selected.length}/{employees.length})</Text>
          <TouchableOpacity onPress={handleSelectAll}>
            <Text style={styles.selectAllText}>{selected.length === employees.length ? 'Deselect All' : 'Select All'}</Text>
          </TouchableOpacity>
        </View>
        {employees.map(emp => (
          <TouchableOpacity key={emp.id} style={[styles.empRow, selected.includes(emp.id) && styles.empRowSelected, shadows.sm]} onPress={() => toggleSelect(emp.id)} activeOpacity={0.7}>
            <View style={[styles.checkbox, selected.includes(emp.id) && styles.checkboxSelected]}>
              {selected.includes(emp.id) && <Ionicons name="checkmark" size={14} color={colors.textInverse} />}
            </View>
            <View style={styles.empInfo}>
              <Text style={styles.empName}>{emp.name}</Text>
              <Text style={styles.empDept}>{emp.department}</Text>
            </View>
            <Badge text={emp.status} variant={emp.status === 'active' ? 'success' : emp.status === 'onboarding' ? 'warning' : 'error'} size="small" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selected.length > 0 && (
        <View style={styles.bottomBar}>
          <Text style={styles.selectedCount}>{selected.length} selected</Text>
          <TouchableOpacity style={styles.applyBtn} onPress={() => handleBulkAction(activeAction || 'approve')} activeOpacity={0.7}>
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
  selectHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  selectAllText: { ...typography.bodySmall, color: colors.primary, fontWeight: '600' },
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
