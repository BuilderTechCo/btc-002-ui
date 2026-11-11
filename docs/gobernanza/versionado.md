# Estándares de versionado — `@buildertechco/ui`

Reglas obligatorias para asignar la versión del paquete en cada issue y PR. La
estrategia arquitectónica completa está registrada en
[ADR-004](../adrs/004-versionado-independiente.md).

## Fuente de verdad

- La versión vigente del paquete es el campo `version` del `package.json` en la
  raíz de este repositorio.
- Antes de proponer un incremento, compara ese valor con las versiones
  publicadas y el historial de [`CHANGELOG.md`](../../CHANGELOG.md). No reutilices
  una versión publicada ni bases el incremento en un número supuesto.
- Un número configurado en `package.json` no significa que ya esté publicado.
  Confirma la publicación en GitHub Packages antes de documentarlo como versión
  disponible para consumidores.

## Incremento obligatorio por issue

- Cada issue que vaya a una PR debe incrementar `package.json` antes de presentar
  la PR, incluso si el cambio solo afecta documentación o mantenimiento.
- La descripción de la PR debe registrar la versión anterior, la nueva, el tipo
  de incremento y el motivo:
  `"<versión anterior>" → "<versión nueva>" (<patch|minor|major>)`.
- Actualiza [`CHANGELOG.md`](../../CHANGELOG.md) según el impacto del cambio y
  conserva las entradas de versiones anteriores.
- Si una PR incluye varias issues, el incremento debe cubrir el cambio de mayor
  impacto; no hagas incrementos consecutivos innecesarios dentro de la misma PR.

## Cómo elegir el incremento

| Cambio                                               | En la fase actual `0.x` | Desde `1.0.0` |
| :--------------------------------------------------- | :---------------------- | :------------ |
| Corrección compatible, documentación o mantenimiento | `patch`                 | `patch`       |
| Funcionalidad compatible                             | `minor`                 | `minor`       |
| Cambio incompatible de API                           | `minor`                 | `major`       |

Durante `0.x`, ADR-004 permite cambios incompatibles en un incremento `minor`;
`1.0.0` marca el objetivo de congelación de la API. A partir de `1.0.0`, aplica
SemVer estricto. Si una issue combina varios tipos de cambio, usa el incremento
de mayor impacto permitido por la fase actual.

## Procedimiento para una PR

1. Lee el valor actual de `package.json` y revisa las versiones publicadas.
2. Clasifica el cambio usando la tabla anterior; para cambios solo documentales o
   de mantenimiento, usa `patch`.
3. Actualiza `package.json` y la entrada correspondiente de `CHANGELOG.md`.
4. Completa la sección **Versión del paquete** de
   [la plantilla de PR](../../.github/pull_request_template.md), con el valor
   anterior, el nuevo y el motivo.
5. No crees tags ni publiques el paquete como parte de este paso. La publicación
   requiere autorización humana y sigue el proceso manual documentado.
