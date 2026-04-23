// src/components/LoadingSpinner.tsx
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '@/src/styles/colors';
import { MotiView } from 'moti';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({ message = 'Carregando...', fullScreen = false }: LoadingSpinnerProps) {
  const Content = () => (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 300 }}
      style={styles.container}
    >
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </MotiView>
  );

  if (fullScreen) {
    return (
      <View style={styles.fullScreen}>
        <Content />
      </View>
    );
  }

  return <Content />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  message: {
    marginTop: 12,
    color: colors.textDark,
    fontFamily: 'monospace',
    fontSize: 14,
  },
});