import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Card } from '../../components';
import { hapticFeedback } from '../../utils/haptics';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DATE_STATUSES = {
  1: 'present', 2: 'present', 3: 'present', 4: 'late', 5: 'present',
  6: 'present', 7: 'present', 8: 'absent', 9: 'present', 10: 'present',
  11: 'leave', 12: 'present', 13: 'present', 14: 'present', 15: 'present',
  16: 'present', 17: 'present', 18: 'present', 19: 'absent', 20: 'present',
  21: 'present', 22: 'present', 23: 'late', 24: 'present', 25: 'present',
  26: 'present', 27: 'present', 28: 'present',
};

export const AttendanceCalendarScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(1);
  const [currentYear, setCurrentYear] = useState(2026);

  const goPrevMonth = () => {
    hapticFeedback('light');
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
    setSelectedDate(null);
  };

  const goNextMonth = () => {
    hapticFeedback('light');
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
    setSelectedDate(null);
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = Array.from({ length: 28 }, (_, i) => i + 1);

  const getStatusColor = (date) => {
    const status = DATE_STATUSES[date];
    switch (status) {
      case 'present': return colors.success;
      case 'late': return colors.warning;
      case 'absent': return colors.error;
      case 'leave': return colors.info;
      default: return null;
    }
  };

  const handleDatePress = (date) => {
    hapticFeedback('light');
    setSelectedDate(date);
    navigation.navigate('AttendanceDetail', {
      record: {
        date: `${MONTHS[currentMonth]} ${date}, ${currentYear}`,
        status: DATE_STATUSES[date] || 'present',
        checkIn: DATE_STATUSES[date] === 'late' ? '09:45 AM' : '09:00 AM',
        checkOut: DATE_STATUSES[date] === 'absent' ? null : '06:00 PM',
        totalHours: DATE_STATUSES[date] === 'absent' ? 0 : 9,
      }
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Attendance Calendar" onBack={() => navigation.goBack()} />

      <View style={styles.monthNavigator}>
        <TouchableOpacity onPress={goPrevMonth} activeOpacity={0.7} accessibilityLabel="Previous month">
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.monthContainer}>
          <Text style={styles.monthText}>{MONTHS[currentMonth]} {currentYear}</Text>
          <Text style={styles.weekText}>
            {currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear() ? 'Current Period' : 'Viewing Period'}
          </Text>
        </View>
        <TouchableOpacity onPress={goNextMonth} activeOpacity={0.7} accessibilityLabel="Next month">
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
            {dates.map((date) => {
              const statusColor = getStatusColor(date);
              const isToday = date === 22 && currentMonth === 1 && currentYear === 2026;
              return (
                <TouchableOpacity
                  key={date}
                  style={[
                    styles.dateCell,
                    selectedDate === date && styles.dateCellSelected,
                    isToday && styles.dateCellToday,
                  ]}
                  onPress={() => handleDatePress(date)}
                  activeOpacity={0.7}
                  accessibilityLabel={`${MONTHS[currentMonth]} ${date}, ${currentYear}${statusColor ? `, ${statusColor}` : ''}`}
                >
                  <Text style={[styles.dateText, selectedDate === date && styles.dateTextSelected]}>
                    {date}
                  </Text>
                  {statusColor && !isToday && <View style={[styles.statusDot, { backgroundColor: statusColor }]} />}
                  {isToday && <View style={styles.todayDot} />}
                </TouchableOpacity>
              );
            })}
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
  statusDot: { width: 4, height: 4, borderRadius: 2, marginTop: 2 },
  legendRow: { flexDirection: 'row', justifyContent: 'space-around' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { ...typography.bodySmall, color: colors.textSecondary },
});
