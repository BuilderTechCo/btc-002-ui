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

## Verificación

<!-- Comprobaciones reales que has ejecutado, no la lista completa de CI si el revisor ya ve la insignia -->

- [ ] `pnpm lint` y `pnpm typecheck` pasan sin errores
- [ ] `pnpm format:check` pasa sin errores
- [ ] `pnpm --filter @buildertech/web check:design` pasa sin violaciones
- [ ] `pnpm quality:verify` pasa; código nuevo con complejidad cognitiva ≤15, sin aumentar deuda histórica
- [ ] Excepciones/baseline/skills: sin cambios, o aprobación explícita enlazada con motivo y alcance
- [ ] Regresiones aplicables ejecutadas; indicar comandos, resultados y omisiones (no marcar si no se ejecutaron)
- [ ] La documentación relacionada está actualizada
- [ ] Variables de entorno: sin cambios, o recorrido configuración → Compose → Dockerfile/imagen → consumidor verificado según `AGENTS.md`; ejemplos y documentación actualizados, con evidencia y límites indicados
- [ ] El diff no contiene credenciales ni archivos sensibles

<!-- Detalles completos de los mensajes de error, ejemplos de código y lista de commits: no los repitas aquí, ya están en el diff, en el CHANGELOG y en la pestaña «Commits» de GitHub. -->
