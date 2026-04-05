import React, { useState } from 'react';
import type { NativeStackScreenProps, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Header, Button } from '../../components';
import { penaltyData } from '../../data/mockData';
import { hapticFeedback } from '../../utils/haptics';

export const PenaltyAppealScreen: React.FC<any> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { penalty } = route.params || {};
  const [selectedType, setSelectedType] = useState<any>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [supportingDoc, setSupportingDoc] = useState<any>(null);

  const pickDocument = async () => {
    hapticFeedback('light');
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Please allow access to your media library to upload documents.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSupportingDoc(result.assets[0].uri);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="File Appeal" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {penalty && (
          <View style={styles.penaltyBanner}>
            <Ionicons name="warning" size={20} color={colors.error} />
            <View style={styles.bannerText}>
              <Text style={styles.bannerTitle}>Appealing: {penalty.type}</Text>
              <Text style={styles.bannerRef}>{penalty.reference}</Text>
            </View>
          </View>
        )}

        <View style={styles.field}>
          <Text style={styles.label}>Appeal Type</Text>
          <Text style={styles.sublabel}>Select the reason for your appeal</Text>
          {penaltyData.appealTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.typeOption,
                selectedType === type.id && styles.typeOptionSelected,
              ]}
              onPress={() => setSelectedType(type.id)}
            >
              <View style={[styles.typeIcon, selectedType === type.id && { backgroundColor: colors.primary }]}>
                <Ionicons name={type.icon} size={18} color={selectedType === type.id ? colors.textInverse : colors.textTertiary} />
              </View>
              <Text style={[styles.typeLabel, selectedType === type.id && styles.typeLabelSelected]}>{type.label}</Text>
              {selectedType === type.id && (
                <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Explanation</Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="Explain why you believe this penalty should be reviewed..."
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={6}
              value={explanation}
              onChangeText={setExplanation}
              maxLength={500}
            />
            <Text style={styles.charCount}>{explanation.length}/500</Text>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Supporting Documents</Text>
          <TouchableOpacity style={styles.uploadArea} onPress={pickDocument} accessibilityLabel="Upload supporting document" accessibilityRole="button">
            <View style={styles.uploadIcon}>
              <Ionicons name="cloud-upload" size={28} color={supportingDoc ? colors.success : colors.primary} />
            </View>
            {supportingDoc ? (
              <Text style={styles.uploadTextSuccess}>Document attached successfully</Text>
            ) : (
              <>
                <Text style={styles.uploadText}>Tap to upload supporting documents</Text>
                <Text style={styles.uploadSubtext}>PDF, JPG, PNG (max 5MB)</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={colors.info} />
          <Text style={styles.infoText}>
            Appeals are reviewed by the HR department within 5-7 business days. Provide clear explanations and supporting evidence for the best outcome.
          </Text>
        </View>
      </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Continue to Review"
            onPress={() => { hapticFeedback('medium'); navigation.navigate('PenaltyReview', { penalty, appealType: selectedType, explanation, supportingDoc }); }}
            disabled={!selectedType || !explanation.trim()}
          />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  penaltyBanner: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.errorLight, padding: spacing.md, borderRadius: borderRadius.lg, marginBottom: spacing.lg },
  bannerText: { flex: 1 },
  bannerTitle: { ...typography.body, color: colors.error, fontWeight: '600' },
  bannerRef: { ...typography.caption, color: colors.error },
  field: { marginBottom: spacing.lg },
  label: { ...typography.label, color: colors.text, marginBottom: spacing.xs },
  sublabel: { ...typography.caption, color: colors.textTertiary, marginBottom: spacing.md },
  typeOption: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, borderWidth: 1.5, borderColor: colors.border, borderRadius: borderRadius.lg, marginBottom: spacing.sm, backgroundColor: colors.surface },
  typeOptionSelected: { borderColor: colors.primary, backgroundColor: colors.primaryLighter },
  typeIcon: { width: 36, height: 36, borderRadius: borderRadius.md, backgroundColor: colors.surfaceVariant, justifyContent: 'center', alignItems: 'center' },
  typeLabel: { ...typography.body, color: colors.textSecondary, flex: 1 },
  typeLabelSelected: { color: colors.primary, fontWeight: '600' },
  textAreaContainer: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: borderRadius.lg, padding: spacing.md },
  textArea: { ...typography.body, color: colors.text, minHeight: 120, textAlignVertical: 'top' },
  charCount: { ...typography.caption, color: colors.textTertiary, textAlign: 'right', marginTop: spacing.xs },
  uploadArea: { alignItems: 'center', padding: spacing.xl, borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed', borderRadius: borderRadius.lg, backgroundColor: colors.surface },
  uploadIcon: { marginBottom: spacing.sm },
  uploadText: { ...typography.body, color: colors.primary, fontWeight: '600' },
  uploadTextSuccess: { ...typography.body, color: colors.success, fontWeight: '600' },
  uploadSubtext: { ...typography.caption, color: colors.textTertiary, marginTop: spacing.xs },
  infoBox: { flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.infoLight, padding: spacing.md, borderRadius: borderRadius.lg },
  infoText: { ...typography.bodySmall, color: colors.info, flex: 1 },
  footer: { padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
});
