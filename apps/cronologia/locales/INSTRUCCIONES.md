# Instrucciones de Traducción — Tabla Cronológica Bíblica

Esta carpeta contiene los archivos de traducción independientes para la aplicación **Tabla Cronológica Bíblica** (`apps/cronologia/`).

## Archivos:
- `es.json`: Archivo base en español (fuente oficial de verdad, con las 447 agrupaciones de eventos y notas).
- `ru.json`: Traducción al ruso (capas, eras, estadísticas, distintivos y notas).
- `_template.json`: Plantilla para iniciar un nuevo idioma (ej. `en.json`, `fr.json`, `de.json`).

## Estructura del JSON:
- `_meta`: Metadatos del idioma y versión.
- `ui`: Textos de la interfaz (capas históricas, eras, estadísticas, distintivos de cálculo/confirmación y notas).
- `groups`: Agrupaciones de eventos cronológicos ordenados temporalmente. Cada evento contiene:
  - `t`: Texto explicativo del suceso histórico/bíblico.
  - `r`: Citas bíblicas de referencia (`l`: etiqueta textual, `b`: número de libro, `c`: capítulo).
  - `L`: Capa cronológica (`bible`, `books`, `world`, `church`, `modern`).
  - `u` / `c` / `s`: Notas sobre confirmación, cálculo bíblico o discrepancia con cronología secular.

## Directrices Bíblicas Obligatorias:
1. **Consulta obligatoria en wol.jw.org:**
   - Toda fecha, nombre histórico, patriarca, rey o acontecimiento debe verificarse exclusivamente con la enciclopedia *«Perspicacia para comprender las Escrituras»* (artículo *«Cronología»* y biografías individuales) y publicaciones oficiales de la Watchtower.
   - Prohibido el uso de cronologías especulativas seculares no respaldadas por el texto bíblico y las publicaciones de los testigos de Jehová.
2. **Citas y nombres bíblicos:**
   - Los nombres propios y las citas bíblicas deben coincidir con la *Traducción del Nuevo Mundo de las Santas Escrituras* en el idioma de destino.
