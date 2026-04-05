import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Card } from '../../components';

export const EmploymentInfoScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const employmentSections = [
    {
      title: 'Position Details',
      icon: 'briefcase-outline' as const,
      items: [
        { label: 'Job Title', value: 'Software Engineer' },
        { label: 'Employee ID', value: 'EMP-001' },
        { label: 'Department', value: 'Engineering' },
        { label: 'Reports To', value: 'John Smith (Engineering Manager)' },
      ],
    },
    {
      title: 'Employment Status',
      icon: 'checkmark-circle-outline' as const,
      items: [
        { label: 'Status', value: 'Active' },
        { label: 'Employment Type', value: 'Full-time' },
        { label: 'Start Date', value: 'January 15, 2022' },
        { label: 'Probation End', value: 'April 15, 2022' },
      ],
    },
    {
      title: 'Compensation',
      icon: 'cash-outline' as const,
      items: [
        { label: 'Base Salary', value: '$85,000/year' },
        { label: 'Pay Frequency', value: 'Monthly' },
        { label: 'Bank Account', value: '**** **** **** 4567' },
      ],
    },
    {
      title: 'Work Schedule',
      icon: 'time-outline' as const,
      items: [
        { label: 'Working Hours', value: '9:00 AM - 6:00 PM' },
        { label: 'Work Days', value: 'Monday - Friday' },
        { label: 'Location', value: 'Office (Hybrid)' },
      ],
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Employment Information" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {employmentSections.map((section, idx) => (
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
});
