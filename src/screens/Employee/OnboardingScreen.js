import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Card, Avatar, Button, ProgressBar, AnimatedCard, AnimatedListItem } from '../../components';
import { onboardingData } from '../../data/mockData';
import { useFadeIn, useSlideIn, useScaleIn } from '../../utils/animations';
import { hapticFeedback } from '../../utils/haptics';

const cloneChecklist = () =>
  onboardingData.checklist.map(section => ({
    ...section,
    items: section.items.map(item => ({ ...item })),
  }));

export const OnboardingScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [checklist, setChecklist] = useState(cloneChecklist);
  const headerFade = useFadeIn(300);
  const statsSlide = useSlideIn('up', 400, 100);
  const hiresSlide = useSlideIn('up', 400, 300);
  const checklistSlide = useSlideIn('up', 400, 600);

  const toggleCheckItem = (sectionIndex, itemIndex) => {
    hapticFeedback('light');
    setChecklist(prev => {
      const next = [...prev];
      const section = { ...next[sectionIndex] };
      const items = [...section.items];
      items[itemIndex] = { ...items[itemIndex], done: !items[itemIndex].done };
      section.items = items;
      next[sectionIndex] = section;
      return next;
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.View style={{ opacity: headerFade }}>
        <Header title="Onboarding" onBack={() => navigation.goBack()} />
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.statsRow, { opacity: statsSlide.opacity, transform: [{ translateY: statsSlide.offset }] }]}>
          {[
            { label: 'New Hires', value: onboardingData.newHires.length, color: colors.primary },
            { label: 'In Progress', value: onboardingData.newHires.filter(h => h.status === 'in-progress').length, color: colors.warning },
            { label: 'Completed', value: onboardingData.newHires.filter(h => h.status === 'completed').length, color: colors.success },
          ].map((stat, i) => {
            const scaleIn = useScaleIn(300, 200 + i * 100);
            return (
              <Animated.View key={stat.label} style={[styles.statCard, { opacity: scaleIn.opacity, transform: [{ scale: scaleIn.scale }] }]}>
                <Text style={[styles.statNumber, { color: stat.color }]}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </Animated.View>
            );
          })}
        </Animated.View>

        <Animated.View style={[{ opacity: hiresSlide.opacity, transform: [{ translateY: hiresSlide.offset }] }]}>
          <Text style={styles.sectionTitle}>New Hires</Text>
          {onboardingData.newHires.map((hire, i) => {
            const slideIn = useSlideIn('up', 350, 400 + i * 100);
            return (
              <Animated.View key={hire.id} style={[{ opacity: slideIn.opacity, transform: [{ translateY: slideIn.offset }], marginBottom: spacing.md }]}>
                <AnimatedCard index={i} onPress={() => { hapticFeedback('medium'); navigation.navigate('EmployeeDetail', { employee: hire }); }} activeOpacity={0.7} style={styles.hireCard}>
                  <Card padding="md" style={{ backgroundColor: 'transparent', borderWidth: 0 }}>
                    <View style={styles.hireHeader}>
                      <View style={styles.hireLeft}>
                        <Avatar name={hire.name} size="medium" />
                        <View>
                          <Text style={styles.hireName}>{hire.name}</Text>
                          <Text style={styles.hireRole}>{hire.role} • {hire.department}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.hireDetails}>
                      <View style={styles.hireDetailItem}>
                        <Ionicons name="calendar-outline" size={14} color={colors.textTertiary} />
                        <Text style={styles.hireDetailText}>Starts: {hire.startDate}</Text>
                      </View>
                      <View style={styles.hireDetailItem}>
                        <Ionicons name="people-outline" size={14} color={colors.textTertiary} />
                        <Text style={styles.hireDetailText}>Buddy: {hire.buddy}</Text>
                      </View>
                    </View>
                    <View style={styles.progressSection}>
                      <Text style={styles.progressLabel}>Progress: {hire.progress}%</Text>
                      <ProgressBar currentStep={hire.progress} totalSteps={100} />
                    </View>
                  </Card>
                </AnimatedCard>
              </Animated.View>
            );
          })}
        </Animated.View>

        <Animated.View style={[{ opacity: checklistSlide.opacity, transform: [{ translateY: checklistSlide.offset }] }]}>
          <Text style={styles.sectionTitle}>Onboarding Checklist</Text>
          {checklist.map((section, i) => {
            const slideIn = useSlideIn('up', 350, 700 + i * 100);
            const doneCount = section.items.filter(it => it.done).length;
            const totalCount = section.items.length;
            return (
              <Animated.View key={section.id} style={[{ opacity: slideIn.opacity, transform: [{ translateY: slideIn.offset }], marginBottom: spacing.md }]}>
                <Card style={styles.checklistCard} padding="md">
                  <View style={styles.checklistHeader}>
                    <Text style={styles.checklistTitle}>{section.title}</Text>
                    <Text style={styles.checklistCount}>{doneCount}/{totalCount}</Text>
                  </View>
                  {section.items.map((item, j) => {
                    const itemSlide = useSlideIn('right', 250, 800 + i * 100 + j * 50);
                    return (
                      <AnimatedListItem key={j} index={j} haptic={null}>
                        <Animated.View style={[{ opacity: itemSlide.opacity, transform: [{ translateX: itemSlide.offset }] }]}>
                          <TouchableOpacity
                            style={styles.checklistItem}
                            onPress={() => toggleCheckItem(i, j)}
                            activeOpacity={0.7}
                            accessibilityLabel={`${item.done ? 'Uncheck' : 'Check'}: ${item.task}`}
                            accessibilityRole="checkbox"
                            accessibilityState={{ checked: item.done }}
                          >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 }}>
                              <View style={[styles.checkCircle, { backgroundColor: item.done ? colors.success : colors.surfaceVariant }]}>
                                <Ionicons name={item.done ? 'checkmark' : 'ellipse-outline'} size={16} color={item.done ? colors.textInverse : colors.textTertiary} />
                              </View>
                              <Text style={[styles.checkText, { color: item.done ? colors.textSecondary : colors.text, textDecorationLine: item.done ? 'line-through' : 'none' }]}>{item.task}</Text>
                            </View>
                          </TouchableOpacity>
                        </Animated.View>
                      </AnimatedListItem>
                    );
                  })}
                </Card>
              </Animated.View>
            );
          })}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  statCard: { flex: 1, alignItems: 'center', padding: spacing.md, backgroundColor: colors.surface, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border },
  statNumber: { ...typography.h3, color: colors.text },
  statLabel: { ...typography.caption, color: colors.textTertiary },
  sectionTitle: { ...typography.label, color: colors.textTertiary, marginBottom: spacing.md, marginTop: spacing.lg },
  hireCard: { marginBottom: spacing.md },
  hireHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  hireLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  hireName: { ...typography.body, color: colors.text, fontWeight: '600' },
  hireRole: { ...typography.bodySmall, color: colors.textSecondary },
  hireDetails: { flexDirection: 'row', gap: spacing.lg, marginBottom: spacing.md },
  hireDetailItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  hireDetailText: { ...typography.bodySmall, color: colors.textSecondary },
  progressSection: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md },
  progressLabel: { ...typography.bodySmall, color: colors.text, fontWeight: '600', marginBottom: spacing.sm },
  checklistCard: { marginBottom: spacing.md },
  checklistHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  checklistTitle: { ...typography.h5, color: colors.text },
  checklistCount: { ...typography.bodySmall, color: colors.textTertiary },
  checklistItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xs },
  checkCircle: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  checkText: { ...typography.body, flex: 1 },
});
