import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const sections = [
  {
    title: 'Performance',
    icon: 'trending-up' as const,
    items: [
      { label: 'My KPIs', icon: 'stats-chart' as const, screen: 'MyKPIs' },
      { label: 'My Reviews', icon: 'clipboard' as const, screen: 'MyReviews' },
      { label: 'My Goals', icon: 'flag' as const, screen: 'MyGoals' },
      { label: 'Feedback 360', icon: 'chatbubble-ellipses' as const, screen: 'MyFeedback' },
    ],
  },
  {
    title: 'Team',
    icon: 'people' as const,
    items: [
      { label: 'My Team Leader', icon: 'person' as const, screen: 'MyTeamLeader' },
      { label: 'Team Members', icon: 'people' as const, screen: 'TeamMembers' },
    ],
  },
  {
    title: 'Notifications',
    icon: 'notifications' as const,
    items: [
      { label: 'All Notifications', icon: 'list' as const, screen: 'NotificationsMain' },
    ],
  },
];

export const MoreHomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="More" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
      {sections.map((section) => (
        <View key={section.title} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name={section.icon} size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
          {section.items.map((item) => (
            <TouchableOpacity
              key={item.screen}
              style={styles.item}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Ionicons name={item.icon} size={20} color={colors.textSecondary} />
              <Text style={styles.itemLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>
      ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 24 },
  title: { fontSize: 34, fontWeight: '700', color: colors.text },
  section: { gap: 8 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.text },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
  } as any,
  itemLabel: { flex: 1, fontSize: 16, color: colors.text },
});
