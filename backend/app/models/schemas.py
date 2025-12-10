"""
Schemas para request/response
"""

from datetime import date
from typing import List, Optional
from pydantic import BaseModel, Field


class ValidationError(BaseModel):
    """Error de validación"""
    fila: int
    columna: str
    tipo: str
    mensaje: str
    valor: Optional[str] = None


class UploadStats(BaseModel):
    """Estadísticas de carga"""
    total_registros: int
    registros_validos: int
    registros_invalidos: int
    columnas_detectadas: List[str]
    rango_fechas: Optional[dict] = None


class UploadResponse(BaseModel):
    """Respuesta de upload"""
    success: bool
    message: str
    dataset_id: str
    stats: UploadStats
    errores: List[ValidationError] = []


class PatronRotacion(BaseModel):
    """Patrón de rotación para análisis Pareto"""
    categoria: str
    valor: str
    total_rotaciones: int = Field(..., ge=0)
    porcentaje: float = Field(..., ge=0, le=100)
    porcentaje_acumulado: float = Field(..., ge=0, le=100)
    impacto_80_20: bool
    indice_rotacion: float


class AnalisisParetoResponse(BaseModel):
    """Respuesta de análisis Pareto"""
    categoria: str
    patrones: List[PatronRotacion]
    concentracion_80: List[PatronRotacion]
    total_rotaciones: int
    fecha_analisis: str


class MetricasResponse(BaseModel):
    """Métricas del dashboard"""
    total_rotaciones: int
    tasa_rotacion: float
    antiguedad_promedio: float
    tiempo_promedio_finiquito: float
    rotaciones_por_tipo: dict
    rotacion_por_mes: List[dict]
