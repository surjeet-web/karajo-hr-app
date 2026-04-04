import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

export const StatusTimeline = ({ items }) => {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={index} style={styles.item}>
          <View style={styles.leftColumn}>
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: item.active ? colors.warning : colors.success,
                },
              ]}
            />
            {index < items.length - 1 && <View style={styles.line} />}
          </View>
          <View style={styles.content}>
            <Text style={styles.statusText}>{item.status}</Text>
            <Text style={styles.detailText}>
              {item.by ? `${item.label} by ${item.by}` : item.label}
            </Text>
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  item: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  leftColumn: {
    alignItems: 'center',
    marginRight: spacing.md,
    width: 16,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginTop: spacing.xs,
  },
  content: {
    flex: 1,
  },
  statusText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  detailText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  dateText: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
});
