import React, { useState, useCallback } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Card, Badge, Button, ProgressBar, AnimatedListItem } from '../../components';
import { performanceData } from '../../data/mockData';
import { useFadeIn, useSlideIn, useScaleIn } from '../../utils/animations';
import { hapticFeedback } from '../../utils/haptics';

export const KPITrackingScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const headerFade = useFadeIn(300);
  const bannerSlide = useSlideIn('up', 400, 100);
  const categories = ['All', ...new Set(performanceData.kpis.map(k => k.category))];
  const filteredKpis = selectedCategory === 'All' ? performanceData.kpis : performanceData.kpis.filter(k => k.category === selectedCategory);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setRefreshing(false);
  }, []);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'exceeding': return { variant: 'success', icon: 'trending-up', color: colors.success };
      case 'on-track': return { variant: 'info', icon: 'trending-up', color: colors.primary };
      case 'at-risk': return { variant: 'error', icon: 'trending-down', color: colors.error };
      default: return { variant: 'default', icon: 'remove', color: colors.textTertiary };
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return 'arrow-up';
      case 'down': return 'arrow-down';
      default: return 'remove';
    }
  };

  const onTrackCount = performanceData.kpis.filter(k => k.status === 'on-track' || k.status === 'exceeding').length;
  const avgScore = performanceData.overview.avgKpiScore;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.View style={{ opacity: headerFade }}>
        <Header title="KPI Tracking" onBack={() => navigation.goBack()} />
      </Animated.View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={styles.catContainer}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.catChip, selectedCategory === cat && styles.catChipActive]}
            onPress={() => { hapticFeedback('light'); setSelectedCategory(cat); }}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Filter by ${cat}`}
            accessibilityState={{ selected: selectedCategory === cat }}
          >
            <Text style={[styles.catChipText, selectedCategory === cat && styles.catChipTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
        }
      >
        <Animated.View style={[styles.summaryBanner, { opacity: bannerSlide.opacity, transform: [{ translateY: bannerSlide.offset }] }]}>
          <PulsingIcon name={<Ionicons name="speedometer" size={24} color={colors.primary} />} delay={200} />
          <View style={styles.summaryText}>
            <Text style={styles.summaryTitle}>Average KPI Score: {avgScore}%</Text>
            <Text style={styles.summarySubtitle}>{onTrackCount} of {performanceData.kpis.length} KPIs are on track or exceeding targets</Text>
          </View>
        </Animated.View>

        {filteredKpis.map((kpi, i) => {
          const statusConfig = getStatusConfig(kpi.status);
          const slideIn = useSlideIn('up', 350, 300 + i * 100);
          return (
            <Animated.View key={kpi.id} style={[{ opacity: slideIn.opacity, transform: [{ translateY: slideIn.offset }], marginBottom: spacing.md }]}>
              <Card style={styles.kpiCard} padding="md">
                <View style={styles.kpiHeader}>
                  <View style={styles.kpiTitleRow}>
                    <Text style={styles.kpiName}>{kpi.name}</Text>
                    <Badge text={kpi.status.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())} variant={statusConfig.variant} size="small" />
                  </View>
                  <Text style={styles.kpiCategory}>{kpi.category}</Text>
                </View>

                <View style={styles.kpiMetrics}>
                  <View style={styles.kpiMetric}>
                    <Text style={styles.kpiMetricLabel}>Current</Text>
                    <Text style={styles.kpiMetricValue}>{kpi.current}</Text>
                  </View>
                  <View style={styles.kpiMetric}>
                    <Text style={styles.kpiMetricLabel}>Target</Text>
                    <Text style={styles.kpiMetricValue}>{kpi.target}</Text>
                  </View>
                  <View style={styles.kpiMetric}>
                    <Text style={styles.kpiMetricLabel}>Trend</Text>
                    <View style={styles.trendBadge}>
                      <Ionicons name={getTrendIcon(kpi.trend)} size={14} color={kpi.trend === 'up' ? colors.success : kpi.trend === 'down' ? colors.error : colors.textTertiary} />
                      <Text style={[styles.trendText, { color: kpi.trend === 'up' ? colors.success : kpi.trend === 'down' ? colors.error : colors.textTertiary }]}>{kpi.trend === 'up' ? 'Up' : kpi.trend === 'down' ? 'Down' : 'Stable'}</Text>
                    </View>
                  </View>
                </View>
              </Card>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  catScroll: { maxHeight: 44 },
  catContainer: { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: spacing.sm },
  catChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, backgroundColor: colors.surfaceVariant },
  catChipActive: { backgroundColor: colors.primary },
  catChipText: { ...typography.bodySmall, color: colors.textSecondary },
  catChipTextActive: { color: colors.textInverse, fontWeight: '600' },
  scrollContent: { padding: spacing.lg },
  summaryBanner: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.primaryLighter, padding: spacing.md, borderRadius: borderRadius.lg, marginBottom: spacing.lg },
  summaryText: { flex: 1 },
  summaryTitle: { ...typography.body, color: colors.primaryDark, fontWeight: '600' },
  summarySubtitle: { ...typography.bodySmall, color: colors.primary },
  kpiCard: { marginBottom: spacing.md },
  kpiHeader: { marginBottom: spacing.md },
  kpiTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  kpiName: { ...typography.body, color: colors.text, fontWeight: '600' },
  kpiCategory: { ...typography.caption, color: colors.textTertiary },
  kpiMetrics: { flexDirection: 'row', gap: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md },
  kpiMetric: { flex: 1 },
  kpiMetricLabel: { ...typography.caption, color: colors.textTertiary, marginBottom: spacing.xs },
  kpiMetricValue: { ...typography.body, color: colors.text, fontWeight: '600' },
  trendBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  trendText: { ...typography.bodySmall, fontWeight: '600' },
});
