#!/bin/bash

# Script de deployment local para testing
# Dashboard de Análisis de Rotación

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "========================================="
echo "Dashboard Análisis de Rotación"
echo "Deployment Local para Testing"
echo "========================================="
echo -e "${NC}"

# Verificar prerrequisitos
echo -e "${BLUE}Verificando prerrequisitos...${NC}"

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js no está instalado${NC}"
    echo "Por favor instala Node.js 18 o superior"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node --version)${NC}"

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm no está instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm --version)${NC}"

# Verificar Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}✗ Python no está instalado${NC}"
    echo "Por favor instala Python 3.11 o superior"
    exit 1
fi
echo -e "${GREEN}✓ Python $(python3 --version)${NC}"

echo ""

# Preguntar qué desplegar
echo -e "${YELLOW}¿Qué deseas desplegar?${NC}"
echo "1) Frontend + Backend (Completo)"
echo "2) Solo Frontend"
echo "3) Solo Backend"
read -p "Selecciona una opción (1-3): " option

case $option in
    1)
        echo -e "${BLUE}Desplegando Frontend + Backend...${NC}"

        # Frontend
        echo -e "${BLUE}Configurando Frontend...${NC}"
        cd frontend

        if [ ! -d "node_modules" ]; then
            echo -e "${BLUE}Instalando dependencias de Frontend...${NC}"
            npm install
        else
            echo -e "${GREEN}✓ Dependencias de Frontend ya instaladas${NC}"
        fi

        # Crear .env si no existe
        if [ ! -f ".env" ]; then
            cp .env.example .env
            echo -e "${GREEN}✓ Archivo .env creado${NC}"
        fi

        # Iniciar frontend en background
        echo -e "${BLUE}Iniciando Frontend en http://localhost:5173...${NC}"
        npm run dev &
        FRONTEND_PID=$!

        cd ..

        # Backend
        echo -e "${BLUE}Configurando Backend...${NC}"
        cd backend

        # Crear entorno virtual si no existe
        if [ ! -d "venv" ]; then
            echo -e "${BLUE}Creando entorno virtual...${NC}"
            python3 -m venv venv
        fi

        # Activar entorno virtual
        source venv/bin/activate

        # Instalar dependencias
        echo -e "${BLUE}Instalando dependencias de Backend...${NC}"
        pip install -r requirements.txt

        # Crear .env si no existe
        if [ ! -f ".env" ]; then
            cp .env.example .env
            echo -e "${GREEN}✓ Archivo .env creado${NC}"
        fi

        # Iniciar backend
        echo -e "${BLUE}Iniciando Backend en http://localhost:8000...${NC}"
        uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
        BACKEND_PID=$!

        cd ..

        # Esperar a que los servicios inicien
        sleep 3

        echo ""
        echo -e "${GREEN}=========================================${NC}"
        echo -e "${GREEN}Deployment Completado${NC}"
        echo -e "${GREEN}=========================================${NC}"
        echo ""
        echo -e "${GREEN}Frontend:${NC} http://localhost:5173"
        echo -e "${GREEN}Backend:${NC} http://localhost:8000"
        echo -e "${GREEN}API Docs:${NC} http://localhost:8000/docs"
        echo ""
        echo -e "${YELLOW}Para detener los servicios, presiona Ctrl+C${NC}"
        echo ""

        # Esperar a que el usuario presione Ctrl+C
        trap "echo -e '\n${BLUE}Deteniendo servicios...${NC}'; kill $FRONTEND_PID $BACKEND_PID 2>/dev/null; exit 0" INT
        wait
        ;;

    2)
        echo -e "${BLUE}Desplegando solo Frontend...${NC}"
        cd frontend

        if [ ! -d "node_modules" ]; then
            echo -e "${BLUE}Instalando dependencias...${NC}"
            npm install
        fi

        if [ ! -f ".env" ]; then
            cp .env.example .env
        fi

        echo -e "${GREEN}Iniciando Frontend en http://localhost:5173...${NC}"
        npm run dev
        ;;

    3)
        echo -e "${BLUE}Desplegando solo Backend...${NC}"
        cd backend

        if [ ! -d "venv" ]; then
            python3 -m venv venv
        fi

        source venv/bin/activate
        pip install -r requirements.txt

        if [ ! -f ".env" ]; then
            cp .env.example .env
        fi

        echo -e "${GREEN}Iniciando Backend en http://localhost:8000...${NC}"
        uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
        ;;

    *)
        echo -e "${RED}Opción inválida${NC}"
        exit 1
        ;;
esac
