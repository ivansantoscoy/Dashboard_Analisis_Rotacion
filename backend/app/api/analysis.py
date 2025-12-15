"""
API endpoints para análisis de datos
"""

from fastapi import APIRouter, HTTPException, Body
from typing import List, Dict
from app.models.schemas import AnalisisCompleto
from app.services.analysis_service import AnalysisService

router = APIRouter()


@router.post("/analyze", response_model=AnalisisCompleto)
async def analyze_data(data: List[Dict] = Body(...)):
    """
    Analiza datos de rotación y retorna métricas completas

    Args:
        data: Lista de registros de empleados con rotación

    Returns:
        AnalisisCompleto con todas las métricas y análisis
    """
    try:
        if not data:
            raise HTTPException(
                status_code=400,
                detail="No se proporcionaron datos para analizar"
            )

        # Realizar análisis
        analisis = AnalysisService.analizar_datos(data)

        return analisis

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al analizar datos: {str(e)}"
        )


@router.get("/health")
async def health_check():
    """Health check para el módulo de análisis"""
    return {"status": "ok", "module": "analysis"}
