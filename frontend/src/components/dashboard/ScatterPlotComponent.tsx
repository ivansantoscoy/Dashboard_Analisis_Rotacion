/**
 * Componente de gráfico de dispersión (scatter plot)
 * Para visualizar la relación entre salario y antigüedad
 */

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ZAxis,
} from 'recharts';
import { useDataStore } from '@/stores/dataStore';
import { formatCurrency } from '@/utils/formatters';

export function ScatterPlotComponent() {
  const { empleadosFiltrados } = useDataStore();

  // Preparar datos: separar por tipo de baja
  const dataRV = empleadosFiltrados
    .filter(emp => emp.tipoBajaNormalizado === 'RV')
    .map(emp => ({
      x: emp.antiguedadSemanas,
      y: emp.salario,
      nombre: emp.nombre,
      tipo: 'RV',
    }));

  const dataBXF = empleadosFiltrados
    .filter(emp => emp.tipoBajaNormalizado === 'BXF')
    .map(emp => ({
      x: emp.antiguedadSemanas,
      y: emp.salario,
      nombre: emp.nombre,
      tipo: 'BXF',
    }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 text-white p-3 rounded-lg shadow-lg border border-gray-700">
          <p className="font-semibold">{data.nombre}</p>
          <p className="text-sm">
            <span className="text-gray-400">Antigüedad:</span> {data.x} semanas
          </p>
          <p className="text-sm">
            <span className="text-gray-400">Salario:</span> {formatCurrency(data.y)}
          </p>
          <p className="text-sm">
            <span className="text-gray-400">Tipo:</span>{' '}
            <span className={data.tipo === 'RV' ? 'text-yellow-400' : 'text-red-400'}>
              {data.tipo}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Relación Salario vs Antigüedad
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            type="number"
            dataKey="x"
            name="Antigüedad"
            unit=" sem"
            stroke="#6b7280"
            label={{
              value: 'Antigüedad (semanas)',
              position: 'insideBottom',
              offset: -10,
              style: { fill: '#6b7280' },
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Salario"
            stroke="#6b7280"
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            label={{
              value: 'Salario',
              angle: -90,
              position: 'insideLeft',
              style: { fill: '#6b7280' },
            }}
          />
          <ZAxis range={[60, 60]} />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Legend
            wrapperStyle={{ paddingTop: '10px' }}
            formatter={(value) => {
              if (value === 'RV') return 'Renuncia Voluntaria';
              if (value === 'BXF') return 'Baja por Faltas';
              return value;
            }}
          />
          <Scatter name="RV" data={dataRV} fill="#f59e0b" />
          <Scatter name="BXF" data={dataBXF} fill="#ef4444" />
        </ScatterChart>
      </ResponsiveContainer>
      <p className="text-sm text-gray-500 mt-4 text-center">
        Cada punto representa un empleado. Identifica patrones de rotación según antigüedad y
        compensación.
      </p>
    </div>
  );
}
