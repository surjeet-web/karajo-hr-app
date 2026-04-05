import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';

interface FilterBarProps {
  title?: string;
  subtitle?: string;
  style?: ViewStyle;
}

export const FilterBar: React.FC<FilterBarProps> = ({ title, subtitle, style }) => (
  <View style={[styles.bar, style]}>
    {title && <Text style={styles.title}>{title}</Text>}
    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
  </View>
);

const styles = StyleSheet.create({
  bar: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, ...shadows.sm, marginBottom: spacing.md },
  title: { ...typography.h5, color: colors.text },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
});
