import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { aiCategories, aiQuickActions } from '../../data/mockData';
import { AnimatedListItem } from '../../components';
import { hapticFeedback } from '../../utils/haptics';
import { useFadeIn, useSlideIn } from '../../utils/animations';

const categoryActionMap = {
  'my-hr': ['remaining leave', 'last payslip', 'holiday calendar', '2026 tax docs'],
  'policies': ['remote policy', 'insurance details'],
  'benefits': ['insurance details', '2026 tax docs'],
  'career': ['remote policy', 'last payslip'],
};

export const AIChatExpandedScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState('my-hr');
  const [inputText, setInputText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const categoryScrollRef = useRef(null);

  const filteredActions = aiQuickActions.filter((action) => {
    const keywords = categoryActionMap[activeCategory] || [];
    return keywords.some((keyword) =>
      action.title.toLowerCase().includes(keyword) ||
      action.subtitle.toLowerCase().includes(keyword)
    );
  });

  const displayActions = filteredActions.length > 0 ? filteredActions : aiQuickActions;

  const getIconName = (icon) => {
    const iconMap = {
      'calendar-check': 'calendar',
      'file-text': 'document-text',
      monitor: 'desktop',
      shield: 'shield-checkmark',
      calendar: 'calendar',
      file: 'document',
    };
    return iconMap[icon] || 'apps';
  };

  const handleActionPress = (action) => {
    navigation.navigate('AIChatConversation', {
      initialQuery: `${action.title} - ${action.subtitle}`,
      actionContext: action,
    });
  };

  const handleSend = () => {
    if (inputText.trim().length > 0) {
      navigation.navigate('AIChatConversation', { initialQuery: inputText.trim() });
      setInputText('');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>K</Text>
          </View>
          <Text style={styles.brandText}>KarajoAI</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Center Content */}
      <View style={styles.centerContent}>
        <Text style={styles.subtitle}>How can I help you today?</Text>
      </View>

      {/* Category Tabs */}
      <ScrollView
        ref={categoryScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
        {aiCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.tab,
              activeCategory === category.id && styles.activeTab,
            ]}
            onPress={() => setActiveCategory(category.id)}
            accessibilityLabel={`Filter by ${category.name}`}
            accessibilityRole="button"
            accessibilityState={{ selected: activeCategory === category.id }}
          >
            <Text
              style={[
                styles.tabText,
                activeCategory === category.id && styles.activeTabText,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Quick Actions Grid */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.actionsContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.actionsGrid}>
          {displayActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={() => handleActionPress(action)}
              accessibilityLabel={`${action.title}: ${action.subtitle}`}
              accessibilityRole="button"
            >
              <Ionicons
                name={getIconName(action.icon)}
                size={24}
                color={colors.primary}
              />
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={styles.inputContainer}>
          <Ionicons name="sparkles" size={20} color={colors.primary} />
          <TextInput
            style={styles.input}
            placeholder="Ask me about work..."
            placeholderTextColor={colors.textTertiary}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            accessibilityLabel="Type your message"
          />
          {inputText.trim().length > 0 ? (
            <TouchableOpacity
              onPress={handleSend}
              accessibilityLabel="Send message"
              accessibilityRole="button"
            >
              <Ionicons name="send" size={20} color={colors.primary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate('AIChatConversation')}
              accessibilityLabel="Open chat conversation"
              accessibilityRole="button"
            >
              <Ionicons name="chatbubble-ellipses" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textInverse,
  },
  brandText: {
    ...typography.h5,
    color: colors.text,
  },
  placeholder: {
    width: 24,
  },
  centerContent: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  subtitle: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
  },
  tabsContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  tab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeTab: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.textInverse,
    fontWeight: '600',
  },
  actionsContainer: {
    padding: spacing.lg,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginTop: spacing.md,
  },
  actionSubtitle: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    margin: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: spacing.xs,
  },
});
