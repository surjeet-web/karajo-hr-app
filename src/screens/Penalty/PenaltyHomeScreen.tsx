import React, { useState, useCallback } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Card, Badge, Button } from '../../components';
import { penaltyData } from '../../data/mockData';
import { useFadeIn, useSlideIn, useScaleIn, hapticFeedback } from '../../animations/hooks';

export const PenaltyHomeScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const summary = penaltyData.summary;
  const [activeTab, setActiveTab] = useState<string>('all');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const headerFade = useFadeIn(300);
  const tabsSlide = useSlideIn('down', 300, 100);
  const statsSlide = useSlideIn('up', 400, 200);
  const listSlide = useSlideIn('up', 400, 500);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error': return colors.error;
      case 'warning': return colors.warning;
      case 'info': return colors.info;
      default: return colors.textTertiary;
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error': return 'close-circle';
      case 'warning': return 'warning';
      case 'info': return 'information-circle';
      default: return 'alert-circle';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return { text: 'Active', variant: 'error' };
      case 'under-review': return { text: 'Under Review', variant: 'warning' };
      case 'resolved': return { text: 'Resolved', variant: 'success' };
      default: return { text: status, variant: 'default' };
    }
  };

  const activePenalties = penaltyData.penalties.filter(p => p.status === 'active' || p.status === 'under-review');
  const resolvedPenalties = penaltyData.penalties.filter(p => p.status === 'resolved');

  const filteredPenalties = activeTab === 'all' ? penaltyData.penalties : activeTab === 'active' ? activePenalties : resolvedPenalties;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.View style={{ opacity: headerFade }}>
        <Header title="Penalty" onBack={() => navigation.goBack()} />
      </Animated.View>

      <Animated.View style={[styles.tabsContainer, { opacity: tabsSlide.opacity, transform: [{ translateY: tabsSlide.offset }] }]}>
        {['all', 'active', 'resolved'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => { hapticFeedback('light'); setActiveTab(tab); }}
            activeOpacity={0.7}
            accessibilityLabel={`Show ${tab} penalties`}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === tab }}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scrollContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}>
        <Animated.View style={[{ opacity: statsSlide.opacity, transform: [{ translateY: statsSlide.offset }] }]}>
          <View style={styles.summaryGrid}>
            {[
              { icon: 'alert-circle', label: 'ACTIVE', value: summary.activePenalties, color: colors.error, delay: 300 },
              { icon: 'cash', label: 'TOTAL FINES', value: summary.totalFines, color: colors.warning, delay: 400 },
            ].map((stat) => {
              const scaleIn = useScaleIn(300, stat.delay);
              return (
                <Animated.View key={stat.label} style={[styles.summaryCard, { opacity: scaleIn.opacity, transform: [{ scale: scaleIn.scale }] }]}>
                  <Card padding="md">
                    <View style={styles.summaryIconRow}>
                      <Ionicons name={stat.icon} size={16} color={stat.color} />
                      <Text style={styles.summaryLabel}>{stat.label}</Text>
                    </View>
                    <Text style={[styles.summaryValue, { color: stat.color }]}>{stat.value}</Text>
                  </Card>
                </Animated.View>
              );
            })}
          </View>

          <View style={styles.summaryGrid}>
            {[
              { icon: 'checkmark-circle', label: 'RESOLVED', value: summary.resolved, color: colors.success, delay: 500 },
              { icon: 'shield', label: 'WARNING PTS', value: summary.warningPoints, color: colors.accentPurple, delay: 600 },
            ].map((stat) => {
              const scaleIn = useScaleIn(300, stat.delay);
              return (
                <Animated.View key={stat.label} style={[styles.summaryCard, { opacity: scaleIn.opacity, transform: [{ scale: scaleIn.scale }] }]}>
                  <Card padding="md">
                    <View style={styles.summaryIconRow}>
                      <Ionicons name={stat.icon} size={16} color={stat.color} />
                      <Text style={styles.summaryLabel}>{stat.label}</Text>
                    </View>
                    <Text style={[styles.summaryValue, { color: stat.color }]}>{stat.value}</Text>
                  </Card>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>

        <Animated.View style={[{ opacity: listSlide.opacity, transform: [{ translateY: listSlide.offset }] }]}>
          {filteredPenalties.length > 0 && (
            <>
              {activeTab !== 'resolved' && activePenalties.length > 0 && (activeTab === 'all' || activeTab === 'active') && (
                <>
                  <Text style={styles.sectionTitle}>Active Penalties</Text>
                  {activePenalties.map((penalty, i) => (
                    <PenaltyCard key={penalty.id} penalty={penalty} index={i} navigation={navigation} getSeverityColor={getSeverityColor} getSeverityIcon={getSeverityIcon} getStatusBadge={getStatusBadge} />
                  ))}
                </>
              )}
              {resolvedPenalties.length > 0 && (activeTab === 'all' || activeTab === 'resolved') && (
                <>
                  <Text style={styles.sectionTitle}>Resolved</Text>
                  {resolvedPenalties.map((penalty, i) => (
                    <PenaltyCard key={penalty.id} penalty={penalty} index={i + activePenalties.length} navigation={navigation} getSeverityColor={getSeverityColor} getSeverityIcon={getSeverityIcon} getStatusBadge={getStatusBadge} />
                  ))}
                </>
              )}
            </>
          )}

          {filteredPenalties.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-circle" size={64} color={colors.success} />
              <Text style={styles.emptyTitle}>All Clear!</Text>
              <Text style={styles.emptySubtitle}>No penalties found in this category.</Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="File Appeal" icon={<Ionicons name="document-text" size={20} color={colors.textInverse} />} onPress={() => { hapticFeedback('medium'); navigation.navigate('PenaltyAppeal'); }} accessibilityLabel="File a penalty appeal" />
      </View>
    </View>
  );
};

const PenaltyCard = ({ penalty, index, navigation, getSeverityColor, getSeverityIcon, getStatusBadge }) => {
  const slideIn = useSlideIn('up', 350, 600 + index * 80);
  const badge = getStatusBadge(penalty.status);

  return (
    <Animated.View style={[{ opacity: slideIn.opacity, transform: [{ translateY: slideIn.offset }], marginBottom: spacing.md }]}>
      <Card style={styles.penaltyCard} padding="md" onPress={() => { hapticFeedback('medium'); navigation.navigate('PenaltyDetail', { penalty }); }}>
        <View style={styles.penaltyHeader}>
          <View style={styles.penaltyLeft}>
            <View style={[styles.penaltyIcon, { backgroundColor: `${getSeverityColor(penalty.severity)}15` }]}>
              <Ionicons name={getSeverityIcon(penalty.severity)} size={20} color={getSeverityColor(penalty.severity)} />
            </View>
            <View>
              <Text style={styles.penaltyTitle}>{penalty.type}</Text>
              <Text style={styles.penaltyDate}>{penalty.date}</Text>
            </View>
          </View>
          <Badge text={badge.text} variant={badge.variant} size="small" />
        </View>
        <Text style={styles.penaltyDescription} numberOfLines={2}>{penalty.description}</Text>
        <View style={styles.penaltyFooter}>
          <View style={styles.penaltyFooterItem}>
            <Text style={styles.penaltyFooterLabel}>Fine</Text>
            <Text style={[styles.penaltyFooterValue, { color: colors.error }]}>{penalty.fine}</Text>
          </View>
          <View style={styles.penaltyFooterItem}>
            <Text style={styles.penaltyFooterLabel}>Ref</Text>
            <Text style={styles.penaltyFooterValue}>{penalty.reference}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
        </View>
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  tabsContainer: { flexDirection: 'row', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.lg },
  tab: { paddingVertical: spacing.xs },
  activeTab: { borderBottomWidth: 2, borderBottomColor: colors.error },
  tabText: { ...typography.body, color: colors.textSecondary },
  activeTabText: { color: colors.error, fontWeight: '600' },
  scrollContent: { padding: spacing.lg },
  summaryGrid: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  summaryCard: { flex: 1 },
  summaryIconRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xs },
  summaryLabel: { ...typography.caption, color: colors.textTertiary },
  summaryValue: { ...typography.h4, color: colors.text },
  sectionTitle: { ...typography.label, color: colors.textTertiary, marginBottom: spacing.md, marginTop: spacing.lg },
  penaltyCard: { marginBottom: spacing.md },
  penaltyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md },
  penaltyLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  penaltyIcon: { width: 44, height: 44, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center' },
  penaltyTitle: { ...typography.body, color: colors.text, fontWeight: '600' },
  penaltyDate: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  penaltyDescription: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.md, lineHeight: 20 },
  penaltyFooter: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md },
  penaltyFooterItem: { flex: 1 },
  penaltyFooterLabel: { ...typography.caption, color: colors.textTertiary, marginBottom: spacing.xs },
  penaltyFooterValue: { ...typography.bodySmall, color: colors.text, fontWeight: '600' },
  footer: { padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxxxl },
  emptyTitle: { ...typography.h4, color: colors.text, marginTop: spacing.md },
  emptySubtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
});
