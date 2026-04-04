import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { shortcuts } from '../../data/mockData';

export const ShortcutsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {});

  const getIconName = (icon) => {
    const iconMap = {
      calendar: 'calendar',
      umbrella: 'umbrella',
      clock: 'time',
      moon: 'moon',
      'file-text': 'document-text',
      'credit-card': 'card',
      dollar: 'cash',
      percent: 'pie-chart',
      users: 'people',
      briefcase: 'briefcase',
      folder: 'folder',
      sliders: 'options',
      warning: 'warning',
      people: 'people',
      'git-branch': 'git-branch',
      rocket: 'rocket',
      'trending-up': 'trending-up',
      speedometer: 'speedometer',
      flag: 'flag',
      'chatbubble-ellipses': 'chatbubble-ellipses',
    };
    return iconMap[icon] || 'apps';
  };

  const handleShortcutPress = (shortcut) => {
    switch (shortcut.id) {
      case 'attendance':
        navigation.navigate('AttendanceHistory');
        break;
      case 'leave':
        navigation.navigate('LeaveHome');
        break;
      case 'overtime':
        navigation.navigate('OvertimeHome');
        break;
      case 'payslip':
        navigation.navigate('PayslipHome');
        break;
      case 'reimburse':
        navigation.navigate('ExpenseOverview');
        break;
      case 'penalty':
        navigation.navigate('PenaltyHome');
        break;
      case 'directory':
        navigation.navigate('EmployeeDirectory');
        break;
      case 'orgchart':
        navigation.navigate('OrgChart');
        break;
      case 'onboarding':
        navigation.navigate('Onboarding');
        break;
      case 'performance':
        navigation.navigate('PerformanceDashboard');
        break;
      case 'kpi':
        navigation.navigate('KPITracking');
        break;
      case 'goals':
        navigation.navigate('GoalSetting');
        break;
      case 'feedback':
        navigation.navigate('Feedback360');
        break;
      default:
        break;
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Handle */}
      <View style={styles.handleContainer}>
        <View style={styles.handle} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Shortcuts</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {Object.entries(groupedShortcuts).map(([category, items]) => (
          <View key={category} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category.toUpperCase()}</Text>
            <View style={styles.shortcutsGrid}>
              {items.map((shortcut) => (
                <TouchableOpacity
                  key={shortcut.id}
                  style={styles.shortcutItem}
                  onPress={() => handleShortcutPress(shortcut)}
                >
                  <View
                    style={[
                      styles.shortcutIcon,
                      { backgroundColor: `${shortcut.color}15` },
                    ]}
                  >
                    <Ionicons
                      name={getIconName(shortcut.icon)}
                      size={24}
                      color={shortcut.color}
                    />
                  </View>
                  <Text style={styles.shortcutName}>{shortcut.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h4,
    color: colors.text,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  categorySection: {
    marginBottom: spacing.xl,
  },
  categoryTitle: {
    ...typography.label,
    color: colors.textTertiary,
    marginBottom: spacing.md,
  },
  shortcutsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  shortcutItem: {
    alignItems: 'center',
    width: 70,
  },
  shortcutIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  shortcutName: {
    ...typography.bodySmall,
    color: colors.text,
    textAlign: 'center',
  },
});
