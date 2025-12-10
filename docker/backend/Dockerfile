# Dockerfile para Backend - FastAPI + Python

FROM python:3.11-slim as base

# Variables de entorno
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Etapa de desarrollo
FROM base as development

# Copiar requirements
COPY backend/requirements.txt .

# Instalar dependencias de desarrollo
RUN pip install -r requirements.txt

# Copiar código
COPY backend/ .

# Exponer puerto
EXPOSE 8000

# Comando de desarrollo con hot reload
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# Etapa de producción
FROM base as production

# Copiar requirements
COPY backend/requirements.txt .

# Instalar solo dependencias de producción
RUN pip install --no-cache-dir -r requirements.txt

# Crear usuario no-root
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app

# Copiar código
COPY --chown=appuser:appuser backend/ .

# Cambiar a usuario no-root
USER appuser

# Exponer puerto
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health')"

# Comando de producción
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
