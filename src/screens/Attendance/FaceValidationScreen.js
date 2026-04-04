import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header } from '../../components';
import { hapticFeedback } from '../../utils/haptics';
import { currentUser } from '../../data/mockData';
import { attendanceService } from '../../services';

export const FaceValidationScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('face');
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const handleVerify = () => {
    if (scanComplete) return;
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanComplete(true);
      hapticFeedback('success');
      setTimeout(() => {
        navigation.navigate('AttendanceSuccess');
      }, 500);
    }, 2000);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Face Validation" onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        {/* Face Circle */}
        <View style={styles.faceContainer}>
          <View style={[styles.faceCircle, scanning && styles.faceCircleScanning]}>
            <Image source={{ uri: currentUser.avatar }} style={styles.faceImage} />
            <View style={[styles.scanLine, scanning && styles.scanLineActive]} />
            {scanning && (
              <View style={styles.scanOverlay}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.scanText}>Scanning...</Text>
              </View>
            )}
            {scanComplete && (
              <View style={styles.scanOverlay}>
                <View style={styles.successCircle}>
                  <Ionicons name="checkmark" size={32} color={colors.success} />
                </View>
              </View>
            )}
          </View>
        </View>

        <Text style={styles.title}>Position your face</Text>
        <Text style={styles.subtitle}>
          Ensure your face is well-lit and fits within the circular frame for secure identification.
        </Text>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'face' && styles.activeTab]}
            onPress={() => { hapticFeedback('light'); setActiveTab('face'); }}
            activeOpacity={0.7}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'face' }}
            accessibilityLabel="Face validation tab"
          >
            <Ionicons name="happy" size={18} color={activeTab === 'face' ? colors.primary : colors.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'face' && styles.activeTabText]}>Face</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'qr' && styles.activeTab]}
            onPress={() => { hapticFeedback('light'); setActiveTab('qr'); navigation.navigate('QRValidation'); }}
            activeOpacity={0.7}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'qr' }}
            accessibilityLabel="QR Code validation tab"
          >
            <Ionicons name="qr-code" size={18} color={colors.textSecondary} />
            <Text style={styles.tabText}>QR Code</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.verifyButton, (scanning || scanComplete) && styles.verifyButtonDisabled]}
          onPress={handleVerify}
          disabled={scanning || scanComplete}
          accessibilityLabel={scanning ? 'Scanning in progress' : 'Verify identity'}
        >
          {scanning ? (
            <ActivityIndicator size="small" color={colors.textInverse} />
          ) : (
            <Text style={styles.verifyButtonText}>Verify Identity</Text>
          )}
        </TouchableOpacity>
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
  faceContainer: { marginTop: spacing.xxl, marginBottom: spacing.xl },
  faceCircle: { width: 200, height: 200, borderRadius: 100, borderWidth: 4, borderColor: colors.primary, overflow: 'hidden', position: 'relative' },
  faceCircleScanning: { borderColor: colors.accentPurple },
  faceImage: { width: '100%', height: '100%' },
  scanLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: colors.primary },
  scanLineActive: { height: 3, backgroundColor: colors.accentPurple },
  scanOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  scanText: { ...typography.bodySmall, color: colors.textInverse, marginTop: spacing.sm },
  successCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' },
  title: { ...typography.h4, color: colors.text, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center', paddingHorizontal: spacing.xl, marginBottom: spacing.xxl },
  tabContainer: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: borderRadius.full, padding: spacing.xs, marginBottom: spacing.xl },
  tab: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.full },
  activeTab: { backgroundColor: colors.surfaceVariant },
  tabText: { ...typography.bodySmall, color: colors.textSecondary },
  activeTabText: { color: colors.primary, fontWeight: '600' },
  verifyButton: { backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: borderRadius.lg, width: '100%', alignItems: 'center' },
  verifyButtonDisabled: { opacity: 0.7 },
  verifyButtonText: { ...typography.button, color: colors.textInverse },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, paddingBottom: spacing.lg },
  footerText: { ...typography.caption, color: colors.textTertiary },
});
