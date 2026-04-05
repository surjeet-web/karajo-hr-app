import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Card, Badge } from '../../components';

export const IdentityVerificationScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const documents = [
    {
      icon: 'card-outline' as const,
      title: 'National ID Card',
      status: 'verified' as const,
      details: 'ID: XXXX-XXXX-1234',
      verifiedDate: 'Verified on Mar 15, 2024',
    },
    {
      icon: 'passport' as const,
      title: 'Passport',
      status: 'verified' as const,
      details: 'Passport No: AB1234567',
      verifiedDate: 'Verified on Jan 10, 2024',
    },
    {
      icon: 'reader-outline' as const,
      title: 'Tax Information',
      status: 'pending' as const,
      details: 'SSN/TIN: XXX-XX-6789',
      verifiedDate: 'Under review',
    },
    {
      icon: 'document-text-outline' as const,
      title: 'Work Permit',
      status: 'not_submitted' as const,
      details: 'Not yet submitted',
      verifiedDate: '',
    },
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'verified': return { variant: 'success' as const, label: 'Verified' };
      case 'pending': return { variant: 'warning' as const, label: 'Pending' };
      case 'not_submitted': return { variant: 'default' as const, label: 'Not Submitted' };
      default: return { variant: 'default' as const, label: 'Unknown' };
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Identity Verification" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.infoCard}>
          <Ionicons name="shield-checkmark" size={40} color={colors.primary} />
          <Text style={styles.infoTitle}>Identity Verification</Text>
          <Text style={styles.infoText}>
            Your identity documents are reviewed by HR to comply with company policies and legal requirements.
          </Text>
        </Card>

        <Text style={styles.sectionTitle}>Documents</Text>

        {documents.map((doc, index) => {
          const statusConfig = getStatusConfig(doc.status);
          return (
            <Card key={index} style={styles.docCard}>
              <View style={styles.docHeader}>
                <View style={styles.docIcon}>
                  <Ionicons name={doc.icon} size={24} color={colors.primary} />
                </View>
                <View style={styles.docInfo}>
                  <Text style={styles.docTitle}>{doc.title}</Text>
                  <Text style={styles.docDetails}>{doc.details}</Text>
                </View>
                <Badge text={statusConfig.label} variant={statusConfig.variant} size="small" />
              </View>
              {doc.verifiedDate ? (
                <Text style={styles.verifiedDate}>{doc.verifiedDate}</Text>
              ) : null}
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  infoCard: { alignItems: 'center', padding: spacing.xl, marginBottom: spacing.lg },
  infoTitle: { ...typography.h3, color: colors.text, marginTop: spacing.md, marginBottom: spacing.xs },
  infoText: { ...typography.bodySmall, color: colors.textSecondary, textAlign: 'center' },
  sectionTitle: { ...typography.body, color: colors.text, fontWeight: '600', marginBottom: spacing.md },
  docCard: { padding: spacing.md, marginBottom: spacing.md },
  docHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  docIcon: { width: 44, height: 44, borderRadius: borderRadius.md, backgroundColor: colors.primaryLighter, justifyContent: 'center', alignItems: 'center' },
  docInfo: { flex: 1 },
  docTitle: { ...typography.body, color: colors.text, fontWeight: '600' },
  docDetails: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  verifiedDate: { ...typography.caption, color: colors.textTertiary, marginTop: spacing.sm },
});
