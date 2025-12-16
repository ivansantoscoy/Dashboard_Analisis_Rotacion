/**
 * RegistroCliente - Modal para dar de alta nuevos clientes
 */

import React, { useState } from 'react';
import { useClienteStore } from '../../stores/clienteStore';

interface RegistroClienteProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RegistroCliente: React.FC<RegistroClienteProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [nombre, setNombre] = useState('');
  const [identificador, setIdentificador] = useState('');
  const [industria, setIndustria] = useState('');
  const [notas, setNotas] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const crearCliente = useClienteStore(state => state.crearCliente);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validar identificador (solo letras, números y guiones bajos)
      if (!/^[a-zA-Z0-9_]+$/.test(identificador)) {
        throw new Error('El identificador solo puede contener letras, números y guiones bajos (_)');
      }

      await crearCliente({
        nombre: nombre.trim(),
        identificador: identificador.trim().toUpperCase(),
        industria: industria.trim() || undefined,
        notas: notas.trim() || undefined
      });

      // Limpiar formulario
      setNombre('');
      setIdentificador('');
      setIndustria('');
      setNotas('');

      // Cerrar modal y notificar éxito
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Error al crear cliente');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Registrar Nuevo Cliente</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Empresa *
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ABC Manufactura"
            />
          </div>

          {/* Identificador */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Identificador Corto *
            </label>
            <input
              type="text"
              value={identificador}
              onChange={(e) => setIdentificador(e.target.value.toUpperCase())}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder="ABC_MFG_2024"
              pattern="[a-zA-Z0-9_]+"
            />
            <p className="text-xs text-gray-500 mt-1">
              Solo letras, números y guiones bajos (_)
            </p>
          </div>

          {/* Industria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industria (Opcional)
            </label>
            <select
              value={industria}
              onChange={(e) => setIndustria(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar...</option>
              <option value="Manufactura">Manufactura</option>
              <option value="Call Center">Call Center</option>
              <option value="Retail">Retail</option>
              <option value="Logística">Logística</option>
              <option value="Servicios">Servicios</option>
              <option value="Tecnología">Tecnología</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas (Opcional)
            </label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              disabled={loading}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Cliente zona norte, 3 plantas..."
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Guardando...
                </>
              ) : (
                'Guardar Cliente'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
