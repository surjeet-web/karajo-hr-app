import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

export const DocumentViewScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>K</Text>
          </View>
          <Text style={styles.brandText}>KarajoAI</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Document Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.documentTitle}>Leave Request Policy</Text>
          <View style={styles.documentMeta}>
            <Text style={styles.metaText}>Effective Date: January 1, 2026</Text>
          </View>
        </View>

        {/* Document Content */}
        <View style={styles.contentContainer}>
          {/* Section 1 */}
          <Text style={styles.sectionTitle}>1. Purpose</Text>
          <Text style={styles.paragraph}>
            The purpose of this policy is to establish clear guidelines for employee
            leave requests, ensuring fair treatment and adequate operational coverage.
            Karajo encourages employees to maintain a healthy work-life balance through
            appropriate use of leave.
          </Text>

          {/* AI Highlighted Section */}
          <View style={styles.highlightedSection}>
            <View style={styles.highlightHeader}>
              <Ionicons name="bulb" size={16} color={colors.warning} />
              <Text style={styles.highlightText}>AI Highlighted</Text>
            </View>
            <Text style={styles.sectionTitle}>2. Submission Timeline</Text>
            <Text style={styles.paragraph}>
              To facilitate resource planning, all requests for planned leave (e.g.,
              vacation) must be submitted at least 14 days in advance of the start date.
            </Text>
            <Text style={styles.paragraph}>
              Last-minute requests will be reviewed on a case-by-case basis and are
              subject to manager approval based on team capacity.
            </Text>
          </View>

          {/* Section 3 */}
          <Text style={styles.sectionTitle}>3. Leave Types</Text>
          <Text style={styles.paragraph}>
            Employees are eligible for various types of leave, including Annual Leave,
            Sick Leave, Parental Leave, and Bereavement Leave. Eligibility for each type
            is contingent upon employment status and tenure as outlined in the Employee
            Handbook.
          </Text>

          {/* Section 4 */}
          <Text style={styles.sectionTitle}>4. Documentation & Compliance</Text>
          <Text style={styles.paragraph}>
            Appropriate documentation may be required for certain leave types. Failure to
            provide documentation may result in the leave being classified as unpaid or
            unauthorized.
          </Text>

          {/* Important Requirement Box */}
          <View style={styles.importantBox}>
            <View style={styles.importantHeader}>
              <Ionicons name="warning" size={16} color={colors.error} />
              <Text style={styles.importantTitle}>Important Requirement</Text>
            </View>
            <Text style={styles.importantText}>
              "For sick leave exceeding 3 consecutive days, a valid medical certificate
              from a registered physician is mandatory upon return to work."
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Input Area */}
      <TouchableOpacity style={styles.inputContainer}>
        <Ionicons name="sparkles" size={20} color={colors.primary} />
        <Text style={styles.inputPlaceholder}>Ask me about work...</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textInverse,
  },
  brandText: {
    ...typography.h5,
    color: colors.text,
  },
  placeholder: {
    width: 24,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  titleContainer: {
    marginBottom: spacing.lg,
  },
  documentTitle: {
    ...typography.h3,
    color: colors.text,
  },
  documentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  metaText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  contentContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.h5,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  paragraph: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  highlightedSection: {
    backgroundColor: colors.warningLight,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginVertical: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  highlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  highlightText: {
    ...typography.label,
    color: colors.warning,
  },
  importantBox: {
    backgroundColor: colors.errorLight,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginTop: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  importantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  importantTitle: {
    ...typography.label,
    color: colors.error,
  },
  importantText: {
    ...typography.body,
    color: colors.text,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    margin: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputPlaceholder: {
    ...typography.body,
    color: colors.textTertiary,
  },
});
