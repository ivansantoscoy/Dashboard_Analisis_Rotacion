# Generación de package-lock.json

El archivo `package-lock.json` no está incluido en el repositorio actualmente. Este archivo es útil para:

1. Garantizar instalaciones reproducibles
2. Mejorar el rendimiento del CI/CD con cache
3. Asegurar que todos usen las mismas versiones de dependencias

## Generar package-lock.json

```bash
cd frontend
npm install
```

Esto generará `frontend/package-lock.json` automáticamente.

## Commitearlo al repositorio (Opcional pero recomendado)

```bash
git add frontend/package-lock.json
git commit -m "Add package-lock.json for reproducible builds"
git push
```

## Beneficios

Una vez que `package-lock.json` esté en el repositorio:

1. **CI/CD más rápido**: El workflow puede usar cache de npm
2. **Instalaciones más rápidas**: `npm ci` es más rápido que `npm install`
3. **Versiones exactas**: Todos los desarrolladores usan exactamente las mismas versiones

## Si no quieres committearlo

El proyecto funciona perfectamente sin `package-lock.json`. El CI/CD está configurado para usar `npm install` que funciona sin lock file.

La única desventaja es que el CI será un poco más lento (30-60 segundos extra).
