/**
 * Panel de métricas principales del dashboard
 */

import { useDataStore } from '@/stores/dataStore';
import { MetricCard } from './MetricCard';

export function DashboardMetrics() {
  const { analisis, isAnalyzing } = useDataStore();

  if (isAnalyzing) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-32 bg-gray-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!analisis) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Carga datos para ver las métricas</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Rotaciones"
          value={analisis.total_registros}
          subtitle="Empleados analizados"
          color="blue"
        />

        <MetricCard
          title="Renuncias Voluntarias"
          value={analisis.total_renuncias_voluntarias}
          subtitle={`${analisis.tasa_rv_vs_bxf.toFixed(1)}% del total`}
          color="yellow"
        />

        <MetricCard
          title="Bajas Forzadas"
          value={analisis.total_bajas_forzadas}
          subtitle={`${(100 - analisis.tasa_rv_vs_bxf).toFixed(1)}% del total`}
          color="red"
        />

        <MetricCard
          title="Antigüedad Promedio"
          value={`${analisis.antiguedad_promedio_semanas.toFixed(1)} sem`}
          subtitle={`${analisis.antiguedad_promedio_dias.toFixed(0)} días`}
          color="green"
        />
      </div>

      {/* Métricas secundarias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Salario Promedio"
          value={`$${analisis.salario_promedio.toFixed(2)}`}
          subtitle="Promedio de empleados rotados"
          color="purple"
        />

        <MetricCard
          title="Rotación Temprana"
          value={analisis.total_rotacion_temprana}
          subtitle={`${analisis.porcentaje_rotacion_temprana.toFixed(1)}% del total (< 3 meses)`}
          color="red"
          trend={
            analisis.porcentaje_rotacion_temprana > 30
              ? 'up'
              : analisis.porcentaje_rotacion_temprana > 15
                ? 'neutral'
                : 'down'
          }
          trendValue={`${analisis.porcentaje_rotacion_temprana.toFixed(1)}%`}
        />

        <MetricCard
          title="Áreas Afectadas"
          value={analisis.analisis_areas.length}
          subtitle="Áreas con rotación"
          color="blue"
        />
      </div>
    </div>
  );
}
