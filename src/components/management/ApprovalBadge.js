import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { hapticFeedback } from '../../utils/haptics';

export const ApprovalBadge = ({ status = 'pending', size = 'medium' }) => {
  const config = {
    pending: { text: 'Pending', bg: colors.warningLight, color: colors.warning },
    approved: { text: 'Approved', bg: colors.successLight, color: colors.success },
    rejected: { text: 'Rejected', bg: colors.errorLight, color: colors.error },
    escalated: { text: 'Escalated', bg: `${colors.accentPurple}15`, color: colors.accentPurple },
    completed: { text: 'Completed', bg: colors.successLight, color: colors.success },
  };

  const c = config[status] || config.pending;
  const sizes = { small: { px: 6, py: 3, fs: 10 }, medium: { px: 10, py: 4, fs: 11 }, large: { px: 14, py: 6, fs: 13 } };
  const s = sizes[size];

  return (
    <View style={[styles.badge, { backgroundColor: c.bg, paddingHorizontal: s.px, paddingVertical: s.py }]}>
      <Text style={[styles.text, { color: c.color, fontSize: s.fs }]}>{c.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: { borderRadius: 9999, alignSelf: 'flex-start' },
  text: { ...typography.label, fontWeight: '600' },
});
