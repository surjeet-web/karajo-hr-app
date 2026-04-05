import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
  useReducedMotion,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { useAuth } from '../../context/AuthContext';
import { Button, Input } from '../../components';

const { width, height } = Dimensions.get('window');

interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  renderContent: (props: OnboardingContentProps) => React.ReactNode;
}

interface OnboardingContentProps {
  data: Record<string, any>;
  updateData: (key: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const steps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Karajo',
    subtitle: 'Your HR companion starts here',
    icon: 'sparkles',
    renderContent: ({ onNext }) => <WelcomeContent onNext={onNext} />,
  },
  {
    id: 'profile',
    title: 'Complete Your Profile',
    subtitle: 'Help your team know you better',
    icon: 'person',
    renderContent: ({ data, updateData, onNext, onBack }) => (
      <ProfileContent data={data} updateData={updateData} onNext={onNext} onBack={onBack} />
    ),
  },
  {
    id: 'team',
    title: 'Meet Your Team',
    subtitle: 'People you will work with',
    icon: 'people',
    renderContent: ({ onNext, onBack }) => <TeamContent onNext={onNext} onBack={onBack} />,
  },
  {
    id: 'essentials',
    title: 'Essential Features',
    subtitle: 'What you can do from day one',
    icon: 'briefcase',
    renderContent: ({ onNext, onBack }) => <EssentialsContent onNext={onNext} onBack={onBack} />,
  },
  {
    id: 'complete',
    title: "You're All Set!",
    subtitle: 'Let us get to work',
    icon: 'checkmark-circle',
    renderContent: ({ onNext }) => <CompleteContent onNext={onNext} />,
  },
];

const WelcomeContent: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const scale = useSharedValue(0);
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
    if (!reduceMotion) {
      scale.value = withSpring(1, { damping: 12, stiffness: 100 });
    } else {
      scale.value = 1;
    }
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.stepContent}>
      <Animated.View style={[styles.welcomeIcon, animatedStyle]}>
        <View style={styles.iconCircle}>
          <Ionicons name="sparkles" size={48} color={colors.primary} />
        </View>
      </Animated.View>
      <Text style={styles.welcomeTitle}>Welcome to Karajo HR</Text>
      <Text style={styles.welcomeSubtitle}>
        Your complete HR companion — from attendance to payroll, all in one place.
      </Text>
      <View style={styles.featuresGrid}>
        <FeatureItem icon="calendar" label="Attendance" />
        <FeatureItem icon="airplane" label="Leave Management" />
        <FeatureItem icon="wallet" label="Payroll & Expenses" />
        <FeatureItem icon="stats-chart" label="Performance" />
      </View>
      <Text style={styles.timeEstimate}>Takes ~3 minutes to get started</Text>
    </View>
  );
};

const ProfileContent: React.FC<{
  data: Record<string, any>;
  updateData: (key: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ data, updateData, onNext, onBack }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const newErrors: Record<string, string> = {};
    if (!data.phone || data.phone.length < 10) {
      newErrors.phone = 'Valid phone number is required';
    }
    if (!data.location) {
      newErrors.location = 'Location is required';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onNext();
    }
  };

  return (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="camera" size={24} color={colors.textSecondary} />
        </View>
        <Text style={styles.profileName}>{data.name || 'New Employee'}</Text>
        <Text style={styles.profileEmail}>{data.email || ''}</Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <Input
          label="Phone Number"
          placeholder="+1 (555) 000-0000"
          value={data.phone || ''}
          onChangeText={(text) => updateData('phone', text)}
          error={errors.phone}
          keyboardType="phone-pad"
        />
        <Input
          label="Work Location"
          placeholder="e.g., New York, Remote, San Francisco"
          value={data.location || ''}
          onChangeText={(text) => updateData('location', text)}
          error={errors.location}
        />
        <Input
          label="Emergency Contact Name"
          placeholder="Full name"
          value={data.emergencyName || ''}
          onChangeText={(text) => updateData('emergencyName', text)}
        />
        <Input
          label="Emergency Contact Phone"
          placeholder="+1 (555) 000-0000"
          value={data.emergencyPhone || ''}
          onChangeText={(text) => updateData('emergencyPhone', text)}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.buttonRow}>
        <Button title="Back" variant="outline" onPress={onBack} style={styles.backButton} />
        <Button title="Continue" onPress={handleNext} style={styles.nextButton} />
      </View>
    </ScrollView>
  );
};

const teamMembers = [
  { name: 'James Wilson', role: 'Engineering Manager', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop' },
  { name: 'Sarah Miller', role: 'Senior Software Engineer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' },
  { name: 'Alex Rivera', role: 'Team Lead', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
  { name: 'Linda Park', role: 'HR Manager', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop' },
];

const TeamContent: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.teamIntroText}>
        Here are some key people you will be working with. Your manager and HR are always here to help.
      </Text>
      <View style={styles.teamGrid}>
        {teamMembers.map((member, index) => (
          <Animated.View
            key={member.name}
            entering={FadeIn.delay(index * 100).duration(300)}
          >
            <View style={styles.teamCard}>
              <Image source={{ uri: member.avatar }} style={styles.teamAvatar} />
              <Text style={styles.teamName} numberOfLines={1}>{member.name}</Text>
              <Text style={styles.teamRole} numberOfLines={1}>{member.role}</Text>
            </View>
          </Animated.View>
        ))}
      </View>
      <View style={styles.buttonRow}>
        <Button title="Back" variant="outline" onPress={onBack} style={styles.backButton} />
        <Button title="Continue" onPress={onNext} style={styles.nextButton} />
      </View>
    </View>
  );
};

const EssentialsContent: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => {
  const essentials = [
    { icon: 'finger-print', title: 'Check In/Out', desc: 'Record your daily attendance with one tap' },
    { icon: 'calendar', title: 'Request Leave', desc: 'Apply for time off and track your balance' },
    { icon: 'receipt', title: 'Submit Expenses', desc: 'Log business expenses with receipts' },
    { icon: 'document-text', title: 'View Payslips', desc: 'Access your salary details anytime' },
  ];

  return (
    <View style={styles.stepContent}>
      <Text style={styles.essentialsIntro}>
        Here is what you can do from day one:
      </Text>
      {essentials.map((item, index) => (
        <Animated.View
          key={item.title}
          entering={SlideInRight.delay(index * 80).duration(300)}
          style={styles.essentialItem}
        >
          <View style={styles.essentialIcon}>
            <Ionicons name={item.icon as any} size={24} color={colors.primary} />
          </View>
          <View style={styles.essentialText}>
            <Text style={styles.essentialTitle}>{item.title}</Text>
            <Text style={styles.essentialDesc}>{item.desc}</Text>
          </View>
        </Animated.View>
      ))}
      <View style={styles.buttonRow}>
        <Button title="Back" variant="outline" onPress={onBack} style={styles.backButton} />
        <Button title="Continue" onPress={onNext} style={styles.nextButton} />
      </View>
    </View>
  );
};

const CompleteContent: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const scale = useSharedValue(0);
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
    if (!reduceMotion) {
      scale.value = withSequence(
        withSpring(1.2, { damping: 8, stiffness: 100 }),
        withSpring(1, { damping: 12, stiffness: 100 })
      );
    } else {
      scale.value = 1;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={[styles.stepContent, styles.completeContent]}>
      <Animated.View style={[styles.completeIcon, animatedStyle]}>
        <View style={styles.completeCircle}>
          <Ionicons name="checkmark" size={48} color={colors.success} />
        </View>
      </Animated.View>
      <Text style={styles.completeTitle}>You are all set!</Text>
      <Text style={styles.completeSubtitle}>
        Your profile is ready. Start exploring your dashboard and make the most of Karajo HR.
      </Text>
      <View style={styles.quickStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>20</Text>
          <Text style={styles.statLabel}>Annual Leave</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>9:00</Text>
          <Text style={styles.statLabel}>Check-in Time</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>5</Text>
          <Text style={styles.statLabel}>Team Members</Text>
        </View>
      </View>
      <Button title="Go to Dashboard" onPress={onNext} style={styles.startButton} />
      <TouchableOpacity style={styles.skipLink} onPress={onNext}>
        <Text style={styles.skipText}>Explore on my own</Text>
      </TouchableOpacity>
    </View>
  );
};

const FeatureItem: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <View style={styles.featureItem}>
    <View style={styles.featureIcon}>
      <Ionicons name={icon as any} size={20} color={colors.primary} />
    </View>
    <Text style={styles.featureLabel}>{label}</Text>
  </View>
);

export const OnboardingScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [profileData, setProfileData] = useState<Record<string, any>>({});
  const { user, completeOnboarding } = useAuth();

  React.useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        department: user.department || '',
      });
    }
  }, [user]);

  const updateProfileData = (key: string, value: any) => {
    setProfileData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setDirection('forward');
      setCurrentStep((prev) => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection('backward');
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            Step {currentStep + 1} of {steps.length}
          </Text>
        </View>
        {currentStep > 0 && currentStep < steps.length - 1 && (
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.stepHeader}>
        <View style={styles.stepIcon}>
          <Ionicons name={step.icon as any} size={24} color={colors.primary} />
        </View>
        <Text style={styles.stepTitle}>{step.title}</Text>
        <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
      </View>

      <View style={styles.contentContainer}>
        {step.renderContent({
          data: profileData,
          updateData: updateProfileData,
          onNext: handleNext,
          onBack: handleBack,
        })}
      </View>
    </SafeAreaView>
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
  progressContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  skipButton: {
    padding: spacing.sm,
  },
  skipButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  stepHeader: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  stepIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  stepContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  welcomeIcon: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  featureItem: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  featureLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  timeEstimate: {
    fontSize: 13,
    color: colors.textTertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  formSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
  teamIntroText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  teamCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  teamAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: spacing.sm,
  },
  teamName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  teamRole: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  essentialsIntro: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  essentialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  essentialIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  essentialText: {
    flex: 1,
  },
  essentialTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  essentialDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  completeContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xl,
  },
  completeIcon: {
    marginBottom: spacing.lg,
  },
  completeCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  completeSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  startButton: {
    width: '100%',
    marginBottom: spacing.md,
  },
  skipLink: {
    padding: spacing.md,
  },
  skipText: {
    fontSize: 14,
    color: colors.textTertiary,
    textDecorationLine: 'underline',
  },
});
