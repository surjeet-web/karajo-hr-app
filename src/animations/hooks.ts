import { Animated, Easing } from 'react-native';
import { useEffect, useRef } from 'react';

export type AnimationDirection = 'up' | 'down' | 'left' | 'right';
export type HapticFeedbackType = 'light' | 'medium' | 'heavy';
export type SpringConfig = Omit<Partial<Animated.SpringAnimationConfig>, 'toValue'>;

interface StaggeredAnimation {
  opacity: Animated.Value;
  translateY: Animated.Value;
}

interface SpringValueResult {
  value: Animated.Value;
  animate: (toValue: number | Animated.Value, config?: SpringConfig) => void;
}

export const useFadeIn = (duration = 400, delay = 0): Animated.Value => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  return opacity;
};

export const useSlideIn = (
  direction: AnimationDirection = 'up',
  duration = 400,
  delay = 0,
): { offset: Animated.Value; opacity: Animated.Value } => {
  const offset = useRef(
    new Animated.Value(
      direction === 'up' ? 30 : direction === 'down' ? -30 : direction === 'left' ? 30 : -30,
    ),
  ).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(offset, {
          toValue: 0,
          duration,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  return { offset, opacity };
};

export const useScaleIn = (
  duration = 300,
  delay = 0,
): { scale: Animated.Value; opacity: Animated.Value } => {
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  return { scale, opacity };
};

export const useStaggeredList = (count: number, staggerDelay = 80): StaggeredAnimation[] => {
  const animations = useRef<StaggeredAnimation[]>(
    Array.from({ length: count }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(20),
    })),
  ).current;

  useEffect(() => {
    animations.forEach((anim, index) => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim.translateY, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start();
      }, index * staggerDelay);
    });
  }, [count]);

  return animations;
};

export const useSpringValue = (initialValue = 0): SpringValueResult => {
  const value = useRef(new Animated.Value(initialValue)).current;

  const animate = (toValue: number | Animated.Value, config: SpringConfig = {}): void => {
    Animated.spring(value, {
      toValue,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
      ...config,
    }).start();
  };

  return { value, animate };
};

export const useCounterAnimation = (targetValue: number, duration = 1000): Animated.Value => {
  const value = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(value, {
      toValue: targetValue,
      duration,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [targetValue]);

  return value;
};

export const hapticFeedback = (type: HapticFeedbackType = 'light'): void => {
  // Haptic feedback - only works on native platforms with expo-haptics installed
  // Silently no-ops on web
};
