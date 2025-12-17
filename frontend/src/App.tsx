import { useState } from 'react';
import { FileParser } from './services/fileParser';
import { useDataStore } from './stores';
import type { EmpleadoRotacion } from './types';
import { Dashboard } from './components/dashboard';

function App() {
  const { setEmpleados, empleados, isLoading, setLoading, analisis, isAnalyzing } = useDataStore();
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setUploadError(null);

    try {
      const result = await FileParser.parseFile(file);

      if (result.errors.length > 0) {
        console.warn('Errores de validación:', result.errors);
      }

      setEmpleados(result.data);
      console.log(`Cargados ${result.data.length} empleados`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al cargar archivo';
      setUploadError(message);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard de Análisis de Rotación</h1>
          <p className="text-text-muted">Sistema para analizar datos de rotación de empleados</p>
        </header>

        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">Cargar Datos</h2>

          <div className="mb-4">
            <label className="block mb-2">
              Selecciona el archivo CSV o Excel:
            </label>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              disabled={isLoading}
              className="input w-full"
            />
          </div>

          {isLoading && (
            <div className="text-info">Cargando archivo...</div>
          )}

          {uploadError && (
            <div className="bg-danger bg-opacity-20 border border-danger text-danger px-4 py-3 rounded">
              {uploadError}
            </div>
          )}

          {empleados.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3">Datos Cargados</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="card">
                  <div className="text-text-muted text-sm">Total de Registros</div>
                  <div className="text-3xl font-bold">{empleados.length}</div>
                </div>
                <div className="card">
                  <div className="text-text-muted text-sm">Renuncias Voluntarias</div>
                  <div className="text-3xl font-bold text-info">
                    {empleados.filter(e => e.tipoBajaNormalizado === 'RV').length}
                  </div>
                </div>
                <div className="card">
                  <div className="text-text-muted text-sm">Bajas por Faltas</div>
                  <div className="text-3xl font-bold text-danger">
                    {empleados.filter(e => e.tipoBajaNormalizado === 'BXF').length}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-surface border-b border-border-main">
                      <th className="px-4 py-2 text-left">Empleado #</th>
                      <th className="px-4 py-2 text-left">Nombre</th>
                      <th className="px-4 py-2 text-left">Área</th>
                      <th className="px-4 py-2 text-left">Supervisor</th>
                      <th className="px-4 py-2 text-left">Tipo Baja</th>
                      <th className="px-4 py-2 text-left">Antigüedad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {empleados.slice(0, 10).map((emp, idx) => (
                      <tr key={emp.numeroEmpleado} className="border-b border-border-main hover:bg-surface">
                        <td className="px-4 py-2">{emp.numeroEmpleado}</td>
                        <td className="px-4 py-2">{emp.nombre}</td>
                        <td className="px-4 py-2">{emp.area}</td>
                        <td className="px-4 py-2">{emp.supervisor}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded text-sm ${
                            emp.tipoBajaNormalizado === 'RV' ? 'bg-info bg-opacity-20 text-info' : 'bg-danger bg-opacity-20 text-danger'
                          }`}>
                            {emp.tipoBajaNormalizado === 'RV' ? 'RV' : 'BXF'}
                          </span>
                        </td>
                        <td className="px-4 py-2">{emp.antiguedadSemanas} sem</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {empleados.length > 10 && (
                  <div className="text-text-muted text-sm mt-2 text-center">
                    Mostrando 10 de {empleados.length} registros
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dashboard de Análisis */}
        {empleados.length > 0 && (
          <div className="mt-8">
            {isAnalyzing ? (
              <div className="card">
                <div className="text-center py-8">
                  <div className="text-info text-lg">Analizando datos...</div>
                </div>
              </div>
            ) : analisis ? (
              <Dashboard />
            ) : null}
          </div>
        )}

        <footer className="mt-8 text-center text-text-muted text-sm">
          <p>Dashboard de Análisis de Rotación v1.0.0</p>
          <p>Sistema para identificar patrones de renuncia y aplicar análisis Pareto</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
