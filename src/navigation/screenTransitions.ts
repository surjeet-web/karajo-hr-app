import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Platform } from 'react-native';

export const screenTransition: NativeStackNavigationOptions = {
  animation: Platform.OS === 'ios' ? 'slide_from_right' : 'slide_from_right',
  animationDuration: 250,
  gestureEnabled: true,
  gestureDirection: 'horizontal',
};

export const modalTransition: NativeStackNavigationOptions = {
  presentation: 'modal',
  animation: 'slide_from_bottom',
  animationDuration: 300,
  gestureEnabled: true,
  gestureDirection: 'vertical',
};

export const fadeTransition: NativeStackNavigationOptions = {
  animation: 'fade',
  animationDuration: 200,
  gestureEnabled: false,
};

export const defaultStackOptions: NativeStackNavigationOptions = {
  headerShown: false,
  ...screenTransition,
};

export const modalStackOptions: NativeStackNavigationOptions = {
  ...modalTransition,
};
