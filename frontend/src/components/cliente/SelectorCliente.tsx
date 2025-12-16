/**
 * SelectorCliente - Componente para seleccionar cliente y cargar su CSV
 */

import React, { useState, useEffect } from 'react';
import { useClienteStore } from '../../stores/clienteStore';
import { useDataStore } from '../../stores/dataStore';
import { RegistroCliente } from './RegistroCliente';

export const SelectorCliente: React.FC = () => {
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [selectedClienteId, setSelectedClienteId] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const {
    clientes,
    clienteActualId,
    loading: clientesLoading,
    cargarClientes,
    activarCliente,
    setClienteActual
  } = useClienteStore();

  const uploadFile = useDataStore(state => state.uploadFile);

  // Cargar lista de clientes al montar
  useEffect(() => {
    cargarClientes();
  }, [cargarClientes]);

  const handleClienteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clienteId = e.target.value;
    setSelectedClienteId(clienteId);

    if (clienteId) {
      const cliente = clientes.find(c => c.id === clienteId);
      if (cliente) {
        setClienteActual(clienteId);
      }
    } else {
      setClienteActual(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleCargarAnalisis = async () => {
    if (!selectedClienteId || !file) return;

    const cliente = clientes.find(c => c.id === selectedClienteId);
    if (!cliente) return;

    setUploading(true);

    try {
      // Subir archivo
      const response = await uploadFile(file);

      if (response.success) {
        // Activar cliente con dataset ID
        activarCliente(cliente, response.dataset_id);

        // Limpiar file input
        setFile(null);
        const fileInput = document.getElementById('csv-file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
    } catch (error) {
      console.error('Error al cargar archivo:', error);
    } finally {
      setUploading(false);
    }
  };

  const clienteActual = clientes.find(c => c.id === clienteActualId);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Gestión de Cliente</h2>
        <button
          onClick={() => setMostrarRegistro(true)}
          className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Nuevo Cliente
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Selector de Cliente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar Cliente
          </label>
          <select
            value={selectedClienteId}
            onChange={handleClienteChange}
            disabled={clientesLoading || uploading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Seleccionar Cliente --</option>
            {clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nombre} ({cliente.identificador})
              </option>
            ))}
          </select>

          {/* Info del cliente seleccionado */}
          {clienteActual && (
            <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm">
              <div className="text-gray-600">
                <strong>Industria:</strong> {clienteActual.industria || 'N/A'}
              </div>
              {clienteActual.fecha_ultimo_analisis && (
                <div className="text-gray-600">
                  <strong>Último análisis:</strong>{' '}
                  {new Date(clienteActual.fecha_ultimo_analisis).toLocaleDateString()}
                  {clienteActual.num_empleados_ultimo_csv && (
                    <span> ({clienteActual.num_empleados_ultimo_csv} empleados)</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Carga de CSV */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cargar Archivo CSV
          </label>
          <div className="space-y-2">
            <input
              id="csv-file-input"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={!selectedClienteId || uploading}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                disabled:opacity-50"
            />

            <button
              onClick={handleCargarAnalisis}
              disabled={!file || !selectedClienteId || uploading}
              className="w-full px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Cargando y analizando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Cargar y Entrenar Modelo
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Registro */}
      <RegistroCliente
        isOpen={mostrarRegistro}
        onClose={() => setMostrarRegistro(false)}
        onSuccess={() => {
          cargarClientes(); // Recargar lista
        }}
      />
    </div>
  );
};
