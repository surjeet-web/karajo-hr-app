import React, { useEffect } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card, Avatar } from '../../components';
import { StatCard } from '../../components/management';

export const DepartmentDetailScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  useEffect(() => { hapticFeedback('medium'); }, []);
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Department Detail" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Card style={styles.deptCard} padding="lg">
          <Text style={styles.deptName}>Engineering</Text>
          <Text style={styles.deptHead}>Head: James Wilson</Text>
        </Card>

        <View style={styles.statsRow}>
          <StatCard icon="people" label="Headcount" value="89" color={colors.primary} delay={0} />
          <StatCard icon="briefcase" label="Open" value="5" color={colors.warning} delay={100} />
          <StatCard icon="wallet" label="Budget" value="$450K" color={colors.success} delay={200} />
          <StatCard icon="star" label="Score" value="92%" color={colors.accentPurple} delay={300} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Team Members</Text>
          {[
            { name: 'Sarah Miller', role: 'Senior Software Engineer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' },
            { name: 'David Miller', role: 'QA Lead', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop' },
            { name: 'Rachel Green', role: 'Junior Developer', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop' },
            { name: 'Tom Brown', role: 'DevOps Engineer', avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=200&h=200&fit=crop' },
          ].map((member, i) => (
            <Card key={i} style={styles.memberCard} padding="md">
              <View style={styles.memberRow}>
                <Avatar source={{ uri: member.avatar }} name={member.name} size="medium" />
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberRole}>{member.role}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  deptCard: { marginBottom: spacing.md, alignItems: 'center' },
  deptName: { ...typography.h3, color: colors.text },
  deptHead: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.lg },
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.h5, color: colors.text, marginBottom: spacing.md },
  memberCard: { marginBottom: spacing.sm },
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  memberInfo: { flex: 1 },
  memberName: { ...typography.body, color: colors.text, fontWeight: '600' },
  memberRole: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
});
