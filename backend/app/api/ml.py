"""
API endpoints para Machine Learning y predicción de riesgo
"""

from fastapi import APIRouter, HTTPException, Body
from typing import List, Dict
from app.models.schemas import (
    MLTrainingResponse,
    PrediccionRiesgo,
    ModelMetrics,
    FeatureImportance
)
from app.services.ml_service import MLService
from datetime import datetime

router = APIRouter()

# Instancia global del servicio ML (en producción usar cache/database)
ml_service = MLService()


@router.post("/ml/train", response_model=MLTrainingResponse)
async def entrenar_modelo(
    data: List[Dict] = Body(...)
):
    """
    Entrena modelo de ML con datos históricos de rotación

    Args:
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

        # Entrenar modelo
        metricas_dict = ml_service.entrenar_modelo(data)

        # Obtener top features
        top_features = ml_service.obtener_top_features(n=10)

        # Convertir a Pydantic models
        metricas = ModelMetrics(**metricas_dict)
        features = [FeatureImportance(**f) for f in top_features]

        return MLTrainingResponse(
            success=True,
            message=f"Modelo entrenado exitosamente con {len(data)} registros",
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
    empleado: Dict = Body(...)
):
    """
    Predice el riesgo de rotación para un empleado

    Args:
        empleado: Datos del empleado

    Returns:
        PrediccionRiesgo con probabilidad y factores de riesgo
    """
    try:
        if ml_service.model is None:
            raise HTTPException(
                status_code=400,
                detail="El modelo no ha sido entrenado. Llama a /ml/train primero"
            )

        # Predecir
        prediccion = ml_service.predecir_riesgo(empleado)

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
    empleados: List[Dict] = Body(...)
):
    """
    Predice el riesgo de rotación para múltiples empleados

    Args:
        empleados: Lista de empleados

    Returns:
        Lista de PrediccionRiesgo
    """
    try:
        if ml_service.model is None:
            raise HTTPException(
                status_code=400,
                detail="El modelo no ha sido entrenado. Llama a /ml/train primero"
            )

        if not empleados:
            raise HTTPException(
                status_code=400,
                detail="No se proporcionaron empleados para predecir"
            )

        # Predecir batch
        predicciones = ml_service.predecir_batch(empleados)

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
async def obtener_features_importantes():
    """
    Obtiene las features más importantes del modelo

    Returns:
        Lista de features ordenadas por importancia
    """
    try:
        if ml_service.model is None:
            raise HTTPException(
                status_code=400,
                detail="El modelo no ha sido entrenado. Llama a /ml/train primero"
            )

        features = ml_service.obtener_top_features(n=15)

        return [FeatureImportance(**f) for f in features]

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener features: {str(e)}"
        )


@router.get("/ml/metrics", response_model=ModelMetrics)
async def obtener_metricas_modelo():
    """
    Obtiene las métricas del modelo entrenado

    Returns:
        ModelMetrics con accuracy, AUC, etc.
    """
    try:
        if ml_service.model is None:
            raise HTTPException(
                status_code=400,
                detail="El modelo no ha sido entrenado. Llama a /ml/train primero"
            )

        return ModelMetrics(**ml_service.model_metrics)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener métricas: {str(e)}"
        )


@router.get("/health")
async def health_check():
    """Health check para el módulo de ML"""
    model_status = "trained" if ml_service.model is not None else "not_trained"
    return {
        "status": "ok",
        "module": "ml",
        "model_status": model_status
    }
