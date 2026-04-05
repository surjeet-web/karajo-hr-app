import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  useReducedMotion,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

interface AnimatedHeaderProps {
  title: string;
  subtitle?: string;
  scrollY: Animated.SharedValue<number>;
  headerHeight?: number;
  collapsedHeight?: number;
  rightContent?: React.ReactNode;
}

export const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({
  title,
  subtitle,
  scrollY,
  headerHeight = 140,
  collapsedHeight = 60,
  rightContent,
}) => {
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();

  const totalHeight = headerHeight + insets.top;
  const minHeights = collapsedHeight + insets.top;
  const scrollRange = totalHeight - minHeights;

  const containerStyle = useAnimatedStyle(() => {
    const scrollProgress = reduceMotion
      ? 0
      : interpolate(
          scrollY.value,
          [0, scrollRange],
          [0, 1],
          Extrapolation.CLAMP
        );

    const height = reduceMotion
      ? minHeights
      : interpolate(
          scrollY.value,
          [0, scrollRange],
          [totalHeight, minHeights],
          Extrapolation.CLAMP
        );

    return {
      height,
      transform: [
        {
          translateY: reduceMotion
            ? 0
            : interpolate(
                scrollY.value,
                [0, scrollRange],
                [0, -scrollRange * 0.3],
                Extrapolation.CLAMP
              ),
        },
      ],
    };
  });

  const titleStyle = useAnimatedStyle(() => {
    const scrollProgress = reduceMotion
      ? 1
      : interpolate(
          scrollY.value,
          [0, scrollRange],
          [0, 1],
          Extrapolation.CLAMP
        );

    return {
      fontSize: interpolate(
        scrollY.value,
        [0, scrollRange],
        [28, 18],
        Extrapolation.CLAMP
      ),
      fontWeight: '700' as const,
      opacity: interpolate(
        scrollProgress,
        [0, 0.5],
        [1, 1],
        Extrapolation.CLAMP
      ),
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, scrollRange],
            [0, 4],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, scrollRange * 0.5],
      [1, 0],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [0, scrollRange],
          [0, -10],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Animated.Text style={[styles.title, titleStyle]} numberOfLines={1}>
            {title}
          </Animated.Text>
          {subtitle && (
            <Animated.Text style={[styles.subtitle, subtitleStyle]} numberOfLines={1}>
              {subtitle}
            </Animated.Text>
          )}
        </View>
        {rightContent && <View style={styles.rightContent}>{rightContent}</View>}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    overflow: 'hidden',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 12,
    height: '100%',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  rightContent: {
    marginLeft: 12,
  },
});
