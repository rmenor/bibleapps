# 📖 Apps Bíblicas

Portal y catálogo de aplicaciones interactivas para el estudio histórico, cronológico y textual de la Biblia.

Optimizado para su despliegue ultrarrápido y sin configuración en **[Vercel](https://vercel.com)**.

---

## 🚀 Aplicaciones Disponibles y Roadmap

### 1. ⏱️ Tabla Cronológica e Histórica Bíblica (`/apps/cronologia`) — **[Disponible]**
Aplicación interactiva exhaustiva con más de 4.000 años de historia sincronizada:
- **8 Módulos de visualización**:
  1. **Tiempo**: Línea temporal global con filtros por eventos bíblicos, libros, imperios mundiales y era secular.
  2. **Biblia**: Libros canónicos, fechas y lugares de redacción, y diagramas de transmisión de manuscritos (hebreos y griegos).
  3. **Genealogías**: Árboles genealógicos desde Adán hasta Jesús.
  4. **Naciones**: Historia y profecías de los imperios mundiales (Babilonia, Medo-Persia, Grecia, Roma).
  5. **Patriarcas**: Gráfico cronológico de vidas y edades de los patriarcas.
  6. **Reyes**: Cuadro comparativo simultáneo de los reyes de Judá y de Israel.
  7. **Fechas clave**: Resumen de los hitos históricos cardinales.
  8. **Jesús y los apóstoles**: Cronología del ministerio terrestre y cartas del siglo I.
- **Buscador en tiempo real** por personajes, años o textos bíblicos.
- **Modo oscuro / claro** persistente.
- **Rigor metodológico**: Contraste explícito entre fechas bíblicas calculadas y discrepancias con la cronología secular.

### 2. 🗺️ Atlas y Geografía Bíblica (`/apps/atlas`) — **[Disponible]**
Aplicación interactiva y cartografía vectorial de las tierras bíblicas documentada rigurosamente con *Perspicacia para comprender las Escrituras* y *wol.jw.org*:
- **4 Módulos de estudio**:
  1. **Mapa Interactivo con Pan y Zoom**: Cartografía con capas conmutables (Tierra Prometida, Éxodo, Ministerio de Jesús, Viajes de Pablo).
  2. **Relieve y Perfil Topográfico de Palestina**: Corte transversal este-oeste con cotas desde el mar Mediterráneo (+0 m) hasta los montes de Judea (+800 m) y la depresión del mar Muerto (-400 m).
  3. **Reparto de las 12 Tribus**: Mapa y fichas detalladas de los territorios asignados por Josué y las 6 ciudades de refugio levíticas.
  4. **Calculador de Distancias Bíblicas**: Conversión geodésica instantánea a estadios romanos, millas romanas y jornadas de camino a pie.
- **Fichas topográficas completas**: Significado etimológico, contexto bíblico, identificación arqueológica y enlaces directos a *wol.jw.org*.

### 3. 📜 Armonía de los Evangelios — **[Próximamente]**
Cotejo paralelo y sinóptico de Mateo, Marcos, Lucas y Juan en orden cronológico.

### 3. ⚖️ Conversor de Pesas, Medidas y Monedas (`/apps/medidas`) — **[Disponible]**
Calculadora interactiva en tiempo real fundamentada estrictamente en *Perspicacia para comprender las Escrituras* y *wol.jw.org*:
- **4 Módulos de conversión y consulta**: Calculadora bidireccional, ejemplos bíblicos clave, tablas de Perspicacia y estimador de jornales.

### 4. 📝 Cuaderno de Notas Bíblicas (`/apps/notas`) — **[Disponible]**
Gestor y cuaderno de notas de investigación bíblica con sincronización en la nube mediante **Neon Serverless Postgres** y almacenamiento local offline:
- Notas persistentes, filtrado por temas/etiquetas, búsqueda instantánea y modo 100% offline.

### 5. 🌍 La Creación: Secuencia Completa (`/apps/creacion`) — **[Disponible]**
Secuencia interactiva y scrubber visual de los 6 días creativos de Génesis 1:1 a 2:4 con simetrías, elementos dominantes y notas de Perspicacia.

---

## 🌐 Despliegue en Vercel

Este proyecto está compuesto por aplicaciones HTML auto-ejecutables sin dependencias de compilación, lo que permite que Vercel lo sirva en su red Edge global al instante.

### Opción 1: Conectar con GitHub (Recomendada)
1. Sube este repositorio a tu cuenta de GitHub.
2. Entra en tu panel de [Vercel](https://vercel.com/new).
3. Haz clic en **"Add New Project"** e importa el repositorio de GitHub.
4. En **Framework Preset**, selecciona **Other**. No requiere ningún *Build Command* ni *Output Directory*.
5. Haz clic en **Deploy**.

---

## 💻 Ejecución y Pruebas en Local

Puedes probar la suite localmente:
- **Doble clic directo (Protocolo `file://`)**: Abre directamente `index.html` o cualquier `apps/{app}/index.html` en tu navegador. Cada aplicación es 100% auto-ejecutable y autónoma.
- **Con Node / npm**:
  ```bash
  npm test   # Ejecuta el validador de sintaxis y arquitectura autónoma
  npm start  # Servidor local
  ```

---

## 📁 Estructura del Repositorio

```text
├── index.html            # Portal principal que contiene y enlaza todas las aplicaciones
├── apps/
│   ├── cronologia/
│   │   ├── index.html    # App autónoma auto-ejecutable (Tabla Cronológica e Histórica)
│   │   └── favicon.svg   # Favicon local
│   ├── atlas/
│   │   ├── index.html    # App autónoma auto-ejecutable (Atlas y Geografía Bíblica)
│   │   ├── vendor/       # Librería Leaflet local
│   │   └── favicon.svg   # Favicon local
│   ├── medidas/
│   │   ├── index.html    # App autónoma auto-ejecutable (Pesas, Medidas y Monedas)
│   │   └── favicon.svg   # Favicon local
│   ├── notas/
│   │   ├── index.html    # App autónoma auto-ejecutable (Cuaderno de Notas con Neon)
│   │   └── favicon.svg   # Favicon local
│   └── creacion/
│       ├── index.html    # App autónoma auto-ejecutable (Secuencia de la Creación)
│       ├── img/          # Obras de arte fotorrealistas de los días creativos
│       └── favicon.svg   # Favicon local
├── api/
│   └── notes.js          # Función serverless para sincronización con Neon Postgres
├── favicon.svg           # Favicon vectorial del portal
├── vercel.json           # Configuración de rutas, redirecciones canónicas y seguridad
├── package.json          # Metadatos del proyecto y scripts
├── scripts/
│   └── validate.js       # Validador de arquitectura autónoma y sintaxis
├── .agents/skills/       # Directrices de arquitectura, fuentes de Perspicacia y diseño UI/UX
├── .gitignore            # Archivos ignorados por git
└── README.md             # Documentación general
```

---

## 🏛️ Rigor Metodológico y Política Estricta de Fuentes

Todas las aplicaciones de la suite se desarrollan bajo un principio irrenunciable:
- **Fuente documental exclusiva:** La biblioteca oficial en línea **[wol.jw.org](https://wol.jw.org)** y primordialmente los dos tomos de la obra enciclopédica **«Perspicacia para comprender las Escrituras»** (*it-1* e *it-2*).
- **Prohibición de fuentes dudosas:** No se admiten datos, cronologías ni especulaciones extraídas de blogs de internet, foros o fuentes no contrastadas ni avaladas por la publicación oficial.
- **Skills de IA asociadas:**
  - `.agents/skills/wol-perspicacia-sources/SKILL.md`: Validación estricta y exhaustiva de fuentes oficiales y enlaces de `wol.jw.org`.
  - `.agents/skills/bibleapps-app-design/SKILL.md`: Consistencia arquitectónica de diseño, encabezados y ancho uniforme de 1200px en toda la suite.

---

## ⚖️ Licencia y Atribución
Las referencias bíblicas e históricas han sido cotejadas con fuentes documentales oficiales en *wol.jw.org*, destacando *«Perspicacia para comprender las Escrituras»* y *«Veamos la buena tierra»*. Código abierto bajo licencia MIT.
