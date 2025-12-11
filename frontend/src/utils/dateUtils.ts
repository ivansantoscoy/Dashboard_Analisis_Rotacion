/**
 * Utilidades para manejo de fechas
 */

import { format, parse, differenceInDays, differenceInWeeks } from 'date-fns';
import { es } from 'date-fns/locale';

export function parseDate(dateString: string): Date | null {
  if (!dateString || dateString.trim() === '') return null;

  try {
    // Intentar varios formatos comunes
    const formats = [
      'yyyy-MM-dd',
      'dd/MM/yyyy',
      'MM/dd/yyyy',
      'dd-MM-yyyy',
      'yyyy/MM/dd',
    ];

    for (const formatStr of formats) {
      try {
        const parsed = parse(dateString, formatStr, new Date());
        if (!isNaN(parsed.getTime())) {
          return parsed;
        }
      } catch {
        continue;
      }
    }

    // Intentar parseando como ISO
    const isoDate = new Date(dateString);
    if (!isNaN(isoDate.getTime())) {
      return isoDate;
    }

    return null;
  } catch {
    return null;
  }
}

export function formatDate(date: Date | string | null | undefined, formatStr = 'dd/MM/yyyy'): string {
  if (!date) return '-';

  try {
    const dateObj = typeof date === 'string' ? parseDate(date) : date;
    if (!dateObj) return '-';
    return format(dateObj, formatStr, { locale: es });
  } catch {
    return '-';
  }
}

export function calcularDiferenciaDias(fecha1: Date, fecha2: Date): number {
  return differenceInDays(fecha2, fecha1);
}

export function calcularDiferenciaSemanas(fecha1: Date, fecha2: Date): number {
  return differenceInWeeks(fecha2, fecha1);
}

export function calcularAntiguedadMeses(semanas: number): number {
  return Math.floor(semanas / 4.33);
}

export function calcularAntiguedadDias(semanas: number): number {
  return semanas * 7;
}
