import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card, Badge } from '../../components';

export const FinanceTaxScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const taxItems = [
    { title: 'W-2 Forms 2025', status: 'filed', deadline: 'Jan 31, 2026', desc: 'Employee wage and tax statements' },
    { title: '1099 Forms 2025', status: 'pending', deadline: 'Jan 31, 2026', desc: 'Contractor payment reports' },
    { title: 'Quarterly Tax Q1 2026', status: 'upcoming', deadline: 'Apr 15, 2026', desc: 'Q1 estimated tax payment' },
    { title: 'State Tax Filing', status: 'filed', deadline: 'Mar 15, 2026', desc: 'State income tax returns' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Tax Management" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {taxItems.map((item, i) => (
          <Card key={i} style={styles.taxCard} padding="md">
            <View style={styles.taxHeader}>
              <Text style={styles.taxTitle}>{item.title}</Text>
              <Badge text={item.status} variant={item.status === 'filed' ? 'success' : item.status === 'pending' ? 'warning' : 'default'} size="small" />
            </View>
            <Text style={styles.taxDesc}>{item.desc}</Text>
            <Text style={styles.taxDeadline}>Deadline: {item.deadline}</Text>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  taxCard: { marginBottom: spacing.sm },
  taxHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  taxTitle: { ...typography.body, color: colors.text, fontWeight: '600' },
  taxDesc: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.sm },
  taxDeadline: { ...typography.caption, color: colors.warning, fontWeight: '600' },
});
