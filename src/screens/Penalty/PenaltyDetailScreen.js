import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Card, Badge, Button, StatusTimeline } from '../../components';

export const PenaltyDetailScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { penalty } = route.params;

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error': return colors.error;
      case 'warning': return colors.warning;
      case 'info': return colors.info;
      default: return colors.textTertiary;
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error': return 'close-circle';
      case 'warning': return 'warning';
      case 'info': return 'information-circle';
      default: return 'alert-circle';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return { text: 'Active', variant: 'error' };
      case 'under-review': return { text: 'Under Review', variant: 'warning' };
      case 'resolved': return { text: 'Resolved', variant: 'success' };
      default: return { text: status, variant: 'default' };
    }
  };

  const badge = getStatusBadge(penalty.status);

  const timeline = [
    { status: 'Penalty Issued', date: penalty.date, by: penalty.issuedBy, active: false },
    { status: 'Employee Notified', date: penalty.date, by: 'System', active: false },
    ...(penalty.status === 'under-review' ? [{ status: 'Under Review', date: 'Pending', by: 'HR Department', active: true }] : []),
    ...(penalty.status === 'resolved' ? [{ status: 'Resolved', date: 'Jan 22, 2026', by: 'HR Department', active: true }] : []),
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Penalty Detail" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card padding="lg" style={styles.mainCard}>
          <View style={styles.headerRow}>
            <View style={[styles.iconContainer, { backgroundColor: `${getSeverityColor(penalty.severity)}15` }]}>
              <Ionicons name={getSeverityIcon(penalty.severity)} size={32} color={getSeverityColor(penalty.severity)} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.typeText}>{penalty.type}</Text>
              <Badge text={badge.text} variant={badge.variant} size="medium" />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={18} color={colors.textTertiary} />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Date Issued</Text>
              <Text style={styles.detailValue}>{penalty.date}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="person-outline" size={18} color={colors.textTertiary} />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Issued By</Text>
              <Text style={styles.detailValue}>{penalty.issuedBy}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="document-outline" size={18} color={colors.textTertiary} />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Reference</Text>
              <Text style={styles.detailValue}>{penalty.reference}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="cash-outline" size={18} color={colors.textTertiary} />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Fine Amount</Text>
              <Text style={[styles.detailValue, { color: colors.error }]}>{penalty.fine}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={18} color={colors.textTertiary} />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Appeal Deadline</Text>
              <Text style={[styles.detailValue, { color: colors.warning }]}>{penalty.appealDeadline}</Text>
            </View>
          </View>
        </Card>

        <Card padding="lg" style={styles.card}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{penalty.description}</Text>
        </Card>

        <Card padding="lg" style={styles.card}>
          <Text style={styles.sectionTitle}>Status Timeline</Text>
          <StatusTimeline items={timeline} />
        </Card>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={colors.info} />
          <Text style={styles.infoText}>
            You have until {penalty.appealDeadline} to file an appeal for this penalty. After the deadline, the penalty will be finalized.
          </Text>
        </View>
      </ScrollView>

      {(penalty.status === 'active' || penalty.status === 'under-review') && (
        <View style={styles.footer}>
          <Button title="File Appeal" variant="primary" onPress={() => navigation.navigate('PenaltyAppeal', { penalty })} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  mainCard: { marginBottom: spacing.md },
  card: { marginBottom: spacing.md },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  iconContainer: { width: 56, height: 56, borderRadius: borderRadius.lg, justifyContent: 'center', alignItems: 'center' },
  headerText: { flex: 1, gap: spacing.sm },
  typeText: { ...typography.h4, color: colors.text },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginBottom: spacing.md },
  detailText: { flex: 1 },
  detailLabel: { ...typography.caption, color: colors.textTertiary, marginBottom: spacing.xs },
  detailValue: { ...typography.body, color: colors.text, fontWeight: '600' },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  descriptionText: { ...typography.body, color: colors.textSecondary, lineHeight: 22 },
  infoBox: { flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.infoLight, padding: spacing.md, borderRadius: borderRadius.lg, marginTop: spacing.sm },
  infoText: { ...typography.bodySmall, color: colors.info, flex: 1 },
  footer: { padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
});
