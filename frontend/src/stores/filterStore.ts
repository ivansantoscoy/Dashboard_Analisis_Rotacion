/**
 * Store de filtros
 */

import { create } from 'zustand';
import { useDataStore } from './dataStore';
import type { EmpleadoRotacion } from '@/types';

interface FilterState {
  // Filtros activos
  fechaInicio: Date | null;
  fechaFin: Date | null;
  areas: string[];
  supervisores: string[];
  puestos: string[];
  turnos: string[];
  tiposBaja: ('RV' | 'BXF')[];
  rangoSalarial: string | null;

  // Acciones
  setFechaInicio: (fecha: Date | null) => void;
  setFechaFin: (fecha: Date | null) => void;
  setAreas: (areas: string[]) => void;
  setSupervisores: (supervisores: string[]) => void;
  setPuestos: (puestos: string[]) => void;
  setTurnos: (turnos: string[]) => void;
  setTiposBaja: (tipos: ('RV' | 'BXF')[]) => void;
  setRangoSalarial: (rango: string | null) => void;
  clearFilters: () => void;
  applyFilters: () => void;
}

export const useFilterStore = create<FilterState>((set, get) => ({
  // Estado inicial
  fechaInicio: null,
  fechaFin: null,
  areas: [],
  supervisores: [],
  puestos: [],
  turnos: [],
  tiposBaja: [],
  rangoSalarial: null,

  // Acciones
  setFechaInicio: (fecha) => {
    set({ fechaInicio: fecha });
    get().applyFilters();
  },

  setFechaFin: (fecha) => {
    set({ fechaFin: fecha });
    get().applyFilters();
  },

  setAreas: (areas) => {
    set({ areas });
    get().applyFilters();
  },

  setSupervisores: (supervisores) => {
    set({ supervisores });
    get().applyFilters();
  },

  setPuestos: (puestos) => {
    set({ puestos });
    get().applyFilters();
  },

  setTurnos: (turnos) => {
    set({ turnos });
    get().applyFilters();
  },

  setTiposBaja: (tipos) => {
    set({ tiposBaja: tipos });
    get().applyFilters();
  },

  setRangoSalarial: (rango) => {
    set({ rangoSalarial: rango });
    get().applyFilters();
  },

  clearFilters: () => {
    set({
      fechaInicio: null,
      fechaFin: null,
      areas: [],
      supervisores: [],
      puestos: [],
      turnos: [],
      tiposBaja: [],
      rangoSalarial: null,
    });
    useDataStore.getState().resetFilters();
  },

  applyFilters: () => {
    const state = get();
    const { empleados } = useDataStore.getState();

    const filtrados = empleados.filter((empleado: EmpleadoRotacion) => {
      // Filtro por fecha inicio
      if (state.fechaInicio && empleado.fechaBajaSistema < state.fechaInicio) {
        return false;
      }

      // Filtro por fecha fin
      if (state.fechaFin && empleado.fechaBajaSistema > state.fechaFin) {
        return false;
      }

      // Filtro por áreas
      if (state.areas.length > 0 && !state.areas.includes(empleado.area)) {
        return false;
      }

      // Filtro por supervisores
      if (state.supervisores.length > 0 && !state.supervisores.includes(empleado.supervisor)) {
        return false;
      }

      // Filtro por puestos
      if (state.puestos.length > 0 && !state.puestos.includes(empleado.puesto)) {
        return false;
      }

      // Filtro por turnos
      if (state.turnos.length > 0 && !state.turnos.includes(empleado.turno)) {
        return false;
      }

      // Filtro por tipos de baja
      if (state.tiposBaja.length > 0 && empleado.tipoBajaNormalizado &&
          !state.tiposBaja.includes(empleado.tipoBajaNormalizado)) {
        return false;
      }

      // Filtro por rango salarial
      if (state.rangoSalarial && empleado.rangoSalarial !== state.rangoSalarial) {
        return false;
      }

      return true;
    });

    const dataStore = useDataStore.getState();
    dataStore.setEmpleadosFiltrados(filtrados);
    // Re-analizar con datos filtrados
    dataStore.analyzeData();
  },
}));
