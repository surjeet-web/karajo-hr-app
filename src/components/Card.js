import React from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { borderRadius, shadows, spacing } from '../theme/spacing';

export const Card = ({
  children,
  style = {},
  onPress = null,
  variant = 'default',
  padding = 'md',
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const shadowAnim = React.useRef(new Animated.Value(0)).current;

  const getPadding = () => {
    switch (padding) {
      case 'none': return 0;
      case 'sm': return spacing.sm;
      case 'md': return spacing.md;
      case 'lg': return spacing.lg;
      case 'xl': return spacing.xl;
      default: return spacing.md;
    }
  };

  const getBackgroundColor = () => {
    switch (variant) {
      case 'default': return colors.surface;
      case 'primary': return colors.primary;
      case 'secondary': return colors.surfaceVariant;
      default: return colors.surface;
    }
  };

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 0.98, tension: 200, friction: 10, useNativeDriver: true }),
      Animated.timing(shadowAnim, { toValue: 1, duration: 150, useNativeDriver: false }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 200, friction: 10, useNativeDriver: true }),
      Animated.timing(shadowAnim, { toValue: 0, duration: 150, useNativeDriver: false }),
    ]).start();
  };

  const content = (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: getBackgroundColor(),
          padding: getPadding(),
          transform: [{ scale: scaleAnim }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
});
