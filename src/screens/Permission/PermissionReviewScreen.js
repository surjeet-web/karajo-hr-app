import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Button } from '../../components';

export const PermissionReviewScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

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
              <Text style={styles.summaryValue}>Fri 20, Feb</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryItem}>
            <View style={styles.summaryIcon}>
              <Ionicons name="time" size={20} color={colors.primary} />
            </View>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryLabel}>Time Window</Text>
              <Text style={styles.summaryValue}>09:00 AM - 10:30 AM</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryItem}>
            <View style={styles.summaryIcon}>
              <Ionicons name="timer" size={20} color={colors.primary} />
            </View>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryLabel}>Total Duration</Text>
              <Text style={styles.summaryValue}>1h 30m</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryItem}>
            <View style={styles.summaryIcon}>
              <Ionicons name="document-text" size={20} color={colors.primary} />
            </View>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryLabel}>Reason</Text>
              <Text style={styles.summaryValue}>Personal appointment</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={colors.info} />
          <Text style={styles.infoText}>
            By submitting this request, you confirm that all information provided is accurate. Your supervisor will be notified for approval.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Submit Permission Request" onPress={() => navigation.navigate('PermissionSuccess')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
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
