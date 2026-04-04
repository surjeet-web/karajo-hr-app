import React from 'react';
import { Animated, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { borderRadius, spacing } from '../theme/spacing';
import { hapticFeedback } from '../animations/hooks';

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon = null,
  style = {},
  textStyle = {},
  haptic = true,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const opacityAnim = React.useRef(new Animated.Value(1)).current;

  const getBackgroundColor = () => {
    if (disabled) return colors.border;
    switch (variant) {
      case 'primary': return colors.primary;
      case 'secondary': return colors.surface;
      case 'outline': return colors.surface;
      case 'ghost': return 'transparent';
      case 'danger': return colors.error;
      default: return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.textTertiary;
    switch (variant) {
      case 'primary': return colors.textInverse;
      case 'secondary': return colors.text;
      case 'outline': return colors.primary;
      case 'ghost': return colors.primary;
      case 'danger': return colors.textInverse;
      default: return colors.textInverse;
    }
  };

  const getBorderColor = () => {
    if (disabled) return colors.border;
    switch (variant) {
      case 'outline': return colors.primary;
      default: return 'transparent';
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'small': return { paddingVertical: spacing.sm, paddingHorizontal: spacing.md };
      case 'medium': return { paddingVertical: spacing.md, paddingHorizontal: spacing.lg };
      case 'large': return { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl };
      default: return { paddingVertical: spacing.md, paddingHorizontal: spacing.lg };
    }
  };

  const handlePressIn = () => {
    if (haptic) hapticFeedback('light');
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 0.96, tension: 200, friction: 8, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 0.85, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 200, friction: 8, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handlePress = () => {
    if (onPress) onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: opacityAnim }}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={1}
        style={[
          styles.button,
          {
            backgroundColor: getBackgroundColor(),
            borderColor: getBorderColor(),
            borderWidth: variant === 'outline' ? 1.5 : 0,
            ...getPadding(),
          },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={getTextColor()} size="small" />
        ) : (
          <>
            {icon}
            <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
              {title}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  text: {
    ...typography.button,
  },
});
