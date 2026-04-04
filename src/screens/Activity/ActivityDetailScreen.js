import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Badge, StatusTimeline } from '../../components';

export const ActivityDetailScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  
  const timeline = [
    { status: 'Updated Description', label: 'Request created by', by: 'Sarah Miller', date: 'Feb 28, 09:00 PM' },
    { status: 'Activity Created', label: 'Reviewed by', by: 'Alex Johnson', date: 'Feb 28, 09:20 PM' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Activity Record" onBack={() => navigation.goBack()} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Badge text="Submitted" variant="info" />
          <Text style={styles.recordId}>#ACT-8942</Text>
        </View>

        <Text style={styles.title}>Backend API Refactoring</Text>
        
        <View style={styles.projectRow}>
          <Ionicons name="briefcase" size={16} color={colors.textTertiary} />
          <Text style={styles.projectText}>Project Alpha</Text>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <View style={styles.infoIconRow}>
              <Ionicons name="calendar-outline" size={16} color={colors.textTertiary} />
              <Text style={styles.infoLabel}>DATE</Text>
            </View>
            <Text style={styles.infoValue}>Feb 24, 2023</Text>
          </View>
          <View style={styles.infoCard}>
            <View style={styles.infoIconRow}>
              <Ionicons name="time-outline" size={16} color={colors.textTertiary} />
              <Text style={styles.infoLabel}>DURATION</Text>
            </View>
            <Text style={styles.infoValue}>4h 30m</Text>
          </View>
        </View>

        <View style={styles.timeWindowCard}>
          <Text style={styles.timeWindowLabel}>TIME WINDOW</Text>
          <View style={styles.timeWindowRow}>
            <View>
              <Text style={styles.timeWindowSublabel}>Start</Text>
              <Text style={styles.timeWindowValue}>09:00 AM</Text>
            </View>
            <View style={styles.timeWindowLine} />
            <View>
              <Text style={styles.timeWindowSublabel}>End</Text>
              <Text style={styles.timeWindowValue}>01:30 PM</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DESCRIPTION</Text>
          <Text style={styles.description}>
            Refactored the user authentication endpoints to improve latency. Updated the swagger documentation to reflect changes in the response schema for /auth/login and /auth/verify{'\n\n'}
            Conducted unit tests on the new middleware and verified 15% improvement in response times during load testing.
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={colors.info} />
          <Text style={styles.infoText}>This record has been finalized and synced with the central timesheet system.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>HISTORY LOG</Text>
          <StatusTimeline items={timeline} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  recordId: { ...typography.bodySmall, color: colors.textTertiary },
  title: { ...typography.h3, color: colors.text, marginBottom: spacing.sm },
  projectRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.lg },
  projectText: { ...typography.body, color: colors.textSecondary },
  infoGrid: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  infoCard: { flex: 1, backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  infoIconRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xs },
  infoLabel: { ...typography.caption, color: colors.textTertiary },
  infoValue: { ...typography.h5, color: colors.text },
  timeWindowCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.lg },
  timeWindowLabel: { ...typography.caption, color: colors.textTertiary, marginBottom: spacing.sm },
  timeWindowRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timeWindowSublabel: { ...typography.caption, color: colors.textTertiary },
  timeWindowValue: { ...typography.h5, color: colors.text },
  timeWindowLine: { flex: 1, height: 1, backgroundColor: colors.border, marginHorizontal: spacing.md, marginTop: spacing.md },
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.label, color: colors.textTertiary, marginBottom: spacing.md },
  description: { ...typography.body, color: colors.textSecondary, lineHeight: 24 },
  infoBox: { flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.infoLight, padding: spacing.md, borderRadius: borderRadius.lg, marginBottom: spacing.lg },
  infoText: { ...typography.bodySmall, color: colors.info, flex: 1 },
});
