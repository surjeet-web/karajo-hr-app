import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Button } from '../../components';
import { hapticFeedback } from '../../utils/haptics';

export const ApprovalSheet = ({ visible, onClose, onApprove, onReject, request }) => {
  const [comment, setComment] = useState('');

  const handleApprove = () => {
    hapticFeedback('success');
    onApprove?.(request, comment);
    setComment('');
    onClose();
  };

  const handleReject = () => {
    hapticFeedback('error');
    if (!comment.trim()) {
      Alert.alert('Rejection Reason', 'Please provide a reason for rejection.');
      return;
    }
    onReject?.(request, comment);
    setComment('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Review Request</Text>

          {request && (
            <View style={styles.requestInfo}>
              <Text style={styles.requesterName}>{request.requesterName}</Text>
              <Text style={styles.requestType}>{request.type} • {request.date}</Text>
              {request.reason && <Text style={styles.reason}>"{request.reason}"</Text>}
            </View>
          )}

          <Text style={styles.label}>Comment</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Add a comment (required for rejection)..."
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          <View style={styles.actions}>
            <Button title="Reject" variant="danger" onPress={handleReject} style={styles.rejectBtn} />
            <Button title="Approve" onPress={handleApprove} style={styles.approveBtn} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: borderRadius.xxl, borderTopRightRadius: borderRadius.xxl, padding: spacing.lg, paddingBottom: spacing.xl },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: spacing.lg },
  title: { ...typography.h4, color: colors.text, marginBottom: spacing.md },
  requestInfo: { backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md },
  requesterName: { ...typography.body, color: colors.text, fontWeight: '600' },
  requestType: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  reason: { ...typography.bodySmall, color: colors.text, fontStyle: 'italic', marginTop: spacing.sm },
  label: { ...typography.label, color: colors.textSecondary, marginBottom: spacing.sm },
  textArea: { backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.lg, padding: spacing.md, ...typography.body, color: colors.text, minHeight: 80, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.lg },
  actions: { flexDirection: 'row', gap: spacing.md },
  rejectBtn: { flex: 1 },
  approveBtn: { flex: 1 },
});
