"""
Servicio de Machine Learning para predicción de riesgo de rotación
Entrena modelos y predice probabilidad de renuncia
"""

import pandas as pd
import numpy as np
from datetime import datetime
from typing import List, Dict, Tuple, Optional
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
import warnings
warnings.filterwarnings('ignore')


class MLService:
    """Servicio de Machine Learning para predicción de rotación"""

    def __init__(self):
        self.model = None
        self.feature_names = []
        self.label_encoders = {}
        self.feature_importance = {}
        self.model_metrics = {}

    def preparar_features(self, data: List[Dict]) -> pd.DataFrame:
        """
        Prepara features para el modelo de ML

        Args:
            data: Lista de registros de empleados

        Returns:
            DataFrame con features preparados
        """
        df = pd.DataFrame(data)

        # Features numéricos directos
        features_df = pd.DataFrame()

        # Antigüedad
        features_df['antiguedad_semanas'] = df.get('antiguedadSemanas', 0)

        # Salario
        features_df['salario'] = df.get('salario', 0)

        # Faltas y permisos
        features_df['total_faltas'] = df.get('totalFaltas', 0)
        features_df['permisos'] = df.get('permisos', 0)

        # Horas trabajadas
        features_df['horas_ultima_semana'] = df.get('totalHorasUltimaSemana', 0)

        # Cumplimiento de entrenamiento (boolean a int)
        features_df['cumplio_entrenamiento'] = df.get('cumplioEntrenamiento', True).astype(int)

        # Rotación temprana (boolean a int)
        features_df['rotacion_temprana'] = df.get('rotacionTemprana', False).astype(int)

        # Features categóricos - Label Encoding
        categorical_features = ['area', 'supervisor', 'puesto', 'turno', 'clase']

        for feature in categorical_features:
            if feature in df.columns:
                if feature not in self.label_encoders:
                    self.label_encoders[feature] = LabelEncoder()
                    # Fit con todos los valores únicos
                    unique_values = df[feature].dropna().unique()
                    self.label_encoders[feature].fit(unique_values)

                # Transform
                try:
                    features_df[f'{feature}_encoded'] = self.label_encoders[feature].transform(
                        df[feature].fillna('Unknown')
                    )
                except:
                    features_df[f'{feature}_encoded'] = 0

        # Features derivados
        if 'salario' in features_df.columns and 'antiguedadSemanas' in features_df.columns:
            # Salario por semana de antigüedad
            features_df['salario_por_semana'] = features_df['salario'] / (features_df['antiguedad_semanas'] + 1)

        # Ratio de faltas
        if 'total_faltas' in features_df.columns and 'antiguedadSemanas' in features_df.columns:
            features_df['faltas_por_semana'] = features_df['total_faltas'] / (features_df['antiguedad_semanas'] + 1)

        return features_df

    def entrenar_modelo(
        self,
        data: List[Dict],
        test_size: float = 0.2,
        random_state: int = 42
    ) -> Dict:
        """
        Entrena modelo de clasificación para predecir tipo de baja

        Args:
            data: Lista de registros de empleados con rotación
            test_size: Proporción para test set
            random_state: Seed para reproducibilidad

        Returns:
            Diccionario con métricas del modelo
        """
        if len(data) < 10:
            raise ValueError("Se requieren al menos 10 registros para entrenar el modelo")

        df = pd.DataFrame(data)

        # Preparar features
        X = self.preparar_features(data)
        self.feature_names = X.columns.tolist()

        # Target: tipo de baja (RV vs BXF)
        y = (df.get('tipoBajaNormalizado', 'RV') == 'RV').astype(int)

        # Split train/test
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=random_state, stratify=y
        )

        # Entrenar Random Forest
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=random_state,
            class_weight='balanced'
        )

        self.model.fit(X_train, y_train)

        # Predicciones
        y_pred = self.model.predict(X_test)
        y_pred_proba = self.model.predict_proba(X_test)[:, 1]

        # Métricas
        accuracy = self.model.score(X_test, y_test)

        # Cross-validation
        cv_scores = cross_val_score(self.model, X, y, cv=min(5, len(data) // 2))

        # Feature importance
        self.feature_importance = dict(zip(
            self.feature_names,
            self.model.feature_importances_
        ))

        # Guardar métricas
        self.model_metrics = {
            'accuracy': float(accuracy),
            'cv_mean_score': float(cv_scores.mean()),
            'cv_std_score': float(cv_scores.std()),
            'n_samples': len(data),
            'n_features': len(self.feature_names),
            'train_size': len(X_train),
            'test_size': len(X_test),
            'feature_importance': self.feature_importance,
        }

        try:
            auc_score = roc_auc_score(y_test, y_pred_proba)
            self.model_metrics['auc_roc'] = float(auc_score)
        except:
            pass

        return self.model_metrics

    def predecir_riesgo(self, empleado: Dict) -> Dict:
        """
        Predice el riesgo de rotación para un empleado

        Args:
            empleado: Diccionario con datos del empleado

        Returns:
            Diccionario con predicción y explicación
        """
        if self.model is None:
            raise ValueError("El modelo no ha sido entrenado. Llama a entrenar_modelo() primero.")

        # Preparar features para un solo empleado
        X = self.preparar_features([empleado])

        # Predicción
        prob = self.model.predict_proba(X)[0]
        pred_class = self.model.predict(X)[0]

        # Probabilidad de RV (riesgo alto de renuncia voluntaria)
        prob_rv = float(prob[1]) * 100

        # Categoría de riesgo
        if prob_rv >= 70:
            nivel_riesgo = 'Alto'
            color = 'red'
        elif prob_rv >= 40:
            nivel_riesgo = 'Medio'
            color = 'yellow'
        else:
            nivel_riesgo = 'Bajo'
            color = 'green'

        # Factores que contribuyen (top 5)
        feature_values = X.iloc[0].to_dict()
        factores = []

        for feature, importance in sorted(
            self.feature_importance.items(),
            key=lambda x: x[1],
            reverse=True
        )[:5]:
            valor = feature_values.get(feature, 0)
            factores.append({
                'feature': feature,
                'valor': float(valor),
                'importancia': float(importance),
                'contribucion': float(importance * valor)
            })

        return {
            'probabilidad_rv': round(prob_rv, 2),
            'probabilidad_bxf': round((1 - prob[1]) * 100, 2),
            'prediccion': 'RV' if pred_class == 1 else 'BXF',
            'nivel_riesgo': nivel_riesgo,
            'color': color,
            'factores_clave': factores,
            'confianza': round(max(prob) * 100, 2)
        }

    def predecir_batch(self, empleados: List[Dict]) -> List[Dict]:
        """
        Predice riesgo para múltiples empleados

        Args:
            empleados: Lista de empleados

        Returns:
            Lista de predicciones
        """
        predicciones = []

        for i, empleado in enumerate(empleados):
            try:
                pred = self.predecir_riesgo(empleado)
                pred['empleado_id'] = empleado.get('numeroEmpleado', f'emp_{i}')
                pred['nombre'] = empleado.get('nombre', 'Desconocido')
                predicciones.append(pred)
            except Exception as e:
                print(f"Error prediciendo empleado {i}: {e}")
                continue

        return predicciones

    def obtener_top_features(self, n: int = 10) -> List[Dict]:
        """
        Obtiene las features más importantes del modelo

        Args:
            n: Número de features a retornar

        Returns:
            Lista de features ordenadas por importancia
        """
        if not self.feature_importance:
            return []

        sorted_features = sorted(
            self.feature_importance.items(),
            key=lambda x: x[1],
            reverse=True
        )[:n]

        return [
            {
                'feature': feature,
                'importancia': round(importance * 100, 2),
                'descripcion': self._describir_feature(feature)
            }
            for feature, importance in sorted_features
        ]

    def _describir_feature(self, feature: str) -> str:
        """Genera descripción legible de una feature"""
        descripciones = {
            'antiguedad_semanas': 'Antigüedad en semanas',
            'salario': 'Salario mensual',
            'total_faltas': 'Número total de faltas',
            'permisos': 'Número de permisos',
            'horas_ultima_semana': 'Horas trabajadas última semana',
            'cumplio_entrenamiento': 'Cumplimiento de entrenamiento',
            'rotacion_temprana': 'Rotación temprana (<13 semanas)',
            'salario_por_semana': 'Salario por semana de antigüedad',
            'faltas_por_semana': 'Faltas por semana',
        }

        if feature in descripciones:
            return descripciones[feature]
        elif '_encoded' in feature:
            return f"{feature.replace('_encoded', '').title()}"
        else:
            return feature.title()
