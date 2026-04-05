import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { hapticFeedback } from '../../utils/haptics';
import { useAuth } from '../../context/AuthContext';
import { Input, Button, Card, Header } from '../../components';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { authService } from '../../services';

export const ChangePasswordScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChangePassword = async () => {
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setError('All fields are required');
      hapticFeedback('error');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      hapticFeedback('error');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      hapticFeedback('error');
      return;
    }
    setError(null);
    setIsLoading(true);
    hapticFeedback('medium');

    try {
      await authService.changePassword(currentPassword, newPassword);
      Alert.alert(
        'Password Changed',
        'Your password has been updated successfully. Please sign in again with your new password.',
        [{ text: 'OK', onPress: () => logout() }]
      );
    } catch (err: any) {
      setError(err.message || 'Failed to change password. Please try again.');
      hapticFeedback('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Change Password" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card} padding="xl">
          <View style={styles.iconRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="shield-checkmark" size={28} color={colors.primary} />
            </View>
          </View>
          <Text style={styles.title}>Update Your Password</Text>
          <Text style={styles.subtitle}>For security, choose a strong password you haven't used before.</Text>

          <View style={styles.inputGroup}>
            <Input label="Current Password" placeholder="Enter current password" value={currentPassword} onChangeText={t => { setCurrentPassword(t); if (error) setError(null); }} icon="lock-closed-outline" secureTextEntry />
            <Input label="New Password" placeholder="Min. 6 characters" value={newPassword} onChangeText={t => { setNewPassword(t); if (error) setError(null); }} icon="lock-closed-outline" secureTextEntry />
            <Input label="Confirm New Password" placeholder="Re-enter new password" value={confirmPassword} onChangeText={t => { setConfirmPassword(t); if (error) setError(null); }} icon="lock-closed-outline" secureTextEntry />

            {error && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color={colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.requirements}>
              <Text style={styles.requirementsTitle}>Requirements:</Text>
              <View style={styles.requirement}>
                <Ionicons name={newPassword.length >= 6 ? 'checkmark-circle' : 'ellipse-outline'} size={16} color={newPassword.length >= 6 ? colors.success : colors.textTertiary} />
                <Text style={styles.requirementText}>At least 6 characters</Text>
              </View>
              <View style={styles.requirement}>
                <Ionicons name={newPassword === confirmPassword && newPassword.length > 0 ? 'checkmark-circle' : 'ellipse-outline'} size={16} color={newPassword === confirmPassword && newPassword.length > 0 ? colors.success : colors.textTertiary} />
                <Text style={styles.requirementText}>Passwords match</Text>
              </View>
              <View style={styles.requirement}>
                <Ionicons name={newPassword !== currentPassword && newPassword.length > 0 ? 'checkmark-circle' : 'ellipse-outline'} size={16} color={newPassword !== currentPassword && newPassword.length > 0 ? colors.success : colors.textTertiary} />
                <Text style={styles.requirementText}>Different from current</Text>
              </View>
            </View>

            <Button title="Change Password" onPress={handleChangePassword} loading={isLoading} haptic={false} />
          </View>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  card: { ...shadows.sm },
  iconRow: { alignItems: 'center', marginBottom: spacing.md },
  iconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primaryLighter, justifyContent: 'center', alignItems: 'center' },
  title: { ...typography.h4, color: colors.text, textAlign: 'center', marginBottom: spacing.xs },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xl },
  inputGroup: { gap: spacing.md },
  errorContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.errorLight, padding: spacing.md, borderRadius: borderRadius.lg, gap: spacing.sm },
  errorText: { ...typography.bodySmall, color: colors.error, flex: 1 },
  requirements: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  requirementsTitle: { ...typography.label, color: colors.textTertiary, marginBottom: spacing.sm },
  requirement: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  requirementText: { ...typography.bodySmall, color: colors.textSecondary },
});
