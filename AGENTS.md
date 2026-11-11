# AGENTS.md — `@buildertechco/ui`

Instrucciones para trabajar en el repositorio independiente del Design System de
BuilderTech.

## Contexto del repositorio

- Este checkout contiene el paquete `@buildertechco/ui` en la raíz del
  repositorio.
- La fuente principal de convenciones, arquitectura, estructura y comandos es
  [`CLAUDE.md`](./CLAUDE.md). Confirma los comandos disponibles en
  [`package.json`](./package.json) antes de usarlos.
- Stack: TypeScript, React, Tailwind CSS v4, Vite, Vitest y Storybook. El paquete
  se compila y publica de forma independiente.

## Aprobación humana

- No crees ramas ni hagas commit, push, merge o PR sin aprobación humana previa,
  explícita y específica para esa acción. No infieras aprobación del contexto ni
  de la autorización para otra acción.
- Respeta cualquier regla más estricta de `CLAUDE.md`; esta sección no autoriza
  acciones que allí estén prohibidas.
- No publiques el paquete ni inicies un despliegue sin aprobación humana
  explícita.

## Secretos y servicios externos

- No escribas ni expongas credenciales, tokens u otros secretos.
- No leas ni copies valores de archivos `.env*` reales.
- No te conectes a servicios productivos ni ejecutes operaciones que los
  modifiquen.

## Dependencias

- No uses dependencias con versión `latest`.
- No añadas dependencias sin que lo solicite la tarea.

## Documentación y estándares aprobados

- Antes de iniciar una tarea, lee íntegramente la documentación propia y
  versionada del proyecto: `README.md`, `CLAUDE.md`, `CHANGELOG.md`, `docs/`,
  guías, ADRs, documentación de componentes y plantillas de issues y PR. No
  sustituyas su lectura por una búsqueda parcial.
- Los estándares y decisiones aprobados son obligatorios. No los debilites,
  omitas ni eludas, incluidos checks, umbrales y requisitos de pruebas. Si
  parecen entrar en conflicto o necesitan cambiarse, detente y solicita
  aprobación humana explícita antes de modificarlos.
- Para incrementar la versión, sigue [`docs/gobernanza/versionado.md`](docs/gobernanza/versionado.md)
  y ADR-004; no determines el tipo de incremento fuera de esa política.

## Código y documentación

- Mantén los componentes presentacionales; no agregues lógica de negocio ni
  llamadas de red o acceso a bases de datos a `src/`.
- Respeta los tokens y utilidades `btc-*` y las convenciones del Design System
  documentadas en `CLAUDE.md`.
- Si cambia la API pública o los tokens, actualiza los exports correspondientes,
  la documentación del paquete y `CHANGELOG.md`.
- No alteres snapshots visuales sin aprobación explícita.
- No borres trabajo local ni archivos sin seguimiento que no hayas creado.
- Para cambios de código, consulta la guía de calidad y la skill local indicadas
  en `CLAUDE.md`; no ocultes errores ni reduzcas las verificaciones para hacer
  pasar un cambio.

## Issues y pull requests

- Usa siempre la plantilla correspondiente de `.github/ISSUE_TEMPLATE/` al
  preparar una issue: `bug_report.md`, `feature_request.md` o `task_chore.md`.
- Usa siempre `.github/pull_request_template.md` al preparar una PR y conserva
  su estructura y secciones aplicables.
- Después de cada issue y antes de presentar su PR, incrementa siempre el campo
  `version` del `package.json` de la raíz, incluso para cambios de documentación
  o mantenimiento. Sigue la política y las reglas SemVer de
  [`docs/gobernanza/versionado.md`](docs/gobernanza/versionado.md).
- Incluye en la descripción de toda PR evidencia de las verificaciones locales:
  comando ejecutado y resultado concreto; para pruebas, indica el resumen de
  pruebas pasadas/fallidas u omitidas. Marca solo las verificaciones realmente
  ejecutadas y explica cualquier fallo u omisión.

## Validación y documentación

- Antes de cualquier commit, es obligatorio ejecutar localmente y obtener
  resultado satisfactorio en todas estas verificaciones:
  - Formato: `pnpm format:check`.
  - Typecheck, lint, reglas de diseño y pruebas unit/integration:
    `pnpm quality:verify`.
  - Contratos y verificaciones estáticas:
    `pnpm test:static`.
  - Pruebas de stories: `pnpm test:storybook`.
  - Regresión visual: `pnpm test:visual`.
  - Prueba de consumo del paquete: `pnpm test:consumer`.
  - Build: `pnpm build`.
- Si una verificación falla o no puede ejecutarse, no se considera aprobada:
  informa el resultado y bloquea el commit hasta resolverlo. No omitas pruebas,
  no reduzcas su alcance ni afirmes que pasaron sin haberlas ejecutado.
- Estos requisitos aplican a todo cambio que vaya a commit, incluidos cambios
  solo de documentación.
- Mantén la documentación y los conteos de componentes y pruebas consistentes
  con el estado verificado del repositorio.
