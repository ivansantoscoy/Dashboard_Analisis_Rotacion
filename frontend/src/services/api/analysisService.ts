/**
 * Servicio para análisis de datos
 */

import { apiClient } from './client';
import type { ApiResponse } from '@/types';
import type { AnalisisCompleto } from '@/types/analysis.types';
import type { EmpleadoRotacion } from '@/types';

export class AnalysisService {
  /**
   * Analiza los datos de rotación
   */
  static async analyzeData(
    data: EmpleadoRotacion[]
  ): Promise<ApiResponse<AnalisisCompleto>> {
    return apiClient.post<AnalisisCompleto>('/api/analyze', data);
  }
}
