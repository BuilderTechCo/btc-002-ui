# Estado y clasificación de pruebas

**Fecha**: 2026-11-10
**Suite**: Vitest `unit` + `integration`
**Resultado**: **334 pruebas aprobadas, 0 fallidas** (24 archivos)
**Storybook**: última cifra documentada: **255 pruebas** (21 archivos, Chromium); no revalidada el 2026-11-10
**Alcance**: Pruebas y comportamiento de componentes; sin cambios de lógica de negocio

---

## Resumen

| Categoría                           | Estado      | Descripción                                             |
| :---------------------------------- | :---------- | :------------------------------------------------------ |
| (T) Test Defect                     | ✅ Resuelto | Ajustes de queries, selectores y mocks                  |
| (E) Environment                     | ✅ Resuelto | Duplicados en mocks y setup de Vitest                   |
| (C1) CopyButton sin estado de error | ✅ Aceptado | El fallo solo emite `onCopy(false)`; no hay UI de error |
| (C2) ErrorPage actions como Button  | ✅ Aceptado | Las acciones renderizan `<Button>`; `href` no se usa    |
| (C3) Iconos faltantes en `empty`    | ✅ Resuelto | Iconos añadidos a la categoría `empty`                  |

---

## Suite actual

| Proyecto                     | Entorno  | Archivos |  Tests  | Comando               |
| :--------------------------- | :------- | :------: | :-----: | :-------------------- |
| `unit`                       | Node     |    3     |    —    | `pnpm test`           |
| `integration`                | jsdom    |    21    |    —    | `pnpm test`           |
| **Total unit + integration** | —        |  **24**  | **334** | `pnpm test`           |
| `storybook`                  | Chromium |    21    | 255 documentadas; sin revalidar | `pnpm test:storybook` |

> Las 334 pruebas unit/integration se verificaron contra Vitest en dos ejecuciones. Las 255 de Storybook son la última cifra documentada y no se revalidaron en esta revisión. Si añades tests, actualiza esta tabla y `README.md`.

---

## Resueltos (T/E)

| Archivo                                               | Test                      | Clasificación | Fix aplicado                                                      |
| :---------------------------------------------------- | :------------------------ | :------------ | :---------------------------------------------------------------- |
| `src/lib/icon/icon.test.ts`                           | Exports faltantes         | (T)           | Añadidos Sun, Moon, Monitor, Eye, EyeOff, Wrench, WifiOff al mock |
| `src/components/loading-state/loading-state.test.tsx` | `getByText('')`           | (T)           | Eliminado el hack de render con texto vacío                       |
| `src/components/empty-state/empty-state.test.tsx`     | Selector de `className`   | (T)           | `parentElement` → `closest('div.rounded-btc-lg')`                 |
| `src/components/error-page/error-page.test.tsx`       | Título                    | (T)           | H1 para el código, H2 para el título                              |
| `src/components/error-page/error-page.test.tsx`       | Selector de `className`   | (T)           | `closest('div.flex.flex-col.items-center.justify-center')`        |
| `src/lib/icon/icon.test.ts`                           | `AlertTriangle` duplicado | (E)           | Entrada duplicada eliminada                                       |

---

## Decisiones de comportamiento aceptado

### C1: CopyButton — sin estado visual de error

**Archivo**: `src/components/copy-button/copy-button.tsx`

**Comportamiento actual**:

- `CopyButton` tiene un único estado `copied: boolean`.
- Si `navigator.clipboard.writeText` falla, llama `onCopy(false)` y permanece en el estado por defecto.
- No existe prop `onError` ni UI de error.

**Decisión**: se acepta el contrato actual y se documenta. Los tests verifican que el botón permanece en estado por defecto y que `onCopy(false)` se emite. Si en el futuro se requiere feedback de error, se añadirá como feature con su propio ADR/cambio de API.

**Consecuencia**: los consumidores deben gestionar el fallo con `onCopy(success)`.

---

### C2: ErrorPage — acciones siempre como `Button`

**Archivo**: `src/components/error-page/error-page.tsx`

**Comportamiento actual**:

- `action` y `secondaryAction` renderizan `<Button>`.
- Los tipos aceptan `href?: string`, pero el componente **no lo utiliza**.
- El test verifica `role="button"` para ambas acciones.

**Decisión**: se acepta el comportamiento actual y se documenta que `href` está reservado y no implementado. Para navegación se debe pasar `onClick` (por ejemplo, con un router de la app).

**Deuda**: si se necesita semántica de enlace real, el componente debe renderizar `<a>` cuando `href` esté presente. Requiere cambio de API y actualización de tests.

---

### C3: ErrorPage — iconos de la categoría `empty` (resuelto)

**Causa**: `errorConfig` usaba `user`, `alertCircle`, `alertTriangle` y `wrench` con `category="empty"`; esos nombres no existían en `empty`.

**Resolución**: se añadieron a `src/lib/icon/icon.tsx` en la categoría `empty`:

- `empty:user` → `LucideIcons.User`
- `empty:alertCircle` → `LucideIcons.AlertCircle`
- `empty:alertTriangle` → `LucideIcons.AlertTriangle`
- `empty:wrench` → `LucideIcons.Wrench`

**Verificación**: la suite ya no emite warnings `[Icon] Icono no encontrado` para estos códigos.

---

## Deuda conocida fuera de tests

| Tema                                    | Estado         | Referencia                          |
| :-------------------------------------- | :------------- | :---------------------------------- |
| **Contraste del botón primario**        | **Tokens corregidos; axe pendiente de revalidación** | `docs/tokens/paleta-visual.md` §6.1 |
| `ErrorPage.action.href` sin implementar | Aceptado/documentado | Este documento, C2                  |
| `test:visual` fuera de `quality:verify` | Aceptado       | Requiere Storybook/Chromium         |
| Sin CI ni Husky                         | Aceptado       | Validación local antes del PR       |

---

## Cómo reproducir

```bash
pnpm test
pnpm test:storybook
pnpm check:design
```

Verificación registrada el 2026-11-10: `pnpm test` pasó dos veces con **334 pruebas unit/integration**, y `pnpm check:design` terminó con **0 violaciones**. Storybook no se ejecutó; su última cifra documentada es **255 pruebas**, pendiente de revalidación.
