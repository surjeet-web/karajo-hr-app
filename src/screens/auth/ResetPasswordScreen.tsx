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

export const ResetPasswordScreen: React.FC<any> = ({ navigation, route }) => {
  const { token, email } = route.params || {};
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const handleReset = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError('Both password fields are required');
      hapticFeedback('error');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      hapticFeedback('error');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      hapticFeedback('error');
      return;
    }
    setError(null);
    setIsLoading(true);
    hapticFeedback('medium');

    try {
      await authService.resetPassword(token, newPassword);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please try again.');
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
            <Ionicons name="shield-checkmark" size={64} color={colors.success} />
          </View>
          <Text style={styles.successTitle}>Password Reset!</Text>
          <Text style={styles.successSubtitle}>
            Your password has been successfully reset. You can now sign in with your new password.
          </Text>
          <Button title="Sign In" onPress={() => navigation.navigate('Login')} style={styles.signInButton} />
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
              <Ionicons name="key" size={48} color={colors.textInverse} />
            </View>
            <Text style={styles.logoTitle}>Set New Password</Text>
            <Text style={styles.logoSubtitle}>Create a strong password for your account</Text>
          </Animated.View>

          <Animated.View style={[styles.formContainer, { opacity: formOpacity, transform: [{ translateY: formTranslateY }] }]}>
            <Card style={styles.card} padding="xl">
              <Text style={styles.cardTitle}>New Password</Text>
              <Text style={styles.cardSubtitle}>Enter your new password below.</Text>

              <View style={styles.inputGroup}>
                <Input label="New Password" placeholder="Min. 6 characters" value={newPassword} onChangeText={t => { setNewPassword(t); if (error) setError(null); }} icon="lock-closed-outline" secureTextEntry />
                <Input label="Confirm Password" placeholder="Re-enter new password" value={confirmPassword} onChangeText={t => { setConfirmPassword(t); if (error) setError(null); }} icon="lock-closed-outline" secureTextEntry />

                {error && (
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={16} color={colors.error} />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}

                <View style={styles.requirements}>
                  <Text style={styles.requirementsTitle}>Password requirements:</Text>
                  <View style={styles.requirement}>
                    <Ionicons name={newPassword.length >= 6 ? 'checkmark-circle' : 'ellipse-outline'} size={16} color={newPassword.length >= 6 ? colors.success : colors.textTertiary} />
                    <Text style={styles.requirementText}>At least 6 characters</Text>
                  </View>
                  <View style={styles.requirement}>
                    <Ionicons name={newPassword === confirmPassword && newPassword.length > 0 ? 'checkmark-circle' : 'ellipse-outline'} size={16} color={newPassword === confirmPassword && newPassword.length > 0 ? colors.success : colors.textTertiary} />
                    <Text style={styles.requirementText}>Passwords match</Text>
                  </View>
                </View>

                <Button title="Reset Password" onPress={handleReset} loading={isLoading} haptic={false} style={styles.resetButton} />
              </View>
            </Card>
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
  requirements: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  requirementsTitle: { ...typography.label, color: colors.textTertiary, marginBottom: spacing.sm },
  requirement: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  requirementText: { ...typography.bodySmall, color: colors.textSecondary },
  resetButton: { marginTop: spacing.sm },
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  successIcon: { marginBottom: spacing.xl },
  successTitle: { ...typography.h2, color: colors.text, marginBottom: spacing.sm, textAlign: 'center' },
  successSubtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xxl, lineHeight: 24 },
  signInButton: { width: '100%' },
});
