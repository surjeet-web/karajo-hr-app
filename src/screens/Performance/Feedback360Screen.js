import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Card, Badge, Avatar } from '../../components';
import { performanceData } from '../../data/mockData';

export const Feedback360Screen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const filters = ['all', 'positive', 'constructive'];
  const filteredFeedback = selectedFilter === 'all' ? performanceData.feedback : performanceData.feedback.filter(f => f.type === selectedFilter);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="360 Feedback" onBack={() => navigation.goBack()} />

      <View style={styles.filterContainer}>
        {filters.map(filter => (
          <TouchableOpacity key={filter} style={[styles.filterChip, selectedFilter === filter && styles.filterChipActive]} onPress={() => setSelectedFilter(filter)}>
            <Ionicons
              name={filter === 'positive' ? 'thumbs-up' : filter === 'constructive' ? 'create' : 'chatbubbles'}
              size={16}
              color={selectedFilter === filter ? colors.textInverse : colors.textSecondary}
            />
            <Text style={[styles.filterText, selectedFilter === filter && styles.filterTextActive]}>
              {filter === 'all' ? 'All' : filter === 'positive' ? 'Positive' : 'Constructive'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card padding="md" style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: colors.success }]}>{performanceData.feedback.filter(f => f.type === 'positive').length}</Text>
              <Text style={styles.summaryLabel}>Positive</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: colors.warning }]}>{performanceData.feedback.filter(f => f.type === 'constructive').length}</Text>
              <Text style={styles.summaryLabel}>Constructive</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: colors.primary }]}>{performanceData.feedback.length}</Text>
              <Text style={styles.summaryLabel}>Total</Text>
            </View>
          </View>
        </Card>

        {filteredFeedback.map(feedback => (
          <Card key={feedback.id} style={styles.feedbackCard} padding="md">
            <View style={styles.feedbackHeader}>
              <View style={styles.feedbackFrom}>
                <Avatar name={feedback.from} size="small" />
                <View>
                  <Text style={styles.feedbackFromName}>{feedback.from}</Text>
                  <Text style={styles.feedbackDate}>{feedback.date}</Text>
                </View>
              </View>
              <Badge
                text={feedback.type === 'positive' ? 'Positive' : 'Constructive'}
                variant={feedback.type === 'positive' ? 'success' : 'warning'}
                size="small"
              />
            </View>

            <View style={styles.feedbackCategory}>
              <Ionicons name="pricetag-outline" size={14} color={colors.textTertiary} />
              <Text style={styles.feedbackCategoryText}>{feedback.category}</Text>
            </View>

            <Text style={styles.feedbackText}>{feedback.text}</Text>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  filterContainer: { flexDirection: 'row', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.sm },
  filterChip: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, backgroundColor: colors.surfaceVariant },
  filterChipActive: { backgroundColor: colors.primary },
  filterText: { ...typography.bodySmall, color: colors.textSecondary },
  filterTextActive: { color: colors.textInverse, fontWeight: '600' },
  scrollContent: { padding: spacing.lg },
  summaryCard: { marginBottom: spacing.lg },
  summaryRow: { flexDirection: 'row', alignItems: 'center' },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryNumber: { ...typography.h3, color: colors.text },
  summaryLabel: { ...typography.caption, color: colors.textTertiary },
  summaryDivider: { width: 1, height: 32, backgroundColor: colors.border },
  feedbackCard: { marginBottom: spacing.md },
  feedbackHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md },
  feedbackFrom: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  feedbackFromName: { ...typography.body, color: colors.text, fontWeight: '600' },
  feedbackDate: { ...typography.caption, color: colors.textTertiary },
  feedbackCategory: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.sm },
  feedbackCategoryText: { ...typography.caption, color: colors.textTertiary },
  feedbackText: { ...typography.body, color: colors.textSecondary, lineHeight: 22 },
});
