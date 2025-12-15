/**
 * Componente principal del Dashboard
 */

import { useDataStore } from '@/stores/dataStore';
import { DashboardMetrics } from './DashboardMetrics';
import { DistributionChart } from './DistributionChart';
import { TrendChart } from './TrendChart';

export function Dashboard() {
  const { analisis, empleados } = useDataStore();

  if (empleados.length === 0) {
    return null; // No mostrar nada si no hay datos
  }

  return (
    <div className="space-y-8 mt-8">
      {/* Métricas principales */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Métricas Clave
        </h2>
        <DashboardMetrics />
      </section>

      {/* Gráficos */}
      {analisis && (
        <>
          {/* Tendencias */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Tendencias de Rotación
            </h2>
            <TrendChart
              title="Evolución Mensual de Rotaciones"
              data={analisis.tendencias_mensuales}
            />
          </section>

          {/* Distribuciones */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Distribuciones
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DistributionChart
                title="Rotaciones por Área"
                data={analisis.distribucion_por_area}
              />
              <DistributionChart
                title="Rotaciones por Rango Salarial"
                data={analisis.distribucion_rango_salarial}
              />
              <DistributionChart
                title="Rotaciones por Supervisor"
                data={analisis.distribucion_por_supervisor}
              />
              <DistributionChart
                title="Rotaciones por Antigüedad"
                data={analisis.distribucion_rango_antiguedad}
              />
            </div>
          </section>

          {/* Análisis por Área */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Análisis Detallado por Área
            </h2>
            <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Área
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rotaciones
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % del Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Antigüedad Prom.
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Salario Prom.
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo Predominante
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analisis.analisis_areas.map((area, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {area.area}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {area.total_rotaciones}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {area.porcentaje.toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {area.antiguedad_promedio.toFixed(1)} sem
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${area.salario_promedio.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              area.tipo_baja_predominante === 'RV'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {area.tipo_baja_predominante}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
