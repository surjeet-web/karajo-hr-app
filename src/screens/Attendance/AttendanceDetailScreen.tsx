import React from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Badge, Button } from '../../components';
import { hapticFeedback } from '../../utils/haptics';
import { attendanceService } from '../../services';

export const AttendanceDetailScreen: React.FC<any> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { record } = route?.params || {};

  const displayDate = record?.date || 'Monday, Feb 23, 2023';
  const displayCheckIn = record?.checkIn || '09:15 AM';
  const displayCheckOut = record?.checkOut || '06:05 PM';
  const displayStatus = record?.status || 'late';
  const displayLocation = record?.location || 'Head Office, Jakarta';
  const displayTotalHours = record?.totalHours || 8.83;

  const getStatusBadge = () => {
    switch (displayStatus) {
      case 'on-time': return { text: 'On Time', variant: 'success' };
      case 'late': return { text: 'Late - 15 mins', variant: 'warning' };
      case 'overtime': return { text: 'Overtime', variant: 'primary' };
      case 'absent': return { text: 'Absent', variant: 'error' };
      default: return { text: displayStatus, variant: 'default' };
    }
  };

  const badge = getStatusBadge();
  const hours = Math.floor(displayTotalHours);
  const mins = Math.round((displayTotalHours - hours) * 60);
  const totalWorkTime = `${String(hours).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m`;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Attendance Detail" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.dateSection}>
          <Text style={styles.recordLabel}>RECORD FOR</Text>
          <Text style={styles.dateText}>{displayDate}</Text>
          <View style={styles.badgesRow}>
            <Badge text={badge.text} variant={badge.variant} />
            <Badge text="On-site" variant="info" />
          </View>
        </View>

        <View style={styles.timelineSection}>
          <View style={styles.timelineHeader}>
            <Text style={styles.timelineTitle}>Timeline</Text>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL WORK TIME</Text>
              <Text style={styles.totalValue}>{totalWorkTime}</Text>
            </View>
          </View>

          <View style={styles.timeline}>
            <View style={styles.timelineItem}>
              <View style={styles.timelineDot}>
                <Ionicons name="log-in" size={16} color={colors.textInverse} />
              </View>
              <View style={styles.timelineLine} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineLabel}>CHECK IN</Text>
                <Text style={styles.timelineTime}>{displayCheckIn}</Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location" size={14} color={colors.textTertiary} />
                  <Text style={styles.locationText}>{displayLocation}</Text>
                </View>
              </View>
              <Text style={styles.timelineRight}>{displayCheckIn}</Text>
            </View>

            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.primary }]}>
                <Ionicons name="log-out" size={16} color={colors.primary} />
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineLabel}>CHECK OUT</Text>
                <Text style={styles.timelineTime}>{displayCheckOut}</Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location" size={14} color={colors.textTertiary} />
                  <Text style={styles.locationText}>{displayLocation}</Text>
                </View>
              </View>
              <Text style={styles.timelineRight}>{displayCheckOut}</Text>
            </View>
          </View>
        </View>

        <View style={styles.mapSection}>
          <View style={styles.mapHeader}>
            <Text style={styles.mapTitle}>Work Location</Text>
            <TouchableOpacity onPress={() => { hapticFeedback('light'); Alert.alert('Map', 'Map view coming soon'); }} activeOpacity={0.7} accessibilityLabel="See location on map">
              <Text style={styles.seeMapText}>See on Map</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={{ uri: 'https://api.mapbox.com/styles/v1/mapbox/light-v10/static/106.8456,-6.2088,12,0/400x200?access_token=pk.demo' }}
            style={styles.mapImage}
            resizeMode="cover"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Request Correction"
          variant="outline"
          onPress={() => { hapticFeedback('medium'); navigation.navigate('CorrectionReason', { record }); }}
          icon={<Ionicons name="calendar" size={18} color={colors.primary} />}
          accessibilityLabel="Request attendance correction"
        />
        <Text style={styles.footerNote}>Corrections are subject to HR approval.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  dateSection: { marginBottom: spacing.lg },
  recordLabel: { ...typography.caption, color: colors.textTertiary, marginBottom: spacing.xs },
  dateText: { ...typography.h4, color: colors.text, marginBottom: spacing.md },
  badgesRow: { flexDirection: 'row', gap: spacing.sm },
  timelineSection: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border },
  timelineHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.lg },
  timelineTitle: { ...typography.h5, color: colors.text },
  totalRow: { alignItems: 'flex-end' },
  totalLabel: { ...typography.caption, color: colors.textTertiary },
  totalValue: { ...typography.h4, color: colors.primary, fontWeight: '700' },
  timeline: {},
  timelineItem: { flexDirection: 'row', alignItems: 'flex-start', position: 'relative', paddingBottom: spacing.lg },
  timelineDot: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md, zIndex: 1 },
  timelineLine: { position: 'absolute', left: 17, top: 36, width: 2, height: 60, backgroundColor: colors.primary },
  timelineContent: { flex: 1 },
  timelineLabel: { ...typography.caption, color: colors.textTertiary },
  timelineTime: { ...typography.h5, color: colors.text, marginTop: spacing.xs },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs },
  locationText: { ...typography.bodySmall, color: colors.textSecondary },
  timelineRight: { ...typography.bodySmall, color: colors.textTertiary },
  mapSection: { marginBottom: spacing.lg },
  mapHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  mapTitle: { ...typography.h5, color: colors.text },
  seeMapText: { ...typography.bodySmall, color: colors.primary, fontWeight: '600' },
  mapImage: { width: '100%', height: 150, borderRadius: borderRadius.lg },
  footer: { padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
  footerNote: { ...typography.caption, color: colors.textTertiary, textAlign: 'center', marginTop: spacing.sm },
});
