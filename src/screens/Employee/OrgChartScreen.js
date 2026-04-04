import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Card, Avatar, AnimatedListItem } from '../../components';
import { orgChart } from '../../data/mockData';
import { hapticFeedback } from '../../utils/haptics';
import { useFadeIn, useSlideIn } from '../../utils/animations';

const OrgNode = ({ node, depth = 0, isLast = true }) => {
  const [expanded, setExpanded] = useState(depth < 1);
  const hasChildren = node.children && node.children.length > 0;
  const isRoot = depth === 0;

  const toggleExpand = () => {
    hapticFeedback('light');
    setExpanded(!expanded);
  };

  return (
    <View style={{ marginLeft: depth > 0 ? spacing.xl : 0 }}>
      {!isRoot && (
        <View style={styles.connector}>
          <View style={[styles.connectorLine, { height: 20 }]} />
          <View style={styles.connectorCorner} />
          <View style={[styles.connectorLine, { flex: 1 }]} />
        </View>
      )}
      <AnimatedListItem index={depth} haptic={null}>
        <TouchableOpacity style={[styles.nodeCard, { marginLeft: isRoot ? 0 : spacing.md }]} onPress={toggleExpand} activeOpacity={0.7} disabled={!hasChildren}>
          <View style={styles.nodeContent}>
            <Avatar name={node.name} size="small" />
            <View style={styles.nodeInfo}>
              <Text style={styles.nodeName}>{node.name}</Text>
              <Text style={styles.nodeRole}>{node.role}</Text>
            </View>
            {hasChildren && (
              <Ionicons name={expanded ? 'chevron-down' : 'chevron-forward'} size={18} color={colors.textTertiary} />
            )}
          </View>
        </TouchableOpacity>
      </AnimatedListItem>
      {expanded && hasChildren && (
        <View style={styles.childrenContainer}>
          {node.children.map((child, index) => (
            <OrgNode key={child.name} node={child} depth={depth + 1} isLast={index === node.children.length - 1} />
          ))}
        </View>
      )}
    </View>
  );
};

export const OrgChartScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Organization Chart" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card padding="md" style={styles.legendCard}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
            <Text style={styles.legendText}>Tap to expand/collapse teams</Text>
          </View>
        </Card>

        <OrgNode node={orgChart} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  legendCard: { marginBottom: spacing.lg },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { ...typography.bodySmall, color: colors.textSecondary },
  connector: { flexDirection: 'row', alignItems: 'flex-start', height: 40 },
  connectorLine: { width: 1.5, backgroundColor: colors.border },
  connectorCorner: { width: spacing.md, height: 1.5, backgroundColor: colors.border },
  nodeCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.sm },
  nodeContent: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.md },
  nodeInfo: { flex: 1 },
  nodeName: { ...typography.body, color: colors.text, fontWeight: '600' },
  nodeRole: { ...typography.caption, color: colors.textTertiary },
  childrenContainer: { paddingLeft: spacing.md },
});
