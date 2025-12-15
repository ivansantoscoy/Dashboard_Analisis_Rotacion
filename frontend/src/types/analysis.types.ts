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

// Tipos para análisis completo
export interface DistribucionCategoria {
  categoria: string;
  total: number;
  porcentaje: number;
}

export interface TendenciaRotacion {
  periodo: string;
  total_rv: number;
  total_bxf: number;
  total: number;
  tasa: number;
}

export interface AnalisisPorArea {
  area: string;
  total_rotaciones: number;
  porcentaje: number;
  antiguedad_promedio: number;
  salario_promedio: number;
  tipo_baja_predominante: string;
}

export interface AnalisisCompleto {
  // Métricas generales
  total_registros: number;
  total_renuncias_voluntarias: number;
  total_bajas_forzadas: number;
  tasa_rv_vs_bxf: number;

  // Promedios
  antiguedad_promedio_dias: number;
  antiguedad_promedio_semanas: number;
  salario_promedio: number;

  // Distribuciones
  distribucion_tipo_baja: DistribucionCategoria[];
  distribucion_por_area: DistribucionCategoria[];
  distribucion_por_supervisor: DistribucionCategoria[];
  distribucion_rango_salarial: DistribucionCategoria[];
  distribucion_rango_antiguedad: DistribucionCategoria[];

  // Tendencias
  tendencias_mensuales: TendenciaRotacion[];

  // Análisis detallado
  analisis_areas: AnalisisPorArea[];

  // Rotación temprana
  total_rotacion_temprana: number;
  porcentaje_rotacion_temprana: number;
}
