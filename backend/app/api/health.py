"""
Endpoints de health check
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "service": "dashboard-rotacion-api"
    }


@router.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Dashboard de Análisis de Rotación API",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "health": "/health",
            "upload": "/api/upload",
            "analysis": "/api/analysis/*"
        }
    }
