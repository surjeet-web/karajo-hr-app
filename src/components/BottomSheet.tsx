import React, { useCallback, useEffect } from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  useReducedMotion,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapPoints?: number[];
  initialSnapIndex?: number;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  children,
  snapPoints = [0.5, 0.9],
  initialSnapIndex = 0,
}) => {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);
  const reduceMotion = useReducedMotion();
  const currentSnapIndex = useSharedValue(initialSnapIndex);

  const getSnapY = useCallback(
    (index: number) => {
      'worklet';
      const snapPoint = snapPoints[index] || snapPoints[0];
      return SCREEN_HEIGHT * (1 - snapPoint);
    },
    [snapPoints]
  );

  const open = useCallback(() => {
    const targetY = getSnapY(currentSnapIndex.value);
    if (reduceMotion) {
      translateY.value = targetY;
      backdropOpacity.value = 0.5;
    } else {
      translateY.value = withSpring(targetY, {
        damping: 20,
        stiffness: 200,
        mass: 0.8,
      });
      backdropOpacity.value = withTiming(0.5, { duration: 280 });
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [reduceMotion, translateY, backdropOpacity, getSnapY, currentSnapIndex]);

  const close = useCallback(() => {
    if (reduceMotion) {
      translateY.value = SCREEN_HEIGHT;
      backdropOpacity.value = 0;
      runOnJS(onClose)();
    } else {
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: 280 }, () => {
        runOnJS(onClose)();
      });
      backdropOpacity.value = withTiming(0, { duration: 280 });
    }
  }, [reduceMotion, translateY, backdropOpacity, onClose]);

  useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => open());
    } else {
      close();
    }
  }, [visible, open, close]);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      const newY = Math.max(0, getSnapY(currentSnapIndex.value) + e.translationY);
      translateY.value = newY;
    })
    .onEnd((e) => {
      if (e.translationY > 120 || e.velocityY > 800) {
        translateY.value = withTiming(SCREEN_HEIGHT, { duration: 280 }, () => {
          runOnJS(onClose)();
        });
        backdropOpacity.value = withTiming(0, { duration: 280 });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else {
        translateY.value = withSpring(getSnapY(currentSnapIndex.value), {
          damping: 20,
          stiffness: 200,
        });
      }
    });

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={close}>
          <Animated.View style={[styles.backdrop, backdropStyle]} />
        </TouchableWithoutFeedback>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.sheet, sheetStyle]}>
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>
            {children}
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: SCREEN_HEIGHT * 0.4,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
});
