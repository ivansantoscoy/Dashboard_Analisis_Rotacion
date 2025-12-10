/**
 * Tipos para análisis de rotación
 */

export interface PatronRotacion {
  categoria: string;
  valor: string;
  totalRotaciones: number;
  porcentaje: number;
  porcentajeAcumulado: number;
  impacto80_20: boolean;
  indiceRotacion: number;
}

export interface AnalisisPareto {
  categoria: string;
  patrones: PatronRotacion[];
  concentracion80: PatronRotacion[];
  totalRotaciones: number;
  fechaAnalisis: Date;
}

export type TipoCorrelacion = 'pearson' | 'spearman';
export type NivelSignificancia = 'alta' | 'media' | 'baja' | 'no_significativa';

export interface CorrelacionVariable {
  variable1: string;
  variable2: string;
  coeficiente: number;
  tipo: TipoCorrelacion;
  significancia: NivelSignificancia;
  pValue: number;
  interpretacion: string;
}

export interface MatrizCorrelacion {
  variables: string[];
  matriz: number[][];
  correlaciones: CorrelacionVariable[];
  topCorrelaciones: CorrelacionVariable[];
}

export type TipoInsight = 'pareto' | 'correlacion' | 'tendencia' | 'anomalia';
export type ImportanciaInsight = 'critica' | 'alta' | 'media' | 'baja';

export interface Insight {
  id: string;
  tipo: TipoInsight;
  importancia: ImportanciaInsight;
  titulo: string;
  descripcion: string;
  datos: any;
  recomendacion?: string;
}

export interface MetricasDashboard {
  totalRotaciones: number;
  tasaRotacion: number;
  antiguedadPromedio: number;
  tiempoPromedioFiniquito: number;
  rotacionesPorTipo: {
    RV: number;
    BXF: number;
  };
  rotacionPorMes: {
    mes: string;
    cantidad: number;
  }[];
}

export type CategoriaAnalisis =
  | 'supervisor'
  | 'area'
  | 'puesto'
  | 'turno'
  | 'rango_salarial'
  | 'rango_antiguedad'
  | 'cumplimiento_entrenamiento';
