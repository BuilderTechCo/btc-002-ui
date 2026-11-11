# ADR-001: Paquete Workspace Solo Código Fuente

**Estado**: Aceptado | **Fecha**: 2026-11-01 | **Aclarado**: 2026-11-10

---

## Contexto

El monorepo BuilderTech contiene múltiples apps (`apps/web`, `apps/admin`, etc.) que consumen el Design System. Necesitamos definir qué vive en el paquete `@buildertechco/ui` vs qué vive en las apps.

## Decisión

**`src/` es la única fuente de verdad del código del Design System.** El repositorio mantiene tests, documentación, scripts y configuración; el artefacto publicado contiene únicamente `dist/`:

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

**No forma parte del artefacto publicado**:

- Tests (unitarios, visuales, E2E)
- Configuraciones de apps (tailwind.config.js, next.config.js, playwright.config.ts)
- Builds de apps (`.next/`, `.turbo/`)
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

- El repositorio del paquete debe mantener y ejecutar sus propios tests; las apps consumidoras añaden sus pruebas de integración.
- Apps deben configurar Tailwind para incluir `node_modules/@buildertechco/ui/dist/**`
- Requiere disciplina: no commitear configs de app en paquete

## Implementación

- `pnpm-workspace.yaml` define workspace root
- `package.json` publica solo `dist/` mediante `files` y declara targets `types`, `import` y `default` en `exports`.
- Build genera `dist/` (no commiteado)
- Apps consumidoras importan `@buildertechco/ui` y configuran content paths

## Aclaración de alcance (2026-11-10)

La decisión de «solo código fuente» describe el workspace y la fuente de verdad, no el contenido del repositorio. Los tests unitarios/de integración, Storybook, scripts de calidad y documentación viven en este repositorio y se ejecutan aquí. El tarball publicado sigue limitado a `dist/`.

---

## Referencias

- `arquitectura/indice.md` §1 Principio 1
- `guias/contribuir.md` — Estructura del repo
