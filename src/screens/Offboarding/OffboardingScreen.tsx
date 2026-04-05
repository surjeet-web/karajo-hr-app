import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  useReducedMotion,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Button, Input } from '../../components';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

interface OffboardingStep {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  renderContent: (props: OffboardingContentProps) => React.ReactNode;
}

interface OffboardingContentProps {
  data: Record<string, any>;
  updateData: (key: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const steps: OffboardingStep[] = [
  {
    id: 'notice',
    title: 'We are Sorry to See You Go',
    subtitle: 'Let us wrap things up smoothly',
    icon: 'sad',
    renderContent: ({ onNext }) => <NoticeContent onNext={onNext} />,
  },
  {
    id: 'checklist',
    title: 'Exit Checklist',
    subtitle: 'Things to complete before you leave',
    icon: 'list',
    renderContent: ({ data, updateData, onNext, onBack }) => (
      <ChecklistContent data={data} updateData={updateData} onNext={onNext} onBack={onBack} />
    ),
  },
  {
    id: 'assets',
    title: 'Return Company Assets',
    subtitle: 'Laptop, badge, and other items',
    icon: 'laptop',
    renderContent: ({ data, updateData, onNext, onBack }) => (
      <AssetsContent data={data} updateData={updateData} onNext={onNext} onBack={onBack} />
    ),
  },
  {
    id: 'feedback',
    title: 'Share Your Feedback',
    subtitle: 'Help us improve for future employees',
    icon: 'chatbubble',
    renderContent: ({ data, updateData, onNext, onBack }) => (
      <FeedbackContent data={data} updateData={updateData} onNext={onNext} onBack={onBack} />
    ),
  },
  {
    id: 'farewell',
    title: 'Thank You',
    subtitle: 'We wish you all the best',
    icon: 'heart',
    renderContent: ({ onNext }) => <FarewellContent onNext={onNext} />,
  },
];

const NoticeContent: React.FC<{ onNext: () => void }> = ({ onNext }) => {
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
      <Animated.View style={[styles.noticeIcon, animatedStyle]}>
        <View style={styles.iconCircle}>
          <Ionicons name="sad" size={48} color={colors.warning} />
        </View>
      </Animated.View>
      <Text style={styles.noticeTitle}>Thank You for Your Time</Text>
      <Text style={styles.noticeSubtitle}>
        We appreciate everything you have contributed. This process will help ensure a smooth transition for everyone.
      </Text>
      <View style={styles.infoCard}>
        <Ionicons name="information-circle" size={20} color={colors.primary} />
        <Text style={styles.infoText}>
          Your access will remain active until your last day. Please complete all items in the checklist below.
        </Text>
      </View>
      <View style={styles.timeline}>
        <TimelineItem title="Submit Resignation" status="completed" />
        <TimelineItem title="Complete Exit Checklist" status="in-progress" />
        <TimelineItem title="Return Assets" status="pending" />
        <TimelineItem title="Final Settlement" status="pending" />
      </View>
      <Button title="Start Exit Process" onPress={onNext} style={styles.nextButton} />
    </View>
  );
};

const TimelineItem: React.FC<{ title: string; status: 'completed' | 'in-progress' | 'pending' }> = ({ title, status }) => (
  <View style={styles.timelineItem}>
    <View style={[
      styles.timelineDot,
      status === 'completed' && styles.timelineDotCompleted,
      status === 'in-progress' && styles.timelineDotInProgress,
    ]}>
      {status === 'completed' && <Ionicons name="checkmark" size={12} color={colors.textInverse} />}
      {status === 'in-progress' && <View style={styles.timelineDotInner} />}
    </View>
    <Text style={[
      styles.timelineText,
      status === 'completed' && styles.timelineTextCompleted,
      status === 'pending' && styles.timelineTextPending,
    ]}>
      {title}
    </Text>
  </View>
);

const checklistItems = [
  { id: 'handover', title: 'Complete Handover Notes', desc: 'Document your ongoing work and responsibilities' },
  { id: 'access', title: 'Revoke System Access', desc: 'List all systems and tools you use' },
  { id: 'contacts', title: 'Update Emergency Contacts', desc: 'Provide alternate contact information' },
  { id: 'benefits', title: 'Review Benefits & COBRA', desc: 'Understand your post-employment benefits' },
  { id: 'final-pay', title: 'Confirm Final Pay Details', desc: 'Verify your last paycheck and PTO payout' },
  { id: 'references', title: 'Request Reference Letters', desc: 'Ask your manager for a reference' },
];

const ChecklistContent: React.FC<{
  data: Record<string, any>;
  updateData: (key: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ data, updateData, onNext, onBack }) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(data.checkedItems || {});

  const toggleItem = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
    updateData('checkedItems', { ...checkedItems, [id]: !checkedItems[id] });
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progress = (completedCount / checklistItems.length) * 100;

  return (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Checklist Progress</Text>
          <Text style={styles.progressCount}>{completedCount}/{checklistItems.length}</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      {checklistItems.map((item, index) => (
        <Animated.View
          key={item.id}
          entering={SlideInRight.delay(index * 60).duration(250)}
        >
          <TouchableOpacity
            style={[
              styles.checklistItem,
              checkedItems[item.id] && styles.checklistItemCompleted,
            ]}
            onPress={() => toggleItem(item.id)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.checkbox,
              checkedItems[item.id] && styles.checkboxChecked,
            ]}>
              {checkedItems[item.id] && (
                <Ionicons name="checkmark" size={16} color={colors.textInverse} />
              )}
            </View>
            <View style={styles.checklistText}>
              <Text style={[
                styles.checklistTitle,
                checkedItems[item.id] && styles.checklistTitleCompleted,
              ]}>
                {item.title}
              </Text>
              <Text style={styles.checklistDesc}>{item.desc}</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      ))}

      <View style={styles.buttonRow}>
        <Button title="Back" variant="outline" onPress={onBack} style={styles.backButton} />
        <Button title="Continue" onPress={onNext} style={styles.nextButton} />
      </View>
    </ScrollView>
  );
};

const companyAssets = [
  { id: 'laptop', title: 'Laptop / Computer', icon: 'laptop', required: true },
  { id: 'badge', title: 'ID Badge / Access Card', icon: 'card', required: true },
  { id: 'phone', title: 'Company Phone', icon: 'phone-portrait', required: false },
  { id: 'keys', title: 'Office Keys', icon: 'key', required: true },
  { id: 'charger', title: 'Chargers & Accessories', icon: 'battery-charging', required: false },
  { id: 'software', title: 'Software Licenses', icon: 'download', required: true },
];

const AssetsContent: React.FC<{
  data: Record<string, any>;
  updateData: (key: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ data, updateData, onNext, onBack }) => {
  const [returnedAssets, setReturnedAssets] = useState<Record<string, boolean>>(data.returnedAssets || {});

  const toggleAsset = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setReturnedAssets((prev) => ({ ...prev, [id]: !prev[id] }));
    updateData('returnedAssets', { ...returnedAssets, [id]: !returnedAssets[id] });
  };

  const requiredReturned = companyAssets
    .filter((a) => a.required)
    .every((a) => returnedAssets[a.id]);

  return (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.assetsIntro}>
        Please return all company property. Required items must be returned before your final settlement.
      </Text>

      {companyAssets.map((asset, index) => (
        <Animated.View
          key={asset.id}
          entering={SlideInRight.delay(index * 60).duration(250)}
        >
          <TouchableOpacity
            style={[
              styles.assetItem,
              returnedAssets[asset.id] && styles.assetItemReturned,
            ]}
            onPress={() => toggleAsset(asset.id)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.assetIcon,
              returnedAssets[asset.id] && styles.assetIconReturned,
            ]}>
              <Ionicons name={asset.icon as any} size={22} color={returnedAssets[asset.id] ? colors.success : colors.textSecondary} />
            </View>
            <View style={styles.assetText}>
              <Text style={styles.assetTitle}>{asset.title}</Text>
              {asset.required && <Text style={styles.assetRequired}>Required</Text>}
            </View>
            <View style={[
              styles.assetStatus,
              returnedAssets[asset.id] && styles.assetStatusReturned,
            ]}>
              <Text style={[
                styles.assetStatusText,
                returnedAssets[asset.id] && styles.assetStatusTextReturned,
              ]}>
                {returnedAssets[asset.id] ? 'Returned' : 'Pending'}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      ))}

      {!requiredReturned && (
        <View style={styles.warningCard}>
          <Ionicons name="warning" size={18} color={colors.warning} />
          <Text style={styles.warningText}>All required items must be returned before final settlement.</Text>
        </View>
      )}

      <View style={styles.buttonRow}>
        <Button title="Back" variant="outline" onPress={onBack} style={styles.backButton} />
        <Button title="Continue" onPress={onNext} style={styles.nextButton} />
      </View>
    </ScrollView>
  );
};

const FeedbackContent: React.FC<{
  data: Record<string, any>;
  updateData: (key: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ data, updateData, onNext, onBack }) => {
  const [rating, setRating] = useState(data.feedbackRating || 0);

  const handleRating = (value: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRating(value);
    updateData('feedbackRating', value);
  };

  return (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.feedbackIntro}>
        Your feedback helps us build a better workplace. All responses are confidential.
      </Text>

      <View style={styles.ratingSection}>
        <Text style={styles.ratingQuestion}>How would you rate your overall experience?</Text>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => handleRating(star)} style={styles.starButton}>
              <Ionicons
                name={star <= rating ? 'star' : 'star-outline'}
                size={32}
                color={star <= rating ? colors.warning : colors.border}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Input
        label="What did you enjoy most?"
        placeholder="Share your positive experiences..."
        value={data.enjoyedMost || ''}
        onChangeText={(text) => updateData('enjoyedMost', text)}
        multiline
        numberOfLines={3}
      />

      <Input
        label="What could we improve?"
        placeholder="Your suggestions matter..."
        value={data.improvements || ''}
        onChangeText={(text) => updateData('improvements', text)}
        multiline
        numberOfLines={3}
      />

      <Input
        label="Would you recommend working here?"
        placeholder="Yes / No / Maybe — and why..."
        value={data.recommend || ''}
        onChangeText={(text) => updateData('recommend', text)}
        multiline
        numberOfLines={2}
      />

      <View style={styles.buttonRow}>
        <Button title="Back" variant="outline" onPress={onBack} style={styles.backButton} />
        <Button title="Continue" onPress={onNext} style={styles.nextButton} />
      </View>
    </ScrollView>
  );
};

const FarewellContent: React.FC<{ onNext: () => void }> = ({ onNext }) => {
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
    <View style={[styles.stepContent, styles.farewellContent]}>
      <Animated.View style={[styles.farewellIcon, animatedStyle]}>
        <View style={styles.farewellCircle}>
          <Ionicons name="heart" size={48} color={colors.error} />
        </View>
      </Animated.View>
      <Text style={styles.farewellTitle}>Thank You, {data?.name || 'Friend'}</Text>
      <Text style={styles.farewellSubtitle}>
        Your contributions have made a lasting impact. We wish you success in your next chapter.
      </Text>

      <View style={styles.farewellInfo}>
        <View style={styles.farewellInfoItem}>
          <Ionicons name="mail" size={20} color={colors.primary} />
          <Text style={styles.farewellInfoText}>Your final payslip will be emailed to you</Text>
        </View>
        <View style={styles.farewellInfoItem}>
          <Ionicons name="document" size={20} color={colors.primary} />
          <Text style={styles.farewellInfoText}>Experience letter will be ready in 5 business days</Text>
        </View>
        <View style={styles.farewellInfoItem}>
          <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
          <Text style={styles.farewellInfoText}>Your data will be securely archived</Text>
        </View>
      </View>

      <Button title="Complete & Exit" onPress={onNext} style={styles.completeButton} />
      <TouchableOpacity style={styles.contactHR}>
        <Text style={styles.contactHRText}>Need help? Contact HR at hr@karajo.com</Text>
      </TouchableOpacity>
    </View>
  );
};

const data: any = {};

export const OffboardingScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [offboardingData, setOffboardingData] = useState<Record<string, any>>({});
  const { user } = useAuth();

  const updateData = (key: string, value: any) => {
    setOffboardingData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
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
        <TouchableOpacity style={styles.closeButton}>
          <Ionicons name="close" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.stepHeader}>
        <View style={styles.stepIcon}>
          <Ionicons name={step.icon as any} size={24} color={colors.warning} />
        </View>
        <Text style={styles.stepTitle}>{step.title}</Text>
        <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
      </View>

      <View style={styles.contentContainer}>
        {step.renderContent({
          data: { ...offboardingData, name: user?.name },
          updateData,
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
    backgroundColor: colors.warning,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  closeButton: {
    padding: spacing.sm,
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
    backgroundColor: colors.warningLight,
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
  noticeIcon: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.warningLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  noticeSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginLeft: spacing.sm,
  },
  timeline: {
    marginBottom: spacing.xl,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  timelineDotCompleted: {
    backgroundColor: colors.success,
  },
  timelineDotInProgress: {
    backgroundColor: colors.primary,
  },
  timelineDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textInverse,
  },
  timelineText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },
  timelineTextCompleted: {
    color: colors.success,
    textDecorationLine: 'line-through',
  },
  timelineTextPending: {
    color: colors.textTertiary,
  },
  nextButton: {
    width: '100%',
    marginBottom: spacing.md,
  },
  progressSection: {
    marginBottom: spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checklistItemCompleted: {
    borderColor: colors.success,
    backgroundColor: colors.successLight,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  checkboxChecked: {
    backgroundColor: colors.success,
  },
  checklistText: {
    flex: 1,
  },
  checklistTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  checklistTitleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  checklistDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  backButton: {
    flex: 1,
  },
  assetsIntro: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 22,
    textAlign: 'center',
  },
  assetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  assetItemReturned: {
    borderColor: colors.success,
    backgroundColor: colors.successLight,
  },
  assetIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  assetIconReturned: {
    backgroundColor: colors.successLight,
  },
  assetText: {
    flex: 1,
  },
  assetTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  assetRequired: {
    fontSize: 12,
    color: colors.error,
    fontWeight: '500',
    marginTop: 2,
  },
  assetStatus: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: colors.border,
  },
  assetStatusReturned: {
    backgroundColor: colors.successLight,
  },
  assetStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  assetStatusTextReturned: {
    color: colors.success,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: colors.warningLight,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: colors.warning,
    marginLeft: spacing.sm,
    fontWeight: '500',
  },
  feedbackIntro: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 22,
    textAlign: 'center',
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  ratingQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  stars: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  starButton: {
    padding: spacing.xs,
  },
  farewellContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xl,
  },
  farewellIcon: {
    marginBottom: spacing.lg,
  },
  farewellCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.errorLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  farewellTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  farewellSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  farewellInfo: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  farewellInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  farewellInfoText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: spacing.md,
    flex: 1,
  },
  completeButton: {
    width: '100%',
    marginBottom: spacing.md,
  },
  contactHR: {
    padding: spacing.md,
  },
  contactHRText: {
    fontSize: 13,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});
