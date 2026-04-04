import { useEffect, useRef } from 'react';
import { Animated, Easing, type ViewStyle } from 'react-native';

type Direction = 'up' | 'down' | 'left' | 'right';

interface AnimationStyle {
  transform: Array<Record<string, Animated.Value | number>>;
  opacity: Animated.Value;
}

interface StaggerAnimationStyle {
  transform: Array<{ translateY: Animated.Value } | { scale: Animated.Value }>;
  opacity: Animated.Value;
}

interface PressAnimationReturn {
  animatedStyle: {
    transform: Array<{ scale: Animated.Value }>;
    opacity: Animated.Value;
  };
  onPressIn: () => void;
  onPressOut: () => void;
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
  }, [opacity, duration, delay]);

  return opacity;
};

export const useSlideIn = (direction: Direction = 'up', distance = 30, duration = 500, delay = 0): AnimationStyle => {
  const translate = useRef(new Animated.Value(direction === 'up' ? distance : direction === 'down' ? -distance : direction === 'left' ? distance : -distance)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translate, {
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
  }, [translate, opacity, duration, delay]);

  return { transform: [{ translateX: direction === 'left' || direction === 'right' ? translate : 0 }, { translateY: direction === 'up' || direction === 'down' ? translate : 0 }], opacity };
};

export const useScaleIn = (duration = 400, delay = 0): AnimationStyle => {
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
  }, [scale, opacity, duration, delay]);

  return { transform: [{ scale }], opacity };
};

export const usePulse = (repeat = true): { transform: Array<{ scale: Animated.Value }> } => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.15, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]).start(() => {
        if (repeat) pulse();
      });
    };
    pulse();
  }, [scale, repeat]);

  return { transform: [{ scale }] };
};

export const useStaggerList = (count: number, baseDelay = 80, direction: Direction = 'up'): StaggerAnimationStyle[] => {
  const animations = useRef(
    Array.from({ length: count }, () => ({
      translate: new Animated.Value(direction === 'up' ? 20 : direction === 'down' ? -20 : 0),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.95),
    }))
  ).current;

  useEffect(() => {
    animations.forEach((anim, i) => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(anim.opacity, { toValue: 1, duration: 300, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.spring(anim.scale, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true }),
          Animated.timing(anim.translate, { toValue: 0, duration: 300, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        ]).start();
      }, i * baseDelay);
    });
  }, [animations, baseDelay]);

  return animations.map(anim => ({
    transform: [{ translateY: anim.translate }, { scale: anim.scale }],
    opacity: anim.opacity,
  }));
};

export const usePressAnimation = (): PressAnimationReturn => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.parallel([
      Animated.timing(scale, { toValue: 0.96, duration: 100, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0.8, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const onPressOut = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, tension: 200, friction: 10, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  return { animatedStyle: { transform: [{ scale }], opacity }, onPressIn, onPressOut };
};
