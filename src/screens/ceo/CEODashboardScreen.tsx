import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Header, Card, Badge } from '../../components';
import { StatCard, ApprovalCard } from '../../components/management';
import { hapticFeedback } from '../../utils/haptics';
import { 
  getExecutiveSummary, 
  getDepartmentMetrics
} from '../../services';
import { formatCurrency } from '../../utils/calculations';

const ALERTS = [
  { title: 'Payroll Tax Filing Overdue', severity: 'high', icon: 'warning', desc: 'Q4 state tax filing needs immediate attention' },
  { title: 'VP Sales Retirement Risk', severity: 'medium', icon: 'person', desc: 'Key leader eligible for retirement in 2027' },
  { title: 'OSHA Inspection Due', severity: 'low', icon: 'shield-checkmark', desc: 'Annual safety inspection for Warehouse B' },
];

const ACTIVITY_FEED = [
  { icon: 'checkmark-circle', color: colors.success, title: 'Budget Approved', desc: 'Engineering Q2 budget of $620K approved by CFO', time: '2h ago' },
  { icon: 'person-add', color: colors.primary, title: 'New Hire', desc: 'Senior Engineer joined Engineering team', time: '5h ago' },
  { icon: 'trending-up', color: colors.info, title: 'Revenue Milestone', desc: 'Monthly revenue crossed $700K for the first time', time: '1d ago' },
  { icon: 'alert-circle', color: colors.warning, title: 'Attrition Alert', desc: 'Design department attrition rate increased to 8%', time: '2d ago' },
];

export const CEODashboardScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  
  const executiveData = getExecutiveSummary();
  const departmentMetrics = getDepartmentMetrics();
  
  const onRefresh = useCallback((): void => { 
    setRefreshing(true); 
    setTimeout(() => setRefreshing(false), 800); 
  }, []);

  const severityColor = (sev: string) => {
    switch (sev) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.info;
      default: return colors.textTertiary;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="CEO Dashboard" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        
        {/* KPI Stats */}
        <View style={styles.statsRow}>
          <StatCard 
            icon="people" 
            label="Total Employees" 
            value={executiveData.headcount.total.toString()} 
            color={colors.primary} 
            delay={0} 
          />
          <StatCard 
            icon="wallet" 
            label="Total Payroll" 
            value={formatCurrency(executiveData.financial.totalPayroll)} 
            color={colors.success} 
            delay={100} 
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard 
            icon="checkmark-circle" 
            label="Attendance Rate" 
            value={`${executiveData.attendance.averageAttendance}%`} 
            color={colors.info} 
            delay={200} 
          />
          <StatCard 
            icon="trending-up" 
            label="Avg KPI Score" 
            value={`${executiveData.performance.averageKPI}%`} 
            color={colors.accentPurple} 
            delay={300} 
          />
        </View>

        {/* Strategic Alerts */}
        {ALERTS.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Strategic Alerts</Text>
              <Badge text={`${ALERTS.length} Active`} variant="error" size="small" />
            </View>
            {ALERTS.map((alert, i) => (
              <Card key={i} style={styles.alertCard} padding="md">
                <View style={[styles.alertIcon, { backgroundColor: severityColor(alert.severity) + '15' }]}>
                  <Ionicons name={alert.icon} size={20} color={severityColor(alert.severity)} />
                </View>
                <View style={styles.alertInfo}>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  <Text style={styles.alertDesc}>{alert.desc}</Text>
                </View>
                <View style={[styles.severityBadge, { backgroundColor: severityColor(alert.severity) }]}>
                  <Text style={styles.severityText}>{alert.severity}</Text>
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* Quick Navigation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Navigation</Text>
          <View style={styles.quickActions}>
            {[
              { icon: 'stats-chart', label: 'Analytics', color: colors.primary, screen: 'CEOAnalytics' },
              { icon: 'wallet', label: 'Financial', color: colors.success, screen: 'CEOFinancial' },
              { icon: 'business', label: 'Departments', color: colors.info, screen: 'DepartmentOverview' },
              { icon: 'flag', label: 'Goals', color: colors.warning, screen: 'CompanyGoals' },
              { icon: 'shield-checkmark', label: 'Compliance', color: colors.accentPurple, screen: 'CEOCompliance' },
              { icon: 'people', label: 'Succession', color: colors.error, screen: 'CEOSuccession' },
              { icon: 'heart', label: 'Diversity', color: colors.accentPink, screen: 'CEODiversity' },
              { icon: 'bar-chart', label: 'Reports', color: colors.textSecondary, screen: 'CEOReports' },
            ].map(action => (
              <TouchableOpacity key={action.label} style={[styles.quickAction, { backgroundColor: `${action.color}10` }]}
                onPress={() => { hapticFeedback('light'); navigation.navigate(action.screen); }} activeOpacity={0.7}>
                <Ionicons name={action.icon} size={22} color={action.color} />
                <Text style={[styles.quickActionLabel, { color: action.color }]}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Department Performance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Department Performance</Text>
          {departmentMetrics.map((dept, i) => (
            <TouchableOpacity 
              key={dept.id} 
              style={styles.deptRow} 
              onPress={() => { hapticFeedback('light'); navigation.navigate('DepartmentDetail', { department: dept }); }} 
              activeOpacity={0.7}
            >
              <View style={styles.deptInfo}>
                <Text style={styles.deptName}>{dept.name}</Text>
                <Text style={styles.deptCount}>{dept.headcount} employees</Text>
              </View>
              <View style={styles.deptScore}>
                <Text 
                  style={[
                    styles.scoreValue, 
                    { color: dept.averageKPI >= 90 ? colors.success : dept.averageKPI >= 80 ? colors.warning : colors.error }
                  ]}
                >
                  {dept.averageKPI}%
                </Text>
                <Text style={styles.scoreLabel}>Score</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Activity Feed */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {ACTIVITY_FEED.map((item, i) => (
            <View key={i} style={styles.activityRow}>
              <View style={[styles.activityIcon, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon} size={18} color={item.color} />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{item.title}</Text>
                <Text style={styles.activityDesc}>{item.desc}</Text>
              </View>
              <Text style={styles.activityTime}>{item.time}</Text>
            </View>
          ))}
        </View>

        {/* Critical Approvals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pending Approvals</Text>
          <TouchableOpacity style={styles.viewAllBtn} onPress={() => navigation.navigate('HRApprovalDetail')} activeOpacity={0.7}>
            <Text style={styles.viewAllText}>View All Approvals</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  section: { marginBottom: spacing.xl },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  sectionTitle: { ...typography.h5, color: colors.text },
  alertCard: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, gap: spacing.md },
  alertIcon: { width: 40, height: 40, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center' },
  alertInfo: { flex: 1 },
  alertTitle: { ...typography.bodySmall, color: colors.text, fontWeight: '600' },
  alertDesc: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  severityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: borderRadius.full },
  severityText: { ...typography.caption, color: colors.textInverse, fontWeight: '700', textTransform: 'capitalize' },
  quickActions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  quickAction: { width: '23%', borderRadius: borderRadius.lg, padding: spacing.md, alignItems: 'center', gap: spacing.xs },
  quickActionLabel: { ...typography.caption, fontWeight: '600' },
  deptRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm },
  deptInfo: { flex: 1 },
  deptName: { ...typography.body, color: colors.text, fontWeight: '600' },
  deptCount: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  deptScore: { alignItems: 'flex-end' },
  scoreValue: { ...typography.h4, fontWeight: '700' },
  scoreLabel: { ...typography.caption, color: colors.textTertiary },
  activityRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  activityIcon: { width: 32, height: 32, borderRadius: borderRadius.sm, justifyContent: 'center', alignItems: 'center' },
  activityInfo: { flex: 1 },
  activityTitle: { ...typography.bodySmall, color: colors.text, fontWeight: '600' },
  activityDesc: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  activityTime: { ...typography.caption, color: colors.textTertiary },
  viewAllBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.md, backgroundColor: colors.surface, borderRadius: borderRadius.md },
  viewAllText: { ...typography.bodySmall, color: colors.primary, fontWeight: '600' },
});
