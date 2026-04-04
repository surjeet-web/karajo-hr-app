import React, { useState, useEffect, useRef } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { aiSuggestions } from '../../data/mockData';
import { AnimatedListItem } from '../../components';
import { hapticFeedback } from '../../utils/haptics';
import { useFadeIn, useSlideIn } from '../../utils/animations';

export const AIChatScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [inputText, setInputText] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const handleSuggestionPress = (suggestion) => {
    navigation.navigate('AIChatConversation', { initialQuery: suggestion.title });
  };

  const handleUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photos to upload files.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled && result.assets?.length > 0) {
      Alert.alert('File Selected', result.assets[0].uri.split('/').pop() || 'File uploaded successfully');
      navigation.navigate('AIChatConversation', { uploadedFile: result.assets[0].uri });
    }
  };

  const handleSend = (): void => {
    if (inputText.trim().length > 0) {
      navigation.navigate('AIChatConversation', { initialQuery: inputText.trim() });
      setInputText('');
    }
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
          <Text style={styles.clockText}>{formatTime(currentTime)}</Text>
        </View>

        {/* Center Content */}
        <View style={styles.centerContent}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>K</Text>
            </View>
            <Text style={styles.brandText}>KarajoAI</Text>
          </View>
          
          <Text style={styles.subtitle}>How can I help you today?</Text>

          {/* Upload Button */}
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleUpload}
            accessibilityLabel="Upload a file or photo"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-up" size={24} color={colors.textInverse} />
          </TouchableOpacity>

          <Text style={styles.moreSuggestions}>More Suggestions</Text>

          {/* Suggestion Pills */}
          <View style={styles.suggestionsRow}>
            {aiSuggestions.map((suggestion) => (
              <TouchableOpacity
                key={suggestion.id}
                style={styles.suggestionPill}
                onPress={() => handleSuggestionPress(suggestion)}
                accessibilityLabel={`Ask about ${suggestion.title}`}
                accessibilityRole="button"
              >
                <Ionicons
                  name={suggestion.icon === 'shield' ? 'shield-checkmark' : 'calendar'}
                  size={14}
                  color={colors.primary}
                />
                <Text style={styles.suggestionText}>{suggestion.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <Ionicons name="sparkles" size={20} color={colors.primary} />
          <TextInput
            style={styles.input}
            placeholder="Ask me about work..."
            placeholderTextColor={colors.textTertiary}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            accessibilityLabel="Type your message"
          />
          {inputText.trim().length > 0 ? (
            <TouchableOpacity
              onPress={handleSend}
              accessibilityLabel="Send message"
              accessibilityRole="button"
            >
              <Ionicons name="send" size={20} color={colors.primary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate('AIChatExpanded')}
              accessibilityLabel="Open expanded chat"
              accessibilityRole="button"
            >
              <Ionicons name="expand" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
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
  clockText: {
    ...typography.body,
    color: colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textInverse,
  },
  brandText: {
    ...typography.h4,
    color: colors.text,
  },
  subtitle: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    marginBottom: spacing.xxl,
  },
  uploadButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  moreSuggestions: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    marginBottom: spacing.md,
  },
  suggestionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  suggestionPill: {
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
  suggestionText: {
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
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: spacing.xs,
  },
});
