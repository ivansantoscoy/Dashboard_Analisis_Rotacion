"""
ML Manager - Gestiona múltiples modelos ML en memoria (uno por cliente)
"""
from typing import Dict, Optional, List
from datetime import datetime
from app.services.ml_service import MLService


class MLManager:
    """
    Gestor de modelos ML en memoria
    Mantiene un modelo por cada cliente_id
    """

    def __init__(self):
        # Diccionario de modelos por cliente_id
        self.modelos: Dict[str, MLService] = {}
        # Metadata por cliente
        self.metadata: Dict[str, Dict] = {}

    def entrenar_modelo(self, cliente_id: str, data: List[Dict]) -> Dict:
        """
        Entrena o re-entrena el modelo para un cliente específico

        Args:
            cliente_id: ID del cliente
            data: Lista de registros de empleados para entrenamiento

        Returns:
            Métricas del modelo entrenado
        """
        # Crear nueva instancia del servicio ML para este cliente
        ml_service = MLService()

        # Entrenar modelo
        metricas = ml_service.entrenar_modelo(data)

        # Guardar en memoria
        self.modelos[cliente_id] = ml_service
        self.metadata[cliente_id] = {
            'fecha_entrenamiento': datetime.utcnow().isoformat(),
            'num_registros': len(data),
            'metricas': metricas
        }

        return metricas

    def predecir_riesgo(self, cliente_id: str, empleado: Dict) -> Dict:
        """
        Predice riesgo para un empleado de un cliente específico

        Args:
            cliente_id: ID del cliente
            empleado: Datos del empleado

        Returns:
            Predicción de riesgo

        Raises:
            ValueError: Si no hay modelo entrenado para el cliente
        """
        if cliente_id not in self.modelos:
            raise ValueError(
                f"No hay modelo entrenado para el cliente '{cliente_id}'. "
                "Primero debes entrenar el modelo."
            )

        return self.modelos[cliente_id].predecir_riesgo(empleado)

    def predecir_batch(self, cliente_id: str, empleados: List[Dict]) -> List[Dict]:
        """
        Predice riesgo para múltiples empleados

        Args:
            cliente_id: ID del cliente
            empleados: Lista de empleados

        Returns:
            Lista de predicciones

        Raises:
            ValueError: Si no hay modelo entrenado para el cliente
        """
        if cliente_id not in self.modelos:
            raise ValueError(
                f"No hay modelo entrenado para el cliente '{cliente_id}'. "
                "Primero debes entrenar el modelo."
            )

        return self.modelos[cliente_id].predecir_batch(empleados)

    def obtener_features(self, cliente_id: str, n: int = 10) -> List[Dict]:
        """
        Obtiene las features más importantes del modelo de un cliente

        Args:
            cliente_id: ID del cliente
            n: Número de features a retornar

        Returns:
            Lista de features importantes

        Raises:
            ValueError: Si no hay modelo entrenado para el cliente
        """
        if cliente_id not in self.modelos:
            raise ValueError(
                f"No hay modelo entrenado para el cliente '{cliente_id}'"
            )

        return self.modelos[cliente_id].obtener_top_features(n)

    def obtener_metricas(self, cliente_id: str) -> Optional[Dict]:
        """
        Obtiene métricas del modelo de un cliente

        Args:
            cliente_id: ID del cliente

        Returns:
            Métricas del modelo o None si no existe
        """
        if cliente_id not in self.modelos:
            return None

        return self.modelos[cliente_id].model_metrics

    def obtener_metadata(self, cliente_id: str) -> Optional[Dict]:
        """
        Obtiene metadata del modelo (fecha entrenamiento, etc.)

        Args:
            cliente_id: ID del cliente

        Returns:
            Metadata o None si no existe
        """
        return self.metadata.get(cliente_id)

    def tiene_modelo(self, cliente_id: str) -> bool:
        """
        Verifica si existe un modelo entrenado para el cliente

        Args:
            cliente_id: ID del cliente

        Returns:
            True si existe modelo, False si no
        """
        return cliente_id in self.modelos

    def cerrar_modelo(self, cliente_id: str) -> bool:
        """
        Elimina el modelo de un cliente de la memoria

        Args:
            cliente_id: ID del cliente

        Returns:
            True si se eliminó, False si no existía
        """
        if cliente_id in self.modelos:
            del self.modelos[cliente_id]
            del self.metadata[cliente_id]
            return True
        return False

    def listar_modelos_activos(self) -> List[Dict]:
        """
        Lista todos los modelos actualmente en memoria

        Returns:
            Lista con info de modelos activos
        """
        modelos_activos = []

        for cliente_id, metadata in self.metadata.items():
            modelos_activos.append({
                'cliente_id': cliente_id,
                'fecha_entrenamiento': metadata['fecha_entrenamiento'],
                'num_registros': metadata['num_registros'],
                'accuracy': metadata['metricas'].get('accuracy', 0),
                'n_features': metadata['metricas'].get('n_features', 0)
            })

        return modelos_activos

    def limpiar_todos(self):
        """
        Elimina todos los modelos de la memoria
        Útil para reiniciar el sistema
        """
        self.modelos.clear()
        self.metadata.clear()


# Instancia global del gestor
ml_manager = MLManager()
