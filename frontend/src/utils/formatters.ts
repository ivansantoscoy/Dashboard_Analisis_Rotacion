/**
 * Utilidades de formateo
 */

export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(value);
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${formatNumber(value, decimals)}%`;
}

export function formatBoolean(value: boolean | string): string {
  if (typeof value === 'boolean') {
    return value ? 'Sí' : 'No';
  }
  const str = value.toString().toLowerCase();
  return str === 'true' || str === 'sí' || str === 'si' || str === '1' ? 'Sí' : 'No';
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

export function capitalizeFirst(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function formatTipoBaja(tipo: string): string {
  if (tipo.startsWith('RV')) return 'Renuncia Voluntaria';
  if (tipo.startsWith('BXF')) return 'Baja por Faltas';
  return tipo;
}
