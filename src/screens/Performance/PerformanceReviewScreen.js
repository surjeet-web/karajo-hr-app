import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Card, Badge, Button, StatusTimeline } from '../../components';
import { performanceData } from '../../data/mockData';

export const PerformanceReviewScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);

  const tabs = ['all', 'completed', 'pending'];
  const filteredReviews = activeTab === 'all' ? performanceData.reviews : performanceData.reviews.filter(r => r.status === activeTab);

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
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Ionicons name={star <= rating ? 'star' : 'star-outline'} size={32} color={star <= rating ? colors.warning : colors.border} />
                </TouchableOpacity>
              ))}
            </View>
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
                maxLength={500}
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
                maxLength={500}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button title="Submit Review" onPress={() => { setSelectedReview(null); navigation.navigate('PerformanceDashboard'); }} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Performance Reviews" onBack={() => navigation.goBack()} />

      <View style={styles.tabsContainer}>
        {tabs.map(tab => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.activeTab]} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
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
                <Button title="Write Review" size="small" onPress={() => setSelectedReview(review)} />
              </View>
            )}
          </Card>
        ))}
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
  textAreaContainer: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: borderRadius.lg, padding: spacing.md },
  textArea: { ...typography.body, color: colors.text, minHeight: 100, textAlignVertical: 'top' },
  charCount: { ...typography.caption, color: colors.textTertiary, textAlign: 'right', marginTop: spacing.xs },
  footer: { padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
});
