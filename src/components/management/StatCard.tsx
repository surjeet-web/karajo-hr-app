import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { usePressAnimation, useFadeIn, useScaleIn } from '../../utils/animations';
import { hapticFeedback } from '../../utils/haptics';

type TrendDirection = 'up' | 'down' | 'stable';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  trend?: TrendDirection;
  trendValue?: string;
  color?: string;
  delay?: number;
  onPress?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, label, value, trend, trendValue, color = colors.primary, delay = 0, onPress }) => {
  const pressAnim = usePressAnimation();
  const scaleIn = useScaleIn(400, delay);

  const handlePress = () => {
    hapticFeedback('light');
    onPress?.();
  };

  const content = (
    <Animated.View style={[styles.card, scaleIn, shadows.sm]}>
      <TouchableOpacity activeOpacity={0.7} onPress={handlePress} onPressIn={pressAnim.onPressIn} onPressOut={pressAnim.onPressOut} style={styles.touchable}>
        <Animated.View style={pressAnim.animatedStyle}>
          <View style={[styles.iconBox, { backgroundColor: `${color}15` }]}>
            <Ionicons name={icon as any} size={22} color={color} />
          </View>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.label}>{label}</Text>
          {trend && (
            <View style={[styles.trend, trend === 'up' ? styles.trendUp : trend === 'down' ? styles.trendDown : null]}>
              <Ionicons name={trend === 'up' ? 'trending-up' : trend === 'down' ? 'trending-down' : 'remove'} size={12} color={trend === 'up' ? colors.success : trend === 'down' ? colors.error : colors.textTertiary} />
              <Text style={[styles.trendText, trend === 'up' ? styles.trendTextUp : trend === 'down' ? styles.trendTextDown : null]}>{trendValue}</Text>
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );

  return content;
};

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, flex: 1 },
  touchable: { borderRadius: borderRadius.lg },
  iconBox: { width: 36, height: 36, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm },
  value: { ...typography.statNumberSmall, color: colors.text },
  label: { ...typography.caption, color: colors.textTertiary, marginTop: spacing.xs },
  trend: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: spacing.xs },
  trendUp: {},
  trendDown: {},
  trendText: { ...typography.caption, fontWeight: '600' },
  trendTextUp: { color: colors.success },
  trendTextDown: { color: colors.error },
});
