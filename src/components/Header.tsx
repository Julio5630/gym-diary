// src/components/Header.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/src/styles/colors';
import { MotiText } from 'moti';

interface HeaderProps {
  title: string;
  subtitle?: string;
  variant?: 'default' | 'small';
}

export default function Header({ title, subtitle, variant = 'default' }: HeaderProps) {
  const isSmall = variant === 'small';

  return (
    <View style={styles.container}>
      <MotiText
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500 }}
        style={[styles.title, isSmall && styles.titleSmall]}
      >
        {title}
      </MotiText>
      
      <View style={styles.rivets}>
        <View style={styles.rivet} />
        <View style={styles.rivet} />
        <View style={styles.rivet} />
      </View>
      
      {subtitle && (
        <Text style={[styles.subtitle, isSmall && styles.subtitleSmall]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    letterSpacing: 4,
    color: colors.text,
    fontWeight: '700',
    textAlign: 'center',
  },
  titleSmall: {
    fontSize: 18,
    letterSpacing: 3,
  },
  rivets: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginVertical: 10,
  },
  rivet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.metal.light,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 2,
  },
  subtitle: {
    fontFamily: 'monospace',
    color: colors.primary,
    fontSize: 12,
    letterSpacing: 1,
    backgroundColor: colors.overlay,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 4,
    marginTop: 5,
  },
  subtitleSmall: {
    fontSize: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
});