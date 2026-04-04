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
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useAuth } from '../../context/AuthContext';
import { Input, Button, Card } from '../../components';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';

const ROLE_OPTIONS = [
  { label: 'Employee', value: 'employee' },
  { label: 'Team Lead', value: 'team_lead' },
  { label: 'Department Manager', value: 'manager' },
  { label: 'HR Manager', value: 'hr_manager' },
  { label: 'Finance Manager', value: 'finance_mgr' },
  { label: 'CEO', value: 'ceo' },
];

export const LoginScreen = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('employee');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(40)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(200),
        Animated.parallel([
          Animated.timing(formTranslateY, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(formOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setError(null);
    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await login(email.trim(), password, selectedRole);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'Forgot Password',
      'Password reset functionality will be available soon.',
      [{ text: 'OK' }]
    );
  };

  const selectRole = (roleValue) => {
    setSelectedRole(roleValue);
    setShowRoleDropdown(false);
    Haptics.selectionAsync();
  };

  const selectedRoleLabel = ROLE_OPTIONS.find((r) => r.value === selectedRole)?.label || 'Employee';

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={[styles.logoContainer, { opacity: logoOpacity }]}>
            <View style={styles.logoIcon}>
              <Ionicons name="people" size={48} color={colors.textInverse} />
            </View>
            <Text style={styles.logoTitle}>Karajo HR</Text>
            <Text style={styles.logoSubtitle}>
              Human Resource Management System
            </Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: formOpacity,
                transform: [{ translateY: formTranslateY }],
              },
            ]}
          >
            <Card style={styles.card} padding="xl">
              <Text style={styles.cardTitle}>Sign In</Text>
              <Text style={styles.cardSubtitle}>
                Enter your credentials to continue
              </Text>

              <View style={styles.inputGroup}>
                <Input
                  label="Email Address"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (error) setError(null);
                  }}
                  icon="mail-outline"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  accessibilityLabel="Email address input"
                />

                <Input
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (error) setError(null);
                  }}
                  icon="lock-closed-outline"
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="password"
                  accessibilityLabel="Password input"
                />

                <View style={styles.roleSelector}>
                  <Text style={styles.roleLabel}>Sign in as</Text>
                  <TouchableOpacity
                    style={styles.roleButton}
                    onPress={() => {
                      setShowRoleDropdown(!showRoleDropdown);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    accessibilityLabel="Select role dropdown"
                    accessibilityRole="button"
                  >
                    <Ionicons
                      name="person-outline"
                      size={18}
                      color={colors.textSecondary}
                    />
                    <Text style={styles.roleButtonText}>{selectedRoleLabel}</Text>
                    <Ionicons
                      name={showRoleDropdown ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={colors.textTertiary}
                    />
                  </TouchableOpacity>

                  {showRoleDropdown && (
                    <View style={styles.dropdown}>
                      {ROLE_OPTIONS.map((option) => (
                        <TouchableOpacity
                          key={option.value}
                          style={[
                            styles.dropdownItem,
                            selectedRole === option.value && styles.dropdownItemSelected,
                          ]}
                          onPress={() => selectRole(option.value)}
                          accessibilityLabel={`Select ${option.label} role`}
                          accessibilityRole="button"
                        >
                          <Ionicons
                            name={
                              selectedRole === option.value
                                ? 'checkmark-circle'
                                : 'ellipse-outline'
                            }
                            size={20}
                            color={
                              selectedRole === option.value
                                ? colors.primary
                                : colors.textTertiary
                            }
                          />
                          <Text
                            style={[
                              styles.dropdownItemText,
                              selectedRole === option.value &&
                                styles.dropdownItemTextSelected,
                            ]}
                          >
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {error && (
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={16} color={colors.error} />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.forgotPasswordLink}
                  onPress={handleForgotPassword}
                  accessibilityLabel="Forgot password link"
                  accessibilityRole="link"
                >
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>

                <Button
                  title="Sign In"
                  onPress={handleLogin}
                  loading={isLoading}
                  haptic={false}
                  style={styles.signInButton}
                  accessibilityLabel="Sign in button"
                />
              </View>
            </Card>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxxl,
    paddingBottom: spacing.xxl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxxxxl,
  },
  logoIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
    marginBottom: spacing.lg,
  },
  logoTitle: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  logoSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  formContainer: {
    width: '100%',
  },
  card: {
    ...shadows.lg,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  cardSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  inputGroup: {
    gap: spacing.md,
  },
  roleSelector: {
    marginTop: spacing.xs,
  },
  roleLabel: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },
  roleButtonText: {
    flex: 1,
    ...typography.body,
    color: colors.text,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.lg,
    zIndex: 10,
    marginTop: spacing.xs,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  dropdownItemSelected: {
    backgroundColor: colors.primaryLighter,
  },
  dropdownItemText: {
    ...typography.body,
    color: colors.text,
  },
  dropdownItemTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorLight,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.error,
    flex: 1,
  },
  forgotPasswordLink: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  forgotPasswordText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  signInButton: {
    marginTop: spacing.sm,
  },
});
