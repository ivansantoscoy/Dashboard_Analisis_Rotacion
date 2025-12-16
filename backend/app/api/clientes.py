"""
API endpoints para gestión de clientes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.models.schemas import (
    ClienteCreate,
    ClienteUpdate,
    ClienteResponse,
    ClienteListResponse
)
from app.services.cliente_service import ClienteService

router = APIRouter()


@router.post("/clientes", response_model=ClienteResponse, status_code=status.HTTP_201_CREATED)
async def crear_cliente(
    cliente_data: ClienteCreate,
    db: Session = Depends(get_db)
):
    """
    Crear un nuevo cliente

    Args:
        cliente_data: Datos del cliente (nombre, identificador, industria, notas)
        db: Database session

    Returns:
        ClienteResponse con datos del cliente creado

    Raises:
        HTTPException 400: Si el identificador ya existe
    """
    try:
        cliente = ClienteService.crear_cliente(db, cliente_data)
        return cliente
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/clientes", response_model=ClienteListResponse)
async def listar_clientes(db: Session = Depends(get_db)):
    """
    Listar todos los clientes registrados

    Args:
        db: Database session

    Returns:
        Lista de clientes con metadata
    """
    clientes = ClienteService.listar_clientes(db)
    return ClienteListResponse(
        clientes=clientes,
        total=len(clientes)
    )


@router.get("/clientes/{cliente_id}", response_model=ClienteResponse)
async def obtener_cliente(
    cliente_id: str,
    db: Session = Depends(get_db)
):
    """
    Obtener cliente por ID

    Args:
        cliente_id: UUID del cliente
        db: Database session

    Returns:
        Datos del cliente

    Raises:
        HTTPException 404: Si el cliente no existe
    """
    cliente = ClienteService.obtener_cliente(db, cliente_id)

    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cliente con ID '{cliente_id}' no encontrado"
        )

    return cliente


@router.get("/clientes/identificador/{identificador}", response_model=ClienteResponse)
async def obtener_cliente_por_identificador(
    identificador: str,
    db: Session = Depends(get_db)
):
    """
    Obtener cliente por identificador único

    Args:
        identificador: Identificador del cliente (ej: ABC_MFG_2024)
        db: Database session

    Returns:
        Datos del cliente

    Raises:
        HTTPException 404: Si el cliente no existe
    """
    cliente = ClienteService.obtener_cliente_por_identificador(db, identificador)

    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cliente con identificador '{identificador}' no encontrado"
        )

    return cliente


@router.put("/clientes/{cliente_id}", response_model=ClienteResponse)
async def actualizar_cliente(
    cliente_id: str,
    cliente_data: ClienteUpdate,
    db: Session = Depends(get_db)
):
    """
    Actualizar datos de un cliente

    Args:
        cliente_id: UUID del cliente
        cliente_data: Datos a actualizar
        db: Database session

    Returns:
        Cliente actualizado

    Raises:
        HTTPException 404: Si el cliente no existe
    """
    cliente = ClienteService.actualizar_cliente(db, cliente_id, cliente_data)

    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cliente con ID '{cliente_id}' no encontrado"
        )

    return cliente


@router.delete("/clientes/{cliente_id}", status_code=status.HTTP_204_NO_CONTENT)
async def eliminar_cliente(
    cliente_id: str,
    db: Session = Depends(get_db)
):
    """
    Eliminar un cliente

    Args:
        cliente_id: UUID del cliente
        db: Database session

    Raises:
        HTTPException 404: Si el cliente no existe
    """
    eliminado = ClienteService.eliminar_cliente(db, cliente_id)

    if not eliminado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cliente con ID '{cliente_id}' no encontrado"
        )

    return None


@router.post("/clientes/{cliente_id}/analisis")
async def registrar_analisis(
    cliente_id: str,
    num_empleados: int,
    db: Session = Depends(get_db)
):
    """
    Registrar que se realizó un análisis para el cliente
    (Actualiza fecha_ultimo_analisis y num_empleados)

    Args:
        cliente_id: UUID del cliente
        num_empleados: Número de empleados en el CSV cargado
        db: Database session

    Returns:
        Cliente actualizado

    Raises:
        HTTPException 404: Si el cliente no existe
    """
    cliente = ClienteService.actualizar_ultima_analisis(db, cliente_id, num_empleados)

    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cliente con ID '{cliente_id}' no encontrado"
        )

    return cliente
