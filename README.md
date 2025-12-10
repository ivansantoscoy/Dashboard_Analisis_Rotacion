# Dashboard de Análisis de Rotación

Sistema interactivo para analizar datos de rotación de empleados, identificar patrones de renuncia y aplicar análisis Pareto (80-20) para desarrollar estrategias de retención.

## Descripción

Este dashboard permite a los equipos de Recursos Humanos cargar matrices de rotación y realizar análisis profundos sobre:

- Patrones de renuncia por supervisor, área, puesto, turno y otros factores
- Análisis Pareto (80-20) para identificar las causas principales de rotación
- Correlaciones entre variables (salario, antigüedad, entrenamiento, etc.)
- Análisis de encuestas de salida
- Predicción de rotación mediante Machine Learning
- Exportación de reportes ejecutivos

## Características Principales

### Análisis

- Análisis Pareto por múltiples categorías (supervisores, áreas, puestos, salarios)
- Matriz de correlación entre variables
- Análisis de texto de encuestas de salida
- Detección automática de patrones y tendencias
- Insights automáticos con recomendaciones accionables

### Visualizaciones

- Gráficas Pareto interactivas
- Series temporales de rotación
- Mapas de calor de correlaciones
- Distribuciones por categorías
- Nubes de palabras de encuestas

### UX

- Dashboard interactivo y responsivo
- Tooltips informativos en todas las visualizaciones
- Filtros avanzados
- Exportación a PDF y Excel
- Diseño profesional con paleta de colores corporativa

## Stack Tecnológico

### Frontend
- React 18 + TypeScript
- Vite
- TailwindCSS
- Recharts + D3.js
- Zustand (state management)

### Backend
- Python 3.11+
- FastAPI
- pandas + numpy (análisis)
- scikit-learn (ML)
- Pydantic (validación)

### Infraestructura
- Docker + Docker Compose
- GitHub Actions (CI/CD)

## Inicio Rápido

### Prerrequisitos

- Docker y Docker Compose
- Node.js 18+ (para desarrollo local)
- Python 3.11+ (para desarrollo local)

### Instalación

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd Dashboard_Analisis_Rotacion
```

2. Levantar con Docker:
```bash
docker-compose up -d
```

3. Acceder a la aplicación:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Documentación API: http://localhost:8000/docs

### Desarrollo Local

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Uso

### 1. Cargar Datos

1. En la pantalla inicial, haz clic en "Cargar Archivo"
2. Selecciona tu archivo CSV o Excel con la matriz de rotación
3. El sistema validará las columnas y mostrará un preview
4. Confirma la carga

### 2. Explorar Dashboard

- Vista general con métricas clave
- Gráficas de distribución
- Tendencias temporales

### 3. Análisis Avanzado

- Selecciona "Análisis Pareto"
- Elige la categoría (supervisor, área, puesto, etc.)
- Visualiza el 20% que causa el 80% de rotación
- Revisa insights automáticos

### 4. Exportar Resultados

- Haz clic en "Exportar"
- Selecciona formato (PDF o Excel)
- Descarga el reporte

## Estructura del Proyecto

```
dashboard-rotacion/
├── frontend/          # Aplicación React
├── backend/           # API FastAPI
├── docker/            # Configuraciones Docker
├── docs/              # Documentación
└── scripts/           # Scripts de utilidad
```

Ver [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) para detalles completos.

## Documentación

- [Arquitectura del Sistema](ARCHITECTURE.md)
- [Plan de Implementación](IMPLEMENTATION_PLAN.md)
- [Modelo de Datos](DATA_MODEL.md)
- [Estructura del Proyecto](PROJECT_STRUCTURE.md)

## Columnas del Archivo

El archivo de rotación debe contener las siguientes columnas:

- **Empleado#**: Número de empleado
- **Nombre**: Nombre completo
- **Fecha de baja en el Sistema**: Fecha de registro de baja
- **Fecha de último día de trabajo (UDT)**: Último día trabajado
- **Fecha de Alta**: Fecha de contratación
- **Antigüedad en Semanas**: Antigüedad al momento de baja
- **Encuesta de salida 4FRH-209**: Razón real de renuncia (CRÍTICO)
- **Tipo de baja en el Sistema**: RV (Renuncia Voluntaria) o BXF (Baja por Faltas)
- **Área**: Área de trabajo
- **Supervisor**: Supervisor asignado
- **Puesto**: Posición del empleado
- **Turno**: Turno laboral
- **Salario**: Último salario
- Y más... (ver [DATA_MODEL.md](DATA_MODEL.md))

## Paleta de Colores

El sistema utiliza una paleta de colores profesional en tonos grises:

```css
--color-void: #000000
--color-surface: #202020
--color-border-main: #404040
--color-text-muted: #5f5f5f
--color-accent: #7f7f7f
```

## Roadmap

### Fase 1 (MVP) - Semanas 1-3
- Carga de archivos
- Dashboard básico
- Análisis Pareto fundamental

### Fase 2 - Semanas 4-5
- Análisis de correlaciones
- Análisis de encuestas de salida
- Cruces de variables

### Fase 3 - Semanas 6-7
- Machine Learning para predicción
- Análisis de sentimiento
- Exportación de reportes

Ver [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) para detalles.

## Testing

```bash
# Frontend
cd frontend
npm test
npm run test:coverage

# Backend
cd backend
pytest
pytest --cov=app tests/
```

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto es privado y confidencial.

## Contacto

Para preguntas o soporte, contacta al equipo de desarrollo.