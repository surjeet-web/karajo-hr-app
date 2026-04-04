import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Avatar, Card, Badge, StatusTimeline } from '../../components';
import { StatCard } from '../../components/management';

export const HREmployeeProfileScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const employee = route.params?.employee || { id: 1, name: 'Sarah Miller', role: 'Senior Software Engineer', department: 'Engineering', email: 'sarah.miller@karajo.com', phone: '+1 (555) 123-4567', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop', joinDate: 'Mar 15, 2022', status: 'active', location: 'New York', employmentType: 'Full-time', rating: 4.5, kpiScore: 94, pendingReviews: 2 };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Employee Profile" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Card style={styles.profileCard} padding="lg">
          <Avatar source={{ uri: employee.avatar }} name={employee.name} size="xlarge" />
          <Text style={styles.profileName}>{employee.name}</Text>
          <Text style={styles.profileRole}>{employee.role}</Text>
          <Badge text={employee.status} variant={employee.status === 'active' ? 'success' : 'warning'} size="medium" />
        </Card>

        <View style={styles.statsRow}>
          <StatCard icon="star" label="Rating" value={employee.rating.toString()} color={colors.warning} delay={0} />
          <StatCard icon="trending-up" label="KPI Score" value={employee.kpiScore.toString()} color={colors.success} delay={100} />
          <StatCard icon="clipboard" label="Reviews" value={employee.pendingReviews.toString()} color={colors.primary} delay={200} />
        </View>

        <Card style={styles.infoCard} padding="lg">
          <Text style={styles.infoTitle}>Contact Information</Text>
          <TouchableOpacity style={styles.infoRow} onPress={() => Linking.openURL(`mailto:${employee.email}`)}>
            <Ionicons name="mail-outline" size={20} color={colors.primary} />
            <Text style={styles.infoText}>{employee.email}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.infoRow} onPress={() => Linking.openURL(`tel:${employee.phone}`)}>
            <Ionicons name="call-outline" size={20} color={colors.primary} />
            <Text style={styles.infoText}>{employee.phone}</Text>
          </TouchableOpacity>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color={colors.primary} />
            <Text style={styles.infoText}>{employee.location}</Text>
          </View>
        </Card>

        <Card style={styles.infoCard} padding="lg">
          <Text style={styles.infoTitle}>Employment Details</Text>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Department</Text><Text style={styles.detailValue}>{employee.department}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Employment Type</Text><Text style={styles.detailValue}>{employee.employmentType}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Join Date</Text><Text style={styles.detailValue}>{employee.joinDate}</Text></View>
        </Card>

        <Card style={styles.infoCard} padding="lg">
          <Text style={styles.infoTitle}>Recent Activity</Text>
          <StatusTimeline items={[
            { status: 'Checked In', label: 'Attendance', by: 'System', date: 'Today, 09:00' },
            { status: 'Leave Approved', label: 'Annual Leave', by: 'HR', date: 'Feb 25' },
            { status: 'Review Completed', label: 'Q4 Review', by: 'James Wilson', date: 'Feb 20' },
          ]} />
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  profileCard: { alignItems: 'center', marginBottom: spacing.md },
  profileName: { ...typography.h4, color: colors.text, marginTop: spacing.md },
  profileRole: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  infoCard: { marginBottom: spacing.md },
  infoTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  infoText: { ...typography.body, color: colors.text, flex: 1 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  detailLabel: { ...typography.bodySmall, color: colors.textSecondary },
  detailValue: { ...typography.bodySmall, color: colors.text, fontWeight: '600' },
});
