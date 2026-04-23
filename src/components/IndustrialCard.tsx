// src/components/IndustrialCard.tsx
import { colors } from '@/src/styles/colors';
import { MotiView } from 'moti';
import React from 'react';
import {
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

interface IndustrialCardProps {
  title?: string;
  icon?: string;
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  noCorner?: boolean;
  noPadding?: boolean;
}

export default function IndustrialCard({
  title,
  icon,
  children,
  onPress,
  style,
  titleStyle,
  noCorner = false,
  noPadding = false,
}: IndustrialCardProps) {
  const cardContent = (
    <>
      {/* Canto industrial */}
      {!noCorner && <View style={styles.corner} />}
      
      {/* Cabeçalho do card */}
      {(title || icon) && (
        <View style={styles.cardHeader}>
          {icon && <Text style={styles.cardIcon}>{icon}</Text>}
          {title && <Text style={[styles.cardTitle, titleStyle]}>{title}</Text>}
        </View>
      )}
      
      {/* Conteúdo */}
      <View style={[!noPadding && styles.cardBody, noPadding && { padding: 0 }]}>
        {children}
      </View>
    </>
  );
  
  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 300 }}
      style={[styles.card, style]}
    >
      {onPress ? (
        <TouchableOpacity style={{ flex: 1 }} onPress={onPress} activeOpacity={0.7}>
          {cardContent}
        </TouchableOpacity>
      ) : (
        <View style={{ flex: 1 }}>
          {cardContent}
        </View>
      )}
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.industrialBorder,
    borderRadius: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 20,
  },
  corner: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopColor: colors.primary,
    borderLeftColor: colors.primary,
    zIndex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 15,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.industrialBorder,
  },
  cardIcon: {
    fontSize: 20,
  },
  cardTitle: {
    fontSize: 14,
    letterSpacing: 1,
    color: colors.textDark,
    fontWeight: '500',
  },
  cardBody: {
    padding: 20,
  },
});