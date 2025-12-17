"""
API endpoints para Machine Learning y predicción de riesgo
Soporte multi-cliente: cada cliente tiene su propio modelo en memoria
"""

from fastapi import APIRouter, HTTPException, Body, Query
from typing import List, Dict, Optional
from app.models.schemas import (
    MLTrainingResponse,
    PrediccionRiesgo,
    ModelMetrics,
    FeatureImportance
)
from app.services.ml_manager import ml_manager
from datetime import datetime

router = APIRouter()


@router.post("/ml/train", response_model=MLTrainingResponse)
async def entrenar_modelo(
    cliente_id: str = Query(..., description="ID del cliente"),
    data: List[Dict] = Body(...)
):
    """
    Entrena modelo de ML con datos históricos de rotación para un cliente específico

    Args:
        cliente_id: ID del cliente
        data: Lista de registros de empleados con rotación

    Returns:
        MLTrainingResponse con métricas del modelo
    """
    try:
        if not data:
            raise HTTPException(
                status_code=400,
                detail="No se proporcionaron datos para entrenar"
            )

        if len(data) < 10:
            raise HTTPException(
                status_code=400,
                detail="Se requieren al menos 10 registros para entrenar el modelo"
            )

        # Entrenar modelo para el cliente
        metricas_dict = ml_manager.entrenar_modelo(cliente_id, data)

        # Obtener top features
        top_features = ml_manager.obtener_features(cliente_id, n=10)

        # Convertir a Pydantic models
        metricas = ModelMetrics(**metricas_dict)
        features = [FeatureImportance(**f) for f in top_features]

        return MLTrainingResponse(
            success=True,
            message=f"Modelo entrenado exitosamente para cliente '{cliente_id}' con {len(data)} registros",
            metricas=metricas,
            top_features=features,
            fecha_entrenamiento=datetime.now().isoformat()
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al entrenar modelo: {str(e)}"
        )


@router.post("/ml/predict", response_model=PrediccionRiesgo)
async def predecir_riesgo(
    cliente_id: str = Query(..., description="ID del cliente"),
    empleado: Dict = Body(...)
):
    """
    Predice el riesgo de rotación para un empleado de un cliente específico

    Args:
        cliente_id: ID del cliente
        empleado: Datos del empleado

    Returns:
        PrediccionRiesgo con probabilidad y factores de riesgo
    """
    try:
        if not ml_manager.tiene_modelo(cliente_id):
            raise HTTPException(
                status_code=400,
                detail=f"El modelo para el cliente '{cliente_id}' no ha sido entrenado. Llama a /ml/train primero"
            )

        # Predecir
        prediccion = ml_manager.predecir_riesgo(cliente_id, empleado)

        return PrediccionRiesgo(**prediccion)

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al predecir riesgo: {str(e)}"
        )


@router.post("/ml/predict/batch", response_model=List[PrediccionRiesgo])
async def predecir_riesgo_batch(
    cliente_id: str = Query(..., description="ID del cliente"),
    empleados: List[Dict] = Body(...)
):
    """
    Predice el riesgo de rotación para múltiples empleados de un cliente

    Args:
        cliente_id: ID del cliente
        empleados: Lista de empleados

    Returns:
        Lista de PrediccionRiesgo
    """
    try:
        if not ml_manager.tiene_modelo(cliente_id):
            raise HTTPException(
                status_code=400,
                detail=f"El modelo para el cliente '{cliente_id}' no ha sido entrenado. Llama a /ml/train primero"
            )

        if not empleados:
            raise HTTPException(
                status_code=400,
                detail="No se proporcionaron empleados para predecir"
            )

        # Predecir batch
        predicciones = ml_manager.predecir_batch(cliente_id, empleados)

        return [PrediccionRiesgo(**p) for p in predicciones]

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al predecir batch: {str(e)}"
        )


@router.get("/ml/features", response_model=List[FeatureImportance])
async def obtener_features_importantes(
    cliente_id: str = Query(..., description="ID del cliente")
):
    """
    Obtiene las features más importantes del modelo de un cliente

    Args:
        cliente_id: ID del cliente

    Returns:
        Lista de features ordenadas por importancia
    """
    try:
        if not ml_manager.tiene_modelo(cliente_id):
            raise HTTPException(
                status_code=400,
                detail=f"El modelo para el cliente '{cliente_id}' no ha sido entrenado"
            )

        features = ml_manager.obtener_features(cliente_id, n=15)

        return [FeatureImportance(**f) for f in features]

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener features: {str(e)}"
        )


@router.get("/ml/metrics", response_model=ModelMetrics)
async def obtener_metricas_modelo(
    cliente_id: str = Query(..., description="ID del cliente")
):
    """
    Obtiene las métricas del modelo entrenado para un cliente

    Args:
        cliente_id: ID del cliente

    Returns:
        ModelMetrics con accuracy, AUC, etc.
    """
    try:
        if not ml_manager.tiene_modelo(cliente_id):
            raise HTTPException(
                status_code=400,
                detail=f"El modelo para el cliente '{cliente_id}' no ha sido entrenado"
            )

        metricas = ml_manager.obtener_metricas(cliente_id)

        return ModelMetrics(**metricas)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener métricas: {str(e)}"
        )


@router.get("/ml/modelos-activos")
async def listar_modelos_activos():
    """
    Lista todos los modelos ML actualmente cargados en memoria

    Returns:
        Lista de modelos activos con metadata
    """
    try:
        modelos = ml_manager.listar_modelos_activos()
        return {
            "total": len(modelos),
            "modelos": modelos
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al listar modelos: {str(e)}"
        )


@router.delete("/ml/modelo/{cliente_id}")
async def cerrar_modelo(cliente_id: str):
    """
    Cierra/elimina el modelo de un cliente de la memoria

    Args:
        cliente_id: ID del cliente

    Returns:
        Confirmación de cierre
    """
    try:
        eliminado = ml_manager.cerrar_modelo(cliente_id)

        if not eliminado:
            raise HTTPException(
                status_code=404,
                detail=f"No existe modelo activo para el cliente '{cliente_id}'"
            )

        return {
            "success": True,
            "message": f"Modelo del cliente '{cliente_id}' eliminado de memoria"
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al cerrar modelo: {str(e)}"
        )


@router.get("/ml/health")
async def health_check():
    """Health check para el módulo de ML"""
    modelos_activos = ml_manager.listar_modelos_activos()
    return {
        "status": "ok",
        "module": "ml",
        "modelos_activos": len(modelos_activos),
        "clientes_con_modelo": [m['cliente_id'] for m in modelos_activos]
    }
