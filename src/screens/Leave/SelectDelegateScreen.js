import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Button, ProgressBar } from '../../components';
import { colleagues } from '../../data/mockData';

export const SelectDelegateScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selectedDelegate, setSelectedDelegate] = useState(null);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Select Delegate" onBack={() => navigation.goBack()} />
      <ProgressBar currentStep={3} totalSteps={6} title="Request Leave" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Select a delegate</Text>
        <Text style={styles.subheading}>Choose a colleague to handle your responsibilities while you're away.</Text>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textTertiary} />
          <Text style={styles.searchPlaceholder}>Search colleagues...</Text>
        </View>

        <Text style={styles.sectionTitle}>Suggested Colleagues</Text>

        <View style={styles.colleaguesList}>
          {colleagues.map((colleague) => (
            <TouchableOpacity
              key={colleague.id}
              style={[styles.colleagueItem, selectedDelegate === colleague.id && styles.colleagueItemSelected]}
              onPress={() => setSelectedDelegate(colleague.id)}
            >
              <Image source={{ uri: colleague.avatar }} style={styles.colleagueAvatar} />
              <View style={styles.colleagueInfo}>
                <Text style={styles.colleagueName}>{colleague.name}</Text>
                <Text style={styles.colleagueRole}>{colleague.role}</Text>
              </View>
              <View style={[styles.radio, selectedDelegate === colleague.id && styles.radioSelected]}>
                {selectedDelegate === colleague.id && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={colors.info} />
          <Text style={styles.infoText}>
            Your delegate will be notified and will have access to your tasks and responsibilities during your absence.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Continue" onPress={() => navigation.navigate('UploadDocument')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  heading: { ...typography.h4, color: colors.text, marginBottom: spacing.sm },
  subheading: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  searchContainer: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surface, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, height: 48, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.lg },
  searchPlaceholder: { ...typography.body, color: colors.textTertiary },
  sectionTitle: { ...typography.label, color: colors.textTertiary, marginBottom: spacing.md },
  colleaguesList: { gap: spacing.md, marginBottom: spacing.lg },
  colleagueItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  colleagueItemSelected: { borderColor: colors.primary, backgroundColor: colors.primaryLighter },
  colleagueAvatar: { width: 48, height: 48, borderRadius: 24 },
  colleagueInfo: { flex: 1 },
  colleagueName: { ...typography.body, color: colors.text, fontWeight: '600' },
  colleagueRole: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  radioSelected: { borderColor: colors.primary },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
  infoBox: { flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.infoLight, padding: spacing.md, borderRadius: borderRadius.lg },
  infoText: { ...typography.bodySmall, color: colors.info, flex: 1 },
  footer: { padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
});
