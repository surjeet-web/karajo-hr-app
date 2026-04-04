import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { leaveData } from '../../data/mockData';

export const AIChatConversationScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [inputText, setInputText] = useState('');

  const leaveBalance = leaveData.balance;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>K</Text>
          </View>
          <Text style={styles.brandText}>KarajoAI</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Timestamp */}
        <Text style={styles.timestamp}>Today, 9:30 AM</Text>

        {/* User Message */}
        <View style={styles.userMessageContainer}>
          <View style={styles.userMessage}>
            <Text style={styles.userMessageText}>
              Hi, could you please show me my current leave balance?
            </Text>
          </View>
          <Text style={styles.messageTime}>9:32 AM</Text>
        </View>

        {/* AI Response */}
        <View style={styles.aiMessageContainer}>
          <Text style={styles.aiMessageText}>
            Certainly. Here is a summary of your current leave balance as of today:
          </Text>

          {/* Leave Balance Table */}
          <View style={styles.balanceTable}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Type</Text>
              <Text style={styles.tableHeaderText}>Available</Text>
            </View>
            
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Annual Leave</Text>
              <Text style={[styles.tableCell, styles.tableCellHighlight]}>
                {leaveBalance.annual.remaining} Days
              </Text>
            </View>
            
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Sick Leave</Text>
              <Text style={[styles.tableCell, styles.tableCellSuccess]}>
                {leaveBalance.sick.remaining} Days
              </Text>
            </View>
            
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Personal Leave</Text>
              <Text style={styles.tableCell}>{leaveBalance.personal.remaining} Days</Text>
            </View>
          </View>

          {/* Follow-up Question */}
          <Text style={styles.followUpText}>
            Would you like to apply for leave now?
          </Text>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('DocumentView')}
            >
              <Text style={styles.actionButtonText}>Leave Request Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryActionButton]}
              onPress={() => navigation.navigate('SelectLeaveType')}
            >
              <Text style={[styles.actionButtonText, styles.primaryActionButtonText]}>
                Apply for Leave
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.viewHistoryButton}>
            <Text style={styles.viewHistoryText}>View History</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <View style={styles.inputContainer}>
          <Ionicons name="sparkles" size={20} color={colors.primary} />
          <TextInput
            style={styles.input}
            placeholder="Ask me about work..."
            placeholderTextColor={colors.textTertiary}
            value={inputText}
            onChangeText={setInputText}
          />
          {inputText.length > 0 && (
            <TouchableOpacity>
              <Ionicons name="send" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textInverse,
  },
  brandText: {
    ...typography.h5,
    color: colors.text,
  },
  placeholder: {
    width: 24,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  timestamp: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
    marginBottom: spacing.lg,
  },
  userMessage: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    borderBottomRightRadius: spacing.xs,
    padding: spacing.md,
    maxWidth: '80%',
  },
  userMessageText: {
    ...typography.body,
    color: colors.textInverse,
  },
  messageTime: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  aiMessageContainer: {
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  aiMessageText: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.md,
  },
  balanceTable: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    width: '100%',
    marginBottom: spacing.lg,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceVariant,
    padding: spacing.md,
  },
  tableHeaderText: {
    ...typography.label,
    color: colors.textSecondary,
    flex: 1,
    textAlign: 'right',
  },
  tableHeaderTextFirst: {
    textAlign: 'left',
  },
  tableRow: {
    flexDirection: 'row',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tableCell: {
    ...typography.body,
    color: colors.text,
    flex: 1,
    textAlign: 'right',
  },
  tableCellHighlight: {
    color: colors.primary,
    fontWeight: '600',
  },
  tableCellSuccess: {
    color: colors.success,
    fontWeight: '600',
  },
  followUpText: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  actionButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  primaryActionButton: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
  },
  actionButtonText: {
    ...typography.bodySmall,
    color: colors.text,
  },
  primaryActionButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },
  viewHistoryButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'flex-start',
  },
  viewHistoryText: {
    ...typography.bodySmall,
    color: colors.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    margin: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
  },
});
