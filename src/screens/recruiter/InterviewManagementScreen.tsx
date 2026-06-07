import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Badge } from '../../components';
import { hapticFeedback } from '../../utils/haptics';

const INTERVIEWS = [
  { id: 1, candidate: 'Sarah Chen', role: 'Senior Engineer', date: 'Today', time: '2:00 PM', type: 'Technical', status: 'Upcoming', interviewer: 'Tech Lead' },
  { id: 2, candidate: 'John Doe', role: 'Product Manager', date: 'Today', time: '4:00 PM', type: 'HR Round', status: 'Upcoming', interviewer: 'HR Manager' },
  { id: 3, candidate: 'David Kim', role: 'Frontend Dev', date: 'Tomorrow', time: '10:00 AM', type: 'Technical', status: 'Scheduled', interviewer: 'Engineering Mgr' },
  { id: 4, candidate: 'Emily Brown', role: 'Marketing Lead', date: 'Tomorrow', time: '1:00 PM', type: 'Final Round', status: 'Scheduled', interviewer: 'VP Marketing' },
  { id: 5, candidate: 'Mike Wilson', role: 'Backend Dev', date: 'Apr 10', time: '11:00 AM', type: 'Screening', status: 'Scheduled', interviewer: 'Recruiter' },
  { id: 6, candidate: 'Lisa Park', role: 'QA Engineer', date: 'Apr 8', time: '3:00 PM', type: 'Technical', status: 'Completed', interviewer: 'QA Lead' },
];

export const InterviewManagementScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 800); };

  const statusVariant = (status: string): 'success' | 'warning' | 'info' => {
    switch (status) {
      case 'Upcoming': return 'warning';
      case 'Scheduled': return 'info';
      case 'Completed': return 'success';
      default: return 'info';
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Interviews" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: `${colors.warning}10` }]}>
            <Text style={[styles.summaryValue, { color: colors.warning }]}>{INTERVIEWS.filter(i => i.status === 'Upcoming').length}</Text>
            <Text style={styles.summaryLabel}>Today</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: `${colors.info}10` }]}>
            <Text style={[styles.summaryValue, { color: colors.info }]}>{INTERVIEWS.filter(i => i.status === 'Scheduled').length}</Text>
            <Text style={styles.summaryLabel}>Scheduled</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: `${colors.success}10` }]}>
            <Text style={[styles.summaryValue, { color: colors.success }]}>{INTERVIEWS.filter(i => i.status === 'Completed').length}</Text>
            <Text style={styles.summaryLabel}>Completed</Text>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={[styles.createButton, shadows.sm]} activeOpacity={0.7}>
            <Ionicons name="add-circle" size={24} color={colors.primary} />
            <Text style={styles.createButtonText}>Schedule New Interview</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          {INTERVIEWS.map((interview) => (
            <TouchableOpacity key={interview.id} style={[styles.interviewRow, shadows.sm]} activeOpacity={0.7}>
              <View style={styles.dateBlock}>
                <Text style={styles.dateDay}>{interview.date}</Text>
                <Text style={styles.dateBadge}>{interview.type}</Text>
              </View>
              <View style={styles.interviewInfo}>
                <Text style={styles.interviewCandidate}>{interview.candidate}</Text>
                <Text style={styles.interviewRole}>{interview.role}</Text>
                <Text style={styles.interviewTime}>{interview.time} • with {interview.interviewer}</Text>
              </View>
              <Badge text={interview.status} variant={statusVariant(interview.status)} size="small" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  summaryRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  summaryCard: { flex: 1, borderRadius: borderRadius.lg, padding: spacing.md, alignItems: 'center' },
  summaryValue: { ...typography.h4, fontWeight: '700' },
  summaryLabel: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  section: { marginBottom: spacing.lg },
  createButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, gap: spacing.sm },
  createButtonText: { ...typography.body, color: colors.primary, fontWeight: '600' },
  interviewRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.md },
  dateBlock: { width: 60, alignItems: 'center', gap: 4 },
  dateDay: { ...typography.bodySmall, color: colors.text, fontWeight: '600', textAlign: 'center' },
  dateBadge: { ...typography.caption, color: colors.primary, backgroundColor: `${colors.primary}10`, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  interviewInfo: { flex: 1 },
  interviewCandidate: { ...typography.body, color: colors.text, fontWeight: '600' },
  interviewRole: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  interviewTime: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
});
