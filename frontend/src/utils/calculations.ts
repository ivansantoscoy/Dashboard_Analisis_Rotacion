/**
 * Utilidades de cálculos
 */

import { RANGOS_SALARIALES, RANGOS_ANTIGUEDAD } from './constants';
import type { EmpleadoRotacion } from '@/types';

export function calcularRangoSalarial(salario: number): string {
  const rango = RANGOS_SALARIALES.find(r => salario >= r.min && salario < r.max);
  return rango?.label || 'Desconocido';
}

export function calcularRangoAntiguedad(semanas: number): string {
  const rango = RANGOS_ANTIGUEDAD.find(r => semanas >= r.min && semanas < r.max);
  return rango?.label || 'Desconocido';
}

export function normalizarTipoBaja(tipo: string): 'RV' | 'BXF' {
  return tipo.startsWith('RV') ? 'RV' : 'BXF';
}

export function esRotacionTemprana(semanas: number): boolean {
  return semanas < 13; // Menos de 3 meses
}

export function calcularTasaRotacion(totalEmpleados: number, rotaciones: number): number {
  if (totalEmpleados === 0) return 0;
  return (rotaciones / totalEmpleados) * 100;
}

export function calcularPromedio(valores: number[]): number {
  if (valores.length === 0) return 0;
  return valores.reduce((sum, val) => sum + val, 0) / valores.length;
}

export function calcularMediana(valores: number[]): number {
  if (valores.length === 0) return 0;
  const sorted = [...valores].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

export function calcularDesviacionEstandar(valores: number[]): number {
  if (valores.length === 0) return 0;
  const promedio = calcularPromedio(valores);
  const varianza = valores.reduce((sum, val) => sum + Math.pow(val - promedio, 2), 0) / valores.length;
  return Math.sqrt(varianza);
}

export function agruparPor<T>(
  items: T[],
  clave: keyof T | ((item: T) => string)
): Record<string, T[]> {
  return items.reduce((acc, item) => {
    const key = typeof clave === 'function' ? clave(item) : String(item[clave]);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

export function contarPorCategoria<T>(
  items: T[],
  clave: keyof T | ((item: T) => string)
): Record<string, number> {
  const agrupado = agruparPor(items, clave);
  return Object.entries(agrupado).reduce((acc, [key, values]) => {
    acc[key] = values.length;
    return acc;
  }, {} as Record<string, number>);
}
