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
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services';
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

const DEPARTMENT_OPTIONS = [
  'Engineering',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
  'Product',
  'Design',
];

export const SignupScreen: React.FC<any> = ({ navigation }) => {
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [selectedRole, setSelectedRole] = useState('employee');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const validate = (): boolean => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('All fields are required');
      hapticFeedback('error');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      hapticFeedback('error');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      hapticFeedback('error');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      hapticFeedback('error');
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setError(null);
    setIsLoading(true);
    hapticFeedback('medium');

    try {
      await authService.register(name.trim(), email.trim(), password, selectedRole, department);
      await login(email.trim(), password, selectedRole);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      hapticFeedback('error');
    } finally {
      setIsLoading(false);
    }
  };

  const selectRole = (value: string) => {
    setSelectedRole(value);
    setShowRoleDropdown(false);
    hapticFeedback('selection');
  };

  const selectDept = (value: string) => {
    setDepartment(value);
    setShowDeptDropdown(false);
    hapticFeedback('selection');
  };

  const selectedRoleLabel = ROLE_OPTIONS.find(r => r.value === selectedRole)?.label || 'Employee';

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Animated.View style={[styles.logoContainer, { opacity: logoOpacity }]}>
            <View style={styles.logoIcon}>
              <Ionicons name="person-add" size={48} color={colors.textInverse} />
            </View>
            <Text style={styles.logoTitle}>Create Account</Text>
            <Text style={styles.logoSubtitle}>Join Karajo HR Management System</Text>
          </Animated.View>

          <Animated.View style={[styles.formContainer, { opacity: formOpacity, transform: [{ translateY: formTranslateY }] }]}>
            <Card style={styles.card} padding="xl">
              <Text style={styles.cardTitle}>Sign Up</Text>
              <Text style={styles.cardSubtitle}>Fill in your details to get started</Text>

              <View style={styles.inputGroup}>
                <Input label="Full Name" placeholder="Enter your full name" value={name} onChangeText={t => { setName(t); if (error) setError(null); }} icon="person-outline" />
                <Input label="Email Address" placeholder="Enter your email" value={email} onChangeText={t => { setEmail(t); if (error) setError(null); }} icon="mail-outline" keyboardType="email-address" />
                <Input label="Password" placeholder="Min. 6 characters" value={password} onChangeText={t => { setPassword(t); if (error) setError(null); }} icon="lock-closed-outline" secureTextEntry />
                <Input label="Confirm Password" placeholder="Re-enter password" value={confirmPassword} onChangeText={t => { setConfirmPassword(t); if (error) setError(null); }} icon="lock-closed-outline" secureTextEntry />

                <View style={styles.dropdownField}>
                  <Text style={styles.roleLabel}>Department</Text>
                  <TouchableOpacity style={styles.roleButton} onPress={() => { setShowDeptDropdown(!showDeptDropdown); hapticFeedback('light'); }}>
                    <Ionicons name="business-outline" size={18} color={colors.textSecondary} />
                    <Text style={styles.roleButtonText}>{department}</Text>
                    <Ionicons name={showDeptDropdown ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textTertiary} />
                  </TouchableOpacity>
                  {showDeptDropdown && (
                    <View style={styles.dropdown}>
                      {DEPARTMENT_OPTIONS.map(opt => (
                        <TouchableOpacity key={opt} style={[styles.dropdownItem, department === opt && styles.dropdownItemSelected]} onPress={() => selectDept(opt)}>
                          <Ionicons name={department === opt ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={department === opt ? colors.primary : colors.textTertiary} />
                          <Text style={[styles.dropdownItemText, department === opt && styles.dropdownItemTextSelected]}>{opt}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                <View style={styles.dropdownField}>
                  <Text style={styles.roleLabel}>Sign up as</Text>
                  <TouchableOpacity style={styles.roleButton} onPress={() => { setShowRoleDropdown(!showRoleDropdown); hapticFeedback('light'); }}>
                    <Ionicons name="shield-outline" size={18} color={colors.textSecondary} />
                    <Text style={styles.roleButtonText}>{selectedRoleLabel}</Text>
                    <Ionicons name={showRoleDropdown ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textTertiary} />
                  </TouchableOpacity>
                  {showRoleDropdown && (
                    <View style={styles.dropdown}>
                      {ROLE_OPTIONS.map(opt => (
                        <TouchableOpacity key={opt.value} style={[styles.dropdownItem, selectedRole === opt.value && styles.dropdownItemSelected]} onPress={() => selectRole(opt.value)}>
                          <Ionicons name={selectedRole === opt.value ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={selectedRole === opt.value ? colors.primary : colors.textTertiary} />
                          <Text style={[styles.dropdownItemText, selectedRole === opt.value && styles.dropdownItemTextSelected]}>{opt.label}</Text>
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

                <Button title="Create Account" onPress={handleSignup} loading={isLoading} haptic={false} style={styles.signupButton} />
              </View>
            </Card>

            <TouchableOpacity style={styles.loginLink} onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <Text style={styles.loginLinkText}>Already have an account? </Text>
              <Text style={[styles.loginLinkText, styles.loginLinkBold]}>Sign In</Text>
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
  logoSubtitle: { ...typography.body, color: colors.textSecondary },
  formContainer: { width: '100%' },
  card: { ...shadows.lg },
  cardTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.xs },
  cardSubtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
  inputGroup: { gap: spacing.md },
  dropdownField: { marginTop: spacing.xs },
  roleLabel: { ...typography.label, color: colors.text, marginBottom: spacing.sm },
  roleButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.md, borderWidth: 1.5, borderColor: colors.border, borderRadius: borderRadius.lg, backgroundColor: colors.surface, gap: spacing.sm },
  roleButtonText: { flex: 1, ...typography.body, color: colors.text },
  dropdown: { position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: colors.surface, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border, ...shadows.lg, zIndex: 10, marginTop: spacing.xs, overflow: 'hidden' },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.md, gap: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  dropdownItemSelected: { backgroundColor: colors.primaryLighter },
  dropdownItemText: { ...typography.body, color: colors.text },
  dropdownItemTextSelected: { color: colors.primary, fontWeight: '600' },
  errorContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.errorLight, padding: spacing.md, borderRadius: borderRadius.lg, gap: spacing.sm },
  errorText: { ...typography.bodySmall, color: colors.error, flex: 1 },
  signupButton: { marginTop: spacing.sm },
  loginLink: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
  loginLinkText: { ...typography.body, color: colors.textSecondary },
  loginLinkBold: { color: colors.primary, fontWeight: '600' },
});
