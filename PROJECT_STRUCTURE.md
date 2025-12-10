# Estructura del Proyecto - Dashboard de Análisis de Rotación

## Árbol de Directorios Completo

```
dashboard-rotacion/
│
├── .github/
│   └── workflows/
│       ├── ci.yml                          # CI/CD pipeline
│       ├── frontend-tests.yml              # Tests de frontend
│       └── backend-tests.yml               # Tests de backend
│
├── docs/
│   ├── ARCHITECTURE.md                     # Arquitectura del sistema
│   ├── IMPLEMENTATION_PLAN.md              # Plan de implementación
│   ├── API_DOCUMENTATION.md                # Documentación de APIs
│   ├── USER_GUIDE.md                       # Manual de usuario
│   ├── DEPLOYMENT.md                       # Guía de deployment
│   └── CONTRIBUTING.md                     # Guía de contribución
│
├── frontend/
│   ├── public/
│   │   ├── favicon.ico
│   │   └── assets/
│   │       └── images/
│   │
│   ├── src/
│   │   ├── App.tsx                         # Componente raíz
│   │   ├── main.tsx                        # Entry point
│   │   ├── router.tsx                      # Configuración de rutas
│   │   │
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Layout.tsx              # Layout principal
│   │   │   │   ├── Header.tsx              # Header
│   │   │   │   ├── Sidebar.tsx             # Sidebar de navegación
│   │   │   │   └── Footer.tsx              # Footer
│   │   │   │
│   │   │   ├── upload/
│   │   │   │   ├── FileUploader.tsx        # Componente principal de carga
│   │   │   │   ├── DropZone.tsx            # Zona de drag & drop
│   │   │   │   ├── FileValidator.tsx       # Validador visual
│   │   │   │   ├── DataPreview.tsx         # Preview de datos
│   │   │   │   └── UploadSummary.tsx       # Resumen de carga
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── DashboardView.tsx       # Vista principal del dashboard
│   │   │   │   ├── MetricsCards.tsx        # Tarjetas de métricas KPI
│   │   │   │   ├── MetricCard.tsx          # Tarjeta individual
│   │   │   │   ├── QuickStats.tsx          # Estadísticas rápidas
│   │   │   │   └── RecentActivity.tsx      # Actividad reciente
│   │   │   │
│   │   │   ├── analysis/
│   │   │   │   ├── AnalysisView.tsx        # Vista de análisis
│   │   │   │   ├── ParetoPanel.tsx         # Panel de análisis Pareto
│   │   │   │   ├── CorrelationPanel.tsx    # Panel de correlaciones
│   │   │   │   ├── CrossAnalysis.tsx       # Análisis cruzado
│   │   │   │   ├── ExitSurveyAnalysis.tsx  # Análisis de encuestas
│   │   │   │   ├── PatternDetector.tsx     # Detector de patrones
│   │   │   │   └── InsightsPanel.tsx       # Panel de insights
│   │   │   │
│   │   │   ├── charts/
│   │   │   │   ├── ParetoChart.tsx         # Gráfica Pareto
│   │   │   │   ├── DistributionChart.tsx   # Gráfica de distribución
│   │   │   │   ├── TimeSeriesChart.tsx     # Serie temporal
│   │   │   │   ├── BarChart.tsx            # Gráfica de barras
│   │   │   │   ├── PieChart.tsx            # Gráfica circular
│   │   │   │   ├── HeatmapChart.tsx        # Mapa de calor
│   │   │   │   ├── SankeyDiagram.tsx       # Diagrama Sankey
│   │   │   │   ├── TreemapChart.tsx        # Treemap
│   │   │   │   ├── WordCloud.tsx           # Nube de palabras
│   │   │   │   └── ChartContainer.tsx      # Contenedor reutilizable
│   │   │   │
│   │   │   ├── filters/
│   │   │   │   ├── FilterPanel.tsx         # Panel de filtros
│   │   │   │   ├── DateRangeFilter.tsx     # Filtro de rango de fechas
│   │   │   │   ├── CategoryFilter.tsx      # Filtro por categoría
│   │   │   │   ├── MultiSelectFilter.tsx   # Filtro multi-selección
│   │   │   │   └── FilterChips.tsx         # Chips de filtros activos
│   │   │   │
│   │   │   ├── export/
│   │   │   │   ├── ExportPanel.tsx         # Panel de exportación
│   │   │   │   ├── ExportButton.tsx        # Botón de exportar
│   │   │   │   └── ReportConfig.tsx        # Configuración de reporte
│   │   │   │
│   │   │   ├── ml/
│   │   │   │   ├── PredictionDashboard.tsx # Dashboard de predicciones
│   │   │   │   ├── SentimentAnalysis.tsx   # Análisis de sentimiento
│   │   │   │   ├── ClusterView.tsx         # Vista de clusters
│   │   │   │   └── RiskScore.tsx           # Score de riesgo
│   │   │   │
│   │   │   └── common/
│   │   │       ├── Button.tsx              # Botón reutilizable
│   │   │       ├── Card.tsx                # Tarjeta
│   │   │       ├── Table.tsx               # Tabla
│   │   │       ├── Modal.tsx               # Modal
│   │   │       ├── Tooltip.tsx             # Tooltip
│   │   │       ├── Loading.tsx             # Indicador de carga
│   │   │       ├── ErrorBoundary.tsx       # Manejo de errores
│   │   │       ├── NoData.tsx              # Estado sin datos
│   │   │       └── ProgressBar.tsx         # Barra de progreso
│   │   │
│   │   ├── services/
│   │   │   ├── api/
│   │   │   │   ├── client.ts               # Cliente HTTP (axios)
│   │   │   │   ├── uploadService.ts        # Servicio de upload
│   │   │   │   ├── analysisService.ts      # Servicio de análisis
│   │   │   │   ├── mlService.ts            # Servicio de ML
│   │   │   │   └── exportService.ts        # Servicio de exportación
│   │   │   │
│   │   │   ├── fileParser.ts               # Parser de archivos
│   │   │   ├── dataValidator.ts            # Validador de datos
│   │   │   ├── dataTransform.ts            # Transformación de datos
│   │   │   ├── metricsCalculator.ts        # Calculador de métricas
│   │   │   ├── chartDataBuilder.ts         # Constructor de datos para charts
│   │   │   └── cacheService.ts             # Servicio de cache
│   │   │
│   │   ├── stores/
│   │   │   ├── dataStore.ts                # Store de datos
│   │   │   ├── uiStore.ts                  # Store de UI
│   │   │   ├── filterStore.ts              # Store de filtros
│   │   │   ├── analysisStore.ts            # Store de análisis
│   │   │   └── index.ts                    # Exportación de stores
│   │   │
│   │   ├── types/
│   │   │   ├── employee.types.ts           # Tipos de empleado
│   │   │   ├── analysis.types.ts           # Tipos de análisis
│   │   │   ├── chart.types.ts              # Tipos de gráficas
│   │   │   ├── api.types.ts                # Tipos de API
│   │   │   └── index.ts                    # Exportación de tipos
│   │   │
│   │   ├── utils/
│   │   │   ├── dateUtils.ts                # Utilidades de fechas
│   │   │   ├── formatters.ts               # Formateadores
│   │   │   ├── validators.ts               # Validadores
│   │   │   ├── calculations.ts             # Cálculos matemáticos
│   │   │   ├── constants.ts                # Constantes
│   │   │   └── helpers.ts                  # Helpers generales
│   │   │
│   │   ├── hooks/
│   │   │   ├── useData.ts                  # Hook de datos
│   │   │   ├── useAnalysis.ts              # Hook de análisis
│   │   │   ├── useFilters.ts               # Hook de filtros
│   │   │   ├── useExport.ts                # Hook de exportación
│   │   │   └── useDebounce.ts              # Hook de debounce
│   │   │
│   │   ├── styles/
│   │   │   ├── globals.css                 # Estilos globales
│   │   │   ├── variables.css               # Variables CSS
│   │   │   └── themes.css                  # Temas
│   │   │
│   │   └── config/
│   │       ├── colors.ts                   # Configuración de colores
│   │       ├── charts.ts                   # Configuración de charts
│   │       └── app.ts                      # Configuración de app
│   │
│   ├── tests/
│   │   ├── unit/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   ├── integration/
│   │   └── e2e/
│   │       └── dashboard.spec.ts
│   │
│   ├── .env.example                        # Variables de entorno ejemplo
│   ├── .eslintrc.json                      # Configuración ESLint
│   ├── .prettierrc                         # Configuración Prettier
│   ├── index.html                          # HTML principal
│   ├── package.json                        # Dependencias npm
│   ├── tsconfig.json                       # Configuración TypeScript
│   ├── vite.config.ts                      # Configuración Vite
│   └── tailwind.config.js                  # Configuración Tailwind
│
├── backend/
│   ├── app/
│   │   ├── main.py                         # Entry point FastAPI
│   │   │
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── deps.py                     # Dependencias
│   │   │   ├── upload.py                   # Endpoints de upload
│   │   │   ├── analysis.py                 # Endpoints de análisis
│   │   │   ├── ml.py                       # Endpoints de ML
│   │   │   └── health.py                   # Health check
│   │   │
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── employee.py                 # Modelo de empleado
│   │   │   ├── analysis.py                 # Modelos de análisis
│   │   │   └── schemas.py                  # Schemas Pydantic
│   │   │
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── data_processor.py           # Procesador de datos
│   │   │   ├── data_validator.py           # Validador de datos
│   │   │   ├── pareto_analyzer.py          # Analizador Pareto
│   │   │   ├── correlation_analyzer.py     # Analizador de correlaciones
│   │   │   ├── cross_analyzer.py           # Analizador de cruces
│   │   │   ├── survey_analyzer.py          # Analizador de encuestas
│   │   │   ├── insights_generator.py       # Generador de insights
│   │   │   ├── pdf_generator.py            # Generador de PDFs
│   │   │   └── excel_exporter.py           # Exportador a Excel
│   │   │
│   │   ├── ml/
│   │   │   ├── __init__.py
│   │   │   ├── rotation_predictor.py       # Predictor de rotación
│   │   │   ├── sentiment_analyzer.py       # Analizador de sentimiento
│   │   │   ├── employee_clustering.py      # Clustering
│   │   │   └── feature_engineering.py      # Feature engineering
│   │   │
│   │   ├── utils/
│   │   │   ├── __init__.py
│   │   │   ├── date_utils.py               # Utilidades de fechas
│   │   │   ├── calculations.py             # Cálculos
│   │   │   ├── validators.py               # Validadores
│   │   │   └── constants.py                # Constantes
│   │   │
│   │   └── config/
│   │       ├── __init__.py
│   │       ├── settings.py                 # Configuración de app
│   │       └── logging.py                  # Configuración de logs
│   │
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── conftest.py                     # Configuración de pytest
│   │   ├── test_api/
│   │   ├── test_services/
│   │   └── test_utils/
│   │
│   ├── .env.example                        # Variables de entorno ejemplo
│   ├── .flake8                             # Configuración Flake8
│   ├── .python-version                     # Versión de Python
│   ├── pyproject.toml                      # Configuración Poetry
│   ├── requirements.txt                    # Dependencias pip
│   └── pytest.ini                          # Configuración pytest
│
├── docker/
│   ├── frontend/
│   │   ├── Dockerfile                      # Dockerfile frontend
│   │   └── nginx.conf                      # Configuración Nginx
│   │
│   └── backend/
│       ├── Dockerfile                      # Dockerfile backend
│       └── entrypoint.sh                   # Script de entrada
│
├── scripts/
│   ├── init-project.sh                     # Script de inicialización
│   ├── run-dev.sh                          # Ejecutar desarrollo
│   ├── run-tests.sh                        # Ejecutar tests
│   └── deploy.sh                           # Script de deployment
│
├── .gitignore                              # Archivos ignorados por git
├── .env.example                            # Variables de entorno ejemplo
├── docker-compose.yml                      # Orquestación Docker
├── docker-compose.dev.yml                  # Docker para desarrollo
├── README.md                               # Documentación principal
├── ARCHITECTURE.md                         # Arquitectura del sistema
├── IMPLEMENTATION_PLAN.md                  # Plan de implementación
└── PROJECT_STRUCTURE.md                    # Este archivo
```

## Descripción de Directorios Principales

### `/frontend`
Aplicación React con TypeScript. Contiene toda la lógica de presentación, componentes UI, visualizaciones y comunicación con el backend.

### `/backend`
API REST con FastAPI. Procesa datos, ejecuta análisis estadísticos y ML, y provee endpoints para el frontend.

### `/docs`
Documentación del proyecto incluyendo arquitectura, guías de usuario, API docs y deployment.

### `/docker`
Configuraciones de Docker para containerización del frontend y backend.

### `/scripts`
Scripts de automatización para desarrollo, testing y deployment.

### `/.github`
Configuración de GitHub Actions para CI/CD.

## Archivos de Configuración Clave

### Frontend
- `vite.config.ts`: Configuración del bundler
- `tailwind.config.js`: Paleta de colores personalizada
- `tsconfig.json`: Configuración de TypeScript
- `.eslintrc.json`: Reglas de linting

### Backend
- `pyproject.toml`: Dependencias y configuración de Poetry
- `pytest.ini`: Configuración de tests
- `.flake8`: Reglas de linting Python

### Docker
- `docker-compose.yml`: Orquestación de servicios
- `Dockerfile`: Imágenes de containers

## Convenciones de Nombres

### Archivos
- Componentes React: `PascalCase.tsx`
- Servicios/Utils: `camelCase.ts`
- Módulos Python: `snake_case.py`
- Estilos: `kebab-case.css`

### Código
- Componentes: `PascalCase`
- Funciones: `camelCase`
- Constantes: `UPPER_SNAKE_CASE`
- Tipos/Interfaces: `PascalCase`

## Próximos Pasos

1. Ejecutar script de inicialización
2. Configurar entornos de desarrollo
3. Crear estructura de directorios
4. Inicializar proyectos (npm, poetry)
5. Configurar Docker
6. Primer commit
