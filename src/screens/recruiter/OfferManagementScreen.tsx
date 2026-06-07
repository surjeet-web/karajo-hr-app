import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Badge } from '../../components';
import { hapticFeedback } from '../../utils/haptics';

const OFFERS = [
  { id: 1, candidate: 'Alex Johnson', role: 'UX Designer', dept: 'Design', salary: '$95,000', status: 'Sent', date: 'Apr 3, 2026' },
  { id: 2, candidate: 'Rachel Green', role: 'Content Writer', dept: 'Marketing', salary: '$65,000', status: 'Pending', date: 'Apr 5, 2026' },
  { id: 3, candidate: 'Tom Hardy', role: 'Backend Dev', dept: 'Engineering', salary: '$110,000', status: 'Accepted', date: 'Mar 28, 2026' },
  { id: 4, candidate: 'Nina Patel', role: 'Data Scientist', dept: 'Analytics', salary: '$120,000', status: 'Draft', date: 'Not sent' },
  { id: 5, candidate: 'Chris Evans', role: 'DevOps Engineer', dept: 'Engineering', salary: '$105,000', status: 'Rejected', date: 'Mar 20, 2026' },
];

export const OfferManagementScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 800); };

  const statusVariant = (status: string): 'success' | 'warning' | 'info' | 'error' => {
    switch (status) {
      case 'Sent': return 'info';
      case 'Pending': return 'warning';
      case 'Accepted': return 'success';
      case 'Draft': return 'info';
      case 'Rejected': return 'error';
      default: return 'info';
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Offer Letters" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: `${colors.info}10` }]}>
            <Text style={[styles.summaryValue, { color: colors.info }]}>{OFFERS.filter(o => o.status === 'Sent').length}</Text>
            <Text style={styles.summaryLabel}>Sent</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: `${colors.success}10` }]}>
            <Text style={[styles.summaryValue, { color: colors.success }]}>{OFFERS.filter(o => o.status === 'Accepted').length}</Text>
            <Text style={styles.summaryLabel}>Accepted</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: `${colors.warning}10` }]}>
            <Text style={[styles.summaryValue, { color: colors.warning }]}>{OFFERS.filter(o => o.status === 'Pending').length}</Text>
            <Text style={styles.summaryLabel}>Pending</Text>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={[styles.createButton, shadows.sm]} activeOpacity={0.7}>
            <Ionicons name="add-circle" size={24} color={colors.primary} />
            <Text style={styles.createButtonText}>Create Offer Letter</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          {OFFERS.map((offer) => (
            <TouchableOpacity key={offer.id} style={[styles.offerRow, shadows.sm]} activeOpacity={0.7}>
              <View style={styles.offerIcon}>
                <Ionicons name="mail" size={24} color={colors.primary} />
              </View>
              <View style={styles.offerInfo}>
                <Text style={styles.offerCandidate}>{offer.candidate}</Text>
                <Text style={styles.offerRole}>{offer.role} • {offer.dept}</Text>
                <Text style={styles.offerSalary}>{offer.salary} • {offer.date}</Text>
              </View>
              <Badge text={offer.status} variant={statusVariant(offer.status)} size="small" />
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
  offerRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.md },
  offerIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: `${colors.primary}10`, alignItems: 'center', justifyContent: 'center' },
  offerInfo: { flex: 1 },
  offerCandidate: { ...typography.body, color: colors.text, fontWeight: '600' },
  offerRole: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  offerSalary: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
});
