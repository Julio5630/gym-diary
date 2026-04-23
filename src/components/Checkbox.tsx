// src/components/Checkbox.tsx
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';
import { colors } from '@/src/styles/colors';
import { MotiView } from 'moti';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  size?: number;
}

export default function Checkbox({ checked, onToggle, size = 44 }: CheckboxProps) {
  const innerSize = size * 0.84;
  const strokeWidth = size * 0.056;

  return (
    <Pressable onPress={onToggle} style={[styles.container, { width: size, height: size }]}>
      <MotiView
        animate={{
          scale: checked ? [0.9, 1] : 1,
        }}
        transition={{ type: 'spring', damping: 12 }}
      >
        <Svg viewBox="0 0 35.6 35.6" width={size} height={size}>
          <Circle
            cx="17.8"
            cy="17.8"
            r="17.8"
            fill={checked ? colors.primary : colors.industrialDark}
            stroke={colors.primary}
            strokeWidth={strokeWidth}
          />
          <Circle
            cx="17.8"
            cy="17.8"
            r="14.9"
            fill="none"
            stroke={colors.textLight}
            strokeMiterlimit={10}
            strokeWidth={strokeWidth}
            strokeDashoffset={checked ? 0 : 100}
            strokeDasharray={100}
          />
          <Polyline
            points="11.8 18.2 15.7 22.2 23.6 14"
            fill="none"
            stroke={colors.textLight}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={strokeWidth}
            strokeDashoffset={checked ? 0 : 22}
            strokeDasharray={22}
          />
        </Svg>
      </MotiView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});