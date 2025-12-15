/**
 * Gráfico de tendencias de rotación
 */

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { TendenciaRotacion } from '@/types/analysis.types';

interface TrendChartProps {
  title: string;
  data: TendenciaRotacion[];
  height?: number;
}

export function TrendChart({ title, data, height = 350 }: TrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <p className="text-gray-500 text-center py-12">
          No hay datos de tendencias disponibles
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="periodo" />
          <YAxis />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === 'total_rv') return [value, 'Renuncias Voluntarias'];
              if (name === 'total_bxf') return [value, 'Bajas Forzadas'];
              if (name === 'total') return [value, 'Total'];
              return [value, name];
            }}
          />
          <Legend
            formatter={(value) => {
              if (value === 'total_rv') return 'Renuncias Voluntarias';
              if (value === 'total_bxf') return 'Bajas Forzadas';
              if (value === 'total') return 'Total';
              return value;
            }}
          />
          <Line
            type="monotone"
            dataKey="total_rv"
            stroke="#f59e0b"
            strokeWidth={2}
            name="RV"
          />
          <Line
            type="monotone"
            dataKey="total_bxf"
            stroke="#ef4444"
            strokeWidth={2}
            name="BXF"
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#3b82f6"
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Total"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
