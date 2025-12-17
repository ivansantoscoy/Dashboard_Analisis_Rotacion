/**
 * Cliente Store - Gestión de clientes y modelos activos
 */

import { create } from 'zustand';
import { Cliente, clienteService } from '../services/api/clienteService';

export interface ClienteActivo {
  cliente: Cliente;
  datasetId?: string;
  modeloEntrenado: boolean;
  fechaCarga?: string;
}

interface ClienteStore {
  // Lista de todos los clientes registrados
  clientes: Cliente[];

  // Clientes actualmente cargados en memoria
  clientesActivos: Map<string, ClienteActivo>;

  // Cliente actualmente seleccionado
  clienteActualId: string | null;

  // Loading states
  loading: boolean;
  error: string | null;

  // Actions
  cargarClientes: () => Promise<void>;
  crearCliente: (data: { nombre: string; identificador: string; industria?: string; notas?: string }) => Promise<Cliente>;
  eliminarCliente: (clienteId: string) => Promise<void>;

  // Gestión de cliente activo
  setClienteActual: (clienteId: string | null) => void;
  activarCliente: (cliente: Cliente, datasetId?: string) => void;
  desactivarCliente: (clienteId: string) => void;
  actualizarClienteActivo: (clienteId: string, updates: Partial<ClienteActivo>) => void;

  // Helpers
  getClienteActual: () => ClienteActivo | null;
  getClienteActivo: (clienteId: string) => ClienteActivo | null;
  limpiarTodo: () => void;
}

export const useClienteStore = create<ClienteStore>((set, get) => ({
  clientes: [],
  clientesActivos: new Map(),
  clienteActualId: null,
  loading: false,
  error: null,

  // Cargar lista de clientes desde el backend
  cargarClientes: async () => {
    set({ loading: true, error: null });
    try {
      const clientes = await clienteService.listarClientes();
      set({ clientes, loading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Error al cargar clientes',
        loading: false
      });
    }
  },

  // Crear nuevo cliente
  crearCliente: async (data) => {
    set({ loading: true, error: null });
    try {
      const nuevoCliente = await clienteService.crearCliente(data);
      set(state => ({
        clientes: [...state.clientes, nuevoCliente],
        loading: false
      }));
      return nuevoCliente;
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Error al crear cliente',
        loading: false
      });
      throw error;
    }
  },

  // Eliminar cliente
  eliminarCliente: async (clienteId: string) => {
    set({ loading: true, error: null });
    try {
      await clienteService.eliminarCliente(clienteId);

      // Remover de lista y desactivar si estaba activo
      set(state => {
        const nuevosActivos = new Map(state.clientesActivos);
        nuevosActivos.delete(clienteId);

        return {
          clientes: state.clientes.filter(c => c.id !== clienteId),
          clientesActivos: nuevosActivos,
          clienteActualId: state.clienteActualId === clienteId ? null : state.clienteActualId,
          loading: false
        };
      });
    } catch (error: any) {
      set({
        error: error.message || 'Error al eliminar cliente',
        loading: false
      });
      throw error;
    }
  },

  // Establecer cliente actual
  setClienteActual: (clienteId: string | null) => {
    set({ clienteActualId: clienteId });
  },

  // Activar cliente (cargar en memoria)
  activarCliente: (cliente: Cliente, datasetId?: string) => {
    set(state => {
      const nuevosActivos = new Map(state.clientesActivos);
      nuevosActivos.set(cliente.id, {
        cliente,
        datasetId,
        modeloEntrenado: false,
        fechaCarga: new Date().toISOString()
      });

      return {
        clientesActivos: nuevosActivos,
        clienteActualId: cliente.id
      };
    });
  },

  // Desactivar cliente (remover de memoria)
  desactivarCliente: (clienteId: string) => {
    set(state => {
      const nuevosActivos = new Map(state.clientesActivos);
      nuevosActivos.delete(clienteId);

      return {
        clientesActivos: nuevosActivos,
        clienteActualId: state.clienteActualId === clienteId ? null : state.clienteActualId
      };
    });
  },

  // Actualizar estado de cliente activo
  actualizarClienteActivo: (clienteId: string, updates: Partial<ClienteActivo>) => {
    set(state => {
      const clienteActivo = state.clientesActivos.get(clienteId);
      if (!clienteActivo) return state;

      const nuevosActivos = new Map(state.clientesActivos);
      nuevosActivos.set(clienteId, {
        ...clienteActivo,
        ...updates
      });

      return { clientesActivos: nuevosActivos };
    });
  },

  // Obtener cliente actual
  getClienteActual: () => {
    const { clienteActualId, clientesActivos } = get();
    if (!clienteActualId) return null;
    return clientesActivos.get(clienteActualId) || null;
  },

  // Obtener cliente activo por ID
  getClienteActivo: (clienteId: string) => {
    return get().clientesActivos.get(clienteId) || null;
  },

  // Limpiar todo (útil para logout)
  limpiarTodo: () => {
    set({
      clientes: [],
      clientesActivos: new Map(),
      clienteActualId: null,
      error: null
    });
  }
}));
