import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Card } from '../../components';
import { getState } from '../../store';

export const PersonalInfoScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const user = getState().user;

  const infoSections = [
    {
      title: 'Contact Information',
      icon: 'call-outline' as const,
      items: [
        { label: 'Email', value: user.email || 'john.doe@company.com' },
        { label: 'Phone', value: user.phone || '+1 (555) 123-4567' },
        { label: 'Emergency Contact', value: 'Jane Doe - +1 (555) 987-6543' },
      ],
    },
    {
      title: 'Address',
      icon: 'location-outline' as const,
      items: [
        { label: 'Street', value: '123 Main Street, Apt 4B' },
        { label: 'City', value: 'New York, NY 10001' },
        { label: 'Country', value: 'United States' },
      ],
    },
    {
      title: 'Personal Details',
      icon: 'person-outline' as const,
      items: [
        { label: 'Date of Birth', value: 'January 15, 1990' },
        { label: 'Gender', value: 'Male' },
        { label: 'Nationality', value: 'American' },
      ],
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Personal Information" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {infoSections.map((section, idx) => (
          <View key={idx} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name={section.icon} size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <Card style={styles.card}>
              {section.items.map((item, i) => (
                <View
                  key={i}
                  style={[
                    styles.row,
                    i < section.items.length - 1 && styles.rowBorder,
                  ]}
                >
                  <Text style={styles.label}>{item.label}</Text>
                  <Text style={styles.value}>{item.value}</Text>
                </View>
              ))}
            </Card>
          </View>
        ))}

        <TouchableOpacity style={styles.editButton} activeOpacity={0.7}>
          <Ionicons name="create-outline" size={20} color={colors.textInverse} />
          <Text style={styles.editButtonText}>Edit Information</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  section: { marginBottom: spacing.lg },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  sectionTitle: { ...typography.body, color: colors.text, fontWeight: '600' },
  card: { padding: 0 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  label: { ...typography.bodySmall, color: colors.textSecondary },
  value: { ...typography.bodySmall, color: colors.text, fontWeight: '500' },
  editButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.primary, paddingVertical: spacing.md, borderRadius: borderRadius.lg, marginTop: spacing.md },
  editButtonText: { ...typography.body, color: colors.textInverse, fontWeight: '600' },
});
