import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Card, Badge, Avatar, Button, ProgressBar, StatusTimeline, AnimatedListItem } from '../../components';
import { hapticFeedback } from '../../utils/haptics';
import { useFadeIn, useSlideIn } from '../../utils/animations';

export const EmployeeDetailScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { employee } = route.params;
  const fadeIn = useFadeIn();
  const slideIn = useSlideIn('up', 30, 400);

  const infoRows = [
    { icon: 'mail-outline', label: 'Email', value: employee.email, action: () => { hapticFeedback('medium'); Linking.openURL(`mailto:${employee.email}`); } },
    { icon: 'call-outline', label: 'Phone', value: employee.phone, action: () => { hapticFeedback('medium'); Linking.openURL(`tel:${employee.phone}`); } },
    { icon: 'business-outline', label: 'Department', value: employee.department },
    { icon: 'person-outline', label: 'Reports To', value: employee.manager },
    { icon: 'calendar-outline', label: 'Joined', value: employee.joinDate },
    { icon: 'location-outline', label: 'Location', value: employee.location },
    { icon: 'briefcase-outline', label: 'Type', value: employee.employmentType },
  ];

  const timeline = [
    { status: 'Joined Company', date: employee.joinDate, by: 'HR Department', active: false },
    { status: 'Probation Completed', date: 'Sep 15, 2022', by: 'James Wilson', active: false },
    { status: 'Promoted to Senior', date: 'Mar 15, 2024', by: 'Engineering', active: true },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.View style={{ opacity: fadeIn }}>
        <Header title="Employee Profile" onBack={() => navigation.goBack()} />
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View style={{ opacity: slideIn.opacity, transform: [{ translateY: slideIn.offset }] }}>
        <Card padding="lg" style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Avatar name={employee.name} size="xlarge" />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{employee.name}</Text>
              <Text style={styles.profileRole}>{employee.role}</Text>
              <Badge text={employee.status === 'active' ? 'Active' : 'Onboarding'} variant={employee.status === 'active' ? 'success' : 'info'} size="small" />
            </View>
          </View>

          {employee.rating && (
            <View style={styles.ratingRow}>
              <View style={styles.ratingItem}>
                <Ionicons name="star" size={20} color={colors.warning} />
                <Text style={styles.ratingValue}>{employee.rating}</Text>
                <Text style={styles.ratingLabel}>Rating</Text>
              </View>
              <View style={styles.ratingItem}>
                <Ionicons name="speedometer" size={20} color={colors.primary} />
                <Text style={styles.ratingValue}>{employee.kpiScore}%</Text>
                <Text style={styles.ratingLabel}>KPI Score</Text>
              </View>
              <View style={styles.ratingItem}>
                <Ionicons name="clipboard" size={20} color={colors.accentPurple} />
                <Text style={styles.ratingValue}>{employee.pendingReviews}</Text>
                <Text style={styles.ratingLabel}>Reviews</Text>
              </View>
            </View>
          )}
        </Card>
        </Animated.View>

        <Card padding="lg" style={styles.card}>
          <Text style={styles.sectionTitle}>Contact & Information</Text>
          {infoRows.map((row, i) => (
            <AnimatedListItem key={i} index={i} haptic={row.action ? 'medium' : null}>
              <TouchableOpacity
                style={styles.infoRow}
                onPress={row.action}
                disabled={!row.action}
                activeOpacity={0.7}
                accessibilityLabel={`${row.label}: ${row.value}`}
                accessibilityRole={row.action ? 'link' : 'text'}
              >
                <Ionicons name={row.icon} size={18} color={colors.textTertiary} />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>{row.label}</Text>
                  <Text style={styles.infoValue}>{row.value}</Text>
                </View>
                {row.action && <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />}
              </TouchableOpacity>
            </AnimatedListItem>
          ))}
        </Card>

        <Card padding="lg" style={styles.card}>
          <Text style={styles.sectionTitle}>Career Timeline</Text>
          <StatusTimeline items={timeline} />
        </Card>

        {employee.pendingReviews > 0 && (
          <View style={styles.footer}>
            <Button title={`View ${employee.pendingReviews} Pending Reviews`} onPress={() => { hapticFeedback('medium'); navigation.navigate('PerformanceDashboard'); }} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  profileCard: { marginBottom: spacing.md },
  card: { marginBottom: spacing.md },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
  profileInfo: { flex: 1, gap: spacing.xs },
  profileName: { ...typography.h4, color: colors.text },
  profileRole: { ...typography.body, color: colors.textSecondary },
  ratingRow: { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md },
  ratingItem: { alignItems: 'center', gap: spacing.xs },
  ratingValue: { ...typography.h5, color: colors.text, fontWeight: '700' },
  ratingLabel: { ...typography.caption, color: colors.textTertiary },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  infoText: { flex: 1 },
  infoLabel: { ...typography.caption, color: colors.textTertiary },
  infoValue: { ...typography.body, color: colors.text },
  footer: { padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
});
