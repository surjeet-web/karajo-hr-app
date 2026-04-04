import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { AnimatedListItem } from '../../components';
import { hapticFeedback } from '../../utils/haptics';
import { useFadeIn, useSlideIn } from '../../utils/animations';

const documentQAResponses = {
  default: "Based on the Leave Request Policy document, I can help answer your questions. The policy covers submission timelines, leave types, documentation requirements, and compliance guidelines. What would you like to know?",
  timeline: "According to Section 2 of the policy, all planned leave requests must be submitted at least 14 days in advance. Last-minute requests are reviewed case-by-case and depend on team capacity.",
  sick: "Section 4 states that for sick leave exceeding 3 consecutive days, a valid medical certificate from a registered physician is mandatory upon return to work.",
  types: "Section 3 outlines that employees are eligible for Annual Leave, Sick Leave, Parental Leave, and Bereavement Leave. Eligibility depends on employment status and tenure per the Employee Handbook.",
  purpose: "Section 1 states the policy establishes clear guidelines for employee leave requests, ensuring fair treatment and adequate operational coverage while encouraging work-life balance.",
  documentation: "Section 4 requires appropriate documentation for certain leave types. Failure to provide documentation may result in the leave being classified as unpaid or unauthorized.",
  advance: "The policy requires at least 14 days advance notice for planned leave (e.g., vacation). This helps facilitate resource planning across teams.",
  approval: "Last-minute leave requests are subject to manager approval based on team capacity. They are reviewed on a case-by-case basis.",
  medical: "A valid medical certificate from a registered physician is mandatory for sick leave exceeding 3 consecutive days. This must be submitted upon return to work.",
  handbook: "The Employee Handbook contains detailed eligibility criteria for each leave type based on employment status and tenure. Would you like me to help you find a specific section?",
};

const getDocumentResponse = (query) => {
  const lowerQuery = query.toLowerCase();
  if (lowerQuery.includes('timeline') || lowerQuery.includes('advance') || lowerQuery.includes('14 day') || lowerQuery.includes('submit') || lowerQuery.includes('notice')) {
    return documentQAResponses.timeline;
  }
  if (lowerQuery.includes('sick') || lowerQuery.includes('medical') || lowerQuery.includes('certificate') || lowerQuery.includes('doctor') || lowerQuery.includes('physician')) {
    return documentQAResponses.sick;
  }
  if (lowerQuery.includes('type') || lowerQuery.includes('annual') || lowerQuery.includes('parental') || lowerQuery.includes('bereavement') || lowerQuery.includes('eligible') || lowerQuery.includes('eligibility')) {
    return documentQAResponses.types;
  }
  if (lowerQuery.includes('purpose') || lowerQuery.includes('what is') || lowerQuery.includes('about') || lowerQuery.includes('summary')) {
    return documentQAResponses.purpose;
  }
  if (lowerQuery.includes('document') || lowerQuery.includes('documentation') || lowerQuery.includes('proof') || lowerQuery.includes('unpaid') || lowerQuery.includes('unauthorized')) {
    return documentQAResponses.documentation;
  }
  if (lowerQuery.includes('approv') || lowerQuery.includes('manager') || lowerQuery.includes('last minute') || lowerQuery.includes('capacity')) {
    return documentQAResponses.approval;
  }
  if (lowerQuery.includes('handbook') || lowerQuery.includes('tenure') || lowerQuery.includes('status')) {
    return documentQAResponses.handbook;
  }
  return documentQAResponses.default;
};

export const DocumentViewScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [inputText, setInputText] = useState('');
  const [qaMessages, setQaMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showQA, setShowQA] = useState(false);
  const qaScrollRef = useRef(null);

  useEffect(() => {
    if (qaScrollRef.current && qaMessages.length > 0) {
      setTimeout(() => {
        qaScrollRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [qaMessages, isTyping]);

  const handleSend = () => {
    if (inputText.trim().length === 0) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setQaMessages((prev) => [...prev, userMessage]);
    const query = inputText.trim();
    setInputText('');
    setShowQA(true);

    setIsTyping(true);
    setTimeout(() => {
      const responseText = getDocumentResponse(query);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'ai',
        timestamp: new Date(),
      };
      setQaMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickQuestion = (question) => {
    setInputText(question);
    setTimeout(() => {
      const userMessage = {
        id: Date.now().toString(),
        text: question,
        sender: 'user',
        timestamp: new Date(),
      };

      setQaMessages((prev) => [...prev, userMessage]);
      setShowQA(true);
      setInputText('');

      setIsTyping(true);
      setTimeout(() => {
        const responseText = getDocumentResponse(question);
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          text: responseText,
          sender: 'ai',
          timestamp: new Date(),
        };
        setQaMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1500);
    }, 100);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
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
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Document Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.documentTitle}>Leave Request Policy</Text>
            <View style={styles.documentMeta}>
              <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.metaText}>Effective Date: January 1, 2026</Text>
            </View>
          </View>

          {/* Document Content */}
          <View style={styles.contentContainer}>
            {/* Section 1 */}
            <Text style={styles.sectionTitle}>1. Purpose</Text>
            <Text style={styles.paragraph}>
              The purpose of this policy is to establish clear guidelines for employee
              leave requests, ensuring fair treatment and adequate operational coverage.
              Karajo encourages employees to maintain a healthy work-life balance through
              appropriate use of leave.
            </Text>

            {/* AI Highlighted Section */}
            <View style={styles.highlightedSection}>
              <View style={styles.highlightHeader}>
                <Ionicons name="bulb" size={16} color={colors.warning} />
                <Text style={styles.highlightText}>AI Highlighted</Text>
              </View>
              <Text style={styles.sectionTitle}>2. Submission Timeline</Text>
              <Text style={styles.paragraph}>
                To facilitate resource planning, all requests for planned leave (e.g.,
                vacation) must be submitted at least 14 days in advance of the start date.
              </Text>
              <Text style={styles.paragraph}>
                Last-minute requests will be reviewed on a case-by-case basis and are
                subject to manager approval based on team capacity.
              </Text>
            </View>

            {/* Section 3 */}
            <Text style={styles.sectionTitle}>3. Leave Types</Text>
            <Text style={styles.paragraph}>
              Employees are eligible for various types of leave, including Annual Leave,
              Sick Leave, Parental Leave, and Bereavement Leave. Eligibility for each type
              is contingent upon employment status and tenure as outlined in the Employee
              Handbook.
            </Text>

            {/* Section 4 */}
            <Text style={styles.sectionTitle}>4. Documentation & Compliance</Text>
            <Text style={styles.paragraph}>
              Appropriate documentation may be required for certain leave types. Failure to
              provide documentation may result in the leave being classified as unpaid or
              unauthorized.
            </Text>

            {/* Important Requirement Box */}
            <View style={styles.importantBox}>
              <View style={styles.importantHeader}>
                <Ionicons name="warning" size={16} color={colors.error} />
                <Text style={styles.importantTitle}>Important Requirement</Text>
              </View>
              <Text style={styles.importantText}>
                "For sick leave exceeding 3 consecutive days, a valid medical certificate
                from a registered physician is mandatory upon return to work."
              </Text>
            </View>
          </View>

          {/* Quick Questions */}
          {!showQA && (
            <View style={styles.quickQuestionsContainer}>
              <Text style={styles.quickQuestionsTitle}>Quick Questions</Text>
              <View style={styles.quickQuestionsRow}>
                <TouchableOpacity
                  style={styles.quickQuestionPill}
                  onPress={() => handleQuickQuestion('How many days in advance do I need to submit leave?')}
                  accessibilityLabel="Ask about advance notice requirement"
                  accessibilityRole="button"
                >
                  <Ionicons name="help-circle-outline" size={12} color={colors.primary} />
                  <Text style={styles.quickQuestionText}>Advance notice?</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickQuestionPill}
                  onPress={() => handleQuickQuestion('What documentation is needed for sick leave?')}
                  accessibilityLabel="Ask about sick leave documentation"
                  accessibilityRole="button"
                >
                  <Ionicons name="help-circle-outline" size={12} color={colors.primary} />
                  <Text style={styles.quickQuestionText}>Sick leave docs?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.quickQuestionsRow}>
                <TouchableOpacity
                  style={styles.quickQuestionPill}
                  onPress={() => handleQuickQuestion('What types of leave am I eligible for?')}
                  accessibilityLabel="Ask about leave types"
                  accessibilityRole="button"
                >
                  <Ionicons name="help-circle-outline" size={12} color={colors.primary} />
                  <Text style={styles.quickQuestionText}>Leave types?</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickQuestionPill}
                  onPress={() => handleQuickQuestion('What is the purpose of this policy?')}
                  accessibilityLabel="Ask about policy purpose"
                  accessibilityRole="button"
                >
                  <Ionicons name="help-circle-outline" size={12} color={colors.primary} />
                  <Text style={styles.quickQuestionText}>Policy purpose?</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Q&A Section */}
          {showQA && (
            <View style={styles.qaSection}>
              <View style={styles.qaHeader}>
                <Ionicons name="sparkles" size={16} color={colors.primary} />
                <Text style={styles.qaTitle}>Document Q&A</Text>
              </View>
              <ScrollView
                ref={qaScrollRef}
                style={styles.qaScroll}
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
              >
                {qaMessages.map((message) => (
                  <View
                    key={message.id}
                    style={[
                      message.sender === 'user'
                        ? styles.qaUserContainer
                        : styles.qaAiContainer,
                    ]}
                  >
                    <View
                      style={[
                        message.sender === 'user'
                          ? styles.qaUserBubble
                          : styles.qaAiBubble,
                      ]}
                    >
                      <Text
                        style={[
                          message.sender === 'user'
                            ? styles.qaUserText
                            : styles.qaAiText,
                        ]}
                      >
                        {message.text}
                      </Text>
                    </View>
                    <Text style={styles.qaTime}>
                      {formatTime(message.timestamp)}
                    </Text>
                  </View>
                ))}
                {isTyping && (
                  <View style={styles.qaAiContainer}>
                    <View style={styles.qaAiBubble}>
                      <View style={styles.typingIndicator}>
                        <ActivityIndicator size="small" color={colors.primary} />
                        <Text style={styles.typingText}>Analyzing document...</Text>
                      </View>
                    </View>
                  </View>
                )}
              </ScrollView>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <Ionicons name="sparkles" size={20} color={colors.primary} />
          <TextInput
            style={styles.input}
            placeholder="Ask about this document..."
            placeholderTextColor={colors.textTertiary}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            accessibilityLabel="Ask a question about this document"
          />
          {inputText.trim().length > 0 ? (
            <TouchableOpacity
              onPress={handleSend}
              accessibilityLabel="Send question"
              accessibilityRole="button"
            >
              <Ionicons name="send" size={20} color={colors.primary} />
            </TouchableOpacity>
          ) : (
            <View style={styles.sendPlaceholder}>
              <Ionicons name="document-text-outline" size={20} color={colors.textTertiary} />
            </View>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
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
  titleContainer: {
    marginBottom: spacing.lg,
  },
  documentTitle: {
    ...typography.h3,
    color: colors.text,
  },
  documentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  metaText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  contentContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.h5,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  paragraph: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  highlightedSection: {
    backgroundColor: colors.warningLight,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginVertical: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  highlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  highlightText: {
    ...typography.label,
    color: colors.warning,
  },
  importantBox: {
    backgroundColor: colors.errorLight,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginTop: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  importantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  importantTitle: {
    ...typography.label,
    color: colors.error,
  },
  importantText: {
    ...typography.body,
    color: colors.text,
    fontStyle: 'italic',
  },
  quickQuestionsContainer: {
    marginTop: spacing.lg,
  },
  quickQuestionsTitle: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  quickQuestionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  quickQuestionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickQuestionText: {
    ...typography.bodySmall,
    color: colors.primary,
  },
  qaSection: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  qaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  qaTitle: {
    ...typography.label,
    color: colors.text,
    fontWeight: '600',
  },
  qaScroll: {
    maxHeight: 300,
  },
  qaUserContainer: {
    alignItems: 'flex-end',
    marginBottom: spacing.md,
  },
  qaAiContainer: {
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  qaUserBubble: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    borderBottomRightRadius: spacing.xs,
    padding: spacing.md,
    maxWidth: '85%',
  },
  qaAiBubble: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    borderBottomLeftRadius: spacing.xs,
    padding: spacing.md,
    maxWidth: '85%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  qaUserText: {
    ...typography.bodySmall,
    color: colors.textInverse,
  },
  qaAiText: {
    ...typography.bodySmall,
    color: colors.text,
  },
  qaTime: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    margin: spacing.lg,
    marginTop: 0,
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
