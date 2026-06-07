import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card, Badge } from '../../components';
import { StatCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';

const RECENT_ACTIVITY = [
  { icon: 'person-add', color: colors.success, title: 'New Candidate Applied', desc: 'Sarah Chen applied for Senior Engineer', time: '1h ago' },
  { icon: 'calendar', color: colors.primary, title: 'Interview Scheduled', desc: 'John Doe - Product Manager - Tomorrow 2PM', time: '3h ago' },
  { icon: 'mail', color: colors.info, title: 'Offer Sent', desc: 'Offer letter sent to Alex Johnson for UX Designer', time: '5h ago' },
  { icon: 'checkmark-circle', color: colors.success, title: 'Position Filled', desc: 'Marketing Analyst position successfully filled', time: '1d ago' },
];

export const RecruiterDashboardScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 800); };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Recruiter Dashboard" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        
        <View style={styles.statsRow}>
          <StatCard icon="people" label="Active Jobs" value="12" color={colors.primary} delay={0} />
          <StatCard icon="person-add" label="Candidates" value="48" color={colors.success} delay={100} />
        </View>
        <View style={styles.statsRow}>
          <StatCard icon="calendar" label="Interviews" value="8" color={colors.info} delay={200} />
          <StatCard icon="mail" label="Offers Out" value="3" color={colors.warning} delay={300} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            {[
              { icon: 'briefcase', label: 'Jobs', color: colors.primary, screen: 'CandidateManagement' },
              { icon: 'people', label: 'Candidates', color: colors.success, screen: 'CandidateManagement' },
              { icon: 'calendar', label: 'Interviews', color: colors.info, screen: 'InterviewManagement' },
              { icon: 'mail', label: 'Offers', color: colors.warning, screen: 'OfferManagement' },
            ].map(action => (
              <TouchableOpacity key={action.label} style={[styles.quickAction, { backgroundColor: `${action.color}10` }]}
                onPress={() => { hapticFeedback('medium'); navigation.navigate(action.screen); }} activeOpacity={0.7}>
                <Ionicons name={action.icon} size={24} color={action.color} />
                <Text style={[styles.quickActionLabel, { color: action.color }]}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Urgent Openings</Text>
            <TouchableOpacity onPress={() => navigation.navigate('CandidateManagement')}><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
          </View>
          {[
            { title: 'Senior Engineer', dept: 'Engineering', applicants: 24, status: 'urgent' },
            { title: 'Product Manager', dept: 'Product', applicants: 18, status: 'active' },
            { title: 'UX Designer', dept: 'Design', applicants: 32, status: 'active' },
          ].map((job, i) => (
            <TouchableOpacity key={i} style={[styles.jobRow, shadows.sm]} onPress={() => navigation.navigate('CandidateManagement')} activeOpacity={0.7}>
              <View style={[styles.statusDot, { backgroundColor: job.status === 'urgent' ? colors.error : colors.success }]} />
              <View style={styles.jobInfo}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={styles.jobDept}>{job.dept} • {job.applicants} applicants</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {RECENT_ACTIVITY.map((item, i) => (
            <TouchableOpacity key={i} style={[styles.activityRow, shadows.sm]} activeOpacity={0.7}>
              <View style={[styles.activityIcon, { backgroundColor: `${item.color}15` }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{item.title}</Text>
                <Text style={styles.activityDesc}>{item.desc}</Text>
                <Text style={styles.activityTime}>{item.time}</Text>
              </View>
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
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  section: { marginBottom: spacing.xl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  viewAll: { ...typography.bodySmall, color: colors.primary, fontWeight: '600' },
  quickActions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  quickAction: { width: '47%', borderRadius: borderRadius.lg, padding: spacing.lg, alignItems: 'center', gap: spacing.sm, ...shadows.sm },
  quickActionLabel: { ...typography.label, fontWeight: '600' },
  jobRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.md },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  jobInfo: { flex: 1 },
  jobTitle: { ...typography.body, color: colors.text, fontWeight: '600' },
  jobDept: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  activityRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.md },
  activityIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  activityInfo: { flex: 1 },
  activityTitle: { ...typography.bodySmall, color: colors.text, fontWeight: '600' },
  activityDesc: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  activityTime: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
});
