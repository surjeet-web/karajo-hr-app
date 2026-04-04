import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Animated, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Card, Badge, Avatar, Button } from '../../components';
import { employees, departments } from '../../data/mockData';
import { useFadeIn, useSlideIn, useScaleIn, hapticFeedback } from '../../animations/hooks';
import { AnimatedProgressBar } from '../../animations/AnimatedComponents';

export const EmployeeDirectoryScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const headerFade = useFadeIn(300);
  const searchSlide = useSlideIn('down', 300, 100);
  const statsSlide = useSlideIn('up', 400, 200);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || emp.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const deptNames = ['All', ...new Set(employees.map(e => e.department))];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.View style={{ opacity: headerFade }}>
        <Header title="Employee Directory" onBack={() => navigation.goBack()} />
      </Animated.View>

      <Animated.View style={[styles.searchContainer, { opacity: searchSlide.opacity, transform: [{ translateY: searchSlide.offset }] }]}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search employees..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.deptScroll} contentContainerStyle={styles.deptContainer}>
        {deptNames.map((dept, i) => (
          <TouchableOpacity
            key={dept}
            style={[styles.deptChip, selectedDept === dept && styles.deptChipActive]}
            onPress={() => { hapticFeedback('light'); setSelectedDept(dept); }}
            activeOpacity={0.7}
            accessibilityLabel={`Filter by ${dept} department`}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedDept === dept }}
          >
            <Text style={[styles.deptChipText, selectedDept === dept && styles.deptChipTextActive]}>{dept}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scrollContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        <Animated.View style={[styles.statsRow, { opacity: statsSlide.opacity, transform: [{ translateY: statsSlide.offset }] }]}>
          {[
            { label: 'Total', value: employees.length, color: colors.text },
            { label: 'Active', value: employees.filter(e => e.status === 'active').length, color: colors.success },
            { label: 'Onboarding', value: employees.filter(e => e.status === 'onboarding').length, color: colors.warning },
          ].map((stat, i) => {
            const scaleIn = useScaleIn(300, 300 + i * 100);
            return (
              <Animated.View key={stat.label} style={[styles.statCard, { opacity: scaleIn.opacity, transform: [{ scale: scaleIn.scale }] }]}>
                <Text style={[styles.statNumber, { color: stat.color }]}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </Animated.View>
            );
          })}
        </Animated.View>

        <Text style={styles.sectionTitle}>Departments</Text>
        <View style={styles.deptGrid}>
          {departments.map((dept, i) => {
            const slideIn = useSlideIn('up', 300, 400 + i * 80);
            return (
              <Animated.View key={dept.id} style={[{ width: '47%', opacity: slideIn.opacity, transform: [{ translateY: slideIn.offset }] }]}>
                <Card style={styles.deptCard} padding="md">
                  <View style={[styles.deptIcon, { backgroundColor: `${dept.color}15` }]}>
                    <Ionicons name="business" size={20} color={dept.color} />
                  </View>
                  <Text style={styles.deptName}>{dept.name}</Text>
                  <Text style={styles.deptCount}>{dept.count} members</Text>
                </Card>
              </Animated.View>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>All Employees ({filteredEmployees.length})</Text>
        {filteredEmployees.map((emp, i) => {
          const slideIn = useSlideIn('up', 350, 600 + i * 80);
          return (
            <AnimatedCard key={emp.id} delay={600 + i * 80} onPress={() => { hapticFeedback('medium'); navigation.navigate('EmployeeDetail', { employee: emp }); }}>
              <Card style={styles.empCard} padding="md">
                <View style={styles.empHeader}>
                  <View style={styles.empLeft}>
                    <Avatar name={emp.name} size="medium" />
                    <View>
                      <Text style={styles.empName}>{emp.name}</Text>
                      <Text style={styles.empRole}>{emp.role}</Text>
                    </View>
                  </View>
                  <Badge text={emp.status === 'active' ? 'Active' : 'Onboarding'} variant={emp.status === 'active' ? 'success' : 'info'} size="small" />
                </View>
                <View style={styles.empDetails}>
                  <View style={styles.empDetailItem}>
                    <Ionicons name="business-outline" size={14} color={colors.textTertiary} />
                    <Text style={styles.empDetailText}>{emp.department}</Text>
                  </View>
                  <View style={styles.empDetailItem}>
                    <Ionicons name="location-outline" size={14} color={colors.textTertiary} />
                    <Text style={styles.empDetailText}>{emp.location}</Text>
                  </View>
                  {emp.rating && (
                    <View style={styles.empDetailItem}>
                      <Ionicons name="star" size={14} color={colors.warning} />
                      <Text style={styles.empDetailText}>{emp.rating}</Text>
                    </View>
                  )}
                </View>
              </Card>
            </AnimatedCard>
          );
        })}
      </ScrollView>
    </View>
  );
};

const AnimatedCard = ({ children, delay, onPress }) => {
  const slideIn = useSlideIn('up', 350, delay);
  return (
    <Animated.View style={{ opacity: slideIn.opacity, transform: [{ translateY: slideIn.offset }], marginBottom: spacing.md }}>
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchContainer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, height: 44, borderWidth: 1.5, borderColor: colors.border },
  searchInput: { flex: 1, marginLeft: spacing.sm, ...typography.body, color: colors.text },
  deptScroll: { maxHeight: 44 },
  deptContainer: { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: spacing.sm },
  deptChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, backgroundColor: colors.surfaceVariant },
  deptChipActive: { backgroundColor: colors.primary },
  deptChipText: { ...typography.bodySmall, color: colors.textSecondary },
  deptChipTextActive: { color: colors.textInverse, fontWeight: '600' },
  scrollContent: { padding: spacing.lg },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  statCard: { flex: 1, alignItems: 'center', padding: spacing.md, backgroundColor: colors.surface, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border },
  statNumber: { ...typography.h3, color: colors.text },
  statLabel: { ...typography.caption, color: colors.textTertiary },
  sectionTitle: { ...typography.label, color: colors.textTertiary, marginBottom: spacing.md, marginTop: spacing.lg },
  deptGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  deptCard: { alignItems: 'center' },
  deptIcon: { width: 40, height: 40, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm },
  deptName: { ...typography.bodySmall, color: colors.text, fontWeight: '600', textAlign: 'center' },
  deptCount: { ...typography.caption, color: colors.textTertiary },
  empCard: { marginBottom: spacing.md },
  empHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  empLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  empName: { ...typography.body, color: colors.text, fontWeight: '600' },
  empRole: { ...typography.bodySmall, color: colors.textSecondary },
  empDetails: { flexDirection: 'row', gap: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md },
  empDetailItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  empDetailText: { ...typography.bodySmall, color: colors.textSecondary },
});
