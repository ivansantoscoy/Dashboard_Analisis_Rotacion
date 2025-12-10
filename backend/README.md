# Backend - Dashboard de Análisis de Rotación

API REST con FastAPI y Python.

## Desarrollo

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Tests

```bash
pytest
pytest --cov=app tests/
```
