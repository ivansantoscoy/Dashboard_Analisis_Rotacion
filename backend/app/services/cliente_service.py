"""
Cliente Service - Gestión de metadata de clientes
"""
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from datetime import datetime

from app.models.cliente import Cliente
from app.models.schemas import ClienteCreate, ClienteUpdate, ClienteResponse


class ClienteService:
    """
    Servicio para gestión de clientes (solo metadata)
    NO maneja datos de empleados ni modelos ML
    """

    @staticmethod
    def crear_cliente(db: Session, cliente_data: ClienteCreate) -> ClienteResponse:
        """
        Crear nuevo cliente

        Args:
            db: Database session
            cliente_data: Datos del cliente a crear

        Returns:
            ClienteResponse con datos del cliente creado

        Raises:
            ValueError: Si el identificador ya existe
        """
        # Verificar que el identificador sea único
        existing = db.query(Cliente).filter(
            Cliente.identificador == cliente_data.identificador
        ).first()

        if existing:
            raise ValueError(f"Ya existe un cliente con el identificador '{cliente_data.identificador}'")

        # Crear nuevo cliente
        nuevo_cliente = Cliente(
            nombre=cliente_data.nombre,
            identificador=cliente_data.identificador,
            industria=cliente_data.industria,
            notas=cliente_data.notas,
        )

        try:
            db.add(nuevo_cliente)
            db.commit()
            db.refresh(nuevo_cliente)

            return ClienteService._to_response(nuevo_cliente)
        except IntegrityError:
            db.rollback()
            raise ValueError(f"Error al crear cliente: identificador duplicado")

    @staticmethod
    def obtener_cliente(db: Session, cliente_id: str) -> Optional[ClienteResponse]:
        """
        Obtener cliente por ID

        Args:
            db: Database session
            cliente_id: ID del cliente

        Returns:
            ClienteResponse o None si no existe
        """
        cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
        return ClienteService._to_response(cliente) if cliente else None

    @staticmethod
    def obtener_cliente_por_identificador(db: Session, identificador: str) -> Optional[ClienteResponse]:
        """
        Obtener cliente por identificador único

        Args:
            db: Database session
            identificador: Identificador del cliente

        Returns:
            ClienteResponse o None si no existe
        """
        cliente = db.query(Cliente).filter(Cliente.identificador == identificador).first()
        return ClienteService._to_response(cliente) if cliente else None

    @staticmethod
    def listar_clientes(db: Session) -> List[ClienteResponse]:
        """
        Listar todos los clientes

        Args:
            db: Database session

        Returns:
            Lista de ClienteResponse
        """
        clientes = db.query(Cliente).order_by(Cliente.fecha_creacion.desc()).all()
        return [ClienteService._to_response(c) for c in clientes]

    @staticmethod
    def actualizar_cliente(
        db: Session,
        cliente_id: str,
        cliente_data: ClienteUpdate
    ) -> Optional[ClienteResponse]:
        """
        Actualizar datos de cliente

        Args:
            db: Database session
            cliente_id: ID del cliente
            cliente_data: Datos a actualizar

        Returns:
            ClienteResponse actualizado o None si no existe
        """
        cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()

        if not cliente:
            return None

        # Actualizar solo campos proporcionados
        if cliente_data.nombre is not None:
            cliente.nombre = cliente_data.nombre
        if cliente_data.industria is not None:
            cliente.industria = cliente_data.industria
        if cliente_data.notas is not None:
            cliente.notas = cliente_data.notas

        db.commit()
        db.refresh(cliente)

        return ClienteService._to_response(cliente)

    @staticmethod
    def eliminar_cliente(db: Session, cliente_id: str) -> bool:
        """
        Eliminar cliente

        Args:
            db: Database session
            cliente_id: ID del cliente

        Returns:
            True si se eliminó, False si no existía
        """
        cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()

        if not cliente:
            return False

        db.delete(cliente)
        db.commit()

        return True

    @staticmethod
    def actualizar_ultima_analisis(
        db: Session,
        cliente_id: str,
        num_empleados: int
    ) -> Optional[ClienteResponse]:
        """
        Actualizar fecha de último análisis y número de empleados

        Args:
            db: Database session
            cliente_id: ID del cliente
            num_empleados: Número de empleados en el CSV cargado

        Returns:
            ClienteResponse actualizado o None si no existe
        """
        cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()

        if not cliente:
            return None

        cliente.fecha_ultimo_analisis = datetime.utcnow()
        cliente.num_empleados_ultimo_csv = num_empleados

        db.commit()
        db.refresh(cliente)

        return ClienteService._to_response(cliente)

    @staticmethod
    def _to_response(cliente: Cliente) -> ClienteResponse:
        """
        Convertir modelo Cliente a ClienteResponse

        Args:
            cliente: Modelo Cliente de SQLAlchemy

        Returns:
            ClienteResponse
        """
        return ClienteResponse(
            id=cliente.id,
            nombre=cliente.nombre,
            identificador=cliente.identificador,
            industria=cliente.industria,
            notas=cliente.notas,
            fecha_creacion=cliente.fecha_creacion.isoformat(),
            fecha_ultimo_analisis=cliente.fecha_ultimo_analisis.isoformat() if cliente.fecha_ultimo_analisis else None,
            num_empleados_ultimo_csv=cliente.num_empleados_ultimo_csv
        )
