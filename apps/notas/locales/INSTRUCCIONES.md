# Instrucciones de Traducción — Cuaderno de Notas Bíblicas (Neon)

Esta carpeta contiene los archivos de traducción independientes para la aplicación **Cuaderno de Notas Bíblicas** (`apps/notas/`), conectada con **Neon Serverless Postgres**.

## Archivos:
- `es.json`: Archivo base en español (fuente canónica).
- `ru.json`: Traducción al ruso (*«Понимание Писания»*).
- `_template.json`: Plantilla para iniciar un nuevo idioma (ej. `en.json`, `fr.json`, `pt.json`).

## Pasos para añadir un nuevo idioma:
1. Copia `_template.json` renombrándolo con el código ISO correspondiente (por ejemplo `en.json`).
2. Traduce las cadenas del bloque `"ui"` respetando los términos bíblicos de la *Traducción del Nuevo Mundo* y la enciclopedia *Perspicacia para comprender las Escrituras* en tu idioma en [wol.jw.org](https://wol.jw.org).
3. Opcionalmente añade notas iniciales de estudio en `"seedNotes"` con citas y referencias en tu idioma.
4. Verifica la validez con el script:
   ```bash
   node scripts/i18n-check.js
   ```
