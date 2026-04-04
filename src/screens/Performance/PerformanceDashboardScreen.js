import React, { useState, useCallback } from 'react';
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

export const PerformanceDashboardScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const overview = performanceData.overview;
  const [refreshing, setRefreshing] = useState(false);
  const headerFade = useFadeIn(300);
  const statsSlide = useSlideIn('up', 400, 100);
  const actionsSlide = useSlideIn('up', 400, 500);
  const reviewsSlide = useSlideIn('up', 400, 700);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setRefreshing(false);
  }, []);

  const quickActions = [
    { icon: 'create-outline', label: 'Write Review', color: colors.primary, screen: 'PerformanceReview' },
    { icon: 'speedometer', label: 'View KPIs', color: colors.accentPink, screen: 'KPITracking' },
    { icon: 'flag', label: 'Set Goals', color: colors.success, screen: 'GoalSetting' },
    { icon: 'chatbubble-ellipses', label: '360 Feedback', color: colors.accentPurple, screen: 'Feedback360' },
  ];

  const recentReviews = performanceData.reviews.filter(r => r.status === 'completed').slice(0, 3);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.View style={{ opacity: headerFade }}>
        <Header title="Performance" onBack={() => navigation.goBack()} />
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
        }
      >
        <Animated.View style={[{ opacity: statsSlide.opacity, transform: [{ translateY: statsSlide.offset }] }]}>
          {[
            [
              { icon: 'star', label: 'AVG RATING', value: overview.overallRating, color: colors.warning },
              { icon: 'speedometer', label: 'AVG KPI', value: `${overview.avgKpiScore}%`, color: colors.primary },
            ],
            [
              { icon: 'checkmark-circle', label: 'COMPLETED', value: overview.completedReviews, color: colors.success },
              { icon: 'time', label: 'PENDING', value: overview.pendingReviews, color: colors.warning },
            ],
            [
              { icon: 'trophy', label: 'TOP PERFORMERS', value: overview.topPerformers, color: colors.accentPurple },
              { icon: 'trending-down', label: 'NEED IMPROVEMENT', value: overview.needsImprovement, color: colors.error },
            ],
          ].map((row, rowIdx) => (
            <View key={rowIdx} style={styles.statsRow}>
              {row.map((stat, i) => {
                const scaleIn = useScaleIn(300, 200 + (rowIdx * 2 + i) * 100);
                return (
                  <Animated.View key={stat.label} style={[styles.statCard, { opacity: scaleIn.opacity, transform: [{ scale: scaleIn.scale }] }]}>
                    <View style={styles.statIconRow}>
                      <Ionicons name={stat.icon} size={16} color={stat.color} />
                      <Text style={styles.statLabel}>{stat.label}</Text>
                    </View>
                    <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                  </Animated.View>
                );
              })}
            </View>
          ))}
        </Animated.View>

        <Animated.View style={[{ opacity: actionsSlide.opacity, transform: [{ translateY: actionsSlide.offset }] }]}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            {quickActions.map((action, i) => {
              const slideIn = useSlideIn('up', 300, 600 + i * 100);
              return (
                <Animated.View key={action.label} style={[{ width: '47%', opacity: slideIn.opacity, transform: [{ translateY: slideIn.offset }] }]}>
                  <TouchableOpacity
                    style={styles.actionCard}
                    activeOpacity={0.7}
                    onPress={() => { hapticFeedback('medium'); navigation.navigate(action.screen); }}
                    accessibilityRole="button"
                    accessibilityLabel={`${action.label} - Navigate to ${action.screen}`}
                  >
                    <View style={[styles.actionIcon, { backgroundColor: `${action.color}15` }]}>
                      <Ionicons name={action.icon} size={24} color={action.color} />
                    </View>
                    <Text style={styles.actionLabel}>{action.label}</Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>

        <Animated.View style={[{ opacity: reviewsSlide.opacity, transform: [{ translateY: reviewsSlide.offset }] }]}>
          <Text style={styles.sectionTitle}>Recent Reviews</Text>
          {recentReviews.map((review, i) => {
            const slideIn = useSlideIn('up', 350, 800 + i * 100);
            return (
              <Animated.View key={review.id} style={[{ opacity: slideIn.opacity, transform: [{ translateY: slideIn.offset }] }]}>
                <AnimatedListItem index={i} haptic="medium" style={{ marginBottom: spacing.md }}>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => { hapticFeedback('medium'); navigation.navigate('PerformanceReview'); }}>
                    <Card style={styles.reviewCard} padding="md">
                      <View style={styles.reviewHeader}>
                        <View>
                          <Text style={styles.reviewerName}>{review.reviewer}</Text>
                          <Text style={styles.reviewType}>{review.type}</Text>
                        </View>
                        <View style={styles.reviewRating}>
                          <Ionicons name="star" size={16} color={colors.warning} />
                          <Text style={styles.reviewRatingValue}>{review.rating}</Text>
                        </View>
                      </View>
                      <Text style={styles.reviewSummary}>{review.summary}</Text>
                      <Text style={styles.reviewDate}>{review.date}</Text>
                    </Card>
                  </TouchableOpacity>
                </AnimatedListItem>
              </Animated.View>
            );
          })}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  statCard: { flex: 1, padding: spacing.md, backgroundColor: colors.surface, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border },
  statIconRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xs },
  statLabel: { ...typography.caption, color: colors.textTertiary },
  statValue: { ...typography.h4, color: colors.text },
  sectionTitle: { ...typography.label, color: colors.textTertiary, marginBottom: spacing.md, marginTop: spacing.lg },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  actionCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  actionIcon: { width: 48, height: 48, borderRadius: borderRadius.lg, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm },
  actionLabel: { ...typography.bodySmall, color: colors.text, fontWeight: '600', textAlign: 'center' },
  reviewCard: { marginBottom: spacing.md },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm },
  reviewerName: { ...typography.body, color: colors.text, fontWeight: '600' },
  reviewType: { ...typography.caption, color: colors.textTertiary },
  reviewRating: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  reviewRatingValue: { ...typography.h5, color: colors.warning, fontWeight: '700' },
  reviewSummary: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 20 },
  reviewDate: { ...typography.caption, color: colors.textTertiary, marginTop: spacing.xs },
});
