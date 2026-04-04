import React, { useState, useEffect } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Badge } from '../../components';
import { hapticFeedback } from '../../utils/haptics';
import { attendanceService } from '../../services';

export const QRValidationScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<string>('qr');
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanComplete, setScanComplete] = useState<boolean>(false);
  const [scanStatus, setScanStatus] = useState<string>('active');

  useEffect(() => {
    const timer = setTimeout(() => {
      setScanning(true);
      setTimeout(() => {
        setScanning(false);
        setScanComplete(true);
        setScanStatus('verified');
        hapticFeedback('success');
        setTimeout(() => {
          navigation.navigate('AttendanceSuccess');
        }, 800);
      }, 2500);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="QR Identity Validation" onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        {scanStatus === 'active' && (
          <Badge text="SCANNER ACTIVE" variant="success" size="small" style={styles.statusBadge} />
        )}
        {scanStatus === 'verified' && (
          <Badge text="QR VERIFIED" variant="success" size="small" style={styles.statusBadge} />
        )}

        {/* QR Frame */}
        <View style={styles.qrFrame}>
          <View style={styles.cornerTL} />
          <View style={styles.cornerTR} />
          <View style={styles.cornerBL} />
          <View style={styles.cornerBR} />
          <View style={styles.qrCode}>
            <Ionicons name="qr-code" size={120} color={scanComplete ? colors.success : colors.text} />
          </View>
          {scanning && (
            <View style={styles.scanningOverlay}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.scanningText}>Scanning QR...</Text>
            </View>
          )}
          {scanComplete && (
            <View style={styles.scanningOverlay}>
              <View style={styles.successBadge}>
                <Ionicons name="checkmark-circle" size={40} color={colors.success} />
              </View>
            </View>
          )}
        </View>

        <Text style={styles.title}>Scan QR Code</Text>
        <Text style={styles.subtitle}>
          Align the company QR code within the frame to automatically verify your attendance.
        </Text>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => { hapticFeedback('light'); navigation.navigate('FaceValidation'); }}
            activeOpacity={0.7}
            accessibilityRole="tab"
            accessibilityLabel="Face validation tab"
          >
            <Ionicons name="happy" size={18} color={colors.textSecondary} />
            <Text style={styles.tabText}>Face</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, styles.activeTab]}
            activeOpacity={0.7}
            accessibilityRole="tab"
            accessibilityState={{ selected: true }}
            accessibilityLabel="QR Code validation tab"
          >
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
  scanningOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  scanningText: { ...typography.bodySmall, color: colors.text, marginTop: spacing.sm },
  successBadge: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' },
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
