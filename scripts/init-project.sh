#!/bin/bash

# Script de inicialización del proyecto Dashboard de Análisis de Rotación
# Este script crea la estructura completa de directorios y archivos base

set -e

echo "========================================="
echo "Inicializando Dashboard Análisis Rotación"
echo "========================================="

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Crear estructura de Frontend
echo -e "${BLUE}Creando estructura de Frontend...${NC}"
mkdir -p frontend/{public,src,tests}
mkdir -p frontend/public/assets/images
mkdir -p frontend/src/{components,services,stores,types,utils,hooks,styles,config}
mkdir -p frontend/src/components/{layout,upload,dashboard,analysis,charts,filters,export,ml,common}
mkdir -p frontend/src/services/api
mkdir -p frontend/tests/{unit,integration,e2e}
mkdir -p frontend/tests/unit/{components,services,utils}

echo -e "${GREEN}✓ Estructura de Frontend creada${NC}"

# Crear estructura de Backend
echo -e "${BLUE}Creando estructura de Backend...${NC}"
mkdir -p backend/{app,tests}
mkdir -p backend/app/{api,models,services,ml,utils,config}
mkdir -p backend/tests/{test_api,test_services,test_utils}

echo -e "${GREEN}✓ Estructura de Backend creada${NC}"

# Crear archivos __init__.py para Python
echo -e "${BLUE}Creando archivos __init__.py...${NC}"
find backend -type d -exec touch {}/__init__.py \;

echo -e "${GREEN}✓ Archivos __init__.py creados${NC}"

# Crear archivos de configuración
echo -e "${BLUE}Creando archivos de configuración...${NC}"

# .env.example
cat > .env.example << EOF
# Configuración general
ENVIRONMENT=development

# Frontend
VITE_API_URL=http://localhost:8000

# Backend
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
LOG_LEVEL=info
MAX_UPLOAD_SIZE=10485760

# Database (si se requiere en el futuro)
# DATABASE_URL=postgresql://user:password@localhost:5432/rotacion_db
EOF

echo -e "${GREEN}✓ .env.example creado${NC}"

# Crear archivos README en subdirectorios
cat > frontend/README.md << EOF
# Frontend - Dashboard de Análisis de Rotación

Aplicación React con TypeScript, Vite y TailwindCSS.

## Desarrollo

\`\`\`bash
npm install
npm run dev
\`\`\`

## Build

\`\`\`bash
npm run build
\`\`\`

## Tests

\`\`\`bash
npm test
npm run test:coverage
\`\`\`
EOF

cat > backend/README.md << EOF
# Backend - Dashboard de Análisis de Rotación

API REST con FastAPI y Python.

## Desarrollo

\`\`\`bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
\`\`\`

## Tests

\`\`\`bash
pytest
pytest --cov=app tests/
\`\`\`
EOF

echo -e "${GREEN}✓ Archivos README creados${NC}"

# Mover documentación a carpeta docs
echo -e "${BLUE}Organizando documentación...${NC}"

if [ -f "../ARCHITECTURE.md" ]; then
    mv ../ARCHITECTURE.md ../docs/ 2>/dev/null || true
fi

if [ -f "../IMPLEMENTATION_PLAN.md" ]; then
    mv ../IMPLEMENTATION_PLAN.md ../docs/ 2>/dev/null || true
fi

if [ -f "../DATA_MODEL.md" ]; then
    mv ../DATA_MODEL.md ../docs/ 2>/dev/null || true
fi

if [ -f "../PROJECT_STRUCTURE.md" ]; then
    mv ../PROJECT_STRUCTURE.md ../docs/ 2>/dev/null || true
fi

echo -e "${GREEN}✓ Documentación organizada${NC}"

# Resumen
echo ""
echo "========================================="
echo -e "${GREEN}Inicialización completada${NC}"
echo "========================================="
echo ""
echo "Estructura creada:"
echo "  - frontend/    (React + TypeScript)"
echo "  - backend/     (FastAPI + Python)"
echo "  - docker/      (Configuraciones Docker)"
echo "  - docs/        (Documentación)"
echo "  - scripts/     (Scripts de utilidad)"
echo ""
echo "Próximos pasos:"
echo "  1. cd frontend && npm install"
echo "  2. cd backend && pip install -r requirements.txt"
echo "  3. docker-compose up -d"
echo ""
echo "Documentación disponible en:"
echo "  - README.md"
echo "  - docs/ARCHITECTURE.md"
echo "  - docs/IMPLEMENTATION_PLAN.md"
echo "  - docs/DATA_MODEL.md"
echo ""
