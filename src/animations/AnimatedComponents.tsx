import React from 'react';
import { Animated, TouchableOpacity, StyleSheet, ViewStyle, TextStyle, ReactNode } from 'react-native';
import { useFadeIn, useSlideIn, useScaleIn, hapticFeedback, AnimationDirection } from './hooks';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'primary' | 'default';

export interface AnimatedCardProps {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
  onPress?: () => void;
  delay?: number;
  index?: number;
  haptic?: boolean;
}

export interface AnimatedStatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  color: string;
  delay?: number;
}

export interface AnimatedBadgeProps {
  text: string;
  variant?: BadgeVariant;
  delay?: number;
}

export interface AnimatedListProps {
  children: ReactNode;
  staggerDelay?: number;
}

export interface PulsingIconProps {
  name: ReactNode;
  size?: number;
  color: string;
  delay?: number;
}

export interface AnimatedProgressBarProps {
  progress: number;
  color?: string;
  delay?: number;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({ children, style, onPress, delay = 0, haptic = true }) => {
  const slideIn = useSlideIn('up', 400, delay);

  if (onPress) {
    return (
      <Animated.View style={[{ opacity: slideIn.opacity, transform: [{ translateY: slideIn.offset }] }, style]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            if (haptic) hapticFeedback('light');
            onPress();
          }}
        >
          {children}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[{ opacity: slideIn.opacity, transform: [{ translateY: slideIn.offset }] }, style]}>
      {children}
    </Animated.View>
  );
};

export const AnimatedStatCard: React.FC<AnimatedStatCardProps> = ({ icon, label, value, color, delay = 0 }) => {
  const scaleIn = useScaleIn(400, delay);

  return (
    <Animated.View style={[styles.statCard, { opacity: scaleIn.opacity, transform: [{ scale: scaleIn.scale }] }]}>
      {icon}
      <Animated.Text style={[styles.statValue, { color }]}>{value}</Animated.Text>
      <Animated.Text style={styles.statLabel}>{label}</Animated.Text>
    </Animated.View>
  );
};

export const AnimatedBadge: React.FC<AnimatedBadgeProps> = ({ text, variant = 'default', delay = 0 }) => {
  const scaleIn = useScaleIn(300, delay);
  const colors: Record<BadgeVariant, string> = {
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    primary: '#2563EB',
    default: '#94A3B8',
  };

  return (
    <Animated.View style={[
      styles.badge,
      { backgroundColor: `${colors[variant]}15`, opacity: scaleIn.opacity, transform: [{ scale: scaleIn.scale }] }
    ]}>
      <Animated.Text style={[styles.badgeText, { color: colors[variant] }]}>{text}</Animated.Text>
    </Animated.View>
  );
};

export const AnimatedList: React.FC<AnimatedListProps> = ({ children, staggerDelay = 80 }) => {
  const count = React.Children.count(children);

  return React.Children.map(children, (child, index) => {
    const delay = index * staggerDelay;
    const slideIn = useSlideIn('up', 350, delay);

    return (
      <Animated.View style={{ opacity: slideIn.opacity, transform: [{ translateY: slideIn.offset }] }}>
        {child}
      </Animated.View>
    );
  });
};

export const PulsingIcon: React.FC<PulsingIconProps> = ({ name, size = 24, color, delay = 0 }) => {
  const scale = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const pulse = Animated.sequence([
        Animated.timing(scale, { toValue: 1.2, duration: 200, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]);
      Animated.loop(pulse).start();
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      {name}
    </Animated.View>
  );
};

export const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({ progress, color = '#2563EB', delay = 0 }) => {
  const width = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      Animated.spring(width, {
        toValue: progress,
        tension: 40,
        friction: 8,
        useNativeDriver: false,
      }).start();
    }, delay);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <Animated.View style={{ height: 6, borderRadius: 3, backgroundColor: '#E2E8F0' }}>
      <Animated.View style={{
        height: 6,
        borderRadius: 3,
        backgroundColor: color,
        width: width.interpolate({
          inputRange: [0, 100],
          outputRange: ['0%', '100%'],
        }),
      }} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  statCard: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
