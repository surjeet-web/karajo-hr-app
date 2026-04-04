import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';

export const FilterBar = ({ title, subtitle, style }) => (
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
