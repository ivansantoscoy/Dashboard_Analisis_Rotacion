/**
 * Configuración de colores del sistema
 */

export const COLORS = {
  void: '#000000',
  surface: '#202020',
  borderMain: '#404040',
  textMuted: '#5f5f5f',
  accent: '#7f7f7f',

  // Colores derivados
  primary: '#7f7f7f',
  success: '#4a9f6f',
  warning: '#d4a574',
  danger: '#c65d5d',
  info: '#6b8fb5',
} as const;

export const CHART_COLORS = [
  '#7f7f7f', // accent
  '#6b8fb5', // info
  '#4a9f6f', // success
  '#d4a574', // warning
  '#c65d5d', // danger
  '#5f5f5f', // text-muted
  '#404040', // border-main
  '#909090', // lighter gray
  '#8fa5bf', // lighter info
  '#64af84', // lighter success
] as const;

export const STATUS_COLORS = {
  RV: COLORS.info,
  BXF: COLORS.danger,
  active: COLORS.success,
  inactive: COLORS.textMuted,
  warning: COLORS.warning,
} as const;
