// src/components/IndustrialInput.tsx
import { colors } from '@/src/styles/colors';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
    ViewStyle,
} from 'react-native';

interface IndustrialInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export default function IndustrialInput({
  label,
  error,
  containerStyle,
  onFocus,
  onBlur,
  ...props
}: IndustrialInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            isFocused ? styles.inputFocused : undefined,
            error ? styles.inputError : undefined,
          ]}
          placeholderTextColor={colors.textDark}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        <View style={[styles.highlight, isFocused && styles.highlightActive]} />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: colors.textDark,
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 6,
    fontFamily: 'monospace',
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: colors.overlay,
    borderWidth: 1,
    borderColor: colors.industrialGray,
    borderRadius: 4,
    padding: 12,
    color: colors.textLight,
    fontFamily: 'monospace',
    fontSize: 14,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  inputError: {
    borderColor: colors.danger,
  },
  highlight: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '0%',
    height: 2,
    backgroundColor: colors.primary,
  },
  highlightActive: {
    width: '100%',
  },
  errorText: {
    color: colors.danger,
    fontSize: 10,
    fontFamily: 'monospace',
    marginTop: 4,
  },
});