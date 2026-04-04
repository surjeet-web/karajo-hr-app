import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Card, Badge, Button } from '../../components';
import { getState, subscribe } from '../../store';

export const PermissionHomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [appState, setAppState] = useState(getState());
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const unsubscribe = subscribe(setAppState);
    return unsubscribe;
  }, []);

  const { permission } = appState;
  const remaining = Math.max(0, permission.monthlyAllowance - permission.totalHoursUsed);
  const filtered = activeTab === 'all' ? permission.requests : permission.requests.filter(r => r.status === activeTab);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Permission" onBack={() => navigation.goBack()} />

      <View style={styles.tabsContainer}>
        {['all', 'pending', 'approved', 'rejected'].map(tab => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.activeTab]} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.summaryGrid}>
          <Card style={styles.summaryCard} padding="md">
            <Text style={styles.summaryLabel}>MONTHLY ALLOWANCE</Text>
            <Text style={styles.summaryValue}>{permission.monthlyAllowance}h</Text>
          </Card>
          <Card style={styles.summaryCard} padding="md">
            <Text style={styles.summaryLabel}>USED</Text>
            <Text style={[styles.summaryValue, { color: colors.warning }]}>{permission.totalHoursUsed}h</Text>
          </Card>
        </View>
        <Card style={styles.remainingCard} padding="md">
          <View style={styles.remainingRow}>
            <Ionicons name="time-outline" size={18} color={remaining > 4 ? colors.success : colors.error} />
            <Text style={styles.remainingText}>{remaining}h remaining this month</Text>
          </View>
        </Card>

        {filtered.map((request) => (
          <Card key={request.id} style={styles.requestCard} padding="md">
            <View style={styles.requestHeader}>
              <View style={styles.requestLeft}>
                <View style={styles.requestIcon}>
                  <Ionicons name="document-text" size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.requestTitle}>{request.reason}</Text>
                  <Text style={styles.requestType}>{request.date}</Text>
                </View>
              </View>
              <Badge text={request.status.charAt(0).toUpperCase() + request.status.slice(1)} variant={getStatusVariant(request.status)} size="small" />
            </View>
            <View style={styles.requestDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailValue}>{request.startTime} - {request.endTime}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Duration</Text>
                <Text style={styles.detailValue}>{request.duration}h</Text>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Request Permission" icon={<Ionicons name="add" size={20} color={colors.textInverse} />} onPress={() => navigation.navigate('PermissionRequest')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  tabsContainer: { flexDirection: 'row', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.lg },
  tab: { paddingVertical: spacing.xs },
  activeTab: { borderBottomWidth: 2, borderBottomColor: colors.primary },
  tabText: { ...typography.body, color: colors.textSecondary },
  activeTabText: { color: colors.primary, fontWeight: '600' },
  scrollContent: { padding: spacing.lg },
  summaryGrid: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  summaryCard: { flex: 1 },
  summaryLabel: { ...typography.caption, color: colors.textTertiary, marginBottom: spacing.xs },
  summaryValue: { ...typography.h4, color: colors.text },
  remainingCard: { marginBottom: spacing.lg, backgroundColor: colors.successLight },
  remainingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  remainingText: { ...typography.body, color: colors.success, fontWeight: '600' },
  requestCard: { marginBottom: spacing.md },
  requestHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md },
  requestLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  requestIcon: { width: 44, height: 44, borderRadius: borderRadius.md, backgroundColor: colors.primaryLighter, justifyContent: 'center', alignItems: 'center' },
  requestTitle: { ...typography.body, color: colors.text, fontWeight: '600' },
  requestType: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  requestDetails: { flexDirection: 'row', gap: spacing.xl, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md },
  detailItem: { flex: 1 },
  detailLabel: { ...typography.caption, color: colors.textTertiary, marginBottom: spacing.xs },
  detailValue: { ...typography.bodySmall, color: colors.text },
  footer: { padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
});
