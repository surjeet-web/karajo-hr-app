import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { aiSuggestions } from '../../data/mockData';

export const AIChatScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Center Content */}
      <View style={styles.centerContent}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>K</Text>
          </View>
          <Text style={styles.brandText}>KarajoAI</Text>
        </View>
        
        <Text style={styles.subtitle}>How can I help you today?</Text>

        {/* Upload Button */}
        <TouchableOpacity style={styles.uploadButton}>
          <Ionicons name="arrow-up" size={24} color={colors.textInverse} />
        </TouchableOpacity>

        <Text style={styles.moreSuggestions}>More Suggestions</Text>

        {/* Suggestion Pills */}
        <View style={styles.suggestionsRow}>
          {aiSuggestions.map((suggestion) => (
            <TouchableOpacity key={suggestion.id} style={styles.suggestionPill}>
              <Ionicons
                name={suggestion.icon === 'shield' ? 'shield' : 'calendar'}
                size={14}
                color={colors.primary}
              />
              <Text style={styles.suggestionText}>{suggestion.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Input Area */}
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => navigation.navigate('AIChatExpanded')}
      >
        <Ionicons name="sparkles" size={20} color={colors.primary} />
        <Text style={styles.inputPlaceholder}>Ask me about work...</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textInverse,
  },
  brandText: {
    ...typography.h4,
    color: colors.text,
  },
  subtitle: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    marginBottom: spacing.xxl,
  },
  uploadButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  moreSuggestions: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    marginBottom: spacing.md,
  },
  suggestionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  suggestionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  suggestionText: {
    ...typography.bodySmall,
    color: colors.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    margin: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputPlaceholder: {
    ...typography.body,
    color: colors.textTertiary,
  },
});
