import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Vibration } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Button, Badge } from '../../components';
import { hapticFeedback } from '../../utils/haptics';
import { checkIn } from '../../store';
import { useFadeIn, useSlideIn } from '../../utils/animations';

export const QRValidationScreen: React.FC<any> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { locationName, gpsData } = route.params || {};
  const cameraRef = useRef<CameraView>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const headerFade = useFadeIn(300);
  const cardSlide = useSlideIn('up', 400, 100);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = useCallback(({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    setScanned(true);
    setScannedData(data);
    Vibration.vibrate(200);
    hapticFeedback('success');
  }, [scanned]);

  const handleCheckIn = useCallback(async () => {
    if (!scannedData) return;
    hapticFeedback('heavy');
    setIsCheckingIn(true);

    try {
      const locationStr = locationName || `QR Check-in: ${scannedData}`;
      checkIn(locationStr, gpsData);

      setTimeout(() => {
        setIsCheckingIn(false);
        navigation.navigate('AttendanceSuccess');
      }, 800);
    } catch {
      setIsCheckingIn(false);
      Alert.alert('Error', 'Check-in failed. Please try again.');
    }
  }, [scannedData, locationName, gpsData, navigation]);

  const handleReset = useCallback(() => {
    setScanned(false);
    setScannedData(null);
    hapticFeedback('light');
  }, []);

  if (hasPermission === null) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.centerText}>Requesting camera access...</Text>
        </View>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.centerContent}>
          <View style={styles.errorIconContainer}>
            <Ionicons name="camera" size={48} color={colors.error} />
          </View>
          <Text style={styles.centerTitle}>Camera Access Required</Text>
          <Text style={styles.centerText}>Camera permission is needed to scan the QR code.</Text>
          <Button title="Grant Permission" onPress={() => Camera.requestCameraPermissionsAsync()} style={{ marginTop: spacing.lg }} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Camera Scanner */}
      <View style={styles.cameraContainer}>
        {!scanned ? (
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={handleBarCodeScanned}
          >
            <View style={styles.scannerOverlay}>
              {/* Scan Frame */}
              <View style={styles.scanFrame}>
                <View style={styles.cornerTL} />
                <View style={styles.cornerTR} />
                <View style={styles.cornerBL} />
                <View style={styles.cornerBR} />
              </View>
              <Text style={styles.scanHint}>Align QR code within the frame</Text>
            </View>
          </CameraView>
        ) : (
          <View style={styles.scannedView}>
            <View style={styles.scannedIconContainer}>
              <Ionicons name="checkmark-circle" size={64} color={colors.success} />
            </View>
            <Text style={styles.scannedTitle}>QR Code Scanned!</Text>
            <View style={styles.scannedDataCard}>
              <Ionicons name="information-circle" size={16} color={colors.textSecondary} />
              <Text style={styles.scannedDataText} numberOfLines={2}>{scannedData}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Bottom Controls */}
      <View style={[styles.bottomSheet, { paddingBottom: insets.bottom + spacing.lg }]}>
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        {scanned ? (
          <>
            <View style={styles.verifiedRow}>
              <View style={styles.verifiedIcon}>
                <Ionicons name="checkmark" size={20} color={colors.success} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.verifiedTitle}>QR Verified</Text>
                <Text style={styles.verifiedSubtitle}>Identity confirmed via QR code</Text>
              </View>
              <Badge text="Verified" variant="success" size="small" />
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Ionicons name="location" size={16} color={colors.textSecondary} />
              <Text style={styles.infoText}>{locationName || 'GPS location recorded'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time" size={16} color={colors.textSecondary} />
              <Text style={styles.infoText}>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</Text>
            </View>
            <View style={styles.actionButtons}>
              <Button title="Scan Again" onPress={handleReset} variant="outline" style={{ flex: 1, marginRight: spacing.sm }} />
              <Button
                title="Complete Check In"
                onPress={handleCheckIn}
                loading={isCheckingIn}
                icon={<Ionicons name="checkmark-circle" size={18} color={colors.textInverse} />}
                style={{ flex: 1, marginLeft: spacing.sm }}
              />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.title}>Scan QR Code</Text>
            <Text style={styles.subtitle}>
              Point your camera at the company QR code to verify your attendance automatically.
            </Text>
            <TouchableOpacity
              style={styles.faceSwitch}
              onPress={() => navigation.navigate('FaceValidation', { locationName, gpsData })}
              activeOpacity={0.7}
            >
              <Ionicons name="camera" size={18} color={colors.primary} />
              <Text style={styles.faceSwitchText}>Use Face Verification Instead</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  centerTitle: { ...typography.h4, color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm, textAlign: 'center' },
  centerText: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  errorIconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.errorLight, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.lg },
  cameraContainer: { flex: 1, position: 'relative', backgroundColor: '#000' },
  camera: { flex: 1 },
  scannerOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  scanFrame: { width: 250, height: 250, position: 'relative' },
  cornerTL: { position: 'absolute', top: 0, left: 0, width: 50, height: 50, borderTopWidth: 4, borderLeftWidth: 4, borderColor: '#fff', borderTopLeftRadius: 8 },
  cornerTR: { position: 'absolute', top: 0, right: 0, width: 50, height: 50, borderTopWidth: 4, borderRightWidth: 4, borderColor: '#fff', borderTopRightRadius: 8 },
  cornerBL: { position: 'absolute', bottom: 0, left: 0, width: 50, height: 50, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: '#fff', borderBottomLeftRadius: 8 },
  cornerBR: { position: 'absolute', bottom: 0, right: 0, width: 50, height: 50, borderBottomWidth: 4, borderRightWidth: 4, borderColor: '#fff', borderBottomRightRadius: 8 },
  scanHint: { ...typography.body, color: 'rgba(255,255,255,0.8)', marginTop: spacing.xl, textAlign: 'center' },
  scannedView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)' },
  scannedIconContainer: { marginBottom: spacing.lg },
  scannedTitle: { ...typography.h3, color: colors.success, fontWeight: '700', marginBottom: spacing.lg },
  scannedDataCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.lg, maxWidth: '80%' },
  scannedDataText: { ...typography.bodySmall, color: 'rgba(255,255,255,0.8)', flex: 1 },
  bottomSheet: { backgroundColor: colors.surface, borderTopLeftRadius: borderRadius.xxl, borderTopRightRadius: borderRadius.xxl, padding: spacing.lg },
  handleContainer: { alignItems: 'center', marginBottom: spacing.md },
  handle: { width: 40, height: 4, backgroundColor: colors.border, borderRadius: 2 },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  verifiedIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.successLight, justifyContent: 'center', alignItems: 'center' },
  verifiedTitle: { ...typography.h5, color: colors.text },
  verifiedSubtitle: { ...typography.bodySmall, color: colors.textSecondary },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  infoText: { ...typography.bodySmall, color: colors.textSecondary },
  actionButtons: { flexDirection: 'row', marginTop: spacing.md },
  title: { ...typography.h4, color: colors.text, marginBottom: spacing.sm, textAlign: 'center' },
  subtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xl },
  faceSwitch: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, paddingVertical: spacing.md },
  faceSwitchText: { ...typography.body, color: colors.primary, fontWeight: '600' },
});
