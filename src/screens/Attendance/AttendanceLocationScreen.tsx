import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Button, Badge } from '../../components';
import { hapticFeedback } from '../../utils/haptics';
import { useFadeIn, useSlideIn } from '../../utils/animations';

export const AttendanceLocationScreen: React.FC<any> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { onNext } = route.params || {};
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(true);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  const headerFade = useFadeIn(300);
  const cardSlide = useSlideIn('up', 400, 100);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const requestLocation = useCallback(async () => {
    setIsLocating(true);
    setErrorMsg(null);
    setLocation(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Location permission is required for attendance check-in. Please enable it in settings.');
        setIsLocating(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(loc);
    } catch {
      setErrorMsg('Unable to get your location. Please ensure GPS is enabled and try again.');
    } finally {
      setIsLocating(false);
    }
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const isOnTime = currentTime.getHours() < 9 || (currentTime.getHours() === 9 && currentTime.getMinutes() <= 15);
  const timeStr = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const handleCheckIn = () => {
    if (!location) {
      Alert.alert('Location Required', 'Please allow location access to check in.');
      return;
    }
    hapticFeedback('heavy');
    const locationName = `GPS: ${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`;
    const gpsData = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy || 0,
    };
    if (onNext) {
      onNext(locationName, gpsData);
    } else {
      navigation.navigate('FaceValidation', { locationName, gpsData });
    }
  };

  const formatAccuracy = (accuracy?: number) => {
    if (!accuracy) return '—';
    if (accuracy < 10) return 'Excellent';
    if (accuracy < 50) return 'Good';
    if (accuracy < 100) return 'Fair';
    return 'Poor';
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Map Background */}
      <View style={styles.mapContainer}>
        {location && (
          <Image
            source={{ uri: `https://maps.googleapis.com/maps/api/staticmap?center=${location.coords.latitude},${location.coords.longitude}&zoom=16&size=400x600&markers=color:blue%7C${location.coords.latitude},${location.coords.longitude}&key=DEMO` }}
            style={styles.mapImage}
            resizeMode="cover"
          />
        )}
        {!location && (
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map" size={64} color={colors.textTertiary} />
          </View>
        )}
        <View style={styles.mapOverlay} />

        {/* Location Pin */}
        {location && (
          <View style={styles.pinContainer}>
            <View style={styles.workZoneBadge}>
              <Text style={styles.workZoneText}>Your Location</Text>
            </View>
            <View style={styles.locationPin}>
              <Ionicons name="location" size={40} color={colors.primary} />
            </View>
          </View>
        )}
      </View>

      {/* Bottom Sheet */}
      <View style={[styles.bottomSheet, { paddingBottom: insets.bottom + spacing.lg }]}>
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        {isLocating ? (
          <View style={styles.locatingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.locatingText}>Finding your GPS location...</Text>
            <Text style={styles.locatingSubtext}>Please wait while we verify your position</Text>
          </View>
        ) : errorMsg ? (
          <View style={styles.errorContainer}>
            <View style={styles.errorIcon}>
              <Ionicons name="alert-circle" size={32} color={colors.error} />
            </View>
            <Text style={styles.errorTitle}>Location Access Denied</Text>
            <Text style={styles.errorText}>{errorMsg}</Text>
            <Button title="Enable Location" onPress={requestLocation} variant="outline" style={{ marginTop: spacing.md }} />
          </View>
        ) : location ? (
          <>
            <View style={styles.verifiedRow}>
              <View style={styles.verifiedIcon}>
                <Ionicons name="checkmark" size={20} color={colors.success} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.verifiedTitle}>Location Verified</Text>
                <Text style={styles.verifiedSubtitle}>GPS position confirmed</Text>
              </View>
              <Badge text={formatAccuracy(location.coords.accuracy ?? undefined)} variant="success" size="small" />
            </View>

            <View style={styles.divider} />

            <View style={styles.gpsDetails}>
              <View style={styles.gpsRow}>
                <Ionicons name="navigate" size={16} color={colors.textSecondary} />
                <Text style={styles.gpsText}>Lat: {location.coords.latitude.toFixed(6)}</Text>
              </View>
              <View style={styles.gpsRow}>
                <Ionicons name="navigate" size={16} color={colors.textSecondary} />
                <Text style={styles.gpsText}>Lng: {location.coords.longitude.toFixed(6)}</Text>
              </View>
              <View style={styles.gpsRow}>
                <Ionicons name="speedometer" size={16} color={colors.textSecondary} />
                <Text style={styles.gpsText}>Accuracy: ±{location.coords.accuracy?.toFixed(0) || '—'}m</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.timeRow}>
              <Ionicons name="time-outline" size={20} color={colors.textTertiary} />
              <View style={styles.timeInfo}>
                <Text style={styles.timeValue}>{timeStr}</Text>
                <Text style={styles.timeStatus}>
                  {isOnTime ? 'On Time' : 'Late'} • Shift starts at 09:00 AM
                </Text>
              </View>
            </View>

            <Button
              title="Continue to Face Verification"
              onPress={handleCheckIn}
              style={styles.checkInButton}
              icon={<Ionicons name="arrow-forward" size={18} color={colors.textInverse} />}
            />
          </>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  mapContainer: { flex: 1, position: 'relative' },
  mapImage: { width: '100%', height: '100%' },
  mapPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.surfaceVariant },
  mapOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.05)' },
  pinContainer: { position: 'absolute', top: '40%', left: '50%', marginLeft: -50, alignItems: 'center' },
  workZoneBadge: { backgroundColor: colors.surface, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.sm, marginBottom: spacing.xs },
  workZoneText: { ...typography.caption, color: colors.primary, fontWeight: '600' },
  locationPin: { width: 50, height: 50, justifyContent: 'center', alignItems: 'center' },
  bottomSheet: { backgroundColor: colors.surface, borderTopLeftRadius: borderRadius.xxl, borderTopRightRadius: borderRadius.xxl, padding: spacing.lg },
  handleContainer: { alignItems: 'center', marginBottom: spacing.md },
  handle: { width: 40, height: 4, backgroundColor: colors.border, borderRadius: 2 },
  locatingContainer: { alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.md },
  locatingText: { ...typography.body, color: colors.textSecondary },
  locatingSubtext: { ...typography.bodySmall, color: colors.textTertiary },
  errorContainer: { alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.md },
  errorIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.errorLight, justifyContent: 'center', alignItems: 'center' },
  errorTitle: { ...typography.h5, color: colors.error },
  errorText: { ...typography.bodySmall, color: colors.textSecondary, textAlign: 'center', paddingHorizontal: spacing.md },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  verifiedIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.successLight, justifyContent: 'center', alignItems: 'center' },
  verifiedTitle: { ...typography.h5, color: colors.text },
  verifiedSubtitle: { ...typography.bodySmall, color: colors.textSecondary },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  gpsDetails: { gap: spacing.sm, marginBottom: spacing.md },
  gpsRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  gpsText: { ...typography.bodySmall, color: colors.textSecondary },
  timeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginBottom: spacing.lg },
  timeInfo: { flex: 1 },
  timeValue: { ...typography.h5, color: colors.text },
  timeStatus: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  checkInButton: { marginBottom: spacing.md },
});
