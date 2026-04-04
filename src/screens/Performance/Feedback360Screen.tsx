import React, { useState, useCallback } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, RefreshControl, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Card, Badge, Avatar, Button, AnimatedListItem } from '../../components';
import { performanceData } from '../../data/mockData';
import { submitFeedback } from '../../store';
import { hapticFeedback } from '../../utils/haptics';
import { useFadeIn, useSlideIn } from '../../utils/animations';

export const Feedback360Screen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [feedbackType, setFeedbackType] = useState<string>('positive');
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [feedbackCategory, setFeedbackCategory] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const filters = ['all', 'positive', 'constructive'];
  const filteredFeedback = selectedFilter === 'all' ? performanceData.feedback : performanceData.feedback.filter(f => f.type === selectedFilter);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setRefreshing(false);
  }, []);

  const positiveCount = performanceData.feedback.filter(f => f.type === 'positive').length;
  const constructiveCount = performanceData.feedback.filter(f => f.type === 'constructive').length;
  const totalCount = performanceData.feedback.length;

  const handleSubmitFeedback = (): void => {
    if (!feedbackText.trim()) {
      Alert.alert('Missing Feedback', 'Please write your feedback before submitting.');
      return;
    }
    if (!feedbackCategory.trim()) {
      Alert.alert('Missing Category', 'Please enter a category for your feedback.');
      return;
    }

    submitFeedback({
      from: 'Sarah Miller',
      to: 'Team Member',
      type: feedbackType,
      text: feedbackText.trim(),
      category: feedbackCategory.trim(),
    });

    setFeedbackText('');
    setFeedbackCategory('');
    setFeedbackType('positive');
    setShowForm(false);
    Alert.alert('Feedback Submitted', 'Your 360 feedback has been submitted successfully.');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="360 Feedback" onBack={() => navigation.goBack()} />

      <View style={styles.filterContainer}>
        {filters.map(filter => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterChip, selectedFilter === filter && styles.filterChipActive]}
            onPress={() => { hapticFeedback('light'); setSelectedFilter(filter); }}
            accessibilityRole="button"
            accessibilityLabel={`Show ${filter} feedback`}
            accessibilityState={{ selected: selectedFilter === filter }}
          >
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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
        }
      >
        <Card padding="md" style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: colors.success }]}>{positiveCount}</Text>
              <Text style={styles.summaryLabel}>Positive</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: colors.warning }]}>{constructiveCount}</Text>
              <Text style={styles.summaryLabel}>Constructive</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: colors.primary }]}>{totalCount}</Text>
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
        {filteredFeedback.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={48} color={colors.textTertiary} />
            <Text style={styles.emptyText}>No {selectedFilter === 'all' ? '' : selectedFilter} feedback found</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Submit Feedback" icon={<Ionicons name="paper-plane" size={18} color={colors.textInverse} />} onPress={() => { hapticFeedback('medium'); setShowForm(true); }} />
      </View>

      <Modal visible={showForm} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Submit Feedback</Text>
              <TouchableOpacity onPress={() => setShowForm(false)} accessibilityRole="button" accessibilityLabel="Close">
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Feedback Type</Text>
              <View style={styles.typeRow}>
                <TouchableOpacity
                  style={[styles.typeChip, feedbackType === 'positive' && styles.typeChipPositive]}
                  onPress={() => setFeedbackType('positive')}
                  accessibilityRole="button"
                  accessibilityLabel="Positive feedback"
                  accessibilityState={{ selected: feedbackType === 'positive' }}
                >
                  <Ionicons name="thumbs-up" size={16} color={feedbackType === 'positive' ? colors.textInverse : colors.success} />
                  <Text style={[styles.typeChipText, feedbackType === 'positive' && styles.typeChipTextActive]}>Positive</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.typeChip, feedbackType === 'constructive' && styles.typeChipConstructive]}
                  onPress={() => setFeedbackType('constructive')}
                  accessibilityRole="button"
                  accessibilityLabel="Constructive feedback"
                  accessibilityState={{ selected: feedbackType === 'constructive' }}
                >
                  <Ionicons name="create" size={16} color={feedbackType === 'constructive' ? colors.textInverse : colors.warning} />
                  <Text style={[styles.typeChipText, feedbackType === 'constructive' && styles.typeChipTextActive]}>Constructive</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Category</Text>
              <View style={styles.formInputContainer}>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g. Technical Excellence, Communication..."
                  placeholderTextColor={colors.textTertiary}
                  value={feedbackCategory}
                  onChangeText={setFeedbackCategory}
                  accessibilityLabel="Feedback category"
                />
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Feedback</Text>
              <View style={styles.textAreaContainer}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Write your feedback..."
                  placeholderTextColor={colors.textTertiary}
                  multiline
                  numberOfLines={6}
                  value={feedbackText}
                  onChangeText={setFeedbackText}
                  maxLength={1000}
                  accessibilityLabel="Feedback text area"
                />
                <Text style={styles.charCount}>{feedbackText.length}/1000</Text>
              </View>
            </View>

            <Button title="Submit Feedback" onPress={handleSubmitFeedback} />
          </View>
        </View>
      </Modal>
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
  footer: { padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xl },
  emptyText: { ...typography.body, color: colors.textTertiary, marginTop: spacing.sm },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: borderRadius.xl, borderTopRightRadius: borderRadius.xl, padding: spacing.lg, paddingBottom: spacing.xl },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  modalTitle: { ...typography.h5, color: colors.text, fontWeight: '700' },
  formField: { marginBottom: spacing.lg },
  formLabel: { ...typography.label, color: colors.text, marginBottom: spacing.sm },
  typeRow: { flexDirection: 'row', gap: spacing.sm },
  typeChip: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, paddingVertical: spacing.sm, borderRadius: borderRadius.md, backgroundColor: colors.background, borderWidth: 1.5, borderColor: colors.border },
  typeChipPositive: { backgroundColor: colors.success, borderColor: colors.success },
  typeChipConstructive: { backgroundColor: colors.warning, borderColor: colors.warning },
  typeChipText: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: '600' },
  typeChipTextActive: { color: colors.textInverse },
  formInputContainer: { backgroundColor: colors.background, borderRadius: borderRadius.lg, borderWidth: 1.5, borderColor: colors.border, padding: spacing.md },
  formInput: { ...typography.body, color: colors.text },
  textAreaContainer: { backgroundColor: colors.background, borderRadius: borderRadius.lg, borderWidth: 1.5, borderColor: colors.border, padding: spacing.md },
  textArea: { ...typography.body, color: colors.text, minHeight: 120, textAlignVertical: 'top' },
  charCount: { ...typography.caption, color: colors.textTertiary, textAlign: 'right', marginTop: spacing.xs },
});
