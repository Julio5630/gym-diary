// src/styles/colors.ts

export const colors = {
  // Cores base
  background: '#0a0c0f',
  backgroundDark: '#050607',
  backgroundLight: '#1a1e24',
  
  // Cores industriais
  industrialGray: '#2c3138',
  industrialDark: '#1e2227',
  industrialBorder: 'rgba(255, 255, 255, 0.1)',
  
  // Destaque principal (laranja industrial)
  primary: '#ff6b35',
  primaryDark: '#e55a2a',
  primaryLight: '#ff8448',
  primaryGlow: 'rgba(255, 107, 53, 0.3)',
  
  // Cores de status
  success: '#2ecc71',
  successDark: '#059669',
  danger: '#dc3545',
  dangerLight: '#ff6b6b',
  warning: '#ffc107',
  gold: '#ffd700',
  
  // Texto
  text: '#e0e0e0',
  textDark: '#aaaaaa',
  textLight: '#ffffff',
  
  // Metais
  metal: {
    light: '#b0b0b0',
    dark: '#4a4a4a',
    gradient: ['#3a3f44', '#1e2227'] as const,
  },
  
  // Overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayDark: 'rgba(0, 0, 0, 0.8)',
  cardBg: 'rgba(18, 22, 28, 0.85)',
};

export type ColorKey = keyof typeof colors;
export type MetalColor = keyof typeof colors.metal;