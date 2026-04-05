import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { hapticFeedback } from '../../utils/haptics';
import { Input, Button, Card } from '../../components';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { authService } from '../../services';

export const ForgotPasswordScreen: React.FC<any> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(40)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(200),
        Animated.parallel([
          Animated.timing(formTranslateY, { toValue: 0, duration: 600, useNativeDriver: true }),
          Animated.timing(formOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        ]),
      ]),
    ]).start();
  }, []);

  const handleSendReset = async () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      hapticFeedback('error');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      hapticFeedback('error');
      return;
    }
    setError(null);
    setIsLoading(true);
    hapticFeedback('medium');

    try {
      await authService.forgotPassword(email.trim());
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
      hapticFeedback('error');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="mail-open" size={64} color={colors.success} />
          </View>
          <Text style={styles.successTitle}>Check Your Email</Text>
          <Text style={styles.successSubtitle}>
            We've sent a password reset link to{'\n'}
            <Text style={styles.emailHighlight}>{email}</Text>
          </Text>
          <View style={styles.successCard}>
            <Ionicons name="information-circle" size={20} color={colors.info} />
            <Text style={styles.successInfo}>
              If you don't see the email, check your spam folder or try again.
            </Text>
          </View>
          <Button title="Back to Sign In" onPress={() => navigation.goBack()} style={styles.backButton} />
          <TouchableOpacity style={styles.retryLink} onPress={() => setSuccess(false)} activeOpacity={0.7}>
            <Text style={styles.retryText}>Didn't receive email? Try again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Animated.View style={[styles.logoContainer, { opacity: logoOpacity }]}>
            <View style={styles.logoIcon}>
              <Ionicons name="lock-open" size={48} color={colors.textInverse} />
            </View>
            <Text style={styles.logoTitle}>Forgot Password?</Text>
            <Text style={styles.logoSubtitle}>No worries, we'll send you reset instructions</Text>
          </Animated.View>

          <Animated.View style={[styles.formContainer, { opacity: formOpacity, transform: [{ translateY: formTranslateY }] }]}>
            <Card style={styles.card} padding="xl">
              <Text style={styles.cardTitle}>Reset Password</Text>
              <Text style={styles.cardSubtitle}>Enter your email address and we'll send you a link to reset your password.</Text>

              <View style={styles.inputGroup}>
                <Input label="Email Address" placeholder="Enter your email" value={email} onChangeText={t => { setEmail(t); if (error) setError(null); }} icon="mail-outline" keyboardType="email-address" />

                {error && (
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={16} color={colors.error} />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}

                <Button title="Send Reset Link" onPress={handleSendReset} loading={isLoading} haptic={false} style={styles.sendButton} />
              </View>
            </Card>

            <TouchableOpacity style={styles.backLink} onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={18} color={colors.primary} />
              <Text style={styles.backLinkText}>Back to Sign In</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.xxxxl, paddingBottom: spacing.xxl },
  logoContainer: { alignItems: 'center', marginBottom: spacing.xxxxl },
  logoIcon: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', ...shadows.lg, marginBottom: spacing.lg },
  logoTitle: { ...typography.h1, color: colors.text, marginBottom: spacing.xs },
  logoSubtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  formContainer: { width: '100%' },
  card: { ...shadows.lg },
  cardTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.xs },
  cardSubtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
  inputGroup: { gap: spacing.md },
  errorContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.errorLight, padding: spacing.md, borderRadius: borderRadius.lg, gap: spacing.sm },
  errorText: { ...typography.bodySmall, color: colors.error, flex: 1 },
  sendButton: { marginTop: spacing.sm },
  backLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, marginTop: spacing.xl },
  backLinkText: { ...typography.body, color: colors.primary, fontWeight: '600' },
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  successIcon: { marginBottom: spacing.xl },
  successTitle: { ...typography.h2, color: colors.text, marginBottom: spacing.sm, textAlign: 'center' },
  successSubtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xl, lineHeight: 24 },
  emailHighlight: { color: colors.text, fontWeight: '600' },
  successCard: { flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.infoLight, padding: spacing.md, borderRadius: borderRadius.lg, marginBottom: spacing.xl, width: '100%' },
  successInfo: { ...typography.bodySmall, color: colors.info, flex: 1 },
  backButton: { width: '100%' },
  retryLink: { marginTop: spacing.lg },
  retryText: { ...typography.body, color: colors.primary, fontWeight: '600' },
});
