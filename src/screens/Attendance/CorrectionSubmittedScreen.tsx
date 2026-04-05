import React, { useEffect } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Button } from '../../components';
import { hapticFeedback } from '../../utils/haptics';

export const CorrectionSubmittedScreen: React.FC<any> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { date, checkInTime, checkOutTime, reason } = route?.params || {};
  const today = date || new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  const requestId = `#COR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;

  useEffect(() => {
    hapticFeedback('success');
  }, []);

  const handleBackToAttendance = (): void => {
    hapticFeedback('medium');
    navigation.navigate('AttendanceHistory');
  };

  const handleViewStatus = (): void => {
    hapticFeedback('medium');
    navigation.navigate('AttendanceHistory');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark" size={40} color={colors.textInverse} />
        </View>
        
        <Text style={styles.title}>Correction Request Submitted</Text>
        <Text style={styles.subtitle}>Your attendance correction request has been sent to your supervisor for review.</Text>

        <View style={styles.requestIdCard}>
          <Text style={styles.requestIdLabel}>Request ID</Text>
          <Text style={styles.requestIdValue}>{requestId}</Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <View style={styles.summaryIcon}>
              <Ionicons name="calendar" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.summaryLabel}>Date</Text>
              <Text style={styles.summaryValue}>{today}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryItem}>
            <View style={styles.summaryIcon}>
              <Ionicons name="time" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.summaryLabel}>Corrected Time</Text>
              <Text style={styles.summaryValue}>{checkInTime || '09:00 AM'} - {checkOutTime || '05:00 PM'}</Text>
            </View>
          </View>

          {reason && (
            <>
              <View style={styles.divider} />
              <View style={styles.summaryItem}>
                <View style={styles.summaryIcon}>
                  <Ionicons name="help-circle" size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.summaryLabel}>Reason</Text>
                  <Text style={styles.summaryValue}>{reason}</Text>
                </View>
              </View>
            </>
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Back to Attendance"
          onPress={handleBackToAttendance}
        />
        <Button
          title="View Request Status"
          variant="outline"
          onPress={handleViewStatus}
          style={styles.secondaryButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  successIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.xl },
  title: { ...typography.h3, color: colors.text, textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xxl },
  requestIdCard: { backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.lg },
  requestIdLabel: { ...typography.caption, color: colors.textTertiary, textAlign: 'center' },
  requestIdValue: { ...typography.h5, color: colors.text, textAlign: 'center', marginTop: spacing.xs },
  summaryCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, width: '100%', borderWidth: 1, borderColor: colors.border },
  summaryItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  summaryIcon: { width: 44, height: 44, borderRadius: borderRadius.md, backgroundColor: colors.primaryLighter, justifyContent: 'center', alignItems: 'center' },
  summaryLabel: { ...typography.caption, color: colors.textTertiary },
  summaryValue: { ...typography.body, color: colors.text, fontWeight: '600', marginTop: spacing.xs },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  footer: { padding: spacing.lg, gap: spacing.md },
  secondaryButton: { borderWidth: 1.5, borderColor: colors.primary },
});
