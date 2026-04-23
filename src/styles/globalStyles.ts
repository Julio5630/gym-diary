// src/styles/globalStyles.ts
import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const globalStyles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  
  // Cards industriais
  industrialCard: {
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
  },
  
  // Cabeçalho
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    letterSpacing: 4,
    color: colors.text,
    fontWeight: '700',
    textAlign: 'center',
  },
  headerHighlight: {
    color: colors.primary,
  },
  
  // Textos
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 8,
  },
  caption: {
    fontSize: 12,
    color: colors.textDark,
    fontFamily: 'monospace',
  },
  
  // Botões
  button: {
    backgroundColor: colors.industrialGray,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSuccess: {
    backgroundColor: colors.successDark,
  },
  buttonDanger: {
    backgroundColor: colors.danger,
  },
  buttonText: {
    color: colors.textLight,
    fontWeight: 'bold',
    letterSpacing: 1,
    fontSize: 14,
  },
  
  // Inputs
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
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  
  // Rows
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Grid
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItemHalf: {
    width: '48%',
  },
  
  // Espaçamentos
  mb5: { marginBottom: 5 },
  mb10: { marginBottom: 10 },
  mb20: { marginBottom: 20 },
  mb30: { marginBottom: 30 },
  mt5: { marginTop: 5 },
  mt10: { marginTop: 10 },
  mt20: { marginTop: 20 },
  mt30: { marginTop: 30 },
  ml10: { marginLeft: 10 },
  mr10: { marginRight: 10 },
  p10: { padding: 10 },
  p20: { padding: 20 },
  
  // Cantos industriais (rebites)
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
  },
  
  // Rebites
  rivet: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.metal.light,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 2,
  },
  
  // Divisor
  divider: {
    height: 1,
    backgroundColor: colors.industrialBorder,
    marginVertical: 15,
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 10,
    color: colors.textDark,
    fontFamily: 'monospace',
  },
  
  // ScrollView content
  scrollContent: {
    paddingBottom: 40,
  },
});

export const typography = {
  titleLarge: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: 2,
  },
  titleMedium: {
    fontSize: 20,
    fontWeight: '600' as const,
    letterSpacing: 1,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
  },
  bodyBold: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    fontFamily: 'monospace',
  },
  button: {
    fontSize: 14,
    fontWeight: '600' as const,
    letterSpacing: 1,
  },
};