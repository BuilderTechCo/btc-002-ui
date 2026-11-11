<!-- --- labels: [] --- -->

# <!-- Título corto: qué hace la PR, no cómo lo hace. -->

**Base:** `rama-base` → **Head:** `rama-head`

<!-- 1-3 líneas: qué resuelve esta solicitud de incorporación de cambios y por qué. Si es una continuación de una revisión anterior (p. ej., «revisión de la solicitud de incorporación de cambios n.º X»), menciónalo aquí. -->

Describe los cambios de esta solicitud de incorporación de cambios y el problema que resuelve.

Cierra #

<!-- Esto solo cierra automáticamente la incidencia si la fusión se integra en la rama predeterminada (main). Si primero se fusiona en «develop», la incidencia no se cerrará hasta que «develop» llegue a «main». -->

## Tipo de cambio

<!-- Utiliza solo las secciones que correspondan. Elimina el resto. Cada viñeta: 1 línea, sin comparaciones completas de «antes/después» (eso pertenece al mensaje de commit o al CHANGELOG). -->

### 🐛 Correcciones

-

### ✨ Funcionalidad

-

### ♻️ Refactorización

-

### 🧪 Pruebas

<!-- Archivos modificados + cobertura nueva o afectada, en una sola línea -->

-

### 📚 Documentación

<!-- Solo enumera los archivos que se han modificado -->

-

## Versión del paquete

<!-- Obligatorio por cada issue, incluidos cambios de documentación y mantenimiento. Sigue docs/gobernanza/versionado.md e indica el cambio SemVer elegido y su motivo. -->

- `package.json`: `<versión anterior>` → `<versión nueva>` (`patch` / `minor` / `major`)
- Motivo del incremento:

## Verificación

<!-- Todas las verificaciones obligatorias deben pasar localmente antes del commit/PR. Registra evidencia real; si alguna falla o no puede ejecutarse, bloquea el commit/PR hasta resolverlo. -->

### Evidencia de ejecución local

<!-- Obligatorio: registra cada comando exacto ejecutado y su resultado concreto (incluida la cantidad de pruebas pasadas/fallidas). Para cada verificación no ejecutada o fallida, indica el motivo o resultado; no marques casillas sin evidencia. -->

- Comando exacto: `<comando>` — resultado: `<resultado y resumen>`

### Lista de verificación

- [ ] `pnpm build` pasa sin errores
- [ ] `pnpm format:check` pasa sin errores
- [ ] `pnpm quality:verify` pasa sin errores
- [ ] `pnpm test:consumer` pasa sin errores
- [ ] `pnpm test:static` pasa sin errores
- [ ] `pnpm test:storybook` pasa sin errores
- [ ] `pnpm test:visual` pasa sin errores
- [ ] Excepciones/baseline/skills: sin cambios, o aprobación explícita enlazada con motivo y alcance
- [ ] La documentación relacionada está actualizada
- [ ] El diff no contiene credenciales ni archivos sensibles

<!-- Detalles completos de los mensajes de error, ejemplos de código y lista de commits: no los repitas aquí, ya están en el diff, en el CHANGELOG y en la pestaña «Commits» de GitHub. -->
