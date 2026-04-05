import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
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

export const FaceValidationScreen: React.FC<any> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { locationName, gpsData } = route.params || {};
  const cameraRef = useRef<CameraView>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraActive, setCameraActive] = useState(true);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const headerFade = useFadeIn(300);
  const cardSlide = useSlideIn('up', 400, 100);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current || isCapturing) return;
    hapticFeedback('medium');
    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7, skipProcessing: true });
      if (photo?.uri) {
        setCapturedPhoto(photo.uri);
        setCameraActive(false);
        hapticFeedback('success');
      }
    } catch {
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing]);

  const handleRetake = useCallback(() => {
    setCapturedPhoto(null);
    setCameraActive(true);
    hapticFeedback('light');
  }, []);

  const handleCheckIn = useCallback(async () => {
    if (!capturedPhoto) return;
    hapticFeedback('heavy');
    setIsCheckingIn(true);

    try {
      const locationStr = locationName || `GPS: ${gpsData?.latitude?.toFixed(4) || 0}, ${gpsData?.longitude?.toFixed(4) || 0}`;
      checkIn(locationStr, gpsData, capturedPhoto);

      setTimeout(() => {
        setIsCheckingIn(false);
        navigation.navigate('AttendanceSuccess');
      }, 800);
    } catch {
      setIsCheckingIn(false);
      Alert.alert('Error', 'Check-in failed. Please try again.');
    }
  }, [capturedPhoto, locationName, gpsData, navigation]);

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
          <Text style={styles.centerText}>Camera permission is needed to verify your identity during check-in.</Text>
          <Button title="Grant Permission" onPress={() => Camera.requestCameraPermissionsAsync()} style={{ marginTop: spacing.lg }} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Camera / Photo Preview */}
      <View style={styles.cameraContainer}>
        {cameraActive && !capturedPhoto ? (
          <CameraView ref={cameraRef} style={styles.camera} facing="front">
            <View style={styles.cameraOverlay}>
              {/* Face Guide Circle */}
              <View style={styles.faceGuide}>
                <View style={styles.faceGuideBorder} />
              </View>
              <Text style={styles.cameraHint}>Position your face in the circle</Text>
            </View>
          </CameraView>
        ) : capturedPhoto ? (
          <View style={styles.photoPreview}>
            <View style={styles.photoImageContainer}>
              {capturedPhoto && <View style={styles.photoImage} />}
            </View>
            <View style={styles.photoOverlay}>
              <View style={styles.photoBadge}>
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                <Text style={styles.photoBadgeText}>Photo Captured</Text>
              </View>
            </View>
          </View>
        ) : null}
      </View>

      {/* Bottom Controls */}
      <View style={[styles.bottomSheet, { paddingBottom: insets.bottom + spacing.lg }]}>
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        {capturedPhoto ? (
          <>
            <View style={styles.verifiedRow}>
              <View style={styles.verifiedIcon}>
                <Ionicons name="checkmark" size={20} color={colors.success} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.verifiedTitle}>Photo Captured</Text>
                <Text style={styles.verifiedSubtitle}>Your attendance photo is ready</Text>
              </View>
              <Badge text="Ready" variant="success" size="small" />
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
              <Button title="Retake Photo" onPress={handleRetake} variant="outline" style={{ flex: 1, marginRight: spacing.sm }} />
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
            <Text style={styles.title}>Verify Your Identity</Text>
            <Text style={styles.subtitle}>
              Take a photo to verify your presence at the office. Ensure good lighting and face the camera.
            </Text>
            <View style={styles.captureContainer}>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={handleCapture}
                disabled={isCapturing}
                activeOpacity={0.7}
              >
                {isCapturing ? (
                  <ActivityIndicator size="large" color={colors.primary} />
                ) : (
                  <Ionicons name="camera" size={36} color={colors.primary} />
                )}
              </TouchableOpacity>
              <Text style={styles.captureLabel}>Tap to Capture</Text>
            </View>
            <TouchableOpacity
              style={styles.qrSwitch}
              onPress={() => navigation.navigate('QRValidation', { locationName, gpsData })}
              activeOpacity={0.7}
            >
              <Ionicons name="qr-code" size={18} color={colors.primary} />
              <Text style={styles.qrSwitchText}>Use QR Code Instead</Text>
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
  cameraOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  faceGuide: { width: 220, height: 280, borderRadius: 110, borderWidth: 3, borderColor: 'rgba(255,255,255,0.6)', justifyContent: 'center', alignItems: 'center' },
  faceGuideBorder: { width: 240, height: 300, borderRadius: 120, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  cameraHint: { ...typography.body, color: 'rgba(255,255,255,0.8)', marginTop: spacing.xl, textAlign: 'center' },
  photoPreview: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  photoImageContainer: { width: 200, height: 200, borderRadius: 100, borderWidth: 4, borderColor: colors.success, overflow: 'hidden' },
  photoImage: { width: '100%', height: '100%', backgroundColor: colors.surfaceVariant },
  photoOverlay: { position: 'absolute', bottom: spacing.xl },
  photoBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full },
  photoBadgeText: { ...typography.body, color: colors.success, fontWeight: '600' },
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
  captureContainer: { alignItems: 'center', marginBottom: spacing.xl },
  captureButton: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.surface, borderWidth: 3, borderColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  captureLabel: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.sm },
  qrSwitch: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, paddingVertical: spacing.md },
  qrSwitchText: { ...typography.body, color: colors.primary, fontWeight: '600' },
});
