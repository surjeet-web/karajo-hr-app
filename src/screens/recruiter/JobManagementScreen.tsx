import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Badge } from '../../components';
import { hapticFeedback } from '../../utils/haptics';

const JOBS = [
  { id: 1, title: 'Senior Engineer', dept: 'Engineering', location: 'Remote', status: 'Active', applicants: 24, posted: '2 weeks ago' },
  { id: 2, title: 'Product Manager', dept: 'Product', location: 'New York', status: 'Active', applicants: 18, posted: '1 week ago' },
  { id: 3, title: 'UX Designer', dept: 'Design', location: 'San Francisco', status: 'Active', applicants: 32, posted: '3 days ago' },
  { id: 4, title: 'Data Analyst', dept: 'Analytics', location: 'Remote', status: 'Draft', applicants: 0, posted: 'Not posted' },
  { id: 5, title: 'Marketing Lead', dept: 'Marketing', location: 'Chicago', status: 'Active', applicants: 12, posted: '5 days ago' },
  { id: 6, title: 'DevOps Engineer', dept: 'Engineering', location: 'Remote', status: 'Closed', applicants: 45, posted: '1 month ago' },
];

export const JobManagementScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 800); };

  const statusVariant = (status: string): 'success' | 'warning' | 'info' | 'error' => {
    switch (status) {
      case 'Active': return 'success';
      case 'Draft': return 'warning';
      case 'Closed': return 'error';
      default: return 'info';
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Job Postings" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: `${colors.success}10` }]}>
            <Text style={[styles.summaryValue, { color: colors.success }]}>{JOBS.filter(j => j.status === 'Active').length}</Text>
            <Text style={styles.summaryLabel}>Active</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: `${colors.warning}10` }]}>
            <Text style={[styles.summaryValue, { color: colors.warning }]}>{JOBS.filter(j => j.status === 'Draft').length}</Text>
            <Text style={styles.summaryLabel}>Draft</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: `${colors.error}10` }]}>
            <Text style={[styles.summaryValue, { color: colors.error }]}>{JOBS.filter(j => j.status === 'Closed').length}</Text>
            <Text style={styles.summaryLabel}>Closed</Text>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={[styles.createButton, shadows.sm]} activeOpacity={0.7}>
            <Ionicons name="add-circle" size={24} color={colors.primary} />
            <Text style={styles.createButtonText}>Create New Job Posting</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          {JOBS.map((job) => (
            <TouchableOpacity key={job.id} style={[styles.jobRow, shadows.sm]} activeOpacity={0.7}>
              <View style={styles.jobIcon}>
                <Ionicons name="briefcase" size={24} color={colors.primary} />
              </View>
              <View style={styles.jobInfo}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={styles.jobMeta}>{job.dept} • {job.location}</Text>
                <Text style={styles.jobApplicants}>{job.applicants} applicants • Posted {job.posted}</Text>
              </View>
              <Badge text={job.status} variant={statusVariant(job.status)} size="small" />
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
  jobRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.md },
  jobIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: `${colors.primary}10`, alignItems: 'center', justifyContent: 'center' },
  jobInfo: { flex: 1 },
  jobTitle: { ...typography.body, color: colors.text, fontWeight: '600' },
  jobMeta: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  jobApplicants: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
});
