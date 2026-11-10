# ADR-004: Versionado Independiente 0.1.x

**Estado**: Aceptado | **Fecha**: 2026-11-02

---

## Contexto

El Design System debe tener su propio ciclo de vida de versiones, independiente de las apps consumidoras. Necesitamos definir la estrategia de versionado y publicación.

## Decisión

**Versionado independiente** del paquete `@buildertechco/ui`:

- **Fase actual**: `0.1.x` (desarrollo activo)
  - Breaking changes permitidos en **minor** (0.1 → 0.2)
  - Patch para fixes (0.1.0 → 0.1.1)
  - Los consumidores instalan una versión publicada; el paquete y el monorepo consumidor son repositorios separados y no usan `workspace:*`.

- **Objetivo**: `1.0.0` (API freeze)
  - SemVer estricto: patch/fix → patch, features → minor, breaking → major
  - Apps consumidoras usan `@buildertechco/ui@^1.0.0` en producción

**Publicación**: GitHub Packages (`https://npm.pkg.github.com`), con scope `@buildertechco` y `publishConfig` en `package.json`.

**Proceso vigente**: release manual. `prepublishOnly` valida el paquete antes de publicar; el responsable ejecuta `pnpm publish --registry=https://npm.pkg.github.com` con credenciales de escritura.

> No hay workflow de publicación ni Changesets instalado. No se debe asumir publicación automática: la versión y el changelog se actualizan en el repositorio y la publicación se ejecuta manualmente después de integrar los cambios.

## Consecuencias

### Positivas

- Ciclo de vida propio del DS
- Consumidores desacoplados del repositorio del paquete y actualizados explícitamente a una versión publicada
- Cambios breaking comunicados en el changelog y asociados a la estrategia SemVer

### Negativas

- Apps deben actualizar dependencia para recibir features/fixes
- El proceso manual requiere disciplina para mantener coherentes `package.json`, el changelog y la publicación

---

## Referencias

- `arquitectura/indice.md` §1 Principio 5
- `guias/contribuir.md` — Release Process
- Changesets docs: https://github.com/changesets/changesets
