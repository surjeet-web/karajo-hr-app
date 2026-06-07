import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Card, Avatar } from '../../components';
import { StatCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';

const DEPT_DATA: Record<string, any> = {
  Engineering: {
    name: 'Engineering', head: 'James Wilson', headcount: 89, openPositions: 12, budget: '$2.4M', score: 92,
    members: [
      { name: 'Sarah Miller', role: 'Senior Software Engineer', initials: 'SM' },
      { name: 'David Chen', role: 'QA Lead', initials: 'DC' },
      { name: 'Rachel Green', role: 'Junior Developer', initials: 'RG' },
      { name: 'Tom Brown', role: 'DevOps Engineer', initials: 'TB' },
      { name: 'Lisa Wang', role: 'Frontend Developer', initials: 'LW' },
      { name: 'Mark Johnson', role: 'Backend Developer', initials: 'MJ' },
    ],
  },
  Design: {
    name: 'Design', head: 'Emily Chen', headcount: 24, openPositions: 3, budget: '$800K', score: 88,
    members: [
      { name: 'Alex Rivera', role: 'Lead Designer', initials: 'AR' },
      { name: 'Jordan Lee', role: 'UX Researcher', initials: 'JL' },
      { name: 'Sam Patel', role: 'UI Designer', initials: 'SP' },
    ],
  },
  Marketing: {
    name: 'Marketing', head: 'Michael Brown', headcount: 32, openPositions: 5, budget: '$1.2M', score: 85,
    members: [
      { name: 'Anna White', role: 'Content Strategist', initials: 'AW' },
      { name: 'Chris Davis', role: 'SEO Specialist', initials: 'CD' },
      { name: 'Mia Taylor', role: 'Social Media Manager', initials: 'MT' },
    ],
  },
  Sales: {
    name: 'Sales', head: 'Robert Kim', headcount: 45, openPositions: 8, budget: '$1.8M', score: 90,
    members: [
      { name: 'Jessica Lee', role: 'Account Executive', initials: 'JL' },
      { name: 'Ryan Scott', role: 'Sales Development Rep', initials: 'RS' },
      { name: 'Nicole Adams', role: 'Customer Success', initials: 'NA' },
    ],
  },
  Finance: {
    name: 'Finance', head: 'Patricia Moore', headcount: 18, openPositions: 2, budget: '$600K', score: 94,
    members: [
      { name: 'Kevin Zhang', role: 'Financial Analyst', initials: 'KZ' },
      { name: 'Laura Martinez', role: 'Accountant', initials: 'LM' },
    ],
  },
  HR: {
    name: 'Human Resources', head: 'Amanda Clark', headcount: 15, openPositions: 1, budget: '$500K', score: 91,
    members: [
      { name: 'Daniel Harris', role: 'HR Specialist', initials: 'DH' },
      { name: 'Sophia Lewis', role: 'Recruiter', initials: 'SL' },
    ],
  },
};

export const DepartmentDetailScreen: React.FC<any> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const deptName = route.params?.department?.name || 'Engineering';
  const dept = DEPT_DATA[deptName] || DEPT_DATA.Engineering;

  useEffect(() => { hapticFeedback('medium'); }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title={dept.name} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Card style={styles.deptCard} padding="lg">
          <View style={styles.deptHeader}>
            <View style={styles.deptIcon}>
              <Ionicons name="business" size={32} color={colors.primary} />
            </View>
            <View style={styles.deptInfo}>
              <Text style={styles.deptName}>{dept.name}</Text>
              <Text style={styles.deptHead}>Head: {dept.head}</Text>
            </View>
          </View>
        </Card>

        <View style={styles.statsRow}>
          <StatCard icon="people" label="Headcount" value={dept.headcount.toString()} color={colors.primary} delay={0} />
          <StatCard icon="briefcase" label="Open" value={dept.openPositions.toString()} color={colors.warning} delay={100} />
          <StatCard icon="wallet" label="Budget" value={dept.budget} color={colors.success} delay={200} />
          <StatCard icon="star" label="Score" value={`${dept.score}%`} color={colors.accentPurple} delay={300} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Team Members ({dept.members.length})</Text>
          {dept.members.map((member: any, i: number) => (
            <Card key={i} style={styles.memberCard} padding="md">
              <View style={styles.memberRow}>
                <Avatar name={member.initials} size="medium" />
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberRole}>{member.role}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
              </View>
            </Card>
          ))}
        </View>

        <TouchableOpacity style={styles.viewAllBtn} onPress={() => navigation.navigate('EmployeeDirectory')}>
          <Text style={styles.viewAllText}>View All Employees</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.primary} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  deptCard: { marginBottom: spacing.md },
  deptHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  deptIcon: { width: 56, height: 56, borderRadius: 16, backgroundColor: colors.primary + '15', justifyContent: 'center', alignItems: 'center' },
  deptInfo: { flex: 1 },
  deptName: { ...typography.h4, color: colors.text },
  deptHead: { ...typography.body, color: colors.textSecondary, marginTop: 2 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.lg },
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  memberCard: { marginBottom: spacing.sm },
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  memberInfo: { flex: 1 },
  memberName: { ...typography.body, color: colors.text, fontWeight: '600' },
  memberRole: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  viewAllBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.md, backgroundColor: colors.surface, borderRadius: borderRadius.md, marginTop: spacing.md },
  viewAllText: { ...typography.body, color: colors.primary, fontWeight: '600' },
});
