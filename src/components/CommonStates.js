import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';

export const LoadingScreen = ({ message = 'Loading...' }) => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={colors.primary} />
    <Text style={styles.message}>{message}</Text>
  </View>
);

export const LoadingOverlay = ({ visible }) => {
  if (!visible) return null;
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color={colors.textInverse} />
    </View>
  );
};

export const EmptyState = ({ icon, title, subtitle, actionLabel, onAction }) => (
  <View style={styles.container}>
    {icon}
    <Text style={styles.title}>{title}</Text>
    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    {actionLabel && onAction && (
      <TouchableOpacity style={styles.actionButton} onPress={onAction}>
        <Text style={styles.actionText}>{actionLabel}</Text>
      </TouchableOpacity>
    )}
  </View>
);

export const ErrorState = ({ message, onRetry }) => (
  <View style={styles.container}>
    <Text style={styles.errorIcon}>⚠️</Text>
    <Text style={styles.title}>Something went wrong</Text>
    <Text style={styles.subtitle}>{message || 'An unexpected error occurred'}</Text>
    {onRetry && (
      <TouchableOpacity style={styles.actionButton} onPress={onRetry}>
        <Text style={styles.actionText}>Try Again</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.overlay, justifyContent: 'center', alignItems: 'center', zIndex: 999 },
  message: { ...typography.body, color: colors.textSecondary, marginTop: spacing.md },
  title: { ...typography.h4, color: colors.text, marginTop: spacing.md, textAlign: 'center' },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs, textAlign: 'center' },
  errorIcon: { fontSize: 48, marginBottom: spacing.md },
  actionButton: { marginTop: spacing.xl, backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: borderRadius.lg },
  actionText: { ...typography.button, color: colors.textInverse },
});
