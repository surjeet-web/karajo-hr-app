import React from 'react';
import { Animated, TouchableOpacity, StyleSheet, View } from 'react-native';
import { usePressAnimation, useFadeIn, useScaleIn, useSlideIn, usePulse } from '../utils/animations';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { hapticFeedback } from '../utils/haptics';

export const AnimatedCard = ({
  children,
  style,
  onPress,
  delay = 0,
  haptic = 'light',
  activeOpacity = 0.7,
  animation = 'fade',
  ...rest
}) => {
  const pressAnim = usePressAnimation();
  const fadeIn = useFadeIn(400, delay);
  const scaleIn = useScaleIn(400, delay);

  const animatedStyle = animation === 'scale' ? scaleIn : { opacity: fadeIn };

  const handlePress = () => {
    if (haptic) hapticFeedback(haptic);
    onPress?.();
  };

  if (onPress) {
    return (
      <Animated.View style={[styles.card, animatedStyle, style]}>
        <TouchableOpacity
          activeOpacity={activeOpacity}
          onPress={handlePress}
          onPressIn={pressAnim.onPressIn}
          onPressOut={pressAnim.onPressOut}
          style={styles.touchable}
          {...rest}
        >
          {children}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.card, animatedStyle, style]} {...rest}>
      {children}
    </Animated.View>
  );
};

export const AnimatedListItem = ({ children, index = 0, delay = 60, onPress, style, haptic = 'light', ...rest }) => {
  const pressAnim = usePressAnimation();
  const slideIn = useSlideIn('up', 20, 350, index * delay);

  const handlePress = () => {
    if (haptic) hapticFeedback(haptic);
    onPress?.();
  };

  if (onPress) {
    return (
      <Animated.View style={[styles.listItem, slideIn, style]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handlePress}
          onPressIn={pressAnim.onPressIn}
          onPressOut={pressAnim.onPressOut}
          style={styles.touchable}
          {...rest}
        >
          {children}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.listItem, slideIn, style]} {...rest}>
      {children}
    </Animated.View>
  );
};

export const AnimatedButton = ({ children, onPress, style, haptic = 'medium', disabled, ...rest }) => {
  const pressAnim = usePressAnimation();

  const handlePress = () => {
    if (disabled) return;
    hapticFeedback(haptic);
    onPress?.();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      onPressIn={pressAnim.onPressIn}
      onPressOut={pressAnim.onPressOut}
      disabled={disabled}
      style={[styles.button, style, disabled && styles.disabled]}
      {...rest}
    >
      <Animated.View style={pressAnim.animatedStyle}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

export const PulsingIcon = ({ children, style }) => {
  const pulse = usePulse();
  return <Animated.View style={[pulse, style]}>{children}</Animated.View>;
};

export const AnimatedProgressBar = ({ progress, style, color = '#2563EB', height = 6, backgroundColor = '#E5E7EB' }) => {
  const width = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(width, {
      toValue: progress,
      duration: 800,
      easing: (t) => t * (2 - t),
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const animatedWidth = width.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.progressTrack, { height, backgroundColor }, style]}>
      <Animated.View style={[styles.progressFill, { width: animatedWidth, backgroundColor: color, height }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: borderRadius.lg, ...shadows.sm },
  listItem: { borderRadius: borderRadius.md },
  touchable: { borderRadius: borderRadius.lg },
  button: { borderRadius: borderRadius.lg },
  disabled: { opacity: 0.5 },
  progressTrack: { borderRadius: borderRadius.full, overflow: 'hidden' },
  progressFill: { borderRadius: borderRadius.full },
});
