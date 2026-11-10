# ADR-004: Versionado Independiente 0.1.x

**Estado**: Aceptado | **Fecha**: 2026-11-02

---

## Contexto

El Design System debe tener su propio ciclo de vida de versiones, independiente de las apps consumidoras. Necesitamos definir la estrategia de versionado y publicación.

## Decisión

**Versionado independiente** del paquete `@buildertech/ui`:

- **Fase actual**: `0.1.x` (desarrollo activo)
  - Breaking changes permitidos en **minor** (0.1 → 0.2)
  - Patch para fixes (0.1.0 → 0.1.1)
  - Apps usan `workspace:*` en desarrollo local

- **Objetivo**: `1.0.0` (API freeze)
  - SemVer estricto: patch/fix → patch, features → minor, breaking → major
  - Apps consumidoras usan `@buildertech/ui@^1.0.0` en producción

**Publicación**: GitHub Packages registry (`npm.pkg.github.com/@buildertech`)

**Tooling**: Changesets para versionado automático + changelog

> **Estado de implementación (2026-11-09)**: Changesets **no está instalado** y no existe `.changeset/`. El flujo descrito es el objetivo, no el estado actual. Hoy el release es manual (ver [`guias/contribuir.md`](../guias/contribuir.md) §8) y el script `release` se eliminó de `package.json` para no declarar tooling inexistente. No hay CI que publique automáticamente.

```bash
# Flujo release
pnpm changeset        # Crea .changeset/*.md con tipo: patch/minor/major
pnpm changeset:version # Bump version + actualiza CHANGELOG.md + package.json
git add . && git commit -m "chore: version bump" && git tag v0.1.x
git push origin main --tags  # CI publica automáticamente
```

## Consecuencias

### Positivas

- Ciclo de vida propio del DS
- Apps no bloqueadas por releases del DS (workspace:* en dev)
- Cambios breaking controlados y comunicados via Changesets
- Changelog automático y consistente

### Negativas

- Apps deben actualizar dependencia para recibir features/fixes
- Requiere disciplina: no commitear version bumps sin changeset

---

## Referencias

- `arquitectura/indice.md` §1 Principio 5
- `guias/contribuir.md` — Release Process
- Changesets docs: https://github.com/changesets/changesets
