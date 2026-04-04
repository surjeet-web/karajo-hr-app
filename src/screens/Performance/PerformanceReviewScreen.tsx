import React, { useState, useCallback } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, RefreshControl, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Card, Badge, Button, StatusTimeline, AnimatedListItem } from '../../components';
import { performanceData } from '../../data/mockData';
import { submitReview } from '../../store';
import { hapticFeedback } from '../../utils/haptics';
import { useFadeIn, useSlideIn } from '../../utils/animations';

export const PerformanceReviewScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [reviewText, setReviewText] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [strengths, setStrengths] = useState<string>('');
  const [improvements, setImprovements] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setRefreshing(false);
  }, []);

  const tabs = ['all', 'completed', 'pending'];
  const filteredReviews = activeTab === 'all' ? performanceData.reviews : performanceData.reviews.filter(r => r.status === activeTab);

  const handleStarPress = (star) => {
    hapticFeedback('light');
    setRating(star);
  };

  const handleSubmitReview = (): void => {
    if (rating === 0) {
      Alert.alert('Missing Rating', 'Please select a rating before submitting.');
      return;
    }
    if (!reviewText.trim()) {
      Alert.alert('Missing Comments', 'Please write your review comments before submitting.');
      return;
    }

    submitReview({
      reviewer: selectedReview?.reviewer || 'Self Review',
      type: selectedReview?.type || 'Self Review',
      rating,
      summary: reviewText,
      strengths: strengths.trim(),
      improvements: improvements.trim(),
    });

    setRating(0);
    setReviewText('');
    setStrengths('');
    setImprovements('');
    setSelectedReview(null);
    Alert.alert('Review Submitted', 'Your performance review has been submitted successfully.');
    navigation.navigate('PerformanceDashboard');
  };

  if (selectedReview) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Header title="Write Review" onBack={() => setSelectedReview(null)} />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Card padding="lg">
            <View style={styles.revieweeHeader}>
              <Text style={styles.revieweeName}>{selectedReview.reviewer}</Text>
              <Text style={styles.revieweeType}>{selectedReview.type}</Text>
            </View>
          </Card>

          <View style={styles.field}>
            <Text style={styles.label}>Rating</Text>
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map(star => (
                <TouchableOpacity
                  key={star}
                  onPress={() => handleStarPress(star)}
                  accessibilityRole="button"
                  accessibilityLabel={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  accessibilityState={{ selected: star <= rating }}
                >
                  <Ionicons name={star <= rating ? 'star' : 'star-outline'} size={32} color={star <= rating ? colors.warning : colors.border} />
                </TouchableOpacity>
              ))}
            </View>
            {rating > 0 && (
              <Text style={styles.ratingLabel}>{rating} of 5 stars</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Review Comments</Text>
            <View style={styles.textAreaContainer}>
              <TextInput
                style={styles.textArea}
                placeholder="Write your performance review comments..."
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={8}
                value={reviewText}
                onChangeText={setReviewText}
                maxLength={1000}
                accessibilityLabel="Review comments text area"
              />
              <Text style={styles.charCount}>{reviewText.length}/1000</Text>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Strengths</Text>
            <View style={styles.textAreaContainer}>
              <TextInput
                style={styles.textArea}
                placeholder="List key strengths observed..."
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={3}
                value={strengths}
                onChangeText={setStrengths}
                maxLength={500}
                accessibilityLabel="Strengths text area"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Areas for Improvement</Text>
            <View style={styles.textAreaContainer}>
              <TextInput
                style={styles.textArea}
                placeholder="List areas that need improvement..."
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={3}
                value={improvements}
                onChangeText={setImprovements}
                maxLength={500}
                accessibilityLabel="Areas for improvement text area"
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button title="Submit Review" onPress={handleSubmitReview} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Performance Reviews" onBack={() => navigation.goBack()} />

      <View style={styles.tabsContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => { hapticFeedback('light'); setActiveTab(tab); }}
            accessibilityRole="button"
            accessibilityLabel={`Show ${tab} reviews`}
            accessibilityState={{ selected: activeTab === tab }}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
        }
      >
        {filteredReviews.map(review => (
          <Card key={review.id} style={styles.reviewCard} padding="md">
            <View style={styles.reviewHeader}>
              <View>
                <Text style={styles.reviewerName}>{review.reviewer}</Text>
                <Text style={styles.reviewType}>{review.type}</Text>
              </View>
              {review.status === 'completed' ? (
                <View style={styles.reviewRating}>
                  <Ionicons name="star" size={16} color={colors.warning} />
                  <Text style={styles.reviewRatingValue}>{review.rating}</Text>
                </View>
              ) : (
                <Badge text="Pending" variant="warning" size="small" />
              )}
            </View>
            {review.summary && <Text style={styles.reviewSummary}>{review.summary}</Text>}
            <Text style={styles.reviewDate}>{review.date}</Text>
            {review.status === 'pending' && (
              <View style={styles.reviewActions}>
                <Button title="Write Review" size="small" onPress={() => { hapticFeedback('medium'); setSelectedReview(review); }} />
              </View>
            )}
          </Card>
        ))}
        {filteredReviews.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color={colors.textTertiary} />
            <Text style={styles.emptyText}>No {activeTab === 'all' ? '' : activeTab} reviews found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  tabsContainer: { flexDirection: 'row', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.lg },
  tab: { paddingVertical: spacing.xs },
  activeTab: { borderBottomWidth: 2, borderBottomColor: colors.primary },
  tabText: { ...typography.body, color: colors.textSecondary },
  activeTabText: { color: colors.primary, fontWeight: '600' },
  scrollContent: { padding: spacing.lg },
  reviewCard: { marginBottom: spacing.md },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm },
  reviewerName: { ...typography.body, color: colors.text, fontWeight: '600' },
  reviewType: { ...typography.caption, color: colors.textTertiary },
  reviewRating: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  reviewRatingValue: { ...typography.h5, color: colors.warning, fontWeight: '700' },
  reviewSummary: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 20, marginBottom: spacing.sm },
  reviewDate: { ...typography.caption, color: colors.textTertiary },
  reviewActions: { marginTop: spacing.md },
  revieweeHeader: { marginBottom: spacing.sm },
  revieweeName: { ...typography.h5, color: colors.text },
  revieweeType: { ...typography.bodySmall, color: colors.textSecondary },
  field: { marginBottom: spacing.lg },
  label: { ...typography.label, color: colors.text, marginBottom: spacing.sm },
  ratingRow: { flexDirection: 'row', gap: spacing.sm },
  ratingLabel: { ...typography.bodySmall, color: colors.warning, fontWeight: '600', marginTop: spacing.xs },
  textAreaContainer: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: borderRadius.lg, padding: spacing.md },
  textArea: { ...typography.body, color: colors.text, minHeight: 100, textAlignVertical: 'top' },
  charCount: { ...typography.caption, color: colors.textTertiary, textAlign: 'right', marginTop: spacing.xs },
  footer: { padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xl },
  emptyText: { ...typography.body, color: colors.textTertiary, marginTop: spacing.sm },
});
