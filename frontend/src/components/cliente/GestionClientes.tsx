/**
 * GestionClientes - Panel de gestión de clientes activos en memoria
 */

import React from 'react';
import { useClienteStore } from '../../stores/clienteStore';

export const GestionClientes: React.FC = () => {
  const {
    clientesActivos,
    clienteActualId,
    setClienteActual,
    desactivarCliente
  } = useClienteStore();

  const clientesActivosArray = Array.from(clientesActivos.entries()).map(([id, data]) => ({
    id,
    ...data
  }));

  if (clientesActivosArray.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Clientes Activos en Memoria</h3>
        <div className="text-center text-gray-500 py-8">
          <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p className="font-medium">No hay clientes cargados</p>
          <p className="text-sm mt-1">Selecciona un cliente y carga su CSV para comenzar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">
          Clientes Activos en Memoria ({clientesActivosArray.length})
        </h3>
        <div className="text-xs text-gray-500">
          Máximo recomendado: 10-15 clientes
        </div>
      </div>

      <div className="space-y-3">
        {clientesActivosArray.map(clienteActivo => {
          const esActual = clienteActivo.id === clienteActualId;

          return (
            <div
              key={clienteActivo.id}
              className={`border rounded-lg p-4 transition-all ${
                esActual
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {esActual && (
                      <span className="px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded">
                        ACTIVO
                      </span>
                    )}
                    <h4 className="font-bold text-gray-800">
                      {clienteActivo.cliente.nombre}
                    </h4>
                    <span className="text-sm text-gray-500 font-mono">
                      ({clienteActivo.cliente.identificador})
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    {clienteActivo.cliente.industria && (
                      <div>
                        <span className="font-medium">Industria:</span> {clienteActivo.cliente.industria}
                      </div>
                    )}
                    {clienteActivo.fechaCarga && (
                      <div>
                        <span className="font-medium">Cargado:</span>{' '}
                        {new Date(clienteActivo.fechaCarga).toLocaleTimeString()}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Modelo ML:</span>{' '}
                      {clienteActivo.modeloEntrenado ? (
                        <span className="text-green-600">Entrenado</span>
                      ) : (
                        <span className="text-yellow-600">Pendiente</span>
                      )}
                    </div>
                    {clienteActivo.datasetId && (
                      <div className="text-xs text-gray-400">
                        Dataset ID: {clienteActivo.datasetId.substring(0, 8)}...
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  {!esActual && (
                    <button
                      onClick={() => setClienteActual(clienteActivo.id)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      title="Cambiar a este cliente"
                    >
                      Ver
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (window.confirm(`¿Cerrar modelo de ${clienteActivo.cliente.nombre}?`)) {
                        desactivarCliente(clienteActivo.id);
                      }
                    }}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                    title="Cerrar y liberar memoria"
                  >
                    Cerrar
                  </button>
                </div>
              </div>

              {clienteActivo.cliente.notas && (
                <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-600">
                  <strong>Notas:</strong> {clienteActivo.cliente.notas}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Advertencia si hay muchos clientes */}
      {clientesActivosArray.length > 10 && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
          <strong>Advertencia:</strong> Tienes {clientesActivosArray.length} clientes activos.
          Considera cerrar algunos para liberar memoria RAM.
        </div>
      )}
    </div>
  );
};
