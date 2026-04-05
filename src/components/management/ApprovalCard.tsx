import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { usePressAnimation, useFadeIn, useScaleIn } from '../../utils/animations';
import { hapticFeedback } from '../../utils/haptics';

type ApprovalType = 'leave' | 'permission' | 'overtime' | 'expense' | 'correction';
type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'escalated';
type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';

interface ApprovalRequest {
  type?: ApprovalType;
  requesterName?: string;
  date?: string;
  amount?: number;
  days?: number;
  status?: ApprovalStatus;
}

interface ApprovalCardProps {
  request: ApprovalRequest;
  onPress?: (request: ApprovalRequest) => void;
  delay?: number;
  haptic?: HapticType;
}

export const ApprovalCard: React.FC<ApprovalCardProps> = ({ request, onPress, delay = 0, haptic = 'medium' }) => {
  const pressAnim = usePressAnimation();
  const fadeIn = useFadeIn(400, delay);

  const typeConfig: Record<ApprovalType, { icon: string; color: string; label: string }> = {
    leave: { icon: 'umbrella', color: colors.warning, label: 'Leave' },
    permission: { icon: 'time', color: colors.info, label: 'Permission' },
    overtime: { icon: 'flash', color: colors.accentPurple, label: 'Overtime' },
    expense: { icon: 'receipt', color: colors.success, label: 'Expense' },
    correction: { icon: 'create', color: colors.error, label: 'Correction' },
  };

  const config = typeConfig[request?.type as ApprovalType] || typeConfig.leave;
  const statusColors: Record<ApprovalStatus, string> = { pending: colors.warning, approved: colors.success, rejected: colors.error, escalated: colors.accentPurple };

  const handlePress = () => {
    hapticFeedback(haptic);
    onPress?.(request);
  };

  return (
    <Animated.View style={[styles.card, fadeIn, shadows.sm]}>
      <TouchableOpacity activeOpacity={0.7} onPress={handlePress} onPressIn={pressAnim.onPressIn} onPressOut={pressAnim.onPressOut} style={styles.touchable}>
        <Animated.View style={pressAnim.animatedStyle}>
          <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: `${config.color}15` }]}>
              <Ionicons name={config.icon as any} size={20} color={config.color} />
            </View>
            <View style={styles.content}>
              <Text style={styles.name}>{request?.requesterName || 'Unknown'}</Text>
              <Text style={styles.type}>{config.label} • {request?.date || 'Today'}</Text>
              {request?.amount && <Text style={styles.amount}>${request.amount}</Text>}
              {request?.days && <Text style={styles.days}>{request.days} day(s)</Text>}
            </View>
            <View style={[styles.statusDot, { backgroundColor: statusColors[request?.status as ApprovalStatus] || colors.textTertiary }]} />
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, marginBottom: spacing.sm },
  touchable: { borderRadius: borderRadius.lg },
  row: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.md },
  iconBox: { width: 40, height: 40, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1 },
  name: { ...typography.body, color: colors.text, fontWeight: '600' },
  type: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  amount: { ...typography.bodySmall, color: colors.success, fontWeight: '600', marginTop: 2 },
  days: { ...typography.bodySmall, color: colors.warning, fontWeight: '600', marginTop: 2 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
});
