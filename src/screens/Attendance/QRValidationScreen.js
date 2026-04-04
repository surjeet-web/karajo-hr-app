import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Badge } from '../../components';

export const QRValidationScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="QR Identity Validation" onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        <Badge text="SCANNER ACTIVE" variant="success" size="small" style={styles.statusBadge} />

        {/* QR Frame */}
        <View style={styles.qrFrame}>
          <View style={styles.cornerTL} />
          <View style={styles.cornerTR} />
          <View style={styles.cornerBL} />
          <View style={styles.cornerBR} />
          <View style={styles.qrCode}>
            <Ionicons name="qr-code" size={120} color={colors.text} />
          </View>
        </View>

        <Text style={styles.title}>Scan QR Code</Text>
        <Text style={styles.subtitle}>
          Align the company QR code within the frame to automatically verify your attendance.
        </Text>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('FaceValidation')}>
            <Ionicons name="happy" size={18} color={colors.textSecondary} />
            <Text style={styles.tabText}>Face</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Ionicons name="qr-code" size={18} color={colors.primary} />
            <Text style={[styles.tabText, styles.activeTabText]}>QR Code</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Ionicons name="shield-checkmark" size={16} color={colors.textTertiary} />
        <Text style={styles.footerText}>SECURED BY KARAJO ID</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, alignItems: 'center', padding: spacing.lg },
  statusBadge: { marginBottom: spacing.xl },
  qrFrame: { width: 220, height: 220, position: 'relative', marginBottom: spacing.xl },
  cornerTL: { position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderTopWidth: 4, borderLeftWidth: 4, borderColor: colors.primary },
  cornerTR: { position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderTopWidth: 4, borderRightWidth: 4, borderColor: colors.primary },
  cornerBL: { position: 'absolute', bottom: 0, left: 0, width: 40, height: 40, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: colors.primary },
  cornerBR: { position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderBottomWidth: 4, borderRightWidth: 4, borderColor: colors.primary },
  qrCode: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { ...typography.h4, color: colors.text, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center', paddingHorizontal: spacing.xl, marginBottom: spacing.xxl },
  tabContainer: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: borderRadius.full, padding: spacing.xs },
  tab: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.full },
  activeTab: { backgroundColor: colors.surfaceVariant },
  tabText: { ...typography.bodySmall, color: colors.textSecondary },
  activeTabText: { color: colors.primary, fontWeight: '600' },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, paddingBottom: spacing.lg },
  footerText: { ...typography.caption, color: colors.textTertiary },
});
