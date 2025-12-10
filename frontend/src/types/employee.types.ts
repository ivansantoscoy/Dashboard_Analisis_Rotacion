/**
 * Tipos de datos para empleados y rotación
 */

export type TipoBaja = 'RV' | 'RV.' | 'BXF' | 'BXF.';

export interface EmpleadoRotacion {
  // IDENTIFICACIÓN
  numeroEmpleado: string;
  nombre: string;
  departamento?: string;

  // FECHAS CRÍTICAS
  fechaBajaSistema: Date;
  fechaUltimoDiaTrabajo: Date;
  fechaAlta: Date;

  // ANTIGÜEDAD
  antiguedadSemanas: number;

  // ÚLTIMA SEMANA TRABAJADA
  numeroSemanaUltimasHoras: number;
  totalHorasUltimaSemana: number;

  // FINIQUITO
  fechaFiniquito?: Date;
  fechaEntregaFiniquito?: Date;
  montoFiniquito?: number;

  // ENCUESTA Y RAZONES
  encuestaSalida4FRH209?: string;
  razonRenunciaRH?: string;
  razonCapturadaSistema?: string;

  // CLASIFICACIÓN
  clase: string;
  turno: string;
  tipoBaja: TipoBaja;

  // ORGANIZACIÓN
  area: string;
  supervisor: string;
  puesto: string;

  // ENTRENAMIENTO Y DESEMPEÑO
  cumplioEntrenamiento: boolean;
  totalFaltas: number;
  permisos: number;
  falta1?: Date;
  falta2?: Date;
  falta3?: Date;
  falta4?: Date;

  // COMPENSACIÓN
  salario: number;
  ultimoCambioSalario?: Date;

  // CAMPOS CALCULADOS
  diasAntiguedad?: number;
  mesesAntiguedad?: number;
  diasEntreUDTyBaja?: number;
  diasHastaFiniquito?: number;
  diasEntregaFiniquito?: number;
  diasDesdeCambioSalario?: number;
  rangoSalarial?: string;
  rangoAntiguedad?: string;
  tipoBajaNormalizado?: 'RV' | 'BXF';
  rotacionTemprana?: boolean;
  razonesExtraidas?: string[];
}

export interface EmpleadoRaw {
  'Depto.'?: string;
  'Empleado#': string;
  'Nombre': string;
  'Fecha de baja en el Sistema': string;
  'Fecha de último día de trabajo (UDT)': string;
  'Fecha de Alta': string;
  'Antigüedad en Semanas': string | number;
  'Número de semana de las últimas horas trabajadas': string | number;
  'Total de horas trabajadas  en la última semana': string | number;
  'Fecha en que se hizo el finiquito'?: string;
  'Fecha de entrega de finiquito'?: string;
  'Monto Finiquito'?: string | number;
  'Encuesta de salida 4FRH-209'?: string;
  'Clase': string;
  'Turno': string;
  'Razón de Renuncia'?: string;
  'Tipo de baja en el Sistema': string;
  'Razon capturada en Sistema'?: string;
  'Área': string;
  'Supervisor': string;
  'Puesto': string;
  'Cumplió con periodo de entrenamiento': string | boolean;
  'Total de faltas': string | number;
  'Permisos': string | number;
  'Falta 1'?: string;
  'Falta 2'?: string;
  'Falta 3'?: string;
  'Falta 4'?: string;
  'Salario': string | number;
  'Último cambio de salario'?: string;
}
