"""
Servicio de análisis de datos de rotación
"""

from typing import List, Dict
from collections import Counter
from datetime import datetime
import pandas as pd
import numpy as np

from app.models.schemas import (
    AnalisisCompleto,
    DistribucionCategoria,
    TendenciaRotacion,
    AnalisisPorArea
)


class AnalysisService:
    """Servicio para análisis estadístico de rotación"""

    @staticmethod
    def analizar_datos(data: List[Dict]) -> AnalisisCompleto:
        """
        Realiza análisis completo de los datos de rotación

        Args:
            data: Lista de registros de empleados con rotación

        Returns:
            AnalisisCompleto con todas las métricas y análisis
        """
        if not data:
            return AnalysisService._get_empty_analysis()

        # Convertir a DataFrame para análisis
        df = pd.DataFrame(data)

        # Métricas generales
        total_registros = len(df)
        total_rv = len(df[df['tipoBajaNormalizado'] == 'RV'])
        total_bxf = len(df[df['tipoBajaNormalizado'] == 'BXF'])
        tasa_rv_vs_bxf = (total_rv / total_registros * 100) if total_registros > 0 else 0

        # Promedios
        antiguedad_promedio_dias = float(df['diasAntiguedad'].mean()) if 'diasAntiguedad' in df.columns else 0
        antiguedad_promedio_semanas = float(df['antiguedadSemanas'].mean())
        salario_promedio = float(df['salario'].mean())

        # Distribuciones
        distribucion_tipo_baja = AnalysisService._calcular_distribucion(
            df, 'tipoBajaNormalizado'
        )
        distribucion_por_area = AnalysisService._calcular_distribucion(
            df, 'area'
        )
        distribucion_por_supervisor = AnalysisService._calcular_distribucion(
            df, 'supervisor'
        )
        distribucion_rango_salarial = AnalysisService._calcular_distribucion(
            df, 'rangoSalarial'
        )
        distribucion_rango_antiguedad = AnalysisService._calcular_distribucion(
            df, 'rangoAntiguedad'
        )

        # Tendencias mensuales
        tendencias_mensuales = AnalysisService._calcular_tendencias(df)

        # Análisis por área
        analisis_areas = AnalysisService._analizar_por_area(df)

        # Rotación temprana
        total_rotacion_temprana = len(df[df['rotacionTemprana'] == True])
        porcentaje_rotacion_temprana = (
            total_rotacion_temprana / total_registros * 100
        ) if total_registros > 0 else 0

        return AnalisisCompleto(
            total_registros=total_registros,
            total_renuncias_voluntarias=total_rv,
            total_bajas_forzadas=total_bxf,
            tasa_rv_vs_bxf=round(tasa_rv_vs_bxf, 2),
            antiguedad_promedio_dias=round(antiguedad_promedio_dias, 2),
            antiguedad_promedio_semanas=round(antiguedad_promedio_semanas, 2),
            salario_promedio=round(salario_promedio, 2),
            distribucion_tipo_baja=distribucion_tipo_baja,
            distribucion_por_area=distribucion_por_area,
            distribucion_por_supervisor=distribucion_por_supervisor,
            distribucion_rango_salarial=distribucion_rango_salarial,
            distribucion_rango_antiguedad=distribucion_rango_antiguedad,
            tendencias_mensuales=tendencias_mensuales,
            analisis_areas=analisis_areas,
            total_rotacion_temprana=total_rotacion_temprana,
            porcentaje_rotacion_temprana=round(porcentaje_rotacion_temprana, 2)
        )

    @staticmethod
    def _calcular_distribucion(
        df: pd.DataFrame,
        columna: str
    ) -> List[DistribucionCategoria]:
        """Calcula distribución por categoría"""
        if columna not in df.columns:
            return []

        total = len(df)
        conteo = df[columna].value_counts()

        distribuciones = []
        for categoria, cantidad in conteo.items():
            if pd.notna(categoria):  # Excluir valores nulos
                porcentaje = (cantidad / total * 100) if total > 0 else 0
                distribuciones.append(
                    DistribucionCategoria(
                        categoria=str(categoria),
                        total=int(cantidad),
                        porcentaje=round(porcentaje, 2)
                    )
                )

        # Ordenar por total descendente
        distribuciones.sort(key=lambda x: x.total, reverse=True)
        return distribuciones

    @staticmethod
    def _calcular_tendencias(df: pd.DataFrame) -> List[TendenciaRotacion]:
        """Calcula tendencias mensuales de rotación"""
        tendencias = []

        # Convertir fechas a datetime si no lo están
        if 'fechaBajaSistema' not in df.columns:
            return tendencias

        try:
            # Crear columna de periodo (año-mes)
            df['periodo'] = pd.to_datetime(df['fechaBajaSistema']).dt.to_period('M')

            # Agrupar por periodo y tipo de baja
            agrupado = df.groupby(['periodo', 'tipoBajaNormalizado']).size().unstack(fill_value=0)

            for periodo, row in agrupado.iterrows():
                total_rv = int(row.get('RV', 0))
                total_bxf = int(row.get('BXF', 0))
                total = total_rv + total_bxf

                # Calcular tasa de rotación (simplificado)
                tasa = total  # Podría ser más sofisticado si tuviéramos datos de plantilla

                tendencias.append(
                    TendenciaRotacion(
                        periodo=str(periodo),
                        total_rv=total_rv,
                        total_bxf=total_bxf,
                        total=total,
                        tasa=float(tasa)
                    )
                )

            # Ordenar por periodo
            tendencias.sort(key=lambda x: x.periodo)

        except Exception as e:
            print(f"Error calculando tendencias: {e}")

        return tendencias

    @staticmethod
    def _analizar_por_area(df: pd.DataFrame) -> List[AnalisisPorArea]:
        """Analiza rotación por área"""
        if 'area' not in df.columns:
            return []

        analisis = []
        total_registros = len(df)

        # Agrupar por área
        for area in df['area'].unique():
            if pd.notna(area):
                df_area = df[df['area'] == area]

                total_rotaciones = len(df_area)
                porcentaje = (total_rotaciones / total_registros * 100) if total_registros > 0 else 0

                # Promedios del área
                antiguedad_promedio = float(df_area['antiguedadSemanas'].mean())
                salario_promedio = float(df_area['salario'].mean())

                # Tipo de baja predominante
                tipo_predominante = df_area['tipoBajaNormalizado'].mode()
                tipo_baja_predominante = str(tipo_predominante[0]) if len(tipo_predominante) > 0 else 'N/A'

                analisis.append(
                    AnalisisPorArea(
                        area=str(area),
                        total_rotaciones=total_rotaciones,
                        porcentaje=round(porcentaje, 2),
                        antiguedad_promedio=round(antiguedad_promedio, 2),
                        salario_promedio=round(salario_promedio, 2),
                        tipo_baja_predominante=tipo_baja_predominante
                    )
                )

        # Ordenar por total de rotaciones descendente
        analisis.sort(key=lambda x: x.total_rotaciones, reverse=True)
        return analisis

    @staticmethod
    def _get_empty_analysis() -> AnalisisCompleto:
        """Retorna análisis vacío cuando no hay datos"""
        return AnalisisCompleto(
            total_registros=0,
            total_renuncias_voluntarias=0,
            total_bajas_forzadas=0,
            tasa_rv_vs_bxf=0.0,
            antiguedad_promedio_dias=0.0,
            antiguedad_promedio_semanas=0.0,
            salario_promedio=0.0,
            distribucion_tipo_baja=[],
            distribucion_por_area=[],
            distribucion_por_supervisor=[],
            distribucion_rango_salarial=[],
            distribucion_rango_antiguedad=[],
            tendencias_mensuales=[],
            analisis_areas=[],
            total_rotacion_temprana=0,
            porcentaje_rotacion_temprana=0.0
        )
