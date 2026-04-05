import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { borderRadius, spacing } from '../theme/spacing';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'primary' | 'default';
type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
  text: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: object;
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'default',
  size = 'medium',
  style = {},
}) => {
  const getColors = (): { bg: string; text: string } => {
    switch (variant) {
      case 'success':
        return { bg: colors.successLight, text: colors.success };
      case 'warning':
        return { bg: colors.warningLight, text: colors.warning };
      case 'error':
        return { bg: colors.errorLight, text: colors.error };
      case 'info':
        return { bg: colors.infoLight, text: colors.info };
      case 'primary':
        return { bg: colors.primaryLighter, text: colors.primary };
      case 'default':
      default:
        return { bg: colors.surfaceVariant, text: colors.textSecondary };
    }
  };

  const getPadding = (): { paddingHorizontal: number; paddingVertical: number } => {
    switch (size) {
      case 'small': return { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs };
      case 'medium': return { paddingHorizontal: spacing.md, paddingVertical: spacing.xs };
      case 'large': return { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm };
      default: return { paddingHorizontal: spacing.md, paddingVertical: spacing.xs };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small': return typography.caption;
      case 'medium': return typography.bodySmall;
      case 'large': return typography.body;
      default: return typography.bodySmall;
    }
  };

  const colors_ = getColors();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors_.bg,
          ...getPadding(),
        },
        style,
      ]}
    >
      {variant !== 'default' && (
        <View style={[styles.dot, { backgroundColor: colors_.text }]} />
      )}
      <Text style={[styles.text, getFontSize(), { color: colors_.text }]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontWeight: '500',
  },
});
