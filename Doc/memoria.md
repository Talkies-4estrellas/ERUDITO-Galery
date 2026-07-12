# ERUDITO Galery — Memoria de sesiones

## Convención de trabajo

Cada sesión de trabajo con el asistente IA genera un archivo de sesión en `Doc/sesiones/`.

### Reglas
1. **Una sesión por día** — el archivo se nombra `sesion-DD-MM-YYYY.md`
2. **Crear el archivo al inicio** del trabajo, antes de comenzar
3. **Registrar al final** qué se hizo, qué quedó pendiente y cualquier decisión importante
4. **Nunca editar sesiones de días anteriores** — son historial inmutable
5. **Los commits los gestiona GitKraken** — el asistente IA nunca hace `git commit`

### Formato de cada sesión
```markdown
# Sesión DD-MM-YYYY

## Objetivo del día
Breve descripción de qué se quería lograr.

## Lo que se hizo
- Item 1
- Item 2

## Archivos modificados
- `ruta/archivo.tsx` — descripción del cambio

## Pendientes detectados
- Cosa que quedó sin hacer o que surgió en el camino

## Notas / decisiones
Cualquier decisión de arquitectura o convención que valga recordar.
```

---

## Índice de sesiones

| Fecha | Resumen |
|---|---|
| [11-07-2026](sesiones/sesion-11-07-2026.md) | Fases 1–4, seeds SQL, avatar upload, rol admin y dashboard |
