import React, { useEffect } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Button } from '../../components';
import { hapticFeedback } from '../../utils/haptics';
import { useFadeIn, useSlideIn } from '../../utils/animations';

export const PenaltySuccessScreen: React.FC<any> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { penalty, appealType } = route.params || {};
  const reference = `APL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Appeal Submitted" onBack={() => navigation.goBack()} showBack={false} />

      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={64} color={colors.success} />
        </View>

        <Text style={styles.title}>Appeal Submitted Successfully</Text>
        <Text style={styles.subtitle}>Your appeal has been received and will be reviewed by the HR department.</Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Ionicons name="time-outline" size={18} color={colors.textTertiary} />
            <View style={styles.summaryRowText}>
              <Text style={styles.summaryLabel}>Expected Review Time</Text>
              <Text style={styles.summaryValue}>5-7 Business Days</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Ionicons name="mail-outline" size={18} color={colors.textTertiary} />
            <View style={styles.summaryRowText}>
              <Text style={styles.summaryLabel}>Notification</Text>
              <Text style={styles.summaryValue}>You will be notified via email</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Ionicons name="shield-checkmark-outline" size={18} color={colors.textTertiary} />
            <View style={styles.summaryRowText}>
              <Text style={styles.summaryLabel}>Reference</Text>
              <Text style={styles.summaryValue}>{reference}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={colors.info} />
          <Text style={styles.infoText}>
            You can track the status of your appeal in the Penalty section.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button title="Back to Penalties" onPress={() => navigation.navigate('PenaltyHome')} />
        <View style={styles.secondaryButton}>
          <Button title="Go to Home" variant="outline" onPress={() => navigation.navigate('MainTabs')} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, alignItems: 'center', padding: spacing.lg, paddingTop: spacing.xxl },
  successIcon: { marginBottom: spacing.lg },
  title: { ...typography.h3, color: colors.text, textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xl, paddingHorizontal: spacing.lg },
  summaryCard: { width: '100%', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.lg },
  summaryRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, paddingVertical: spacing.sm },
  summaryRowText: { flex: 1 },
  summaryLabel: { ...typography.caption, color: colors.textTertiary, marginBottom: spacing.xs },
  summaryValue: { ...typography.body, color: colors.text, fontWeight: '600' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
  infoBox: { flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.infoLight, padding: spacing.md, borderRadius: borderRadius.lg, width: '100%' },
  infoText: { ...typography.bodySmall, color: colors.info, flex: 1 },
  footer: { padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
  secondaryButton: { marginTop: spacing.sm },
});
