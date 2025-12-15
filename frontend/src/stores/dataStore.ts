/**
 * Store principal de datos
 */

import { create } from 'zustand';
import type { EmpleadoRotacion } from '@/types';
import type { AnalisisCompleto } from '@/types/analysis.types';
import { AnalysisService } from '@/services/api/analysisService';

interface DataState {
  // Datos
  empleados: EmpleadoRotacion[];
  empleadosFiltrados: EmpleadoRotacion[];
  datasetId: string | null;
  analisis: AnalisisCompleto | null;

  // Estado de carga
  isLoading: boolean;
  isAnalyzing: boolean;
  error: string | null;

  // Acciones
  setEmpleados: (empleados: EmpleadoRotacion[]) => void;
  setEmpleadosFiltrados: (empleados: EmpleadoRotacion[]) => void;
  setDatasetId: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearData: () => void;
  resetFilters: () => void;
  analyzeData: () => Promise<void>;
}

export const useDataStore = create<DataState>((set, get) => ({
  // Estado inicial
  empleados: [],
  empleadosFiltrados: [],
  datasetId: null,
  analisis: null,
  isLoading: false,
  isAnalyzing: false,
  error: null,

  // Acciones
  setEmpleados: (empleados) => {
    set({
      empleados,
      empleadosFiltrados: empleados,
      error: null,
    });
    // Analizar automáticamente al cargar datos
    get().analyzeData();
  },

  setEmpleadosFiltrados: (empleados) => {
    set({ empleadosFiltrados: empleados });
  },

  setDatasetId: (id) => {
    set({ datasetId: id });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setError: (error) => {
    set({ error, isLoading: false });
  },

  clearData: () => {
    set({
      empleados: [],
      empleadosFiltrados: [],
      datasetId: null,
      analisis: null,
      error: null,
      isLoading: false,
      isAnalyzing: false,
    });
  },

  resetFilters: () => {
    const { empleados } = get();
    set({ empleadosFiltrados: empleados });
  },

  analyzeData: async () => {
    const { empleadosFiltrados } = get();

    if (empleadosFiltrados.length === 0) {
      set({ analisis: null });
      return;
    }

    set({ isAnalyzing: true, error: null });

    try {
      const response = await AnalysisService.analyzeData(empleadosFiltrados);

      if (response.success && response.data) {
        set({ analisis: response.data, isAnalyzing: false });
      } else {
        set({
          error: response.error?.detail || 'Error al analizar datos',
          isAnalyzing: false,
        });
      }
    } catch (error) {
      set({
        error: 'Error inesperado al analizar datos',
        isAnalyzing: false,
      });
    }
  },
}));
