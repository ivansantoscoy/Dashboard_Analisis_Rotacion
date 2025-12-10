# Modelo de Datos - Dashboard de Análisis de Rotación

## 1. Entidad Principal: EmpleadoRotacion

### 1.1 Definición TypeScript (Frontend)

```typescript
/**
 * Representa un empleado que ha causado baja en la organización
 */
interface EmpleadoRotacion {
  // ========================================
  // IDENTIFICACIÓN
  // ========================================

  /** Número único de empleado */
  numeroEmpleado: string;

  /** Nombre completo del empleado */
  nombre: string;

  /** Departamento (NO USAR EN ANÁLISIS) */
  departamento?: string;

  // ========================================
  // FECHAS CRÍTICAS
  // ========================================

  /** Fecha en que RH registró la baja en sistema (debe ser mismo día de baja) */
  fechaBajaSistema: Date;

  /** Último día trabajado (UDT) */
  fechaUltimoDiaTrabajo: Date;

  /** Fecha de contratación del empleado */
  fechaAlta: Date;

  // ========================================
  // ANTIGÜEDAD
  // ========================================

  /** Antigüedad del empleado en semanas al momento de la baja */
  antiguedadSemanas: number;

  // ========================================
  // ÚLTIMA SEMANA TRABAJADA
  // ========================================

  /** Número de semana del año donde registró sus últimas horas */
  numeroSemanaUltimasHoras: number;

  /** Total de horas trabajadas en la última semana registrada */
  totalHorasUltimaSemana: number;

  // ========================================
  // FINIQUITO
  // ========================================

  /** Fecha en que contabilidad elaboró el finiquito */
  fechaFiniquito?: Date;

  /** Fecha en que el empleado recibió su finiquito */
  fechaEntregaFiniquito?: Date;

  /** Monto en pesos entregado por concepto de finiquito */
  montoFiniquito?: number;

  // ========================================
  // ENCUESTA Y RAZONES (CRÍTICO PARA ANÁLISIS)
  // ========================================

  /**
   * Transcripción de encuesta de salida 4FRH-209
   * CRÍTICO: Esta es la razón REAL de renuncia
   */
  encuestaSalida4FRH209?: string;

  /** Razón capturada por RH (NO USAR EN ANÁLISIS) */
  razonRenunciaRH?: string;

  /** Razón capturada en sistema (NO USAR EN ANÁLISIS) */
  razonCapturadaSistema?: string;

  // ========================================
  // CLASIFICACIÓN
  // ========================================

  /** Clase del empleado (siempre "1", IGNORAR EN ANÁLISIS) */
  clase: string;

  /** Turno laboral del empleado */
  turno: string;

  /**
   * Tipo de baja en sistema
   * - "RV" o "RV." = Renuncia Voluntaria
   * - "BXF" o "BXF." = Baja por Faltas
   */
  tipoBaja: 'RV' | 'RV.' | 'BXF' | 'BXF.';

  // ========================================
  // ORGANIZACIÓN
  // ========================================

  /** Área donde laboraba el trabajador */
  area: string;

  /** Último supervisor asignado al empleado */
  supervisor: string;

  /** Posición/puesto en que trabajaba */
  puesto: string;

  // ========================================
  // ENTRENAMIENTO Y DESEMPEÑO
  // ========================================

  /** Indica si cumplió con los 30 días de periodo de entrenamiento */
  cumplioEntrenamiento: boolean;

  /** Últimas faltas acumuladas */
  totalFaltas: number;

  /** Cantidad de permisos de faltar otorgados */
  permisos: number;

  /** Fecha de la primera falta */
  falta1?: Date;

  /** Fecha de la segunda falta */
  falta2?: Date;

  /** Fecha de la tercera falta */
  falta3?: Date;

  /** Fecha de la cuarta falta */
  falta4?: Date;

  // ========================================
  // COMPENSACIÓN
  // ========================================

  /** Último salario percibido según estructura salarial */
  salario: number;

  /** Fecha del último cambio de salario */
  ultimoCambioSalario?: Date;
}
```

### 1.2 Modelo Pydantic (Backend)

```python
from datetime import date, datetime
from typing import Optional, Literal
from pydantic import BaseModel, Field, validator


class EmpleadoRotacion(BaseModel):
    """
    Modelo de empleado que ha causado baja
    """

    # IDENTIFICACIÓN
    numero_empleado: str = Field(..., description="Número único de empleado")
    nombre: str = Field(..., description="Nombre completo del empleado")
    departamento: Optional[str] = Field(None, description="Departamento (no usar en análisis)")

    # FECHAS CRÍTICAS
    fecha_baja_sistema: date = Field(..., description="Fecha de registro de baja en sistema")
    fecha_ultimo_dia_trabajo: date = Field(..., alias="fechaUDT", description="Último día trabajado")
    fecha_alta: date = Field(..., description="Fecha de contratación")

    # ANTIGÜEDAD
    antiguedad_semanas: int = Field(..., ge=0, description="Antigüedad en semanas")

    # ÚLTIMA SEMANA TRABAJADA
    numero_semana_ultimas_horas: int = Field(..., ge=1, le=53, description="Semana del año")
    total_horas_ultima_semana: float = Field(..., ge=0, description="Horas trabajadas en última semana")

    # FINIQUITO
    fecha_finiquito: Optional[date] = Field(None, description="Fecha elaboración finiquito")
    fecha_entrega_finiquito: Optional[date] = Field(None, description="Fecha entrega finiquito")
    monto_finiquito: Optional[float] = Field(None, ge=0, description="Monto del finiquito")

    # ENCUESTA Y RAZONES
    encuesta_salida_4frh209: Optional[str] = Field(None, description="Razón REAL de renuncia")
    razon_renuncia_rh: Optional[str] = Field(None, description="Razón RH (no usar)")
    razon_capturada_sistema: Optional[str] = Field(None, description="Razón sistema (no usar)")

    # CLASIFICACIÓN
    clase: str = Field(default="1", description="Clase (ignorar)")
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
                "encuesta_salida_4frh209": "Mejor oportunidad laboral",
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

    @validator('fecha_ultimo_dia_trabajo')
    def validar_udt_antes_o_igual_baja(cls, v, values):
        """Validar que UDT no sea posterior a fecha de baja"""
        if 'fecha_baja_sistema' in values and v > values['fecha_baja_sistema']:
            raise ValueError('Fecha UDT no puede ser posterior a fecha de baja')
        return v

    @validator('fecha_alta')
    def validar_fecha_alta_anterior_baja(cls, v, values):
        """Validar que fecha de alta sea anterior a baja"""
        if 'fecha_baja_sistema' in values and v >= values['fecha_baja_sistema']:
            raise ValueError('Fecha de alta debe ser anterior a fecha de baja')
        return v
```

## 2. Modelos de Análisis

### 2.1 Patrón de Rotación

```typescript
interface PatronRotacion {
  /** Categoría analizada (ej: "supervisor", "area", "salario") */
  categoria: string;

  /** Valor específico de la categoría */
  valor: string;

  /** Total de rotaciones en esta categoría/valor */
  totalRotaciones: number;

  /** Porcentaje del total de rotaciones */
  porcentaje: number;

  /** Porcentaje acumulado (para Pareto) */
  porcentajeAcumulado: number;

  /** Indica si está en el 20% que causa el 80% */
  impacto80_20: boolean;

  /** Índice de rotación comparado con promedio */
  indiceRotacion: number;
}
```

```python
class PatronRotacion(BaseModel):
    categoria: str
    valor: str
    total_rotaciones: int = Field(..., ge=0)
    porcentaje: float = Field(..., ge=0, le=100)
    porcentaje_acumulado: float = Field(..., ge=0, le=100)
    impacto_80_20: bool
    indice_rotacion: float
```

### 2.2 Análisis Pareto

```typescript
interface AnalisisPareto {
  /** Categoría analizada */
  categoria: string;

  /** Todos los patrones encontrados (ordenados) */
  patrones: PatronRotacion[];

  /** El 20% que causa el 80% de rotación */
  concentracion80: PatronRotacion[];

  /** Total de rotaciones analizadas */
  totalRotaciones: number;

  /** Fecha de análisis */
  fechaAnalisis: Date;
}
```

```python
class AnalisisPareto(BaseModel):
    categoria: str
    patrones: List[PatronRotacion]
    concentracion_80: List[PatronRotacion]
    total_rotaciones: int
    fecha_analisis: datetime
```

### 2.3 Correlación de Variables

```typescript
interface CorrelacionVariable {
  /** Primera variable */
  variable1: string;

  /** Segunda variable */
  variable2: string;

  /** Coeficiente de correlación (-1 a 1) */
  coeficiente: number;

  /** Tipo de correlación */
  tipo: 'pearson' | 'spearman';

  /** Nivel de significancia */
  significancia: 'alta' | 'media' | 'baja' | 'no_significativa';

  /** P-value */
  pValue: number;

  /** Interpretación textual */
  interpretacion: string;
}
```

```python
class CorrelacionVariable(BaseModel):
    variable1: str
    variable2: str
    coeficiente: float = Field(..., ge=-1, le=1)
    tipo: Literal['pearson', 'spearman']
    significancia: Literal['alta', 'media', 'baja', 'no_significativa']
    p_value: float
    interpretacion: str
```

### 2.4 Matriz de Correlación

```typescript
interface MatrizCorrelacion {
  /** Variables incluidas en la matriz */
  variables: string[];

  /** Matriz de correlaciones [i][j] */
  matriz: number[][];

  /** Lista de correlaciones individuales */
  correlaciones: CorrelacionVariable[];

  /** Correlaciones más significativas */
  topCorrelaciones: CorrelacionVariable[];
}
```

### 2.5 Insight Automático

```typescript
interface Insight {
  /** ID único del insight */
  id: string;

  /** Tipo de insight */
  tipo: 'pareto' | 'correlacion' | 'tendencia' | 'anomalia';

  /** Nivel de importancia */
  importancia: 'critica' | 'alta' | 'media' | 'baja';

  /** Título del insight */
  titulo: string;

  /** Descripción detallada */
  descripcion: string;

  /** Datos de soporte */
  datos: any;

  /** Recomendación accionable */
  recomendacion?: string;
}
```

## 3. Modelos de Respuesta API

### 3.1 Respuesta de Upload

```typescript
interface UploadResponse {
  /** Indica si el upload fue exitoso */
  success: boolean;

  /** Mensaje descriptivo */
  message: string;

  /** ID del dataset cargado */
  datasetId: string;

  /** Estadísticas del archivo */
  stats: {
    totalRegistros: number;
    registrosValidos: number;
    registrosInvalidos: number;
    columnasDetectadas: string[];
    rangoFechas: {
      desde: Date;
      hasta: Date;
    };
  };

  /** Errores de validación (si existen) */
  errores?: ValidationError[];
}
```

### 3.2 Error de Validación

```typescript
interface ValidationError {
  /** Fila donde ocurrió el error */
  fila: number;

  /** Columna con error */
  columna: string;

  /** Tipo de error */
  tipo: 'missing' | 'invalid_type' | 'out_of_range' | 'invalid_format';

  /** Mensaje de error */
  mensaje: string;

  /** Valor que causó el error */
  valor: any;
}
```

## 4. Enums y Constantes

### 4.1 Tipo de Baja

```typescript
enum TipoBaja {
  RENUNCIA_VOLUNTARIA = 'RV',
  RENUNCIA_VOLUNTARIA_PUNTO = 'RV.',
  BAJA_POR_FALTAS = 'BXF',
  BAJA_POR_FALTAS_PUNTO = 'BXF.'
}

// Helper para normalizar
function normalizarTipoBaja(tipo: string): 'RV' | 'BXF' {
  return tipo.startsWith('RV') ? 'RV' : 'BXF';
}
```

### 4.2 Categorías de Análisis

```typescript
enum CategoriaAnalisis {
  SUPERVISOR = 'supervisor',
  AREA = 'area',
  PUESTO = 'puesto',
  TURNO = 'turno',
  RANGO_SALARIAL = 'rango_salarial',
  RANGO_ANTIGUEDAD = 'rango_antiguedad',
  CUMPLIMIENTO_ENTRENAMIENTO = 'cumplimiento_entrenamiento'
}
```

### 4.3 Rangos Salariales (ejemplo)

```typescript
const RANGOS_SALARIALES = [
  { min: 0, max: 5000, label: '$0 - $5,000' },
  { min: 5000, max: 8000, label: '$5,000 - $8,000' },
  { min: 8000, max: 12000, label: '$8,000 - $12,000' },
  { min: 12000, max: 20000, label: '$12,000 - $20,000' },
  { min: 20000, max: Infinity, label: '$20,000+' }
];
```

### 4.4 Rangos de Antigüedad

```typescript
const RANGOS_ANTIGUEDAD = [
  { min: 0, max: 4, label: '0-1 mes (0-4 semanas)' },
  { min: 4, max: 13, label: '1-3 meses (4-13 semanas)' },
  { min: 13, max: 26, label: '3-6 meses (13-26 semanas)' },
  { min: 26, max: 52, label: '6-12 meses (26-52 semanas)' },
  { min: 52, max: 104, label: '1-2 años (52-104 semanas)' },
  { min: 104, max: Infinity, label: '2+ años (104+ semanas)' }
];
```

## 5. Mapeo de Columnas CSV

```typescript
const COLUMN_MAPPING = {
  'Depto.': 'departamento',
  'Empleado#': 'numeroEmpleado',
  'Nombre': 'nombre',
  'Fecha de baja en el Sistema': 'fechaBajaSistema',
  'Fecha de último día de trabajo (UDT)': 'fechaUltimoDiaTrabajo',
  'Fecha de Alta': 'fechaAlta',
  'Antigüedad en Semanas': 'antiguedadSemanas',
  'Número de semana de las últimas horas trabajadas': 'numeroSemanaUltimasHoras',
  'Total de horas trabajadas  en la última semana': 'totalHorasUltimaSemana',
  'Fecha en que se hizo el finiquito': 'fechaFiniquito',
  'Fecha de entrega de finiquito': 'fechaEntregaFiniquito',
  'Monto Finiquito': 'montoFiniquito',
  'Encuesta de salida 4FRH-209': 'encuestaSalida4FRH209',
  'Clase': 'clase',
  'Turno': 'turno',
  'Razón de Renuncia': 'razonRenunciaRH',
  'Tipo de baja en el Sistema': 'tipoBaja',
  'Razon capturada en Sistema': 'razonCapturadaSistema',
  'Área': 'area',
  'Supervisor': 'supervisor',
  'Puesto': 'puesto',
  'Cumplió con periodo de entrenamiento': 'cumplioEntrenamiento',
  'Total de faltas': 'totalFaltas',
  'Permisos': 'permisos',
  'Falta 1': 'falta1',
  'Falta 2': 'falta2',
  'Falta 3': 'falta3',
  'Falta 4': 'falta4',
  'Salario': 'salario',
  'Último cambio de salario': 'ultimoCambioSalario'
};
```

## 6. Campos Calculados

Además de los campos directos del CSV, el sistema calculará:

```typescript
interface CamposCalculados {
  /** Días desde alta hasta baja */
  diasAntiguedad: number;

  /** Meses de antigüedad */
  mesesAntiguedad: number;

  /** Días entre UDT y fecha de baja */
  diasEntreUDTyBaja: number;

  /** Días entre baja y elaboración de finiquito */
  diasHastaFiniquito?: number;

  /** Días entre finiquito y entrega */
  diasEntregaFiniquito?: number;

  /** Días desde último cambio de salario */
  diasDesdeCambioSalario?: number;

  /** Rango salarial */
  rangoSalarial: string;

  /** Rango de antigüedad */
  rangoAntiguedad: string;

  /** Tipo de baja normalizado */
  tipoBajaNormalizado: 'RV' | 'BXF';

  /** Indicador de rotación temprana (< 3 meses) */
  rotacionTemprana: boolean;

  /** Razones extraídas de encuesta (keywords) */
  razonesExtraidas?: string[];
}
```

## 7. Ejemplo de Registro Completo

```json
{
  "numeroEmpleado": "78901",
  "nombre": "Ana Martínez López",
  "departamento": "Operaciones",
  "fechaBajaSistema": "2024-03-15",
  "fechaUltimoDiaTrabajo": "2024-03-15",
  "fechaAlta": "2023-09-01",
  "antiguedadSemanas": 28,
  "numeroSemanaUltimasHoras": 11,
  "totalHorasUltimaSemana": 38.5,
  "fechaFiniquito": "2024-03-20",
  "fechaEntregaFiniquito": "2024-03-22",
  "montoFiniquito": 12500.00,
  "encuestaSalida4FRH209": "Encontré mejor oportunidad con mayor salario y mejores prestaciones. No había posibilidad de crecimiento en mi puesto actual.",
  "clase": "1",
  "turno": "Vespertino",
  "tipoBaja": "RV",
  "area": "Empaque",
  "supervisor": "Carlos Ramírez",
  "puesto": "Empacador Senior",
  "cumplioEntrenamiento": true,
  "totalFaltas": 1,
  "permisos": 2,
  "falta1": "2024-02-10",
  "salario": 9200.00,
  "ultimoCambioSalario": "2024-01-01",

  // Campos calculados
  "diasAntiguedad": 196,
  "mesesAntiguedad": 6,
  "diasEntreUDTyBaja": 0,
  "diasHastaFiniquito": 5,
  "diasEntregaFiniquito": 2,
  "diasDesdeCambioSalario": 74,
  "rangoSalarial": "$8,000 - $12,000",
  "rangoAntiguedad": "3-6 meses (13-26 semanas)",
  "tipoBajaNormalizado": "RV",
  "rotacionTemprana": false,
  "razonesExtraidas": ["mejor_oportunidad", "salario", "crecimiento"]
}
```
