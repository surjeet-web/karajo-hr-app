import React, { useEffect } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Badge, Button } from '../../components';
import { requestPermission } from '../../store';
import { hapticFeedback } from '../../utils/haptics';

export const PermissionReviewScreen: React.FC<any> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const request = route.params?.request;

  useEffect(() => { hapticFeedback('medium'); }, []);

  if (!request) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Header title="Review Permission" onBack={() => navigation.goBack()} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
          <Text style={styles.errorText}>No permission request data found.</Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} variant="outline" />
        </View>
      </View>
    );
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const handleConfirm = (): void => {
    hapticFeedback('heavy');
    Alert.alert(
      'Confirm Permission Request',
      `Submit ${request.duration}h permission for ${request.date}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            requestPermission({
              date: request.date,
              startTime: request.startTime,
              endTime: request.endTime,
              duration: request.duration,
              reason: request.reason,
            });
            navigation.navigate('PermissionSuccess', {
              date: request.date,
              startTime: request.startTime,
              endTime: request.endTime,
              duration: request.duration,
              reason: request.reason,
            });
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Review Permission" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Review your request</Text>
        <Text style={styles.subheading}>Please review all details before submitting your permission request.</Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <View style={styles.summaryIcon}>
              <Ionicons name="calendar" size={20} color={colors.primary} />
            </View>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryLabel}>Date</Text>
              <Text style={styles.summaryValue}>{request.date}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryItem}>
            <View style={styles.summaryIcon}>
              <Ionicons name="time" size={20} color={colors.primary} />
            </View>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryLabel}>Time Window</Text>
              <Text style={styles.summaryValue}>{request.startTime} - {request.endTime}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryItem}>
            <View style={styles.summaryIcon}>
              <Ionicons name="timer" size={20} color={colors.primary} />
            </View>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryLabel}>Total Duration</Text>
              <Text style={styles.summaryValue}>{request.duration}h</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryItem}>
            <View style={styles.summaryIcon}>
              <Ionicons name="document-text" size={20} color={colors.primary} />
            </View>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryLabel}>Reason</Text>
              <Text style={styles.summaryValue}>{request.reason}</Text>
            </View>
          </View>

          {request.status && (
            <>
              <View style={styles.divider} />
              <View style={styles.summaryItem}>
                <View style={styles.summaryIcon}>
                  <Ionicons name="information-circle" size={20} color={colors.primary} />
                </View>
                <View style={styles.summaryInfo}>
                  <Text style={styles.summaryLabel}>Status</Text>
                  <Badge text={request.status.charAt(0).toUpperCase() + request.status.slice(1)} variant={getStatusVariant(request.status)} size="small" />
                </View>
              </View>
            </>
          )}
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={colors.info} />
          <Text style={styles.infoText}>
            By submitting this request, you confirm that all information provided is accurate. Your supervisor will be notified for approval.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Submit Permission Request"
          onPress={handleConfirm}
          accessibilityLabel="Submit permission request"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  errorText: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  heading: { ...typography.h4, color: colors.text, marginBottom: spacing.sm },
  subheading: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  summaryCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.lg },
  summaryItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  summaryIcon: { width: 44, height: 44, borderRadius: borderRadius.md, backgroundColor: colors.primaryLighter, justifyContent: 'center', alignItems: 'center' },
  summaryInfo: { flex: 1 },
  summaryLabel: { ...typography.caption, color: colors.textTertiary },
  summaryValue: { ...typography.body, color: colors.text, fontWeight: '600', marginTop: spacing.xs },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  infoBox: { flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.infoLight, padding: spacing.md, borderRadius: borderRadius.lg },
  infoText: { ...typography.bodySmall, color: colors.info, flex: 1 },
  footer: { padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
});
