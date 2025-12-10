# Arquitectura del Dashboard de Análisis de Rotación

## 1. Visión General

Sistema web interactivo para analizar datos de rotación de empleados, identificar patrones de renuncia y aplicar análisis Pareto (80-20) para estrategias de retención.

## 2. Stack Tecnológico

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Estilos**: TailwindCSS (configurado con paleta custom)
- **Visualizaciones**: Recharts + D3.js
- **Manejo de Estado**: Zustand
- **Parsing de Datos**: PapaParse (CSV/Excel)
- **UI Components**: shadcn/ui (customizado)
- **Routing**: React Router v6

### Backend
- **Framework**: Python FastAPI
- **Análisis de Datos**: pandas, numpy, scikit-learn
- **Validación**: Pydantic
- **CORS**: fastapi-cors-middleware

### Infraestructura
- **Containerización**: Docker + Docker Compose
- **Storage**: LocalStorage (MVP) / S3 (Producción)
- **CI/CD**: GitHub Actions

## 3. Arquitectura de Componentes

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Upload     │  │  Dashboard   │  │   Analysis   │      │
│  │    View      │  │     View     │  │     View     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│  ┌──────────────────────────────────────────────────┐      │
│  │           State Management (Zustand)              │      │
│  └──────────────────────────────────────────────────┘      │
│         │                  │                  │              │
│  ┌──────────────────────────────────────────────────┐      │
│  │              Services Layer                       │      │
│  │  - FileParser  - DataProcessor  - ChartBuilder   │      │
│  └──────────────────────────────────────────────────┘      │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │ HTTP/REST
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (FastAPI)                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Upload    │  │   Analysis   │  │   Patterns   │      │
│  │   Endpoint   │  │   Endpoint   │  │   Endpoint   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│  ┌──────────────────────────────────────────────────┐      │
│  │              Business Logic Layer                 │      │
│  │  - DataValidator  - PatternAnalyzer               │      │
│  │  - ParetoAnalyzer - CorrelationEngine             │      │
│  └──────────────────────────────────────────────────┘      │
│         │                  │                  │              │
│  ┌──────────────────────────────────────────────────┐      │
│  │              Data Processing Layer                │      │
│  │  - pandas  - numpy  - scikit-learn                │      │
│  └──────────────────────────────────────────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 4. Modelo de Datos

### 4.1 Entidad Principal: Empleado

```typescript
interface EmpleadoRotacion {
  // Identificación
  numeroEmpleado: string;
  nombre: string;

  // Fechas críticas
  fechaBaja: Date;
  fechaUltimoDiaTrabajo: Date;
  fechaAlta: Date;

  // Antigüedad
  antiguedadSemanas: number;

  // Última semana trabajada
  numeroSemanaUltimasHoras: number;
  totalHorasUltimaSemana: number;

  // Finiquito
  fechaFiniquito?: Date;
  fechaEntregaFiniquito?: Date;
  montoFiniquito?: number;

  // Encuesta y razones
  encuestaSalida?: string; // 4FRH-209 - CRÍTICO PARA ANÁLISIS
  razonRenuncia?: string; // No usar en análisis
  razonCapturadaSistema?: string; // No usar en análisis

  // Clasificación
  clase: string; // Siempre "1" - ignorar
  turno: string;
  tipoBaja: 'RV' | 'RV.' | 'BXF' | 'BXF.'; // RV=Renuncia Voluntaria, BXF=Baja por Faltas

  // Organización
  area: string;
  supervisor: string;
  puesto: string;

  // Entrenamiento y desempeño
  cumplioEntrenamiento: boolean;
  totalFaltas: number;
  permisos: number;
  falta1?: Date;
  falta2?: Date;
  falta3?: Date;
  falta4?: Date;

  // Compensación
  salario: number;
  ultimoCambioSalario?: Date;
}
```

### 4.2 Modelos de Análisis

```typescript
interface PatronRotacion {
  categoria: string; // ej: "supervisor", "area", "salario"
  valor: string;
  totalRotaciones: number;
  porcentaje: number;
  impacto80_20: boolean; // true si está en el 20% que causa el 80%
}

interface AnalisisPareto {
  categoria: string;
  patrones: PatronRotacion[];
  concentracion80: PatronRotacion[]; // El 20% que causa el 80%
}

interface CorrelacionVariable {
  variable1: string;
  variable2: string;
  coeficiente: number; // -1 a 1
  significancia: 'alta' | 'media' | 'baja';
}
```

## 5. Módulos del Sistema

### 5.1 Módulo de Carga (Upload Module)

**Responsabilidades:**
- Validar formato de archivo (CSV, XLSX)
- Parsear datos
- Validar columnas requeridas
- Limpiar y normalizar datos
- Mostrar preview de datos cargados

**Componentes:**
- `FileUploader.tsx`
- `DataValidator.ts`
- `FileParser.ts`
- `DataPreview.tsx`

### 5.2 Módulo de Dashboard (Dashboard Module)

**Responsabilidades:**
- Vista general de métricas clave
- Distribución de renuncias
- Tendencias temporales
- Indicadores principales

**Componentes:**
- `DashboardView.tsx`
- `MetricsCards.tsx`
- `TrendChart.tsx`
- `DistributionChart.tsx`

**Métricas Clave:**
- Tasa de rotación total
- Rotación por tipo (RV vs BXF)
- Antigüedad promedio al renunciar
- Tiempo promedio para finiquito
- Rotación por periodo

### 5.3 Módulo de Análisis (Analysis Module)

**Responsabilidades:**
- Análisis Pareto (80-20)
- Correlaciones entre variables
- Patrones de renuncia
- Análisis de encuestas de salida
- Cruces de variables personalizados

**Componentes:**
- `ParetoAnalysis.tsx`
- `CorrelationMatrix.tsx`
- `PatternDetector.tsx`
- `CrossAnalysis.tsx`
- `ExitSurveyAnalysis.tsx`

**Análisis Implementados:**

1. **Análisis Pareto por:**
   - Supervisor (identificar supervisores con mayor rotación)
   - Área
   - Puesto
   - Turno
   - Rango salarial
   - Antigüedad

2. **Correlaciones:**
   - Salario vs Rotación
   - Entrenamiento vs Permanencia
   - Faltas vs Tipo de baja
   - Área vs Antigüedad promedio

3. **Patrones Temporales:**
   - Semanas con mayor rotación
   - Tiempo desde último cambio de salario
   - Días entre UDT y finiquito

### 5.4 Módulo de Visualización (Visualization Module)

**Componentes de Gráficas:**
- `ParetoChart.tsx` - Gráfica Pareto (barras + línea acumulada)
- `HeatmapChart.tsx` - Matriz de correlación
- `TimeSeriesChart.tsx` - Series temporales
- `SankeyDiagram.tsx` - Flujo de rotación
- `TreemapChart.tsx` - Distribución jerárquica

**Tooltips:**
Todos los gráficos incluyen tooltips informativos con:
- Valor exacto
- Porcentaje del total
- Contexto adicional
- Insights automáticos

## 6. Paleta de Colores

```css
:root {
  --color-void: #000000;
  --color-surface: #202020;
  --color-border-main: #404040;
  --color-text-muted: #5f5f5f;
  --color-accent: #7f7f7f;

  /* Colores derivados para gráficas */
  --color-primary: #7f7f7f;
  --color-success: #4a9f6f;
  --color-warning: #d4a574;
  --color-danger: #c65d5d;
  --color-info: #6b8fb5;
}
```

## 7. Flujo de Usuario

```
1. Landing → Pantalla de Carga
   └─ Usuario selecciona archivo CSV/XLSX
   └─ Sistema valida y parsea
   └─ Muestra preview de datos
   └─ Usuario confirma

2. Dashboard Principal
   ├─ Vista general de métricas
   ├─ Gráficas de distribución
   └─ Acceso rápido a análisis

3. Análisis Detallado
   ├─ Selección de tipo de análisis
   │  ├─ Pareto
   │  ├─ Correlaciones
   │  └─ Patrones personalizados
   │
   ├─ Configuración de parámetros
   └─ Visualización de resultados
      └─ Exportar insights
```

## 8. Consideraciones de Seguridad

- **Datos sensibles**: No enviar datos de empleados a servicios externos
- **Procesamiento local**: Análisis en frontend o backend privado
- **No persistencia**: Datos en memoria, se limpian al cerrar sesión
- **Validación**: Sanitizar inputs para prevenir inyecciones

## 9. Escalabilidad

### Fase 1 (MVP - 3 semanas)
- Carga de archivos
- Dashboard básico
- Análisis Pareto fundamental
- 5 visualizaciones principales

### Fase 2 (2 semanas)
- Análisis de correlaciones
- Análisis de encuestas de salida (NLP básico)
- Exportar reportes
- Filtros avanzados

### Fase 3 (2 semanas)
- Machine Learning para predicción de rotación
- Análisis de sentimiento en encuestas
- Comparativas temporales
- Alertas automáticas

## 10. Estructura de Carpetas

```
dashboard-rotacion/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── upload/
│   │   │   ├── dashboard/
│   │   │   ├── analysis/
│   │   │   ├── charts/
│   │   │   └── common/
│   │   ├── services/
│   │   ├── stores/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── hooks/
│   │   └── styles/
│   ├── public/
│   └── tests/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── services/
│   │   ├── models/
│   │   └── utils/
│   ├── tests/
│   └── requirements.txt
│
├── docs/
└── docker/
```

## 11. APIs Principales

### Backend Endpoints

```
POST   /api/upload          - Subir y validar archivo
GET    /api/analysis/pareto - Análisis Pareto
POST   /api/analysis/correlation - Matriz de correlación
POST   /api/analysis/patterns - Detectar patrones
GET    /api/analysis/summary - Resumen ejecutivo
POST   /api/analysis/custom - Análisis personalizado
```

## 12. Performance

- **Tamaño máximo de archivo**: 10MB (~50,000 registros)
- **Tiempo de carga**: < 2s para 10,000 registros
- **Tiempo de análisis**: < 3s para Pareto completo
- **Renderizado**: Virtualización para tablas grandes
- **Caching**: Resultados de análisis en memoria

## 13. Testing

- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Cypress
- **Backend Tests**: pytest
- **Coverage objetivo**: >80%

## 14. Deployment

### Desarrollo
```bash
docker-compose up -d
```

### Producción
- Frontend: Vercel/Netlify
- Backend: AWS ECS / Google Cloud Run
- Variables de entorno gestionadas por secrets manager
