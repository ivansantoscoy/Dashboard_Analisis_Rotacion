"""
FastAPI Application - Dashboard de Análisis de Rotación
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import get_settings

settings = get_settings()

app = FastAPI(
    title="Dashboard Análisis de Rotación API",
    description="API para análisis de rotación de empleados",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "service": "dashboard-rotacion-api"
    }

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Dashboard de Análisis de Rotación API",
        "version": "1.0.0",
        "docs": "/docs"
    }

# Incluir routers
from app.api import analysis, pareto, ml
app.include_router(analysis.router, prefix="/api", tags=["analysis"])
app.include_router(pareto.router, prefix="/api", tags=["pareto"])
app.include_router(ml.router, prefix="/api", tags=["ml"])
