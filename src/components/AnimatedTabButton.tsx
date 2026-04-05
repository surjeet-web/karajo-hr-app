import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  useSharedValue,
  useReducedMotion,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';

interface TabButtonProps {
  focused: boolean;
  color: string;
  size: number;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}

export const AnimatedTabButton: React.FC<TabButtonProps> = ({
  focused,
  color,
  size,
  icon,
  label,
  onPress,
}) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const reduceMotion = useReducedMotion();

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  const animatedLabelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scale.value, [0.85, 1], [0.7, 1], Extrapolation.CLAMP),
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (!reduceMotion) {
      scale.value = withSequence(
        withSpring(0.85, { damping: 6, stiffness: 300 }),
        withSpring(1, { damping: 8, stiffness: 300 })
      );
      translateY.value = withSequence(
        withSpring(-4, { damping: 6, stiffness: 300 }),
        withSpring(0, { damping: 8, stiffness: 300 })
      );
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
    >
      <Animated.View style={[animatedIconStyle, styles.iconContainer]}>
        <Ionicons
          name={focused ? icon : (`${icon}-outline` as keyof typeof Ionicons.glyphMap)}
          size={size}
          color={color}
        />
      </Animated.View>
      <Animated.Text
        style={[
          animatedLabelStyle,
          styles.label,
          { color },
        ]}
        numberOfLines={1}
      >
        {label}
      </Animated.Text>
      {focused && <View style={styles.activeIndicator} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  iconContainer: {
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '400',
    marginTop: 2,
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 24,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.primary,
  },
});
