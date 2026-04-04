import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Button, ProgressBar, AnimatedListItem } from '../../components';
import { Header } from '../../components';
import { useFadeIn, useSlideIn, useStaggerList } from '../../utils/animations';
import { hapticFeedback } from '../../utils/haptics';
import { getState, subscribe } from '../../store';

export const SelectLeaveTypeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [appState, setAppState] = useState(getState());
  const [selectedType, setSelectedType] = useState(null);
  const fadeIn = useFadeIn(400);
  const slideUp = useSlideIn('up', 20, 500, 100);
  const staggerAnims = useStaggerList(appState.leave.balances.length, 80);

  useEffect(() => {
    const unsubscribe = subscribe(setAppState);
    return unsubscribe;
  }, []);

  const balances = appState.leave.balances;

  const getIconName = (type) => {
    const iconMap = { Annual: 'umbrella', Sick: 'medkit', Personal: 'person', Unpaid: 'cash' };
    return iconMap[type] || 'calendar';
  };

  const getIconColor = (type) => {
    const colorMap = { Annual: colors.warning, Sick: colors.error, Personal: colors.accentPurple, Unpaid: colors.textTertiary };
    return colorMap[type] || colors.primary;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Select Leave Type" onBack={() => navigation.goBack()} />
      <ProgressBar currentStep={1} totalSteps={4} title="Request Leave" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Select Leave Type</Text>

        <View style={styles.typesList}>
          {balances.map((type, i) => (
            <AnimatedListItem
              key={type.type}
              style={[styles.typeItem, selectedType === type.type && styles.typeItemSelected]}
              animation={staggerAnims[i]}
              onPress={() => { hapticFeedback('light'); setSelectedType(type.type); }}
              accessible
              accessibilityLabel={`${type.type} leave, ${type.remaining !== null ? type.remaining + ' days remaining' : 'Unlimited'}`}
              accessibilityRole="radio"
              accessibilityState={{ selected: selectedType === type.type }}
            >
              <View style={[styles.typeIcon, { backgroundColor: `${type.color}15` }]}>
                <Ionicons name={getIconName(type.type)} size={24} color={getIconColor(type.type)} />
              </View>
              <View style={styles.typeInfo}>
                <Text style={styles.typeName}>{type.type} Leave</Text>
                <Text style={styles.typeBalance}>{type.remaining !== null ? type.remaining + ' days remaining' : 'Unlimited'}</Text>
              </View>
              <View style={[styles.radio, selectedType === type.type && styles.radioSelected]}>
                {selectedType === type.type && <View style={styles.radioInner} />}
              </View>
            </AnimatedListItem>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={colors.info} />
          <Text style={styles.infoText}>
            Leave balances are updated in real-time. Requests exceeding your balance may require special approval.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Continue" onPress={() => { hapticFeedback('heavy'); selectedType && navigation.navigate('SelectDates', { leaveType: selectedType }); }} disabled={!selectedType} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  heading: { ...typography.h4, color: colors.text, marginBottom: spacing.lg },
  typesList: { gap: spacing.md, marginBottom: spacing.lg },
  typeItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  typeItemSelected: { borderColor: colors.primary, backgroundColor: colors.primaryLighter },
  typeIcon: { width: 48, height: 48, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  typeInfo: { flex: 1 },
  typeName: { ...typography.body, color: colors.text, fontWeight: '600' },
  typeBalance: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  radioSelected: { borderColor: colors.primary },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
  infoBox: { flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.infoLight, padding: spacing.md, borderRadius: borderRadius.lg },
  infoText: { ...typography.bodySmall, color: colors.info, flex: 1 },
  footer: { padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
});
