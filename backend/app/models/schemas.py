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


class DistribucionCategoria(BaseModel):
    """Distribución por categoría"""
    categoria: str
    total: int
    porcentaje: float


class TendenciaRotacion(BaseModel):
    """Tendencia de rotación por período"""
    periodo: str  # Mes/Año
    total_rv: int
    total_bxf: int
    total: int
    tasa: float


class AnalisisPorArea(BaseModel):
    """Análisis por área/departamento"""
    area: str
    total_rotaciones: int
    porcentaje: float
    antiguedad_promedio: float
    salario_promedio: float
    tipo_baja_predominante: str


class AnalisisCompleto(BaseModel):
    """Análisis completo de datos"""
    # Métricas generales
    total_registros: int
    total_renuncias_voluntarias: int
    total_bajas_forzadas: int
    tasa_rv_vs_bxf: float  # % de RV sobre total

    # Promedios
    antiguedad_promedio_dias: float
    antiguedad_promedio_semanas: float
    salario_promedio: float

    # Distribuciones
    distribucion_tipo_baja: List[DistribucionCategoria]
    distribucion_por_area: List[DistribucionCategoria]
    distribucion_por_supervisor: List[DistribucionCategoria]
    distribucion_rango_salarial: List[DistribucionCategoria]
    distribucion_rango_antiguedad: List[DistribucionCategoria]

    # Tendencias
    tendencias_mensuales: List[TendenciaRotacion]

    # Análisis detallado por área
    analisis_areas: List[AnalisisPorArea]

    # Rotación temprana (< 3 meses)
    total_rotacion_temprana: int
    porcentaje_rotacion_temprana: float

# ============================================================================
# Schemas para Machine Learning
# ============================================================================

class FactorRiesgo(BaseModel):
    """Factor que contribuye al riesgo de rotación"""
    feature: str
    valor: float
    importancia: float
    contribucion: float


class PrediccionRiesgo(BaseModel):
    """Predicción de riesgo de rotación para un empleado"""
    empleado_id: Optional[str] = None
    nombre: Optional[str] = None
    probabilidad_rv: float = Field(..., ge=0, le=100)
    probabilidad_bxf: float = Field(..., ge=0, le=100)
    prediccion: str  # 'RV' o 'BXF'
    nivel_riesgo: str  # 'Alto', 'Medio', 'Bajo'
    color: str  # 'red', 'yellow', 'green'
    factores_clave: List[FactorRiesgo]
    confianza: float = Field(..., ge=0, le=100)


class FeatureImportance(BaseModel):
    """Importancia de una feature en el modelo"""
    feature: str
    importancia: float
    descripcion: str


class ModelMetrics(BaseModel):
    """Métricas del modelo de ML"""
    accuracy: float
    cv_mean_score: float
    cv_std_score: float
    n_samples: int
    n_features: int
    train_size: int
    test_size: int
    auc_roc: Optional[float] = None
    feature_importance: dict


class MLTrainingResponse(BaseModel):
    """Respuesta del entrenamiento del modelo"""
    success: bool
    message: str
    metricas: ModelMetrics
    top_features: List[FeatureImportance]
    fecha_entrenamiento: str


# ============================================================================
# Schemas para Gestión de Clientes
# ============================================================================

class ClienteCreate(BaseModel):
    """Schema para crear un cliente"""
    nombre: str = Field(..., min_length=1, max_length=200, description="Nombre de la empresa")
    identificador: str = Field(..., min_length=1, max_length=50, description="Identificador único (ej: ABC_MFG_2024)")
    industria: Optional[str] = Field(None, max_length=100, description="Industria o sector")
    notas: Optional[str] = Field(None, max_length=500, description="Notas adicionales")


class ClienteUpdate(BaseModel):
    """Schema para actualizar un cliente"""
    nombre: Optional[str] = Field(None, min_length=1, max_length=200)
    industria: Optional[str] = Field(None, max_length=100)
    notas: Optional[str] = Field(None, max_length=500)


class ClienteResponse(BaseModel):
    """Schema de respuesta de cliente"""
    id: str
    nombre: str
    identificador: str
    industria: Optional[str]
    notas: Optional[str]
    fecha_creacion: str
    fecha_ultimo_analisis: Optional[str]
    num_empleados_ultimo_csv: Optional[int]

    class Config:
        from_attributes = True


class ClienteListResponse(BaseModel):
    """Lista de clientes"""
    clientes: List[ClienteResponse]
    total: int
