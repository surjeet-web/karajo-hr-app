import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header } from '../../components';
import { hapticFeedback } from '../../utils/haptics';

export const CEOReportsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const reports = [
    { title: 'Board Report', desc: 'Quarterly executive summary', icon: 'document-text', color: colors.primary },
    { title: 'Investor Summary', desc: 'Financial and operational metrics', icon: 'trending-up', color: colors.success },
    { title: 'Compliance Overview', desc: 'Regulatory compliance status', icon: 'shield-checkmark', color: colors.warning },
    { title: 'Workforce Analytics', desc: 'Headcount, diversity, attrition', icon: 'people', color: colors.accentPurple },
    { title: 'Financial Summary', desc: 'Revenue, costs, profitability', icon: 'wallet', color: colors.info },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Executive Reports" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {reports.map((report, i) => (
          <TouchableOpacity key={i} style={[styles.reportCard, shadows.sm]} onPress={() => hapticFeedback('medium')} activeOpacity={0.7}>
            <View style={[styles.reportIcon, { backgroundColor: `${report.color}15` }]}>
              <Ionicons name={report.icon} size={24} color={report.color} />
            </View>
            <View style={styles.reportInfo}>
              <Text style={styles.reportTitle}>{report.title}</Text>
              <Text style={styles.reportDesc}>{report.desc}</Text>
            </View>
            <Ionicons name="download-outline" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  reportCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.md },
  reportIcon: { width: 48, height: 48, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center' },
  reportInfo: { flex: 1 },
  reportTitle: { ...typography.body, color: colors.text, fontWeight: '600' },
  reportDesc: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
});
