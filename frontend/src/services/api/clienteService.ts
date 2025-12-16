/**
 * Cliente API Service
 * Gestión de clientes (metadata only)
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface Cliente {
  id: string;
  nombre: string;
  identificador: string;
  industria?: string;
  notas?: string;
  fecha_creacion: string;
  fecha_ultimo_analisis?: string;
  num_empleados_ultimo_csv?: number;
}

export interface ClienteCreate {
  nombre: string;
  identificador: string;
  industria?: string;
  notas?: string;
}

export interface ClienteUpdate {
  nombre?: string;
  industria?: string;
  notas?: string;
}

export const clienteService = {
  /**
   * Crear nuevo cliente
   */
  async crearCliente(data: ClienteCreate): Promise<Cliente> {
    const response = await axios.post<Cliente>(`${API_URL}/api/clientes`, data);
    return response.data;
  },

  /**
   * Listar todos los clientes
   */
  async listarClientes(): Promise<Cliente[]> {
    const response = await axios.get<{ clientes: Cliente[]; total: number }>(
      `${API_URL}/api/clientes`
    );
    return response.data.clientes;
  },

  /**
   * Obtener cliente por ID
   */
  async obtenerCliente(clienteId: string): Promise<Cliente> {
    const response = await axios.get<Cliente>(`${API_URL}/api/clientes/${clienteId}`);
    return response.data;
  },

  /**
   * Obtener cliente por identificador
   */
  async obtenerClientePorIdentificador(identificador: string): Promise<Cliente> {
    const response = await axios.get<Cliente>(
      `${API_URL}/api/clientes/identificador/${identificador}`
    );
    return response.data;
  },

  /**
   * Actualizar cliente
   */
  async actualizarCliente(clienteId: string, data: ClienteUpdate): Promise<Cliente> {
    const response = await axios.put<Cliente>(`${API_URL}/api/clientes/${clienteId}`, data);
    return response.data;
  },

  /**
   * Eliminar cliente
   */
  async eliminarCliente(clienteId: string): Promise<void> {
    await axios.delete(`${API_URL}/api/clientes/${clienteId}`);
  },

  /**
   * Registrar análisis realizado
   */
  async registrarAnalisis(clienteId: string, numEmpleados: number): Promise<Cliente> {
    const response = await axios.post<Cliente>(
      `${API_URL}/api/clientes/${clienteId}/analisis`,
      null,
      { params: { num_empleados: numEmpleados } }
    );
    return response.data;
  },
};
