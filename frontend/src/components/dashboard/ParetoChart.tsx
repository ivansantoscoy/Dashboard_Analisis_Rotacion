/**
 * Componente de gráfico de Pareto
 * Muestra barras de cantidad + línea acumulada
 * Resalta el 20% crítico que causa el 80% de rotación
 */

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import type { PatronRotacion } from '@/types/analysis.types';

interface ParetoChartProps {
  title: string;
  patrones: PatronRotacion[];
  categoria: string;
}

export function ParetoChart({ title, patrones, categoria }: ParetoChartProps) {
  if (!patrones || patrones.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <p className="text-gray-500 text-center py-8">No hay datos disponibles para análisis Pareto</p>
      </div>
    );
  }

  // Tomar solo los primeros 10 para mejor visualización
  const data = patrones.slice(0, 10).map(p => ({
    nombre: p.valor,
    cantidad: p.totalRotaciones,
    porcentaje: p.porcentaje,
    acumulado: p.porcentajeAcumulado,
    es80: p.impacto80_20,
  }));

  // Contar cuántos están en el 20% crítico
  const numCriticos = patrones.filter(p => p.impacto80_20).length;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 text-white p-3 rounded-lg shadow-lg border border-gray-700">
          <p className="font-semibold text-sm mb-2">{data.nombre}</p>
          <p className="text-xs">
            <span className="text-gray-400">Rotaciones:</span> {data.cantidad}
          </p>
          <p className="text-xs">
            <span className="text-gray-400">Porcentaje:</span> {data.porcentaje.toFixed(1)}%
          </p>
          <p className="text-xs">
            <span className="text-gray-400">Acumulado:</span> {data.acumulado.toFixed(1)}%
          </p>
          {data.es80 && (
            <p className="text-xs text-red-400 mt-1 font-semibold">⚠️ 20% Crítico</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">
          Análisis Pareto 80/20 - {numCriticos} {categoria}(s) crítico(s)
        </p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          <XAxis
            dataKey="nombre"
            angle={-45}
            textAnchor="end"
            height={100}
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
          />

          <YAxis
            yAxisId="left"
            stroke="#6b7280"
            label={{
              value: 'Cantidad de Rotaciones',
              angle: -90,
              position: 'insideLeft',
              style: { fill: '#6b7280', fontSize: 12 },
            }}
          />

          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#6b7280"
            domain={[0, 100]}
            label={{
              value: 'Porcentaje Acumulado (%)',
              angle: 90,
              position: 'insideRight',
              style: { fill: '#6b7280', fontSize: 12 },
            }}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="rect"
          />

          {/* Línea de referencia en 80% */}
          <ReferenceLine
            yAxisId="right"
            y={80}
            stroke="#ef4444"
            strokeDasharray="5 5"
            strokeWidth={2}
            label={{
              value: '80%',
              position: 'right',
              fill: '#ef4444',
              fontSize: 12,
              fontWeight: 'bold',
            }}
          />

          {/* Barras de cantidad */}
          <Bar
            yAxisId="left"
            dataKey="cantidad"
            name="Rotaciones"
            radius={[4, 4, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.es80 ? '#ef4444' : '#3b82f6'}
              />
            ))}
          </Bar>

          {/* Línea acumulada */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="acumulado"
            name="% Acumulado"
            stroke="#f59e0b"
            strokeWidth={3}
            dot={{ fill: '#f59e0b', r: 5 }}
            activeDot={{ r: 7 }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Leyenda de colores */}
      <div className="mt-4 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-gray-700">20% Crítico (Causa 80%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-gray-700">Resto (80% Causa 20%)</span>
        </div>
      </div>

      {/* Insights */}
      {patrones.length > 0 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">💡 Insights Clave:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>
              • <span className="font-semibold">{numCriticos}</span> {categoria}(s) concentran el
              <span className="font-semibold"> 80% de la rotación</span>
            </li>
            <li>
              • Principal causa: <span className="font-semibold text-red-600">{patrones[0].valor}</span> con{' '}
              <span className="font-semibold">{patrones[0].totalRotaciones}</span> rotaciones
            </li>
            <li>
              • Enfocar esfuerzos en los {numCriticos} elementos resaltados en rojo genera{' '}
              <span className="font-semibold">máximo impacto</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
