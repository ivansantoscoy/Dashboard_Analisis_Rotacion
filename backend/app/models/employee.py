"""
Modelos de datos para empleados
"""

from datetime import date
from typing import Optional, Literal
from pydantic import BaseModel, Field, field_validator


class EmpleadoRotacion(BaseModel):
    """Modelo de empleado que ha causado baja"""

    # IDENTIFICACIÓN
    numero_empleado: str = Field(..., description="Número único de empleado")
    nombre: str = Field(..., description="Nombre completo del empleado")
    departamento: Optional[str] = Field(None, description="Departamento")

    # FECHAS CRÍTICAS
    fecha_baja_sistema: date = Field(..., description="Fecha de registro de baja en sistema")
    fecha_ultimo_dia_trabajo: date = Field(..., description="Último día trabajado")
    fecha_alta: date = Field(..., description="Fecha de contratación")

    # ANTIGÜEDAD
    antiguedad_semanas: int = Field(..., ge=0, description="Antigüedad en semanas")

    # ÚLTIMA SEMANA TRABAJADA
    numero_semana_ultimas_horas: int = Field(..., ge=1, le=53, description="Semana del año")
    total_horas_ultima_semana: float = Field(..., ge=0, description="Horas trabajadas")

    # FINIQUITO
    fecha_finiquito: Optional[date] = Field(None, description="Fecha elaboración finiquito")
    fecha_entrega_finiquito: Optional[date] = Field(None, description="Fecha entrega finiquito")
    monto_finiquito: Optional[float] = Field(None, ge=0, description="Monto del finiquito")

    # ENCUESTA Y RAZONES
    encuesta_salida_4frh209: Optional[str] = Field(None, description="Razón REAL de renuncia")
    razon_renuncia_rh: Optional[str] = Field(None, description="Razón RH")
    razon_capturada_sistema: Optional[str] = Field(None, description="Razón sistema")

    # CLASIFICACIÓN
    clase: str = Field(default="1", description="Clase")
    turno: str = Field(..., description="Turno laboral")
    tipo_baja: Literal['RV', 'RV.', 'BXF', 'BXF.'] = Field(..., description="Tipo de baja")

    # ORGANIZACIÓN
    area: str = Field(..., description="Área de trabajo")
    supervisor: str = Field(..., description="Supervisor asignado")
    puesto: str = Field(..., description="Puesto/posición")

    # ENTRENAMIENTO Y DESEMPEÑO
    cumplio_entrenamiento: bool = Field(..., description="Cumplió periodo de entrenamiento")
    total_faltas: int = Field(..., ge=0, description="Total de faltas")
    permisos: int = Field(..., ge=0, description="Permisos otorgados")
    falta1: Optional[date] = None
    falta2: Optional[date] = None
    falta3: Optional[date] = None
    falta4: Optional[date] = None

    # COMPENSACIÓN
    salario: float = Field(..., gt=0, description="Último salario")
    ultimo_cambio_salario: Optional[date] = Field(None, description="Fecha último cambio salarial")

    # CAMPOS CALCULADOS
    dias_antiguedad: Optional[int] = None
    meses_antiguedad: Optional[int] = None
    dias_entre_udt_y_baja: Optional[int] = None
    dias_hasta_finiquito: Optional[int] = None
    dias_entrega_finiquito: Optional[int] = None
    dias_desde_cambio_salario: Optional[int] = None
    rango_salarial: Optional[str] = None
    rango_antiguedad: Optional[str] = None
    tipo_baja_normalizado: Optional[Literal['RV', 'BXF']] = None
    rotacion_temprana: Optional[bool] = None

    @field_validator('fecha_ultimo_dia_trabajo')
    @classmethod
    def validar_udt(cls, v: date, info) -> date:
        """Validar que UDT no sea posterior a fecha de baja"""
        if 'fecha_baja_sistema' in info.data and v > info.data['fecha_baja_sistema']:
            raise ValueError('Fecha UDT no puede ser posterior a fecha de baja')
        return v

    @field_validator('fecha_alta')
    @classmethod
    def validar_fecha_alta(cls, v: date, info) -> date:
        """Validar que fecha de alta sea anterior a baja"""
        if 'fecha_baja_sistema' in info.data and v >= info.data['fecha_baja_sistema']:
            raise ValueError('Fecha de alta debe ser anterior a fecha de baja')
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "numero_empleado": "12345",
                "nombre": "Juan Pérez",
                "fecha_baja_sistema": "2024-01-15",
                "fecha_ultimo_dia_trabajo": "2024-01-15",
                "fecha_alta": "2023-06-01",
                "antiguedad_semanas": 32,
                "numero_semana_ultimas_horas": 2,
                "total_horas_ultima_semana": 40.0,
                "turno": "Matutino",
                "tipo_baja": "RV",
                "area": "Producción",
                "supervisor": "María González",
                "puesto": "Operador",
                "cumplio_entrenamiento": True,
                "total_faltas": 2,
                "permisos": 1,
                "salario": 8500.00
            }
        }
