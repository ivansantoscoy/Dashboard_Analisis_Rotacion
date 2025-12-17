"""
API endpoints para análisis Pareto
"""

from fastapi import APIRouter, HTTPException, Body, Query
from typing import List, Dict
from app.models.schemas import AnalisisParetoResponse
from app.services.pareto_service import ParetoService

router = APIRouter()


@router.post("/pareto/{categoria}", response_model=AnalisisParetoResponse)
async def analizar_pareto(
    categoria: str,
    data: List[Dict] = Body(...)
):
    """
    Realiza análisis Pareto 80/20 sobre una categoría específica

    Args:
        categoria: Categoría a analizar (area, supervisor, turno, rango_salarial)
        data: Lista de registros de empleados con rotación

    Returns:
        AnalisisParetoResponse con patrones ordenados por impacto
    """
    try:
        if not data:
            raise HTTPException(
                status_code=400,
                detail="No se proporcionaron datos para analizar"
            )

        # Validar categoría
        categorias_validas = ["area", "supervisor", "turno", "rango_salarial", "puesto"]
        if categoria not in categorias_validas:
            raise HTTPException(
                status_code=400,
                detail=f"Categoría inválida. Debe ser una de: {', '.join(categorias_validas)}"
            )

        # Realizar análisis
        analisis = ParetoService.analizar_pareto(data, categoria)

        return analisis

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al analizar datos con Pareto: {str(e)}"
        )


@router.post("/pareto/all", response_model=Dict[str, AnalisisParetoResponse])
async def analizar_pareto_multiple(
    data: List[Dict] = Body(...)
):
    """
    Analiza múltiples categorías con método Pareto

    Args:
        data: Lista de registros de empleados con rotación

    Returns:
        Diccionario con análisis Pareto por cada categoría
    """
    try:
        if not data:
            raise HTTPException(
                status_code=400,
                detail="No se proporcionaron datos para analizar"
            )

        # Analizar todas las categorías
        resultados = ParetoService.analizar_multiples_categorias(data)

        return resultados

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al analizar múltiples categorías: {str(e)}"
        )


@router.post("/pareto/{categoria}/recomendaciones", response_model=Dict[str, List[str]])
async def obtener_recomendaciones_pareto(
    categoria: str,
    data: List[Dict] = Body(...)
):
    """
    Obtiene recomendaciones basadas en análisis Pareto

    Args:
        categoria: Categoría analizada
        data: Lista de registros de empleados

    Returns:
        Diccionario con lista de recomendaciones accionables
    """
    try:
        # Primero hacer el análisis
        analisis = ParetoService.analizar_pareto(data, categoria)

        # Generar recomendaciones
        recomendaciones = ParetoService.obtener_recomendaciones(analisis)

        return {
            "categoria": categoria,
            "recomendaciones": recomendaciones
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al generar recomendaciones: {str(e)}"
        )


@router.get("/health")
async def health_check():
    """Health check para el módulo de Pareto"""
    return {"status": "ok", "module": "pareto"}
