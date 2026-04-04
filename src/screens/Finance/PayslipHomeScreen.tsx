import React, { useState, useEffect, useCallback } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Card, Badge, AnimatedCard, AnimatedListItem } from '../../components';
import { hapticFeedback } from '../../utils/haptics';
import { useFadeIn, useSlideIn } from '../../utils/animations';
import { getState, subscribe } from '../../store';

export const PayslipHomeScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [appState, setAppState] = useState(getState());
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const fadeIn = useFadeIn();
  const slideIn = useSlideIn();

  useEffect(() => {
    const unsubscribe = subscribe(setAppState);
    return unsubscribe;
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setAppState(getState());
    setRefreshing(false);
  }, []);

  const { payroll, user } = appState;
  const latest = payroll.payslips[0];
  const totalEarned = payroll.payslips.reduce((sum, p) => sum + p.netPay, 0);
  const totalDeductions = payroll.payslips.reduce((sum, p) => sum + p.deductions + p.tax, 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Payslips" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <AnimatedCard delay={0}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              hapticFeedback('medium');
              navigation.navigate('PayslipDetail', { payslip: latest });
            }}
            accessibilityRole="button"
            accessibilityLabel={`View ${latest.period} payslip details`}
          >
            <Card style={styles.latestCard} padding="lg">
              <Text style={styles.latestLabel}>Latest Pay Period</Text>
              <Text style={styles.latestPeriod}>{latest.period}</Text>
              <View style={styles.amountRow}>
                <Text style={styles.amountValue}>${latest.netPay.toLocaleString()}.00</Text>
                <Badge text={latest.status.toUpperCase()} variant="success" />
              </View>
              <View style={styles.latestDetails}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Basic</Text>
                  <Text style={styles.detailValue}>${latest.basic.toLocaleString()}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>HRA</Text>
                  <Text style={styles.detailValue}>${latest.hra.toLocaleString()}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Allowances</Text>
                  <Text style={styles.detailValue}>${latest.allowances.toLocaleString()}</Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        </AnimatedCard>

        <View style={styles.summaryGrid}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{ flex: 1 }}
            onPress={() => hapticFeedback('medium')}
            accessibilityRole="button"
            accessibilityLabel={`Total earned: $${totalEarned.toLocaleString()}`}
          >
            <Card style={styles.summaryCard} padding="md">
              <Text style={styles.summaryLabel}>TOTAL EARNED</Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>${totalEarned.toLocaleString()}</Text>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{ flex: 1 }}
            onPress={() => hapticFeedback('medium')}
            accessibilityRole="button"
            accessibilityLabel={`Total deducted: $${totalDeductions.toLocaleString()}`}
          >
            <Card style={styles.summaryCard} padding="md">
              <Text style={styles.summaryLabel}>TOTAL DEDUCTED</Text>
              <Text style={[styles.summaryValue, { color: colors.error }]}>${totalDeductions.toLocaleString()}</Text>
            </Card>
          </TouchableOpacity>
        </View>

        <Text style={styles.historyTitle}>PAYSLIP HISTORY</Text>

        <View style={styles.historyList}>
          {payroll.payslips.map((item, index) => (
            <AnimatedListItem key={item.id} index={index}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.historyItem}
                onPress={() => {
                  hapticFeedback('light');
                  navigation.navigate('PayslipDetail', { payslip: item });
                }}
                accessibilityRole="button"
                accessibilityLabel={`${item.month} payslip, $${item.netPay.toLocaleString()}`}
              >
                <View style={[styles.historyIcon, { backgroundColor: item.bonus > 0 ? colors.warningLight : colors.primaryLighter }]}>
                  <Ionicons name={item.bonus > 0 ? 'gift' : 'document-text'} size={20} color={item.bonus > 0 ? colors.warning : colors.primary} />
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyMonth}>{item.month}</Text>
                  <Text style={styles.historyDate}>Paid on {item.paidOn}</Text>
                  <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownText}>Basic: ${item.basic.toLocaleString()}</Text>
                    {item.overtime > 0 && <Text style={styles.breakdownText}>OT: ${item.overtime}</Text>}
                    {item.bonus > 0 && <Text style={styles.breakdownText}>Bonus: ${item.bonus}</Text>}
                  </View>
                </View>
                <View style={styles.historyRight}>
                  <Text style={styles.historyAmount}>${item.netPay.toLocaleString()}</Text>
                  <Badge text={item.status.toUpperCase()} variant="success" size="small" />
                </View>
              </TouchableOpacity>
            </AnimatedListItem>
          ))}
        </View>

        <Text style={styles.historyTitle}>TAX DOCUMENTS</Text>
        {payroll.taxDocuments.map((doc, index) => (
          <AnimatedCard key={doc.id} delay={index * 100}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                hapticFeedback('light');
                Alert.alert(doc.name, `Tax Year ${doc.year} - Status: ${doc.status}`);
              }}
              accessibilityRole="button"
              accessibilityLabel={`${doc.name} tax year ${doc.year}`}
            >
              <Card style={styles.taxCard} padding="md">
                <View style={styles.taxRow}>
                  <View style={[styles.taxIcon, { backgroundColor: `${colors.accentPurple}15` }]}>
                    <Ionicons name="file-tray" size={20} color={colors.accentPurple} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.taxName}>{doc.name}</Text>
                    <Text style={styles.taxYear}>Tax Year {doc.year}</Text>
                  </View>
                  <Badge text={doc.status} variant={doc.status === 'available' ? 'success' : 'warning'} size="small" />
                </View>
              </Card>
            </TouchableOpacity>
          </AnimatedCard>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  latestCard: { backgroundColor: colors.primary, marginBottom: spacing.md },
  latestLabel: { ...typography.bodySmall, color: 'rgba(255,255,255,0.7)', marginBottom: spacing.xs },
  latestPeriod: { ...typography.body, color: colors.textInverse, marginBottom: spacing.lg },
  amountRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  amountValue: { ...typography.statNumber, color: colors.textInverse },
  latestDetails: { flexDirection: 'row', gap: spacing.md, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', paddingTop: spacing.md },
  detailItem: { flex: 1 },
  detailLabel: { ...typography.caption, color: 'rgba(255,255,255,0.6)' },
  detailValue: { ...typography.body, color: colors.textInverse, fontWeight: '600' },
  summaryGrid: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  summaryCard: { flex: 1 },
  summaryLabel: { ...typography.caption, color: colors.textTertiary, marginBottom: spacing.xs },
  summaryValue: { ...typography.h4, color: colors.text },
  historyTitle: { ...typography.label, color: colors.textTertiary, marginBottom: spacing.md, marginTop: spacing.lg },
  historyList: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', marginBottom: spacing.lg },
  historyItem: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  historyIcon: { width: 44, height: 44, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  historyInfo: { flex: 1 },
  historyMonth: { ...typography.body, color: colors.text, fontWeight: '600' },
  historyDate: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  breakdownRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  breakdownText: { ...typography.caption, color: colors.textTertiary },
  historyRight: { alignItems: 'flex-end' },
  historyAmount: { ...typography.body, color: colors.text, fontWeight: '700' },
  taxCard: { marginBottom: spacing.sm },
  taxRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  taxIcon: { width: 40, height: 40, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center' },
  taxName: { ...typography.body, color: colors.text, fontWeight: '600' },
  taxYear: { ...typography.caption, color: colors.textTertiary },
});
