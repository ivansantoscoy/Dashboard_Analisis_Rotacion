/**
 * Panel de filtros interactivos para el dashboard
 */

import { useState, useMemo } from 'react';
import { useDataStore, useFilterStore } from '@/stores';

export const FilterPanel = () => {
  const { empleados } = useDataStore();
  const {
    fechaInicio,
    fechaFin,
    areas,
    supervisores,
    tiposBaja,
    rangoSalarial,
    setFechaInicio,
    setFechaFin,
    setAreas,
    setSupervisores,
    setTiposBaja,
    setRangoSalarial,
    clearFilters,
  } = useFilterStore();

  const [isExpanded, setIsExpanded] = useState(true);

  // Obtener valores únicos para los filtros
  const valoresUnicos = useMemo(() => {
    const areasSet = new Set<string>();
    const supervisoresSet = new Set<string>();
    const rangosSalariales = new Set<string>();

    empleados.forEach(emp => {
      if (emp.area) areasSet.add(emp.area);
      if (emp.supervisor) supervisoresSet.add(emp.supervisor);
      if (emp.rangoSalarial) rangosSalariales.add(emp.rangoSalarial);
    });

    return {
      areas: Array.from(areasSet).sort(),
      supervisores: Array.from(supervisoresSet).sort(),
      rangosSalariales: Array.from(rangosSalariales).sort(),
    };
  }, [empleados]);

  // Contar filtros activos
  const filtrosActivos = useMemo(() => {
    let count = 0;
    if (fechaInicio) count++;
    if (fechaFin) count++;
    if (areas.length > 0) count++;
    if (supervisores.length > 0) count++;
    if (tiposBaja.length > 0 && tiposBaja.length < 2) count++;
    if (rangoSalarial) count++;
    return count;
  }, [fechaInicio, fechaFin, areas, supervisores, tiposBaja, rangoSalarial]);

  const handleAreaChange = (area: string) => {
    if (areas.includes(area)) {
      setAreas(areas.filter(a => a !== area));
    } else {
      setAreas([...areas, area]);
    }
  };

  const handleSupervisorChange = (supervisor: string) => {
    if (supervisores.includes(supervisor)) {
      setSupervisores(supervisores.filter(s => s !== supervisor));
    } else {
      setSupervisores([...supervisores, supervisor]);
    }
  };

  const handleTipoBajaChange = (tipo: 'RV' | 'BXF') => {
    if (tiposBaja.includes(tipo)) {
      setTiposBaja(tiposBaja.filter(t => t !== tipo));
    } else {
      setTiposBaja([...tiposBaja, tipo]);
    }
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    return new Date(dateStr);
  };

  return (
    <div className="card mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Filtros</h2>
          {filtrosActivos > 0 && (
            <span className="px-3 py-1 bg-info bg-opacity-20 text-info rounded-full text-sm font-medium">
              {filtrosActivos} activo{filtrosActivos !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {filtrosActivos > 0 && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-danger bg-opacity-20 text-danger hover:bg-opacity-30 rounded-lg transition-colors text-sm"
            >
              Limpiar filtros
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 bg-surface hover:bg-border-main rounded-lg transition-colors"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Filtro por Rango de Fechas */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-muted">
              Fecha de Baja - Desde
            </label>
            <input
              type="date"
              value={formatDate(fechaInicio)}
              onChange={(e) => setFechaInicio(parseDate(e.target.value))}
              className="input w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-muted">
              Fecha de Baja - Hasta
            </label>
            <input
              type="date"
              value={formatDate(fechaFin)}
              onChange={(e) => setFechaFin(parseDate(e.target.value))}
              className="input w-full"
            />
          </div>

          {/* Filtro por Tipo de Baja */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-muted">
              Tipo de Baja
            </label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tiposBaja.includes('RV')}
                  onChange={() => handleTipoBajaChange('RV')}
                  className="w-4 h-4 text-info bg-surface border-border-main rounded focus:ring-info"
                />
                <span className="text-sm">RV (Renuncia Voluntaria)</span>
              </label>
            </div>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tiposBaja.includes('BXF')}
                  onChange={() => handleTipoBajaChange('BXF')}
                  className="w-4 h-4 text-danger bg-surface border-border-main rounded focus:ring-danger"
                />
                <span className="text-sm">BXF (Baja por Faltas)</span>
              </label>
            </div>
          </div>

          {/* Filtro por Área */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-muted">
              Área ({areas.length > 0 ? areas.length : 'todas'})
            </label>
            <div className="max-h-48 overflow-y-auto border border-border-main rounded-lg p-2 bg-surface">
              {valoresUnicos.areas.length === 0 ? (
                <p className="text-text-muted text-sm py-2">No hay áreas disponibles</p>
              ) : (
                <div className="space-y-1">
                  {valoresUnicos.areas.map((area) => (
                    <label key={area} className="flex items-center gap-2 cursor-pointer p-1 hover:bg-border-main rounded">
                      <input
                        type="checkbox"
                        checked={areas.includes(area)}
                        onChange={() => handleAreaChange(area)}
                        className="w-4 h-4 text-info bg-surface border-border-main rounded focus:ring-info"
                      />
                      <span className="text-sm">{area}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Filtro por Supervisor */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-muted">
              Supervisor ({supervisores.length > 0 ? supervisores.length : 'todos'})
            </label>
            <div className="max-h-48 overflow-y-auto border border-border-main rounded-lg p-2 bg-surface">
              {valoresUnicos.supervisores.length === 0 ? (
                <p className="text-text-muted text-sm py-2">No hay supervisores disponibles</p>
              ) : (
                <div className="space-y-1">
                  {valoresUnicos.supervisores.map((supervisor) => (
                    <label key={supervisor} className="flex items-center gap-2 cursor-pointer p-1 hover:bg-border-main rounded">
                      <input
                        type="checkbox"
                        checked={supervisores.includes(supervisor)}
                        onChange={() => handleSupervisorChange(supervisor)}
                        className="w-4 h-4 text-info bg-surface border-border-main rounded focus:ring-info"
                      />
                      <span className="text-sm">{supervisor}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Filtro por Rango Salarial */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-muted">
              Rango Salarial
            </label>
            <select
              value={rangoSalarial || ''}
              onChange={(e) => setRangoSalarial(e.target.value || null)}
              className="input w-full"
            >
              <option value="">Todos los rangos</option>
              {valoresUnicos.rangosSalariales.map((rango) => (
                <option key={rango} value={rango}>
                  {rango}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
