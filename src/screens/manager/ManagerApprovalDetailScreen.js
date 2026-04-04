import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card, Button, StatusTimeline } from '../../components';
import { ApprovalBadge } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';

export const ManagerApprovalDetailScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const request = route.params?.request || { type: 'leave', requesterName: 'Sarah Miller', date: 'Feb 28 - Mar 3', days: 4, reason: 'Family vacation', status: 'pending', appliedOn: 'Feb 25' };

  const handleApprove = () => {
    hapticFeedback('success');
    Alert.alert('Approved', 'Request has been approved.');
    navigation.goBack();
  };

  const handleReject = () => {
    hapticFeedback('error');
    Alert.alert('Rejected', 'Request has been rejected.');
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Request Detail" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Card style={styles.headerCard} padding="lg">
          <View style={styles.requesterRow}>
            <Ionicons name="person-circle" size={48} color={colors.primary} />
            <View style={styles.requesterInfo}>
              <Text style={styles.requesterName}>{request.requesterName}</Text>
              <Text style={styles.requesterType}>{request.type}</Text>
            </View>
            <ApprovalBadge status={request.status} size="large" />
          </View>
        </Card>

        <Card style={styles.detailCard} padding="lg">
          <Text style={styles.detailTitle}>Details</Text>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Date</Text><Text style={styles.detailValue}>{request.date}</Text></View>
          {request.days && <View style={styles.detailRow}><Text style={styles.detailLabel}>Duration</Text><Text style={styles.detailValue}>{request.days} day(s)</Text></View>}
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Reason</Text><Text style={styles.detailValue}>{request.reason}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Applied</Text><Text style={styles.detailValue}>{request.appliedOn}</Text></View>
        </Card>

        {request.status === 'pending' && (
          <View style={styles.actions}>
            <Button title="Reject" variant="danger" onPress={handleReject} style={styles.rejectBtn} />
            <Button title="Approve" onPress={handleApprove} style={styles.approveBtn} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  headerCard: { marginBottom: spacing.md },
  requesterRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  requesterInfo: { flex: 1 },
  requesterName: { ...typography.h5, color: colors.text },
  requesterType: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  detailCard: { marginBottom: spacing.md },
  detailTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  detailLabel: { ...typography.bodySmall, color: colors.textSecondary },
  detailValue: { ...typography.bodySmall, color: colors.text, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  rejectBtn: { flex: 1 },
  approveBtn: { flex: 1 },
});
