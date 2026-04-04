import { hapticFeedback } from '../../utils/haptics';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Button, Badge } from '../../components';
import { getState, subscribe } from '../../store';

export const AttendanceSuccessScreen: React.FC<any> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [appState, setAppState] = React.useState(getState());

  React.useEffect(() => {
    const unsubscribe = subscribe(setAppState);
    return unsubscribe;
  }, []);

  const { attendance } = appState;
  const { today } = attendance;
  const checkInTime = today.checkIn || '08:58 AM';
  const isOnTime = today.status === 'on-time';

  const todayDate = new Date();
  const dateStr = todayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { hapticFeedback('medium'); navigation.navigate('Home'); }} accessibilityLabel="Close and go to home">
          <Ionicons name="close" size={24} color={colors.textInverse} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ATTENDANCE VERIFIED</Text>
        <TouchableOpacity accessibilityLabel="Help">
          <Ionicons name="help-circle-outline" size={24} color={colors.textInverse} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.successCard}>
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <Ionicons name="checkmark" size={32} color={colors.success} />
            </View>
            <View style={styles.checkBadge}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            </View>
          </View>

          <Text style={styles.title}>Check-In Successful</Text>
          <Text style={styles.subtitle}>Your attendance has been verified.</Text>

          <View style={styles.timeContainer}>
            <Text style={styles.timeLabel}>TIME RECORDED</Text>
            <Text style={styles.timeValue}>{checkInTime}</Text>
            <Badge text={isOnTime ? 'On time' : today.status} variant={isOnTime ? 'success' : 'warning'} style={styles.timeBadge} />
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="location" size={18} color={colors.primary} />
              </View>
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>{today.location || 'Headquarters, Jak...'}</Text>
              </View>
              <Badge text="On site" variant="default" size="small" />
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="calendar" size={18} color={colors.primary} />
              </View>
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>{dateStr}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Back to Home"
          variant="outline"
          onPress={() => { hapticFeedback('medium'); navigation.navigate('Home'); }}
          style={styles.homeButton}
          textStyle={styles.homeButtonText}
          accessibilityLabel="Back to home screen"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  headerTitle: { ...typography.label, color: colors.textInverse },
  content: { flex: 1, justifyContent: 'center', padding: spacing.lg },
  successCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xxl, padding: spacing.xl, alignItems: 'center' },
  iconContainer: { position: 'relative', marginBottom: spacing.lg },
  iconBackground: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primaryLighter, justifyContent: 'center', alignItems: 'center' },
  checkBadge: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' },
  title: { ...typography.h3, color: colors.text, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
  timeContainer: { alignItems: 'center', marginBottom: spacing.xl },
  timeLabel: { ...typography.caption, color: colors.textTertiary, marginBottom: spacing.sm },
  timeValue: { ...typography.timeLarge, color: colors.primary, marginBottom: spacing.sm },
  timeBadge: { marginTop: spacing.xs },
  detailsContainer: { width: '100%', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.lg },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  detailIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primaryLighter, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  detailInfo: { flex: 1 },
  detailLabel: { ...typography.caption, color: colors.textTertiary },
  detailValue: { ...typography.body, color: colors.text, fontWeight: '500' },
  footer: { padding: spacing.lg },
  homeButton: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.primary },
  homeButtonText: { color: colors.primary },
});
