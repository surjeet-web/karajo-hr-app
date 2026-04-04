import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { leaveData } from '../../data/mockData';
import { AnimatedListItem } from '../../components';
import { hapticFeedback } from '../../utils/haptics';
import { useFadeIn, useSlideIn } from '../../utils/animations';

const aiResponses = {
  default: "I'm here to help! Could you provide more details about what you'd like to know?",
  leave: "Based on your current records, here's your leave information. Is there anything specific you'd like to know about your leave balance or policy?",
  payslip: "I can help you with your payslip information. Your latest payslip shows a net amount of $4,250.00 for the period of Feb 1 - Feb 28, 2026. Would you like more details?",
  insurance: "Your current insurance plan includes health, dental, and vision coverage. The policy is effective from January 1, 2026. Would you like me to show you the detailed benefits breakdown?",
  policy: "I can help you understand company policies. Which specific policy would you like to know more about? I have information on remote work, leave requests, code of conduct, and more.",
  holiday: "The 2026 holiday calendar includes all federal holidays plus company-specific days off. There are 12 paid holidays this year. Would you like me to list them?",
  tax: "Your 2026 tax documents are being prepared. You can expect your W-2 to be available by January 31, 2027. Is there anything specific about your tax information you need help with?",
  remote: "Our remote work policy allows up to 3 days of remote work per week for eligible roles. You'll need manager approval and must maintain core hours of 10 AM - 3 PM. Would you like to apply for remote work?",
};

const getAIResponse = (query) => {
  const lowerQuery = query.toLowerCase();
  if (lowerQuery.includes('leave') || lowerQuery.includes('vacation') || lowerQuery.includes('time off')) {
    return aiResponses.leave;
  }
  if (lowerQuery.includes('payslip') || lowerQuery.includes('pay') || lowerQuery.includes('salary')) {
    return aiResponses.payslip;
  }
  if (lowerQuery.includes('insurance') || lowerQuery.includes('health') || lowerQuery.includes('benefit')) {
    return aiResponses.insurance;
  }
  if (lowerQuery.includes('policy') || lowerQuery.includes('rule') || lowerQuery.includes('guideline')) {
    return aiResponses.policy;
  }
  if (lowerQuery.includes('holiday') || lowerQuery.includes('calendar') || lowerQuery.includes('day off')) {
    return aiResponses.holiday;
  }
  if (lowerQuery.includes('tax') || lowerQuery.includes('w-2') || lowerQuery.includes('document')) {
    return aiResponses.tax;
  }
  if (lowerQuery.includes('remote') || lowerQuery.includes('work from home') || lowerQuery.includes('wfh')) {
    return aiResponses.remote;
  }
  return aiResponses.default;
};

export const AIChatConversationScreen: React.FC<any> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [inputText, setInputText] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const scrollViewRef = useRef(null);
  const leaveBalance = leaveData.balance;

  const initialQuery = route.params?.initialQuery;
  const actionContext = route.params?.actionContext;

  useFocusEffect(
    useCallback(() => {
      if (initialQuery && messages.length === 0) {
        const userMessage = {
          id: Date.now().toString(),
          text: initialQuery,
          sender: 'user',
          timestamp: new Date(),
        };
        setMessages([userMessage]);
        simulateAIResponse(initialQuery);
      }
    }, [initialQuery])
  );

  const simulateAIResponse = useCallback((query) => {
    setIsTyping(true);
    setTimeout(() => {
      const responseText = getAIResponse(query);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  }, []);

  const sendMessage = useCallback(() => {
    if (inputText.trim().length === 0) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const query = inputText.trim();
    setInputText('');
    simulateAIResponse(query);
  }, [inputText, simulateAIResponse]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  useEffect(() => {
    if (scrollViewRef.current && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isTyping]);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderInitialContent = () => {
    if (initialQuery && messages.length <= 1) {
      return (
        <>
          <View style={styles.aiMessageContainer}>
            <Text style={styles.aiMessageText}>
              Certainly. Here is a summary of your current leave balance as of today:
            </Text>

            <View style={styles.balanceTable}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.tableHeaderTextFirst]}>Type</Text>
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

            <Text style={styles.followUpText}>
              Would you like to apply for leave now?
            </Text>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('DocumentView')}
                accessibilityLabel="View Leave Request Policy"
                accessibilityRole="button"
              >
                <Text style={styles.actionButtonText}>Leave Request Policy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.primaryActionButton]}
                onPress={() => navigation.navigate('SelectLeaveType')}
                accessibilityLabel="Apply for Leave"
                accessibilityRole="button"
              >
                <Text style={[styles.actionButtonText, styles.primaryActionButtonText]}>
                  Apply for Leave
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.viewHistoryButton}
              accessibilityLabel="View leave history"
              accessibilityRole="button"
            >
              <Text style={styles.viewHistoryText}>View History</Text>
            </TouchableOpacity>
          </View>
        </>
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
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
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {messages.length === 0 && !initialQuery && (
          <Text style={styles.timestamp}>Today, {formatTime(new Date())}</Text>
        )}

        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              message.sender === 'user'
                ? styles.userMessageContainer
                : styles.aiMessageContainer,
            ]}
          >
            <View
              style={[
                message.sender === 'user' ? styles.userMessage : styles.aiMessageBubble,
              ]}
            >
              <Text
                style={[
                  message.sender === 'user'
                    ? styles.userMessageText
                    : styles.aiMessageText,
                ]}
              >
                {message.text}
              </Text>
            </View>
            <Text style={styles.messageTime}>{formatTime(message.timestamp)}</Text>
          </View>
        ))}

        {renderInitialContent()}

        {isTyping && (
          <View style={styles.aiMessageContainer}>
            <View style={styles.aiMessageBubble}>
              <View style={styles.typingIndicator}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.typingText}>KarajoAI is thinking...</Text>
              </View>
            </View>
          </View>
        )}
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
            placeholder="Ask a follow-up question..."
            placeholderTextColor={colors.textTertiary}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            multiline
            maxLength={500}
            accessibilityLabel="Type your message"
          />
          {inputText.trim().length > 0 ? (
            <TouchableOpacity
              onPress={sendMessage}
              accessibilityLabel="Send message"
              accessibilityRole="button"
            >
              <Ionicons name="send" size={20} color={colors.primary} />
            </TouchableOpacity>
          ) : (
            <View style={styles.sendPlaceholder}>
              <Ionicons name="mic" size={20} color={colors.textTertiary} />
            </View>
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
    paddingBottom: spacing.xl,
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
  aiMessageContainer: {
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  aiMessageBubble: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderBottomLeftRadius: spacing.xs,
    padding: spacing.md,
    maxWidth: '85%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  aiMessageText: {
    ...typography.body,
    color: colors.text,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  typingText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  messageTime: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  balanceTable: {
    backgroundColor: colors.surfaceVariant,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    width: '100%',
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceVariant,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    flexWrap: 'wrap',
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
    alignItems: 'flex-end',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    margin: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 48,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: spacing.xs,
    maxHeight: 100,
  },
  sendPlaceholder: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
