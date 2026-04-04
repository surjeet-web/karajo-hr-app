import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Button, Badge } from '../../components';
import { hapticFeedback } from '../../utils/haptics';
import { checkIn, attendanceService } from '../../store';

export const AttendanceLocationScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [gpsStatus, setGpsStatus] = useState('searching');
  const [gpsAccuracy, setGpsAccuracy] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setGpsStatus('verified');
      setGpsAccuracy('5m');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCheckIn = () => {
    hapticFeedback('heavy');
    setIsCheckingIn(true);
    checkIn('Karajo HQ - Tech Park');
    setTimeout(() => {
      hapticFeedback('success');
      setIsCheckingIn(false);
      navigation.navigate('FaceValidation');
    }, 500);
  };

  const timeStr = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const shiftStart = '09:00 AM';
  const isOnTime = currentTime.getHours() < 9 || (currentTime.getHours() === 9 && currentTime.getMinutes() <= 15);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Map Background */}
      <View style={styles.mapContainer}>
        <Image
          source={{ uri: 'https://api.mapbox.com/styles/v1/mapbox/light-v10/static/106.8456,-6.2088,12,0/400x600?access_token=pk.demo' }}
          style={styles.mapImage}
          resizeMode="cover"
        />
        <View style={styles.mapOverlay} />
        
        {/* Location Pin */}
        <View style={styles.pinContainer}>
          <View style={styles.workZoneBadge}>
            <Text style={styles.workZoneText}>Work Zone</Text>
          </View>
          <View style={styles.locationPin}>
            <Ionicons name="location" size={40} color={colors.primary} />
          </View>
          <View style={styles.youBadge}>
            <Text style={styles.youText}>YOU</Text>
          </View>
        </View>
      </View>

      {/* Bottom Sheet */}
      <View style={[styles.bottomSheet, { paddingBottom: insets.bottom + spacing.lg }]}>
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        <View style={styles.verifiedRow}>
          <View style={styles.verifiedIcon}>
            {gpsStatus === 'searching' ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Ionicons name="checkmark" size={20} color={colors.success} />
            )}
          </View>
          <View>
            <Text style={styles.verifiedTitle}>
              {gpsStatus === 'searching' ? 'Locating...' : 'Location Verified'}
            </Text>
            <Text style={styles.verifiedSubtitle}>
              {gpsStatus === 'searching' ? 'Finding your position...' : 'You are within the office radius'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={20} color={colors.textTertiary} />
          <View style={styles.locationInfo}>
            <Text style={styles.locationName}>Karajo HQ - Tech Park</Text>
            <Text style={styles.locationAddress}>123 Innovation Dr, Tech Park, Suite 400</Text>
          </View>
        </View>

        <View style={styles.timeRow}>
          <Ionicons name="time-outline" size={20} color={colors.textTertiary} />
          <View style={styles.timeInfo}>
            <Text style={styles.timeValue}>{timeStr}</Text>
            <Text style={styles.timeStatus}>
              {isOnTime ? 'On Time' : 'Late'} • Shift starts at {shiftStart}
            </Text>
          </View>
        </View>

        <Button
          title="Check In Now"
          onPress={handleCheckIn}
          style={styles.checkInButton}
          icon={isCheckingIn ? <ActivityIndicator size="small" color={colors.textInverse} /> : <Ionicons name="arrow-forward" size={18} color={colors.textInverse} />}
          disabled={gpsStatus !== 'verified' || isCheckingIn}
          accessibilityLabel="Check in to attendance"
        />

        <Text style={styles.gpsText}>
          GPS accuracy: {gpsStatus === 'searching' ? 'Searching...' : `High (${gpsAccuracy})`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  mapContainer: { flex: 1, position: 'relative' },
  mapImage: { width: '100%', height: '100%' },
  mapOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.1)' },
  pinContainer: { position: 'absolute', top: '40%', left: '50%', marginLeft: -40, alignItems: 'center' },
  workZoneBadge: { backgroundColor: colors.surface, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.sm, marginBottom: spacing.xs },
  workZoneText: { ...typography.caption, color: colors.primary, fontWeight: '600' },
  locationPin: { width: 50, height: 50, justifyContent: 'center', alignItems: 'center' },
  youBadge: { backgroundColor: colors.text, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.xs, marginTop: -spacing.sm },
  youText: { ...typography.caption, color: colors.textInverse, fontWeight: '700' },
  bottomSheet: { backgroundColor: colors.surface, borderTopLeftRadius: borderRadius.xxl, borderTopRightRadius: borderRadius.xxl, padding: spacing.lg },
  handleContainer: { alignItems: 'center', marginBottom: spacing.md },
  handle: { width: 40, height: 4, backgroundColor: colors.border, borderRadius: 2 },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  verifiedIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.successLight, justifyContent: 'center', alignItems: 'center' },
  verifiedTitle: { ...typography.h5, color: colors.text },
  verifiedSubtitle: { ...typography.bodySmall, color: colors.textSecondary },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  locationRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginBottom: spacing.md },
  locationInfo: { flex: 1 },
  locationName: { ...typography.body, color: colors.text, fontWeight: '600' },
  locationAddress: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  timeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginBottom: spacing.lg },
  timeInfo: { flex: 1 },
  timeValue: { ...typography.h5, color: colors.text },
  timeStatus: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  checkInButton: { marginBottom: spacing.md },
  gpsText: { ...typography.caption, color: colors.textTertiary, textAlign: 'center' },
});
