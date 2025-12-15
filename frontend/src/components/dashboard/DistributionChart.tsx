/**
 * Gráfico de distribución por categoría
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { DistribucionCategoria } from '@/types/analysis.types';

interface DistributionChartProps {
  title: string;
  data: DistribucionCategoria[];
  height?: number;
}

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // yellow
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
];

export function DistributionChart({
  title,
  data,
  height = 300,
}: DistributionChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <p className="text-gray-500 text-center py-12">No hay datos disponibles</p>
      </div>
    );
  }

  // Tomar solo los top 10 para no saturar el gráfico
  const topData = data.slice(0, 10);

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={topData}
          margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="categoria"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === 'total') return [value, 'Total'];
              if (name === 'porcentaje') return [`${value}%`, 'Porcentaje'];
              return [value, name];
            }}
          />
          <Legend />
          <Bar dataKey="total" fill="#3b82f6" name="Total">
            {topData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
