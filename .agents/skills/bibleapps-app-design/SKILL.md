---
name: bibleapps-app-design
description: >
  Estándares obligatorios y directrices arquitectónicas de diseño UI/UX para todas las aplicaciones de BibleApps.
  Exige que el ancho de <main> y los contenedores .wrap sea idéntico en toda la suite (1200px), formato y estructura
  canónica del header (botones flotantes homebtn/themebtn, header.top con h1, stats, details.about, y nav.tabs sticky),
  tipografía PT Serif/PT Sans, sincronización de tema claro/oscuro con anti-FOUC y compatibilidad universal con file://.
  Trigger: Al crear una nueva aplicación, maquetar nuevas páginas, modificar el diseño, headers, contenedores o estilos visuales de BibleApps.
license: Apache-2.0
metadata:
  author: ramonmenor
  version: "1.0"
allowed-tools: Read, Edit, Write, Glob, Grep
---

# Estándar de Diseño y Arquitectura UI: BibleApps

## 1. Principio Fundamental: Suite Hermana Unificada

Todas las páginas del ecosistema **BibleApps** — excepto la **página principal del portal** (`index.html`), es decir, **cada aplicación individual** (Cronología, Atlas, Medidas, Armonía de los Evangelios, Genealogías, etc.) — deben compartir **exactamente la misma experiencia visual, espacial y ergonómica**.

> **REGLA DE ORO DE IDENTIDAD VISUAL:**
> Al navegar de una aplicación a otra — o entre el portal y cualquier app — el usuario debe percibir que se encuentra dentro de la misma suite coherente. Ninguna página puede inventar un encabezado diferente, cambiar la posición de los controles de tema o inicio, ni usar un ancho de pantalla distinto.

> **REGLA DE CONSISTENCIA PORTAL ↔ APPS:**
> La página principal (`index.html`) **ES** una excepción.

---

## 2. Hoja de Estilos Compartida (`css/header-main.css`)

Todas las páginas de la suite — incluida la principal — deben cargar la hoja de estilos canónica compartida que define las variables de tema, el reseteo base, el layout de `.wrap`/`main`, los botones flotantes, el header, las pestañas, el footer y las reglas responsive.

* **Ruta desde las apps (`apps/{app}/{lang}/`):** `../../../css/header-main.css`
* **Ruta desde los portales de idioma (`es/`, `ru/`):** `../css/header-main.css`
* **Ruta desde la raíz:** `css/header-main.css`

```html
<!-- Desde una app (apps/atlas/es/, apps/cronologia/ru/, etc.) -->
<link rel="stylesheet" href="../../../css/header-main.css">

<!-- Desde un portal de idioma (es/, ru/) -->
<link rel="stylesheet" href="../css/header-main.css">

<!-- Desde el enrutador raíz (index.html) -->
<link rel="stylesheet" href="css/header-main.css">
```

### Reglas de CSS en las páginas individuales

* **Queda estrictamente prohibido** duplicar en el `<style>` de cada página las variables base (`:root` con `--bg`, `--surface`, `--ink`, etc.), el reseteo (`*`, `html`, `body`, `a`), los estilos de `.wrap`, `.homebtn`, `.themebtn`, `header.top`, `nav.tabs` o `footer.app-footer`. Todo eso viene de `header-main.css`.
* El `<style>` de cada página solo debe contener:
  1. Variables de color **específicas** de esa app/portal (e.g. `--c-books`, `--c-sea`, `--c-tribes`) con sus variantes dark.
  2. Estilos **propios** de esa página (cards, mapas, grids, calculadoras, etc.) que no aplican a otras.

---

## 3. Ancho Canónico Obligatorio (`main` y `.wrap`)

El ancho máximo de visualización está estrictamente normalizado en toda la suite:

* **Ancho canónico:** **`1200px`**
* **Variable CSS canónica:** `--maxw: 1200px;`
* **Regla obligatoria para `.wrap`:**
  ```css
  .wrap {
    max-width: var(--maxw, 1200px);
    margin: 0 auto;
    padding: 0 16px;
    width: 100%;
    box-sizing: border-box;
  }
  ```
* **Contenedor principal de la aplicación (`<main>`):**
  ```html
  <main class="wrap" style="padding-top:16px">
    <!-- Vistas, paneles interactivos, mapas o tablas -->
  </main>
  ```
* **Queda estrictamente prohibido:**
  * Utilizar anchos heterogéneos como `1120px`, `1140px`, `1280px` o `1400px` en `<main>` o `.wrap`.
  * Utilizar una clase diferente como `.container` en vez de `.wrap`.
  * Diseñar aplicaciones a pantalla completa (*full-width*) sin encapsular el contenido legible en el contenedor `.wrap` de 1200px (los fondos pueden extenderse al 100%, pero la cuadrícula de contenido debe alinearse al ancho canónico).

---

## 4. Estructura y Formato Canónico del Encabezado (Header)

Toda página (portal o app) debe implementar el encabezado estructurado en tres componentes obligatorios:

```
┌────────────────────────────────────────────────────────────────────────┐
│ [← Apps Bíblicas Portal]                                   [☼ Tema]   │ <- Botones flotantes
│                                                                        │
│ .wrap (1200px):                                                        │
│   <h1>Título de la Aplicación</h1>                                     │ <- header.top
│   <div class="stats"> [Chip 1] [Chip 2] [Chip 3] </div>                │
│   <details class="about"><summary>Qué significa...</summary>...</details│
└────────────────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────────────────┐
│ nav.tabs sticky (1200px wrap): [Tab 1] [Tab 2] [Tab 3]                 │ <- nav.tabs
└────────────────────────────────────────────────────────────────────────┘
```

### A. Botones Flotantes Superiores
Ubicados en las esquinas superiores, fuera del flujo centrado, con `position: absolute`:
1. **Botón Inicio / Portal (`.homebtn`)** (esquina superior izquierda):
   ```html
   <a class="homebtn" href="../index.html" title="Volver al portal principal de Apps Bíblicas">
     <span class="homebtn-icon">
       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
         <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
         <polyline points="9 22 9 12 15 12 15 22"></polyline>
       </svg>
     </span>
     Apps Bíblicas <span class="homebtn-sub">Portal</span>
   </a>
   ```
2. **Botón Selector de Tema (`.themebtn`)** (esquina superior derecha):
   ```html
   <button class="themebtn" id="themeBtn" aria-label="Cambiar tema">
     <svg class="icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
       <circle cx="12" cy="12" r="5"/>
       <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
       <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
       <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
       <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
     </svg>
     <svg class="icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
       <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
     </svg>
   </button>
   ```
   La visibilidad del icono sol/luna se controla mediante CSS en `header-main.css` (clases `.icon-sun` / `.icon-moon`), sin necesidad de JavaScript ni dependencias externas como Font Awesome.

   > **PROHIBICIÓN ESTRICTA — NO USAR FONT AWESOME NI ICONOS EXTERNOS:**
   > Los iconos del `.themebtn` y `.homebtn` deben ser siempre **SVGs inline**. Queda prohibido cargar Font Awesome u otra librería de iconos externa para estos controles.

> **PROHIBICIÓN ESTRICTA — NINGÚN ENLACE A OTRAS APPS EN LA CABECERA / DERECHA:**
> En la parte superior de la aplicación **únicamente deben existir los controles de suite permitidos**:
> 1. A la izquierda: `.homebtn` para regresar a la página principal (`index.html`).
> 2. A la derecha: `.themebtn` para alternar el tema claro/oscuro y, en el portal o apps que lo incorporen, el selector de idioma `.lang-switch` (tipo pill `ES | RU`).
> 
> **Queda terminantemente prohibido** colocar enlaces directos, botones secundarios (`.homebtn-sub`) o accesos a otras aplicaciones en la cabecera, junto al botón de tema o en el menú derecho. Si el usuario desea entrar a otra aplicación de la suite, **debe volver obligatoriamente a la página principal**.

### B. Bloque Principal del Encabezado (`header.top`)
```html
<header class="top"><div class="wrap">
  <h1>Nombre de la Aplicación</h1>
  <div class="stats">
    <span class="stat"><b>40+</b> lugares georreferenciados</span>
    <span class="stat"><b>100%</b> fuentes de Perspicacia y wol.jw.org</span>
  </div>
  <details class="about">
    <summary>Qué significan los datos / Acerca de esta herramienta</summary>
    <p class="lead">
      Descripción rigurosa del alcance, metodología y fundamentación en la enciclopedia
      «Perspicacia para comprender las Escrituras» y <a href="https://wol.jw.org/es/wol/..." target="_blank" rel="noopener">wol.jw.org</a>.
    </p>
  </details>
</div></header>
```

### C. Barra de Pestañas Pegajosa (`nav.tabs`)
Siempre visible durante el scroll (`position: sticky; top: 0; z-index: 30;`):
```html
<nav class="tabs"><div class="wrap" role="tablist">
  <button role="tab" aria-selected="true" data-tab="tab1" class="tab-btn">Vista Principal</button>
  <button role="tab" aria-selected="false" data-tab="tab2" class="tab-btn">Vista Secundaria</button>
  <button role="tab" aria-selected="false" data-tab="tab3" class="tab-btn">Tablas / Referencias</button>
</div></nav>
```

---

## 4. Tipografía Oficial y Carga de Fuentes

Toda aplicación debe cargar exactamente la combinación de fuentes de Google Fonts en `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400&family=PT+Sans:wght@400;600;700&display=swap" rel="stylesheet">
```

Variables tipográficas:
* `--serif`: `'PT Serif', Georgia, 'Times New Roman', serif;` (Reservada para: `h1`, `h2`, `h3`, citas textuales, nombres sagrados y títulos de sección).
* `--sans`: `'PT Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;` (Usada para: UI general, botones, tablas, campos de formulario, filtros y estadísticas).

---

## 5. Sistema de Temas (Claro / Oscuro) y Prevención de FOUC

### A. Script Inmediato en `<head>` (Anti-FOUC Obligatorio)
Debe situarse **al inicio de `<head>` antes de cualquier hoja de estilo** para evitar el destello blanco antes de renderizar:
```html
<script>
  (function(){
    try {
      var t = localStorage.getItem('theme') || localStorage.getItem('bibleapps_theme');
      if (t) document.documentElement.dataset.theme = t;
    } catch(e){}
  })();
</script>
```

### B. Tokens CSS Semánticos Estándar
```css
:root {
  --bg: #eef1f5;
  --surface: #ffffff;
  --surface2: #e4e9f0;
  --ink: #1a2233;
  --muted: #586377;
  --line: #cfd7e2;
  --accent: #234a7d;
  --accent-hover: #173257;
  --accent-light: #e8f0fe;
  --maxw: 1200px;
  --serif: 'PT Serif', Georgia, 'Times New Roman', serif;
  --sans: 'PT Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

:root[data-theme="dark"] {
  --bg: #0f141c;
  --surface: #171e29;
  --surface2: #1f2836;
  --ink: #e6ebf3;
  --muted: #93a0b5;
  --line: #2c3748;
  --accent: #8fb3e8;
  --accent-hover: #b4d0ff;
  --accent-light: #16263d;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #0f141c;
    --surface: #171e29;
    --surface2: #1f2836;
    --ink: #e6ebf3;
    --muted: #93a0b5;
    --line: #2c3748;
    --accent: #8fb3e8;
    --accent-hover: #b4d0ff;
    --accent-light: #16263d;
  }
}
```

### C. Lógica de Alternancia y Sincronización entre Pestañas
```javascript
function initTheme() {
  const btn = document.getElementById("themebtn");
  if (!btn) return;
  
  function apply(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
    localStorage.setItem("bibleapps_theme", theme);
  }

  btn.addEventListener("click", () => {
    const cur = document.documentElement.dataset.theme || 
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    apply(cur === "dark" ? "light" : "dark");
  });

  window.addEventListener("storage", e => {
    if ((e.key === "theme" || e.key === "bibleapps_theme") && e.newValue) {
      document.documentElement.dataset.theme = e.newValue;
    }
  });
}
```

---

## 6. Favicon Oficial Vectorial

Incluir siempre el favicon oficial de la suite en el `<head>`:
```html
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<link rel="alternate icon" type="image/svg+xml" href="../favicon.svg">
<link rel="apple-touch-icon" href="favicon.svg">
```
*(Y mantener una copia de `favicon.svg` en el directorio de la propia aplicación).*

---

## 7. Pie de Página Canónico (`footer.app-footer`)

```html
<footer class="app-footer">
  <div class="wrap footer-wrap">
    <div>
      <strong>Apps Bíblicas</strong> — Suite de Investigación Histórica y Textual.
    </div>
    <div>
      Documentado con rigor según <a href="https://wol.jw.org" target="_blank" rel="noopener">wol.jw.org</a> y <em>Perspicacia para comprender las Escrituras</em>.
    </div>
  </div>
</footer>
```

---

## 8. Normalizador Universal para Protocolo `file://`

Para garantizar que los usuarios que descargan el repositorio y abren los archivos locales con doble clic (`file:///...`) no experimenten enlaces rotos a la raíz `/`:

```javascript
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.protocol === 'file:') {
    document.querySelectorAll('a').forEach(a => {
      const href = a.getAttribute('href');
      if (!href) return;
      if (href.endsWith('/')) {
        a.setAttribute('href', href + 'index.html');
      }
    });
  }
});
```

---

## 9. Checklist de Verificación para Nuevas Aplicaciones

Antes de dar por concluida cualquier app o refactorización de interfaz:
- [ ] ¿El ancho del contenedor `.wrap` y de `<main>` es exactamente `1200px`?
- [ ] ¿El header tiene únicamente los dos controles permitidos: `.homebtn` a la izquierda y `.themebtn` a la derecha?
- [ ] ¿Se eliminaron/omitieron completamente enlaces a otras apps en la cabecera o a la derecha? (El cambio de app se realiza exclusivamente regresando a la principal mediante `.homebtn`).
- [ ] ¿`header.top` incluye `h1`, `.stats` y `<details class="about">` dentro de `.wrap`?
- [ ] ¿Existe la barra `nav.tabs` sticky con accesibilidad `aria-selected`?
- [ ] ¿El `<head>` incluye el script síncrono anti-FOUC con `localStorage`?
- [ ] ¿Se sincroniza el tema oscuro/claro con las demás pestañas abiertas?
- [ ] ¿Se usan las fuentes `PT Serif` y `PT Sans` sin cargar tipografías discordantes?
- [ ] ¿Está presente el favicon vectorial `favicon.svg`?
- [ ] ¿Todas las referencias bíblicas se verificaron exhaustivamente en `wol.jw.org` con status 200 (según la skill `wol-perspicacia-sources`)?
