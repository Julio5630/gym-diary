// src/components/GearBackground.tsx
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import { colors } from '@/src/styles/colors';

const { width, height } = Dimensions.get('window');

interface GearBackgroundProps {
  variant?: 'login' | 'dashboard' | 'library' | 'history' | 'progress' | 'default';
}

export default function GearBackground({ variant = 'default' }: GearBackgroundProps) {
  const getGearStyles = () => {
    switch (variant) {
      case 'login':
        return {
          gear1: { width: 120, height: 120, top: '15%', left: '10%' },
          gear2: { width: 180, height: 180, bottom: '10%', right: '5%' },
          gear3: { width: 80, height: 80, top: '60%', left: '85%' },
        };
      case 'dashboard':
        return {
          gear1: { width: 180, height: 180, bottom: '5%', left: -60 },
          gear2: { width: 120, height: 120, top: '20%', right: -40 },
          gear3: { width: 90, height: 90, top: '60%', right: '10%' },
        };
      case 'library':
        return {
          gear1: { width: 200, height: 200, bottom: -50, left: -80 },
          gear2: { width: 130, height: 130, top: '15%', right: -40 },
          gear3: { width: 80, height: 80, bottom: '20%', right: '15%' },
        };
      case 'history':
        return {
          gear1: { width: 200, height: 200, top: '10%', left: -80 },
          gear2: { width: 150, height: 150, bottom: '5%', right: -60 },
          gear3: null,
        };
      case 'progress':
        return {
          gear1: { width: 200, height: 200, bottom: -50, left: -70 },
          gear2: { width: 130, height: 130, top: '10%', right: -50 },
          gear3: null,
        };
      default:
        return {
          gear1: { width: 150, height: 150, bottom: '5%', left: -50 },
          gear2: { width: 100, height: 100, top: '20%', right: -30 },
          gear3: null,
        };
    }
  };

  const gearStyles = getGearStyles();

  const Gear = ({ size, position, reverse = false }: { size: number; position: any; reverse?: boolean }) => (
    <MotiView
      style={[
        styles.gear,
        {
          width: size,
          height: size,
          ...position,
        },
      ]}
      from={{ rotate: '0deg' }}
      animate={{ rotate: reverse ? '-360deg' : '360deg' }}
      transition={{
        type: 'timing',
        duration: reverse ? 25000 : 20000,
        repeat: Infinity,
        loop: true,
      }}
    >
      <View style={[styles.gearInner, { width: size * 0.3, height: size * 0.3 }]} />
    </MotiView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.bg} />
      {gearStyles.gear1 && (
        <Gear size={gearStyles.gear1.width as number} position={gearStyles.gear1} />
      )}
      {gearStyles.gear2 && (
        <Gear size={gearStyles.gear2.width as number} position={gearStyles.gear2} reverse />
      )}
      {gearStyles.gear3 && (
        <Gear size={gearStyles.gear3.width as number} position={gearStyles.gear3} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
  },
  gear: {
    position: 'absolute',
    backgroundColor: colors.metal.gradient[0],
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
    overflow: 'hidden',
  },
  gearInner: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    backgroundColor: colors.metal.gradient[1],
    borderRadius: 999,
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
});