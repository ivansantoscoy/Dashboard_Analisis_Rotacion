/**
 * Dashboard de Análisis Pareto 80/20
 * Identifica causas críticas de rotación
 */

import { useState, useEffect } from 'react';
import { useDataStore } from '@/stores/dataStore';
import { ParetoService } from '@/services/api/paretoService';
import { ParetoChart } from './ParetoChart';
import type { AnalisisPareto } from '@/types/analysis.types';

export function ParetoDashboard() {
  const { empleadosFiltrados } = useDataStore();
  const [analisisPareto, setAnalisisPareto] = useState<Record<string, AnalisisPareto> | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('area');

  useEffect(() => {
    if (empleadosFiltrados.length > 0) {
      analizarPareto();
    }
  }, [empleadosFiltrados]);

  const analizarPareto = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await ParetoService.analizarMultiple(empleadosFiltrados);

      if (response.success && response.data) {
        setAnalisisPareto(response.data);
      } else {
        setError(response.error?.detail || 'Error al analizar con método Pareto');
      }
    } catch (err) {
      setError('Error inesperado al analizar datos');
      console.error('Error en análisis Pareto:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (empleadosFiltrados.length === 0) {
    return null;
  }

  if (isAnalyzing) {
    return (
      <div className="bg-white p-8 rounded-lg border-2 border-gray-200">
        <div className="text-center">
          <div className="text-info text-lg font-semibold">Analizando con método Pareto 80/20...</div>
          <p className="text-gray-500 mt-2">Identificando causas críticas de rotación</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!analisisPareto) {
    return null;
  }

  const categorias = [
    { key: 'area', label: 'Áreas' },
    { key: 'supervisor', label: 'Supervisores' },
    { key: 'turno', label: 'Turnos' },
    { key: 'rango_salarial', label: 'Rangos Salariales' },
  ];

  const analisisActual = analisisPareto[categoriaSeleccionada];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 rounded-lg text-white">
        <h2 className="text-2xl font-bold mb-2">📊 Análisis Pareto 80/20</h2>
        <p className="text-yellow-50">
          Identifica el 20% de causas que generan el 80% de la rotación
        </p>
      </div>

      {/* Selector de categoría */}
      <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Selecciona una categoría para análisis Pareto:
        </label>
        <div className="flex flex-wrap gap-2">
          {categorias.map(cat => (
            <button
              key={cat.key}
              onClick={() => setCategoriaSeleccionada(cat.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                categoriaSeleccionada === cat.key
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resumen ejecutivo */}
      {analisisActual && analisisActual.concentracion80.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-red-50 border-2 border-red-200 p-4 rounded-lg">
            <div className="text-sm text-red-600 font-medium">20% Crítico</div>
            <div className="text-3xl font-bold text-red-700 mt-1">
              {analisisActual.concentracion80.length}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {categoriaSeleccionada}(s) causan el 80%
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Total Rotaciones</div>
            <div className="text-3xl font-bold text-blue-700 mt-1">
              {analisisActual.totalRotaciones}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              en {analisisActual.patrones.length} {categoriaSeleccionada}(s)
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-lg">
            <div className="text-sm text-yellow-600 font-medium">Principal Causa</div>
            <div className="text-xl font-bold text-yellow-700 mt-1 truncate">
              {analisisActual.patrones[0]?.valor || 'N/A'}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {analisisActual.patrones[0]?.porcentaje.toFixed(1)}% del total
            </div>
          </div>
        </div>
      )}

      {/* Gráfico de Pareto */}
      {analisisActual && (
        <ParetoChart
          title={`Análisis Pareto: ${categorias.find(c => c.key === categoriaSeleccionada)?.label}`}
          patrones={analisisActual.patrones}
          categoria={categoriaSeleccionada}
        />
      )}

      {/* Tabla de elementos críticos */}
      {analisisActual && analisisActual.concentracion80.length > 0 && (
        <div className="bg-white p-6 rounded-lg border-2 border-red-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            🎯 Elementos Críticos del 20% (Priorizar)
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ranking
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {categoriaSeleccionada}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rotaciones
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % Individual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % Acumulado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analisisActual.concentracion80.map((patron, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        #{index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {patron.valor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {patron.totalRotaciones}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {patron.porcentaje.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {patron.porcentajeAcumulado.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                        ⚠️ Prioridad Alta
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recomendaciones */}
      {analisisActual && (
        <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Recomendaciones</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                <strong>Enfocar recursos</strong> en los {analisisActual.concentracion80.length}{' '}
                {categoriaSeleccionada}(s) críticos resaltados para máximo impacto
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                <strong>Investigar a fondo</strong> las causas en "{analisisActual.patrones[0]?.valor}"
                que concentra {analisisActual.patrones[0]?.porcentaje.toFixed(1)}% de la rotación
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                <strong>Implementar acciones correctivas</strong> en el 20% crítico reducirá el 80%
                de la rotación
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                <strong>Monitorear tendencias</strong> de estos elementos críticos semanalmente
              </span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
