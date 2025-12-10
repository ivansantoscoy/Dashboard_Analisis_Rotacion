/**
 * Store principal de datos
 */

import { create } from 'zustand';
import type { EmpleadoRotacion } from '@/types';

interface DataState {
  // Datos
  empleados: EmpleadoRotacion[];
  empleadosFiltrados: EmpleadoRotacion[];
  datasetId: string | null;

  // Estado de carga
  isLoading: boolean;
  error: string | null;

  // Acciones
  setEmpleados: (empleados: EmpleadoRotacion[]) => void;
  setEmpleadosFiltrados: (empleados: EmpleadoRotacion[]) => void;
  setDatasetId: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearData: () => void;
  resetFilters: () => void;
}

export const useDataStore = create<DataState>((set, get) => ({
  // Estado inicial
  empleados: [],
  empleadosFiltrados: [],
  datasetId: null,
  isLoading: false,
  error: null,

  // Acciones
  setEmpleados: (empleados) => {
    set({
      empleados,
      empleadosFiltrados: empleados,
      error: null,
    });
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
      error: null,
      isLoading: false,
    });
  },

  resetFilters: () => {
    const { empleados } = get();
    set({ empleadosFiltrados: empleados });
  },
}));
