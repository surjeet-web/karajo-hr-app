import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { borderRadius } from '../theme/spacing';

export const Avatar = ({
  source,
  name = '',
  size = 'medium',
  showStatus = false,
  status = 'offline',
  style = {},
}) => {
  const getSize = () => {
    switch (size) {
      case 'small': return { width: 32, height: 32 };
      case 'medium': return { width: 48, height: 48 };
      case 'large': return { width: 64, height: 64 };
      case 'xlarge': return { width: 80, height: 80 };
      case 'xxlarge': return { width: 120, height: 120 };
      default: return { width: 48, height: 48 };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small': return 12;
      case 'medium': return 16;
      case 'large': return 20;
      case 'xlarge': return 24;
      case 'xxlarge': return 36;
      default: return 16;
    }
  };

  const getInitials = () => {
    if (!name) return '';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const size_ = getSize();

  return (
    <View style={[styles.container, size_, style]}>
      {source ? (
        <Image
          source={{ uri: source }}
          style={[styles.image, size_]}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.fallback, size_]}>
          <Text style={[styles.initials, { fontSize: getFontSize() }]}>
            {getInitials()}
          </Text>
        </View>
      )}
      
      {showStatus && (
        <View
          style={[
            styles.statusIndicator,
            {
              backgroundColor: status === 'online' ? colors.success : colors.textTertiary,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    borderRadius: borderRadius.full,
  },
  fallback: {
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryLighter,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: colors.primary,
    fontWeight: '600',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.surface,
  },
});
