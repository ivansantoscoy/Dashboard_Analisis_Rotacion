/**
 * Servicio de API para análisis Pareto
 */

import { apiClient } from './client';
import type { ApiResponse } from '@/types/api.types';
import type { AnalisisPareto } from '@/types/analysis.types';
import type { EmpleadoRotacion } from '@/types';

export class ParetoService {
  /**
   * Analiza una categoría específica con método Pareto 80/20
   */
  static async analizarCategoria(
    data: EmpleadoRotacion[],
    categoria: 'area' | 'supervisor' | 'turno' | 'rango_salarial' | 'puesto'
  ): Promise<ApiResponse<AnalisisPareto>> {
    return apiClient.post<AnalisisPareto>(`/api/pareto/${categoria}`, data);
  }

  /**
   * Analiza múltiples categorías con método Pareto
   */
  static async analizarMultiple(
    data: EmpleadoRotacion[]
  ): Promise<ApiResponse<Record<string, AnalisisPareto>>> {
    return apiClient.post<Record<string, AnalisisPareto>>('/api/pareto/all', data);
  }

  /**
   * Obtiene recomendaciones basadas en análisis Pareto
   */
  static async obtenerRecomendaciones(
    data: EmpleadoRotacion[],
    categoria: string
  ): Promise<ApiResponse<{ categoria: string; recomendaciones: string[] }>> {
    return apiClient.post<{ categoria: string; recomendaciones: string[] }>(
      `/api/pareto/${categoria}/recomendaciones`,
      data
    );
  }
}
