import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { getState } from '../../store';

const ROLE_COLORS: Record<string, string> = {
  manager: colors.primary,
  'team_lead': colors.accent,
  employee: colors.textSecondary,
};

export const TeamMembersScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const state = getState();

  const teamMembers = state.employees || [
    { id: 1, name: 'Sarah Miller', role: 'UI Designer', department: 'Design', status: 'active', email: 'sarah@karajo.com', phone: '+1 234 567 8901', avatar: 'SM' },
    { id: 2, name: 'James Wilson', role: 'Frontend Developer', department: 'Engineering', status: 'active', email: 'james@karajo.com', phone: '+1 234 567 8902', avatar: 'JW' },
    { id: 3, name: 'Emily Chen', role: 'Backend Developer', department: 'Engineering', status: 'active', email: 'emily@karajo.com', phone: '+1 234 567 8903', avatar: 'EC' },
    { id: 4, name: 'Michael Brown', role: 'Product Manager', department: 'Product', status: 'away', email: 'michael@karajo.com', phone: '+1 234 567 8904', avatar: 'MB' },
    { id: 5, name: 'Lisa Anderson', role: 'QA Engineer', department: 'Engineering', status: 'active', email: 'lisa@karajo.com', phone: '+1 234 567 8905', avatar: 'LA' },
    { id: 6, name: 'David Kim', role: 'DevOps Engineer', department: 'Engineering', status: 'offline', email: 'david@karajo.com', phone: '+1 234 567 8906', avatar: 'DK' },
  ];

  const filtered = teamMembers.filter((m: any) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase()) ||
    m.department.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = teamMembers.filter((m: any) => m.status === 'active').length;
  const awayCount = teamMembers.filter((m: any) => m.status === 'away').length;

  const statusColor = (status: string) => {
    switch (status) {
      case 'active': return colors.success;
      case 'away': return colors.warning;
      case 'offline': return colors.textTertiary;
      default: return colors.textTertiary;
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'away': return 'Away';
      case 'offline': return 'Offline';
      default: return status;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Team Members</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{teamMembers.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: colors.success }]}>
          <Text style={[styles.statValue, { color: colors.success }]}>{activeCount}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: colors.warning }]}>
          <Text style={[styles.statValue, { color: colors.warning }]}>{awayCount}</Text>
          <Text style={styles.statLabel}>Away</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textTertiary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, role, or department"
          placeholderTextColor={colors.textTertiary}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filtered.length > 0 ? filtered.map((member: any) => (
          <TouchableOpacity
            key={member.id}
            style={styles.memberCard}
            onPress={() => navigation.navigate('TeamMembers', { employee: member })}
            activeOpacity={0.7}
          >
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{member.avatar || member.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}</Text>
              </View>
              <View style={[styles.statusDot, { backgroundColor: statusColor(member.status) }]} />
            </View>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRole}>{member.role}</Text>
              <View style={styles.memberMeta}>
                <Ionicons name="business-outline" size={12} color={colors.textTertiary} />
                <Text style={styles.memberDept}>{member.department}</Text>
                <Text style={styles.metaSeparator}>·</Text>
                <Text style={[styles.memberStatus, { color: statusColor(member.status) }]}>{statusLabel(member.status)}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        )) : (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>No Members Found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your search.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  backBtn: { padding: spacing.xs },
  headerTitle: { ...typography.h3, color: colors.text, flex: 1, textAlign: 'center', marginRight: 32 },
  headerSpacer: { width: 32 },
  statsRow: { flexDirection: 'row', paddingHorizontal: spacing.lg, gap: spacing.md, marginBottom: spacing.md },
  statCard: { flex: 1, backgroundColor: colors.surface, padding: spacing.md, borderRadius: borderRadius.md, borderLeftWidth: 3, borderLeftColor: colors.primary },
  statValue: { ...typography.h4, color: colors.text, fontWeight: '700' },
  statLabel: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: spacing.lg, marginBottom: spacing.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.surface, borderRadius: borderRadius.md, gap: spacing.sm },
  searchIcon: { opacity: 0.6 },
  searchInput: { flex: 1, ...typography.body, color: colors.text, padding: 0 },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  memberCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm } as any,
  avatarContainer: { position: 'relative', marginRight: spacing.md },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary + '20', justifyContent: 'center', alignItems: 'center' },
  avatarText: { ...typography.h5, color: colors.primary, fontWeight: '700' },
  statusDot: { position: 'absolute', bottom: 0, right: 0, width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: colors.surface },
  memberInfo: { flex: 1 },
  memberName: { ...typography.body, color: colors.text, fontWeight: '600' },
  memberRole: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  memberMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  memberDept: { ...typography.caption, color: colors.textTertiary },
  metaSeparator: { color: colors.textTertiary },
  memberStatus: { ...typography.caption, fontWeight: '500' },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxxxl },
  emptyTitle: { ...typography.h4, color: colors.text, marginTop: spacing.md },
  emptySubtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
});
