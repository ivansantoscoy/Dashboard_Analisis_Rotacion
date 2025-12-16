"""
Servicio de análisis Pareto 80/20
Identifica el 20% de causas que generan el 80% de la rotación
"""

import pandas as pd
from datetime import datetime
from typing import List, Dict
from app.models.schemas import PatronRotacion, AnalisisParetoResponse


class ParetoService:
    """Servicio para análisis Pareto"""

    @staticmethod
    def analizar_pareto(
        data: List[Dict],
        categoria: str = "area"
    ) -> AnalisisParetoResponse:
        """
        Realiza análisis Pareto 80/20 sobre una categoría específica

        Args:
            data: Lista de registros de empleados
            categoria: Categoría a analizar ('area', 'supervisor', 'razon', etc.)

        Returns:
            AnalisisParetoResponse con patrones ordenados por impacto
        """
        if not data:
            return AnalisisParetoResponse(
                categoria=categoria,
                patrones=[],
                concentracion_80=[],
                total_rotaciones=0,
                fecha_analisis=datetime.now().isoformat()
            )

        # Convertir a DataFrame
        df = pd.DataFrame(data)

        # Mapear nombre de categoría a columna
        columna_map = {
            "area": "area",
            "supervisor": "supervisor",
            "puesto": "puesto",
            "turno": "turno",
            "rango_salarial": "rangoSalarial"
        }

        columna = columna_map.get(categoria, categoria)

        if columna not in df.columns:
            raise ValueError(f"Categoría '{categoria}' no encontrada en los datos")

        total_rotaciones = len(df)

        # Contar rotaciones por categoría
        conteo = df[columna].value_counts()

        # Calcular porcentajes y acumulados
        patrones = []
        porcentaje_acum = 0.0

        for idx, (valor, total) in enumerate(conteo.items()):
            if pd.notna(valor):
                porcentaje = (total / total_rotaciones) * 100
                porcentaje_acum += porcentaje

                # Calcular índice de rotación (simplificado)
                # En un caso real, se dividiría por total de empleados en esa categoría
                indice = total / total_rotaciones

                # Determinar si está en el 20% crítico (causa el 80%)
                impacto_80_20 = porcentaje_acum <= 80.0

                patron = PatronRotacion(
                    categoria=categoria,
                    valor=str(valor),
                    total_rotaciones=int(total),
                    porcentaje=round(porcentaje, 2),
                    porcentaje_acumulado=round(porcentaje_acum, 2),
                    impacto_80_20=impacto_80_20,
                    indice_rotacion=round(indice, 4)
                )
                patrones.append(patron)

        # Identificar el 20% que causa el 80%
        concentracion_80 = [p for p in patrones if p.impacto_80_20]

        return AnalisisParetoResponse(
            categoria=categoria,
            patrones=patrones,
            concentracion_80=concentracion_80,
            total_rotaciones=total_rotaciones,
            fecha_analisis=datetime.now().isoformat()
        )

    @staticmethod
    def analizar_multiples_categorias(
        data: List[Dict]
    ) -> Dict[str, AnalisisParetoResponse]:
        """
        Analiza múltiples categorías y retorna análisis Pareto de cada una

        Args:
            data: Lista de registros de empleados

        Returns:
            Diccionario con análisis Pareto por categoría
        """
        categorias = ["area", "supervisor", "turno", "rango_salarial"]
        resultados = {}

        for categoria in categorias:
            try:
                analisis = ParetoService.analizar_pareto(data, categoria)
                resultados[categoria] = analisis
            except Exception as e:
                print(f"Error analizando categoría {categoria}: {e}")
                continue

        return resultados

    @staticmethod
    def obtener_recomendaciones(
        analisis: AnalisisParetoResponse
    ) -> List[str]:
        """
        Genera recomendaciones basadas en el análisis Pareto

        Args:
            analisis: Resultado del análisis Pareto

        Returns:
            Lista de recomendaciones accionables
        """
        recomendaciones = []

        if not analisis.concentracion_80:
            return ["No hay suficientes datos para generar recomendaciones"]

        # Recomendación principal
        top_patron = analisis.concentracion_80[0]
        recomendaciones.append(
            f"PRIORIDAD ALTA: '{top_patron.valor}' representa el {top_patron.porcentaje:.1f}% "
            f"de la rotación total. Investigar causas inmediatamente."
        )

        # Concentración del 20%
        porcentaje_80 = sum(p.porcentaje for p in analisis.concentracion_80)
        num_criticos = len(analisis.concentracion_80)
        num_total = len(analisis.patrones)

        if num_total > 0:
            porcentaje_criticos = (num_criticos / num_total) * 100
            recomendaciones.append(
                f"El {porcentaje_criticos:.0f}% de los {analisis.categoria}s concentra "
                f"el {porcentaje_80:.1f}% de la rotación. Enfocar esfuerzos aquí."
            )

        # Recomendaciones específicas por categoría crítica
        for patron in analisis.concentracion_80[:3]:  # Top 3
            if patron.porcentaje >= 20:
                recomendaciones.append(
                    f"Acción inmediata en '{patron.valor}': {patron.total_rotaciones} rotaciones "
                    f"({patron.porcentaje:.1f}%)"
                )

        return recomendaciones
