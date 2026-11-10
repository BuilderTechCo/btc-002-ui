# ADR-001: Paquete Workspace Solo Código Fuente

**Estado**: Aceptado | **Fecha**: 2026-11-01

---

## Contexto

El monorepo BuilderTech contiene múltiples apps (`apps/web`, `apps/admin`, etc.) que consumen el Design System. Necesitamos definir qué vive en el paquete `@buildertech/ui` vs qué vive en las apps.

## Decisión

**El paquete `@buildertech/ui` contiene EXCLUSIVAMENTE código fuente en `src/`**:

```
src/
├── index.ts
├── styles/
│   ├── tokens.css
│   └── globals.css
├── lib/
│   ├── classnames.ts
│   ├── icon.tsx
│   └── fonts.ts
└── components/
    └── ... (23 componentes)
```

**NO incluye**:
- Tests (unitarios, visuales, E2E)
- Configuraciones de apps (tailwind.config.js, next.config.js, playwright.config.ts)
- Build outputs (`dist/`, `.next/`, `.turbo/`)
- Node modules
- Scripts de CI/CD específicos de app
- Documentación de apps consumidoras

## Consecuencias

### Positivas
- Única fuente de verdad para el DS
- Builds reproducibles y cacheables
- Separación clara paquete/app
- Versionado independiente real
- CI del paquete rápido y enfocado

### Negativas
- Tests corren en apps consumidoras (no en paquete)
- Apps deben configurar Tailwind para incluir `node_modules/@buildertech/ui/dist/**`
- Requiere disciplina: no commitear configs de app en paquete

## Implementación

- `pnpm-workspace.yaml` define workspace root
- `package.json` del paquete tiene `"private": false` + `"main": "dist/index.js"` + `"types": "dist/index.d.ts"`
- Build genera `dist/` (no commiteado)
- Apps consumidoras importan `@buildertech/ui` y configuran content paths

---

## Referencias

- `arquitectura/indice.md` §1 Principio 1
- `guias/contribuir.md` — Estructura del repo
