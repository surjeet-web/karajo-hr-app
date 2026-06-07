import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Badge } from '../../components';
import { hapticFeedback } from '../../utils/haptics';

const CANDIDATES = [
  { id: 1, name: 'Sarah Chen', role: 'Senior Engineer', dept: 'Engineering', stage: 'Interview', rating: 4.5, applied: '2 days ago' },
  { id: 2, name: 'John Doe', role: 'Product Manager', dept: 'Product', stage: 'Screening', rating: 4.0, applied: '3 days ago' },
  { id: 3, name: 'Alex Johnson', role: 'UX Designer', dept: 'Design', stage: 'Offer', rating: 4.8, applied: '1 week ago' },
  { id: 4, name: 'Maria Garcia', role: 'Data Analyst', dept: 'Analytics', stage: 'Applied', rating: 3.5, applied: '1 day ago' },
  { id: 5, name: 'David Kim', role: 'Frontend Dev', dept: 'Engineering', stage: 'Interview', rating: 4.2, applied: '4 days ago' },
  { id: 6, name: 'Emily Brown', role: 'Marketing Lead', dept: 'Marketing', stage: 'Screening', rating: 3.8, applied: '5 days ago' },
];

const STAGE_COLORS: Record<string, string> = {
  Applied: colors.textTertiary,
  Screening: colors.info,
  Interview: colors.warning,
  Offer: colors.success,
  Hired: colors.primary,
  Rejected: colors.error,
};

export const CandidateManagementScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('All');
  const onRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 800); };

  const stages = ['All', 'Applied', 'Screening', 'Interview', 'Offer', 'Hired'];
  const filtered = filter === 'All' ? CANDIDATES : CANDIDATES.filter(c => c.stage === filter);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Candidates" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: `${colors.primary}10` }]}>
            <Text style={[styles.summaryValue, { color: colors.primary }]}>{CANDIDATES.length}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: `${colors.info}10` }]}>
            <Text style={[styles.summaryValue, { color: colors.info }]}>{CANDIDATES.filter(c => c.stage === 'Screening').length}</Text>
            <Text style={styles.summaryLabel}>Screening</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: `${colors.warning}10` }]}>
            <Text style={[styles.summaryValue, { color: colors.warning }]}>{CANDIDATES.filter(c => c.stage === 'Interview').length}</Text>
            <Text style={styles.summaryLabel}>Interview</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: `${colors.success}10` }]}>
            <Text style={[styles.summaryValue, { color: colors.success }]}>{CANDIDATES.filter(c => c.stage === 'Offer').length}</Text>
            <Text style={styles.summaryLabel}>Offer</Text>
          </View>
        </View>

        <View style={styles.section}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
            {stages.map(s => (
              <TouchableOpacity key={s} style={[styles.filterChip, filter === s && { backgroundColor: colors.primary, borderColor: colors.primary }]}
                onPress={() => { hapticFeedback('light'); setFilter(s); }}>
                <Text style={[styles.filterText, filter === s && { color: colors.surface }]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          {filtered.map((candidate, i) => (
            <TouchableOpacity key={candidate.id} style={[styles.candidateRow, shadows.sm]} activeOpacity={0.7}>
              <View style={styles.candidateAvatar}>
                <Ionicons name="person" size={24} color={colors.primary} />
              </View>
              <View style={styles.candidateInfo}>
                <Text style={styles.candidateName}>{candidate.name}</Text>
                <Text style={styles.candidateRole}>{candidate.role} • {candidate.dept}</Text>
                <Text style={styles.candidateTime}>Applied {candidate.applied}</Text>
              </View>
              <View style={styles.candidateRight}>
                <Badge text={candidate.stage} variant={candidate.stage === 'Offer' ? 'success' : candidate.stage === 'Interview' ? 'warning' : 'info'} size="small" />
                <Text style={styles.ratingText}>★ {candidate.rating}</Text>
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
  summaryRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  summaryCard: { flex: 1, borderRadius: borderRadius.lg, padding: spacing.md, alignItems: 'center' },
  summaryValue: { ...typography.h4, fontWeight: '700' },
  summaryLabel: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  section: { marginBottom: spacing.lg },
  filterChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  filterText: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: '500' },
  candidateRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.md },
  candidateAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: `${colors.primary}10`, alignItems: 'center', justifyContent: 'center' },
  candidateInfo: { flex: 1 },
  candidateName: { ...typography.body, color: colors.text, fontWeight: '600' },
  candidateRole: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  candidateTime: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
  candidateRight: { alignItems: 'flex-end', gap: 4 },
  ratingText: { ...typography.caption, color: colors.warning, fontWeight: '600' },
});
