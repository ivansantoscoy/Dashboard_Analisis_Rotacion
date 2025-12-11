/**
 * Constantes y configuraciones del sistema
 */

import type { EmpleadoRaw } from '@/types';

export const RANGOS_SALARIALES = [
  { min: 0, max: 5000, label: '$0 - $5,000' },
  { min: 5000, max: 8000, label: '$5,000 - $8,000' },
  { min: 8000, max: 12000, label: '$8,000 - $12,000' },
  { min: 12000, max: 20000, label: '$12,000 - $20,000' },
  { min: 20000, max: Infinity, label: '$20,000+' },
] as const;

export const RANGOS_ANTIGUEDAD = [
  { min: 0, max: 4, label: '0-1 mes (0-4 semanas)' },
  { min: 4, max: 13, label: '1-3 meses (4-13 semanas)' },
  { min: 13, max: 26, label: '3-6 meses (13-26 semanas)' },
  { min: 26, max: 52, label: '6-12 meses (26-52 semanas)' },
  { min: 52, max: 104, label: '1-2 años (52-104 semanas)' },
  { min: 104, max: Infinity, label: '2+ años (104+ semanas)' },
] as const;

export const COLUMN_MAPPING: Record<keyof EmpleadoRaw, string> = {
  'Depto.': 'departamento',
  'Empleado#': 'numeroEmpleado',
  'Nombre': 'nombre',
  'Fecha de baja en el Sistema': 'fechaBajaSistema',
  'Fecha de último día de trabajo (UDT)': 'fechaUltimoDiaTrabajo',
  'Fecha de Alta': 'fechaAlta',
  'Antigüedad en Semanas': 'antiguedadSemanas',
  'Número de semana de las últimas horas trabajadas': 'numeroSemanaUltimasHoras',
  'Total de horas trabajadas  en la última semana': 'totalHorasUltimaSemana',
  'Fecha en que se hizo el finiquito': 'fechaFiniquito',
  'Fecha de entrega de finiquito': 'fechaEntregaFiniquito',
  'Monto Finiquito': 'montoFiniquito',
  'Encuesta de salida 4FRH-209': 'encuestaSalida4FRH209',
  'Clase': 'clase',
  'Turno': 'turno',
  'Razón de Renuncia': 'razonRenunciaRH',
  'Tipo de baja en el Sistema': 'tipoBaja',
  'Razon capturada en Sistema': 'razonCapturadaSistema',
  'Área': 'area',
  'Supervisor': 'supervisor',
  'Puesto': 'puesto',
  'Cumplió con periodo de entrenamiento': 'cumplioEntrenamiento',
  'Total de faltas': 'totalFaltas',
  'Permisos': 'permisos',
  'Falta 1': 'falta1',
  'Falta 2': 'falta2',
  'Falta 3': 'falta3',
  'Falta 4': 'falta4',
  'Salario': 'salario',
  'Último cambio de salario': 'ultimoCambioSalario',
};

export const REQUIRED_COLUMNS = [
  'Empleado#',
  'Nombre',
  'Fecha de baja en el Sistema',
  'Fecha de último día de trabajo (UDT)',
  'Fecha de Alta',
  'Antigüedad en Semanas',
  'Tipo de baja en el Sistema',
  'Área',
  'Supervisor',
  'Puesto',
  'Salario',
  'Turno',
] as const;

export const CATEGORIAS_ANALISIS = [
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'area', label: 'Área' },
  { value: 'puesto', label: 'Puesto' },
  { value: 'turno', label: 'Turno' },
  { value: 'rango_salarial', label: 'Rango Salarial' },
  { value: 'rango_antiguedad', label: 'Rango de Antigüedad' },
  { value: 'cumplimiento_entrenamiento', label: 'Cumplimiento de Entrenamiento' },
] as const;
