# Guía de Deployment para Testing

## Opción 1: Deployment Local Rápido (Recomendado para Testing)

### Prerrequisitos
- Node.js 18 o superior
- Python 3.11 o superior

### Pasos:

#### 1. Frontend

```bash
# Navegar a la carpeta frontend
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en: **http://localhost:5173**

#### 2. Backend (en otra terminal)

```bash
# Navegar a la carpeta backend
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Linux/Mac:
source venv/bin/activate
# En Windows:
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Iniciar servidor
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

El backend estará disponible en: **http://localhost:8000**
Documentación API: **http://localhost:8000/docs**

---

## Opción 2: Deployment con Docker (Más Fácil)

### Prerrequisitos
- Docker
- Docker Compose

### Pasos:

```bash
# Desde la raíz del proyecto
docker-compose up -d
```

**Servicios disponibles:**
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

**Ver logs:**
```bash
docker-compose logs -f
```

**Detener:**
```bash
docker-compose down
```

---

## Opción 3: Solo Frontend (Para Testing de UI)

Si solo quieres probar el frontend sin backend:

```bash
cd frontend
npm install
npm run dev
```

**Nota:** El parsing de CSV funciona completamente en el frontend, así que puedes probar la carga de archivos sin backend.

---

## Verificar que Todo Funciona

### 1. Verificar Frontend
```bash
curl http://localhost:5173
# Deberías ver el HTML de la aplicación
```

O abre en navegador: http://localhost:5173

### 2. Verificar Backend
```bash
curl http://localhost:8000/health
# Debería devolver: {"status":"healthy","version":"1.0.0","service":"dashboard-rotacion-api"}
```

O abre en navegador: http://localhost:8000/docs

---

## Preparar Archivo CSV para Testing

### Opción A: Crear archivo de prueba

Crea un archivo `test_data.csv` con este contenido mínimo:

```csv
Empleado#,Nombre,Fecha de baja en el Sistema,Fecha de último día de trabajo (UDT),Fecha de Alta,Antigüedad en Semanas,Número de semana de las últimas horas trabajadas,Total de horas trabajadas  en la última semana,Tipo de baja en el Sistema,Clase,Turno,Área,Supervisor,Puesto,Cumplió con periodo de entrenamiento,Total de faltas,Permisos,Salario
12345,Juan Pérez,2024-01-15,2024-01-15,2023-06-01,32,2,40.0,RV,1,Matutino,Producción,María González,Operador,Sí,2,1,8500.00
67890,Ana Martínez,2024-02-20,2024-02-20,2023-11-15,14,8,38.5,BXF,1,Vespertino,Empaque,Carlos Ramírez,Empacador,No,5,0,7200.00
11223,Pedro López,2024-03-10,2024-03-10,2022-01-05,110,10,42.0,RV,1,Matutino,Producción,María González,Supervisor,Sí,0,3,12000.00
```

### Opción B: Usar datos reales

Si tienes un archivo real con la matriz de rotación, asegúrate que tenga estas columnas mínimas:

**Requeridas:**
- Empleado#
- Nombre
- Fecha de baja en el Sistema
- Fecha de último día de trabajo (UDT)
- Fecha de Alta
- Antigüedad en Semanas
- Número de semana de las últimas horas trabajadas
- Total de horas trabajadas en la última semana
- Tipo de baja en el Sistema (debe ser: RV, RV., BXF, o BXF.)
- Clase
- Turno
- Área
- Supervisor
- Puesto
- Cumplió con periodo de entrenamiento
- Total de faltas
- Permisos
- Salario

---

## Cómo Hacer Testing

### 1. Abrir la aplicación
```
http://localhost:5173
```

### 2. Cargar archivo CSV
- Haz clic en el botón de selección de archivo
- Selecciona tu archivo `test_data.csv`
- El sistema automáticamente:
  - Validará las columnas
  - Parseará los datos
  - Mostrará errores si hay
  - Mostrará preview de datos

### 3. Verificar resultados
- Deberías ver 3 KPI cards:
  - Total de Registros
  - Renuncias Voluntarias (RV)
  - Bajas por Faltas (BXF)
- Tabla con los primeros 10 registros
- Si hay errores, se mostrarán en rojo

---

## Solución de Problemas

### Error: "npm: command not found"
```bash
# Instalar Node.js
# En Ubuntu/Debian:
sudo apt install nodejs npm

# En Mac:
brew install node

# En Windows:
# Descargar desde https://nodejs.org
```

### Error: "python: command not found"
```bash
# En Ubuntu/Debian:
sudo apt install python3 python3-pip python3-venv

# En Mac:
brew install python@3.11

# En Windows:
# Descargar desde https://www.python.org
```

### Error: "docker: command not found"
```bash
# Instalar Docker Desktop
# https://docs.docker.com/get-docker/
```

### Error: "port 5173 already in use"
```bash
# Cambiar puerto en vite.config.ts
# O matar proceso:
lsof -ti:5173 | xargs kill -9
```

### Error: "CORS error" al hacer llamadas al backend
```bash
# Verificar que el backend esté corriendo en :8000
# Verificar la variable de entorno en frontend/.env
VITE_API_URL=http://localhost:8000
```

### El archivo CSV no se carga
- Verificar que tenga las columnas requeridas
- Verificar el formato de fechas (yyyy-MM-dd, dd/MM/yyyy, etc.)
- Revisar la consola del navegador (F12) para ver errores
- Verificar que el archivo no exceda 10MB

---

## Testing del Parser

El parser automáticamente:

✅ Valida columnas requeridas
✅ Parsea fechas en múltiples formatos
✅ Convierte números y booleanos
✅ Calcula campos derivados:
  - Rangos salariales
  - Rangos de antigüedad
  - Días de antigüedad
  - Rotación temprana
  - Tipo de baja normalizado

✅ Reporta errores detallados:
  - Número de fila
  - Columna con error
  - Tipo de error
  - Valor que causó el error

---

## Comandos Útiles

### Frontend
```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Linter
npm run lint

# Tests (cuando se implementen)
npm test
```

### Backend
```bash
# Desarrollo
uvicorn app.main:app --reload

# Producción
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4

# Tests (cuando se implementen)
pytest
pytest --cov=app tests/
```

### Docker
```bash
# Levantar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Logs de un servicio específico
docker-compose logs -f frontend
docker-compose logs -f backend

# Reiniciar servicios
docker-compose restart

# Detener servicios
docker-compose down

# Rebuild (después de cambios en código)
docker-compose up -d --build

# Eliminar todo (incluyendo volúmenes)
docker-compose down -v
```

---

## Siguiente Paso Después del Testing

Una vez que hayas probado que todo funciona:

1. Cargar archivos CSV reales
2. Verificar que los datos se parsean correctamente
3. Revisar los KPIs mostrados
4. Si todo funciona bien, continuar con:
   - Sprint 2: Implementar gráficas del dashboard
   - Sprint 3: Implementar análisis Pareto

---

## Ayuda Adicional

Si encuentras problemas:

1. Revisa los logs de la consola del navegador (F12)
2. Revisa los logs del terminal donde corre el servidor
3. Verifica que todas las dependencias estén instaladas
4. Asegúrate de estar en la rama correcta:
   ```bash
   git branch
   # Debería mostrar: claude/rotation-dashboard-architecture-01WXrKnZBPe5w4fiLF2CtJor
   ```
