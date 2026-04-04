import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Card } from '../../components';

export const AttendanceCalendarScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(22);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = Array.from({ length: 28 }, (_, i) => i + 1);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Attendance Calendar" onBack={() => navigation.goBack()} />

      <View style={styles.monthNavigator}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.monthContainer}>
          <Text style={styles.monthText}>February 2026</Text>
          <Text style={styles.weekText}>Current Period</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="chevron-forward" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.calendarCard} padding="md">
          <View style={styles.daysRow}>
            {days.map((day) => (
              <Text key={day} style={styles.dayHeader}>{day}</Text>
            ))}
          </View>
          <View style={styles.datesGrid}>
            {dates.map((date) => (
              <TouchableOpacity
                key={date}
                style={[
                  styles.dateCell,
                  selectedDate === date && styles.dateCellSelected,
                  date === 22 && styles.dateCellToday,
                ]}
                onPress={() => setSelectedDate(date)}
              >
                <Text style={[styles.dateText, selectedDate === date && styles.dateTextSelected]}>
                  {date}
                </Text>
                {date === 22 && <View style={styles.todayDot} />}
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
            <Text style={styles.legendText}>Present</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
            <Text style={styles.legendText}>Late</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.error }]} />
            <Text style={styles.legendText}>Absent</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.info }]} />
            <Text style={styles.legendText}>Leave</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  monthNavigator: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.lg, paddingVertical: spacing.md },
  monthContainer: { alignItems: 'center' },
  monthText: { ...typography.h5, color: colors.text },
  weekText: { ...typography.bodySmall, color: colors.textSecondary },
  scrollContent: { padding: spacing.lg },
  calendarCard: { marginBottom: spacing.lg },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  dayHeader: { ...typography.caption, color: colors.textTertiary, width: 40, textAlign: 'center' },
  datesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  dateCell: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm },
  dateCellSelected: { backgroundColor: colors.primary, borderRadius: borderRadius.md },
  dateCellToday: { borderWidth: 2, borderColor: colors.primary, borderRadius: borderRadius.md },
  dateText: { ...typography.body, color: colors.text },
  dateTextSelected: { color: colors.textInverse, fontWeight: '600' },
  todayDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.primary, marginTop: 2 },
  legendRow: { flexDirection: 'row', justifyContent: 'space-around' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { ...typography.bodySmall, color: colors.textSecondary },
});
