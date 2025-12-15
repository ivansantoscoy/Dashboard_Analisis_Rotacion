/**
 * Componente de mapa de calor (heatmap)
 * Para visualizar la intensidad de rotación por mes y área
 */

import { useMemo } from 'react';
import { useDataStore } from '@/stores/dataStore';

interface HeatmapCell {
  mes: string;
  area: string;
  cantidad: number;
}

const MESES = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
];

export function HeatmapComponent() {
  const { empleadosFiltrados } = useDataStore();

  const { heatmapData, areas, maxValue } = useMemo(() => {
    // Crear un mapa de mes-area -> cantidad
    const dataMap = new Map<string, HeatmapCell>();
    const areasSet = new Set<string>();

    empleadosFiltrados.forEach((emp) => {
      const fecha = new Date(emp.fechaBajaSistema);
      const mes = fecha.getMonth(); // 0-11
      const area = emp.area;

      areasSet.add(area);
      const key = `${mes}-${area}`;

      if (dataMap.has(key)) {
        const cell = dataMap.get(key)!;
        cell.cantidad += 1;
      } else {
        dataMap.set(key, {
          mes: MESES[mes],
          area,
          cantidad: 1,
        });
      }
    });

    // Convertir a array y encontrar el valor máximo
    const data = Array.from(dataMap.values());
    const max = Math.max(...data.map((d) => d.cantidad), 1);
    const sortedAreas = Array.from(areasSet).sort();

    return {
      heatmapData: data,
      areas: sortedAreas,
      maxValue: max,
    };
  }, [empleadosFiltrados]);

  // Función para obtener el color basado en la intensidad
  const getColor = (cantidad: number): string => {
    if (cantidad === 0) return 'bg-gray-100';

    const intensity = cantidad / maxValue;

    if (intensity >= 0.8) return 'bg-red-600';
    if (intensity >= 0.6) return 'bg-red-500';
    if (intensity >= 0.4) return 'bg-orange-500';
    if (intensity >= 0.2) return 'bg-yellow-500';
    return 'bg-yellow-300';
  };

  // Función para obtener la cantidad de rotaciones para un mes y área específicos
  const getCantidad = (mesIdx: number, area: string): number => {
    const cell = heatmapData.find((d) => d.mes === MESES[mesIdx] && d.area === area);
    return cell ? cell.cantidad : 0;
  };

  if (areas.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Mapa de Calor: Rotación por Mes y Área
        </h3>
        <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Mapa de Calor: Rotación por Mes y Área
      </h3>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase sticky left-0 bg-white">
                Área
              </th>
              {MESES.map((mes) => (
                <th
                  key={mes}
                  className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase"
                >
                  {mes}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {areas.map((area) => (
              <tr key={area}>
                <td className="px-3 py-2 text-sm font-medium text-gray-900 sticky left-0 bg-white">
                  {area}
                </td>
                {MESES.map((mes, mesIdx) => {
                  const cantidad = getCantidad(mesIdx, area);
                  return (
                    <td key={mes} className="px-3 py-2 text-center">
                      <div
                        className={`${getColor(cantidad)} rounded px-2 py-1 text-sm font-semibold ${
                          cantidad > 0 ? 'text-white' : 'text-gray-400'
                        }`}
                        title={`${area} - ${mes}: ${cantidad} rotaciones`}
                      >
                        {cantidad > 0 ? cantidad : '-'}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Leyenda */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <span className="text-sm text-gray-600">Intensidad:</span>
        <div className="flex items-center gap-1">
          <div className="bg-gray-100 w-8 h-6 rounded"></div>
          <span className="text-xs text-gray-500">0</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="bg-yellow-300 w-8 h-6 rounded"></div>
          <span className="text-xs text-gray-500">Baja</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="bg-orange-500 w-8 h-6 rounded"></div>
          <span className="text-xs text-gray-500">Media</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="bg-red-600 w-8 h-6 rounded"></div>
          <span className="text-xs text-gray-500">Alta</span>
        </div>
        <span className="text-xs text-gray-500 ml-2">(Max: {maxValue})</span>
      </div>

      <p className="text-sm text-gray-500 mt-4 text-center">
        Los colores más oscuros indican mayor cantidad de rotaciones en ese mes y área
      </p>
    </div>
  );
}
