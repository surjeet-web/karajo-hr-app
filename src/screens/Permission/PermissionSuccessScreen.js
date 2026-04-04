import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Button } from '../../components';

export const PermissionSuccessScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark" size={40} color={colors.textInverse} />
        </View>
        
        <Text style={styles.title}>Permission Request Submitted</Text>
        <Text style={styles.subtitle}>Your manager has been notified.</Text>
        <Text style={styles.requestId}>Request ID: #KRJ-2023-889</Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <View style={styles.summaryIcon}>
              <Ionicons name="calendar" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.summaryLabel}>Date</Text>
              <Text style={styles.summaryValue}>Fri 20, Feb</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryItem}>
            <View style={styles.summaryIcon}>
              <Ionicons name="time" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.summaryLabel}>Time</Text>
              <Text style={styles.summaryValue}>09:00 AM - 10:30 AM</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryItem}>
            <View style={styles.summaryIcon}>
              <Ionicons name="timer" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.summaryLabel}>Total Duration</Text>
              <Text style={styles.summaryValue}>3 Days</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button title="Back to permission" onPress={() => navigation.navigate('PermissionHome')} />
        <Button title="Go to approval" variant="outline" onPress={() => navigation.navigate('PermissionHome')} style={styles.secondaryButton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  successIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.xl },
  title: { ...typography.h3, color: colors.text, textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  requestId: { ...typography.bodySmall, color: colors.textTertiary, textAlign: 'center', marginBottom: spacing.xxl },
  summaryCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, width: '100%', borderWidth: 1, borderColor: colors.border },
  summaryItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  summaryIcon: { width: 44, height: 44, borderRadius: borderRadius.md, backgroundColor: colors.primaryLighter, justifyContent: 'center', alignItems: 'center' },
  summaryLabel: { ...typography.caption, color: colors.textTertiary },
  summaryValue: { ...typography.body, color: colors.text, fontWeight: '600', marginTop: spacing.xs },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  footer: { padding: spacing.lg, gap: spacing.md },
  secondaryButton: { borderWidth: 1.5, borderColor: colors.primary },
});
