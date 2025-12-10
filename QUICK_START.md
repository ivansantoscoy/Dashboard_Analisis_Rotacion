# Guía de Inicio Rápido

## Arquitectura y Plan Completados

El proyecto Dashboard de Análisis de Rotación cuenta con:

### Documentación Completa

1. **ARCHITECTURE.md** - Arquitectura detallada del sistema
   - Stack tecnológico (React + FastAPI)
   - Módulos y componentes
   - Flujo de datos
   - APIs y servicios

2. **IMPLEMENTATION_PLAN.md** - Plan de implementación en 3 fases
   - Fase 1 (Semanas 1-3): MVP con carga y dashboard básico
   - Fase 2 (Semanas 4-5): Análisis avanzado y correlaciones
   - Fase 3 (Semanas 6-7): ML, predicciones y exportación

3. **DATA_MODEL.md** - Modelo de datos completo
   - Interfaz EmpleadoRotacion con todas las columnas
   - Modelos de análisis Pareto
   - Correlaciones y patrones
   - Validaciones y esquemas

4. **PROJECT_STRUCTURE.md** - Estructura de directorios
   - Organización completa del código
   - Convenciones de nombres
   - Ubicación de componentes

### Estructura Base Creada

```
Dashboard_Analisis_Rotacion/
├── README.md                      # Documentación principal
├── ARCHITECTURE.md                # Arquitectura del sistema
├── IMPLEMENTATION_PLAN.md         # Plan de implementación
├── DATA_MODEL.md                  # Modelo de datos
├── PROJECT_STRUCTURE.md           # Estructura de directorios
├── QUICK_START.md                 # Esta guía
├── docker-compose.yml             # Orquestación Docker
├── .gitignore                     # Archivos ignorados
├── .env.example                   # Variables de entorno
│
├── docs/                          # Documentación adicional
├── docker/                        # Configuraciones Docker
│   ├── frontend/
│   │   ├── Dockerfile
│   │   └── nginx.conf
│   └── backend/
│       └── Dockerfile
│
├── scripts/                       # Scripts de utilidad
│   └── init-project.sh           # Script de inicialización
│
├── frontend/                      # (A crear en Fase 1)
└── backend/                       # (A crear en Fase 1)
```

## Próximos Pasos

### Opción 1: Inicialización Completa

```bash
# 1. Ejecutar script de inicialización
./scripts/init-project.sh

# 2. Inicializar Frontend
cd frontend
npm init -y
npm install vite @vitejs/plugin-react typescript --save-dev
npm install react react-dom react-router-dom
npm install tailwindcss postcss autoprefixer --save-dev
npm install zustand recharts d3 papaparse
npm install @types/react @types/react-dom --save-dev

# 3. Inicializar Backend
cd ../backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install fastapi uvicorn pandas numpy scikit-learn pydantic python-multipart

# 4. Crear requirements.txt
pip freeze > requirements.txt
```

### Opción 2: Desarrollo Gradual (Recomendado)

Seguir el **IMPLEMENTATION_PLAN.md** paso a paso:

#### Sprint 1 (Semana 1): Setup e Infraestructura
- Inicializar proyectos frontend y backend
- Configurar Docker
- Crear modelos de datos base
- Setup de CI/CD

#### Sprint 2 (Semana 2): Módulo de Carga
- Componente de upload
- Parser de archivos
- Validación de datos
- Preview de datos

#### Sprint 3 (Semana 3): Dashboard Básico
- Layout principal
- Métricas KPI
- Gráficas básicas
- State management

## Comandos Útiles

### Docker
```bash
# Levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Rebuild
docker-compose up --build
```

### Frontend (una vez inicializado)
```bash
cd frontend
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm test             # Ejecutar tests
npm run lint         # Linter
```

### Backend (una vez inicializado)
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload    # Servidor de desarrollo
pytest                           # Ejecutar tests
pytest --cov=app tests/          # Tests con coverage
```

## Características Principales del Sistema

### Funcionalidades Core

1. **Carga de Datos**
   - Upload de CSV/Excel
   - Validación automática
   - Preview de datos
   - Detección de errores

2. **Dashboard Interactivo**
   - Métricas clave (KPIs)
   - Visualizaciones dinámicas
   - Filtros avanzados
   - Tooltips informativos

3. **Análisis Pareto (80-20)**
   - Por supervisor
   - Por área
   - Por puesto
   - Por salario
   - Por antigüedad

4. **Análisis Avanzado**
   - Correlaciones entre variables
   - Análisis de encuestas de salida
   - Cruces de variables personalizados
   - Insights automáticos

5. **Machine Learning** (Fase 3)
   - Predicción de rotación
   - Análisis de sentimiento
   - Clustering de empleados

6. **Exportación**
   - Reportes en PDF
   - Exportación a Excel
   - Gráficas incluidas

### Paleta de Colores

El sistema usa una paleta profesional en tonos grises:

```css
--color-void: #000000          /* Negro absoluto */
--color-surface: #202020       /* Gris muy oscuro */
--color-border-main: #404040   /* Gris oscuro */
--color-text-muted: #5f5f5f    /* Gris medio */
--color-accent: #7f7f7f        /* Gris claro */
```

### Columnas Críticas del Archivo

Columnas **REQUERIDAS**:
- Empleado# (número único)
- Nombre
- Fecha de baja en el Sistema
- Fecha de último día de trabajo (UDT)
- Fecha de Alta
- Antigüedad en Semanas
- Tipo de baja en el Sistema (RV o BXF)
- Área
- Supervisor
- Puesto
- Salario

Columnas **MUY IMPORTANTES** para análisis:
- **Encuesta de salida 4FRH-209** (razón REAL de renuncia)
- Turno
- Cumplió con periodo de entrenamiento
- Total de faltas

Columnas **NO USAR** en análisis:
- Razón de Renuncia (capturada por RH)
- Razón capturada en Sistema
- Clase (siempre es "1")
- Depto. (ignorar)

## Tecnologías Clave

### Frontend
- **React 18**: Framework UI
- **TypeScript**: Type safety
- **Vite**: Build tool (rápido)
- **TailwindCSS**: Estilos (paleta custom)
- **Recharts**: Gráficas interactivas
- **Zustand**: State management (simple)
- **PapaParse**: Parser CSV/Excel

### Backend
- **FastAPI**: Framework API (rápido, async)
- **Pydantic**: Validación de datos
- **pandas**: Procesamiento de datos
- **numpy**: Cálculos numéricos
- **scikit-learn**: Machine Learning
- **uvicorn**: ASGI server

### DevOps
- **Docker**: Containerización
- **Docker Compose**: Orquestación
- **GitHub Actions**: CI/CD

## Recursos de Aprendizaje

- [Documentación de React](https://react.dev)
- [Documentación de FastAPI](https://fastapi.tiangolo.com)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Recharts Examples](https://recharts.org/en-US/examples)
- [pandas Guide](https://pandas.pydata.org/docs/user_guide/index.html)

## Soporte

Para dudas o problemas:
1. Revisar la documentación en `/docs`
2. Consultar los ejemplos en el código
3. Contactar al equipo de desarrollo

## Checklist de Inicio

- [ ] Revisar ARCHITECTURE.md
- [ ] Leer IMPLEMENTATION_PLAN.md
- [ ] Entender DATA_MODEL.md
- [ ] Ejecutar init-project.sh
- [ ] Configurar entorno de desarrollo
- [ ] Inicializar Frontend (npm)
- [ ] Inicializar Backend (pip)
- [ ] Levantar Docker
- [ ] Crear primer componente
- [ ] Implementar primer endpoint
- [ ] Probar integración Frontend-Backend

¡Listo para empezar! Sigue el plan de implementación y construye el sistema paso a paso.
