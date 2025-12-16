"""
SQLAlchemy model for Cliente (Client metadata only)
"""
from sqlalchemy import Column, String, Integer, DateTime
from datetime import datetime
from app.db.database import Base
import uuid

class Cliente(Base):
    """
    Cliente model - stores only metadata, NO employee data
    """
    __tablename__ = "clientes"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    nombre = Column(String, nullable=False)  # "ABC Manufactura"
    identificador = Column(String, unique=True, nullable=False)  # "ABC_MFG_2024"
    industria = Column(String, nullable=True)  # "Manufactura", "Call Center", etc.
    notas = Column(String, nullable=True)  # Optional notes
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
    fecha_ultimo_analisis = Column(DateTime, nullable=True)
    num_empleados_ultimo_csv = Column(Integer, nullable=True)

    def __repr__(self):
        return f"<Cliente {self.identificador}: {self.nombre}>"
