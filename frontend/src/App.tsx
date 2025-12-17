import { useState } from 'react';
import { useDataStore } from './stores';
import { useClienteStore } from './stores/clienteStore';
import { Dashboard } from './components/dashboard';
import { SelectorCliente, GestionClientes } from './components/cliente';

function App() {
  const { empleados, isLoading, analisis, isAnalyzing } = useDataStore();
  const { clienteActualId } = useClienteStore();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-800">Dashboard de Análisis de Rotación</h1>
          <p className="text-gray-600">Sistema multi-cliente para analizar datos de rotación de empleados</p>
        </header>

        {/* Selector de Cliente y Carga de CSV */}
        <SelectorCliente />

        {/* Panel de Gestión de Clientes Activos */}
        {clienteActualId && (
          <div className="mb-6">
            <GestionClientes />
          </div>
        )}

        {/* Resumen de Datos Cargados */}
        {empleados.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Datos Cargados</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-gray-600 text-sm">Total de Registros</div>
                <div className="text-3xl font-bold text-gray-800">{empleados.length}</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-gray-600 text-sm">Renuncias Voluntarias</div>
                <div className="text-3xl font-bold text-green-600">
                  {empleados.filter(e => e.tipoBajaNormalizado === 'RV').length}
                </div>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-gray-600 text-sm">Bajas por Faltas</div>
                <div className="text-3xl font-bold text-red-600">
                  {empleados.filter(e => e.tipoBajaNormalizado === 'BXF').length}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard de Análisis */}
        {empleados.length > 0 && (
          <div>
            {isAnalyzing ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center py-8">
                  <div className="text-blue-600 text-lg">Analizando datos...</div>
                </div>
              </div>
            ) : analisis ? (
              <Dashboard />
            ) : null}
          </div>
        )}

        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>Dashboard de Análisis de Rotación v2.0.0 (Multi-Cliente)</p>
          <p>Sistema para identificar patrones de renuncia, aplicar análisis Pareto y ML por cliente</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
