/**
 * Utilidades para manejo de fechas
 */

import { format, parse, differenceInDays, differenceInWeeks } from 'date-fns';
import { es } from 'date-fns/locale';

export function parseDate(dateString: string | number): Date | null {
  if (dateString === null || dateString === undefined || dateString === '') return null;

  try {
    // Si es un número (serial de Excel)
    if (typeof dateString === 'number') {
      // Convertir número serial de Excel a fecha JavaScript
      // Excel cuenta días desde 1/1/1900
      // JavaScript cuenta milisegundos desde 1/1/1970
      // Offset: 25569 días entre ambas fechas
      const excelEpoch = new Date(1899, 11, 30); // 30 de diciembre de 1899
      const jsDate = new Date(excelEpoch.getTime() + dateString * 86400000);
      return jsDate;
    }

    // Convertir a string si no lo es
    const dateStr = dateString.toString().trim();
    if (dateStr === '') return null;

    // Si parece un número como string, convertir
    const asNumber = parseFloat(dateStr);
    if (!isNaN(asNumber) && asNumber > 1000) {
      // Probablemente es un serial de Excel
      const excelEpoch = new Date(1899, 11, 30);
      const jsDate = new Date(excelEpoch.getTime() + asNumber * 86400000);
      return jsDate;
    }

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
        const parsed = parse(dateStr, formatStr, new Date());
        if (!isNaN(parsed.getTime())) {
          return parsed;
        }
      } catch {
        continue;
      }
    }

    // Intentar parseando como ISO
    const isoDate = new Date(dateStr);
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
