# 📖 Apps Bíblicas

Portal y catálogo de aplicaciones interactivas para el estudio histórico, cronológico y textual de la Biblia.

Optimizado para su despliegue ultrarrápido y sin configuración en **[Vercel](https://vercel.com)**.

---

## 🚀 Aplicaciones Disponibles y Roadmap

### 1. ⏱️ Tabla Cronológica e Histórica Bíblica (`/cronologia`) — **[Disponible]**
Aplicación interactiva exhaustiva con más de 4.000 años de historia sincronizada:
- **8 Módulos de visualización**:
  1. **Tiempo**: Línea temporal global con filtros por eventos bíblicos, libros, imperios mundiales y عصر secular.
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

### 2. 🗺️ Atlas y Geografía Bíblica (`/atlas`) — **[Disponible]**
Aplicación interactiva y cartografía vectorial de las tierras bíblicas documentada rigurosamente con *Perspicacia para comprender las Escrituras* y *wol.jw.org*:
- **4 Módulos de estudio**:
  1. **Mapa Interactivo con Pan y Zoom**: Cartografía SVG con capas conmutables (Tierra Prometida, Éxodo, Ministerio de Jesús, Viajes de Pablo).
  2. **Relieve y Perfil Topográfico de Palestina**: Corte transversal este-oeste con cotas desde el mar Mediterráneo (+0 m) hasta los montes de Judea (+800 m) y la depresión del mar Muerto (-400 m).
  3. **Reparto de las 12 Tribus**: Mapa y fichas detalladas de los territorios asignados por Josué y las 6 ciudades de refugio levíticas.
  4. **Calculador de Distancias Bíblicas**: Conversión geodésica instantánea a estadios romanos, millas romanas y jornadas de camino a pie.
- **Fichas topográficas completas**: Significado etimológico, contexto bíblico, identificación arqueológica y enlaces directos a *wol.jw.org*.

### 3. 📜 Armonía de los Evangelios — **[Próximamente]**
Cotejo paralelo y sinóptico de Mateo, Marcos, Lucas y Juan en orden cronológico.

### 4. ⚖️ Conversor de Pesas, Medidas y Monedas (`/medidas`) — **[Disponible]**
Calculadora interactiva en tiempo real fundamentada estrictamente en *Perspicacia para comprender las Escrituras* y *wol.jw.org*:
- **4 Módulos de conversión y consulta**:
  1. **Calculadora Bidireccional en Vivo**: Conversión instantánea de unidades bíblicas a métricas (y viceversa) para Longitud (dedo, palmo, codo, caña, estadio, milla), Líquidos (log, hin, bat, coro), Secos (cab, ómer, seah, efá, létek, hómer), Pesas (guerá, beca, pim, siclo, mina, talento) y Monedas (lepta, cuadrante, as, denario, dracma, didracma, estáter, dárico).
  2. **Ejemplos Bíblicos Clave**: Dimensiones del arca de Noé, altura y armadura de Goliat, estatua de oro de Nabucodonosor, mar fundido de Salomón, las dos monedas de la viuda y la parábola de los talentos.
  3. **Tablas Maestras de Perspicacia**: Resumen canónico de proporciones, equivalencias y textos bíblicos.
  4. **Estimador de Poder Adquisitivo y Jornales**: Cálculo del valor laboral histórico según el denario romano (1 jornada de 12 horas).

---

## 🌐 Despliegue en Vercel

Este proyecto está compuesto por archivos estáticos puros (HTML, CSS y JavaScript sin dependencias pesadas), lo que permite que Vercel lo sirva en su red Edge global en milisegundos.

### Opción 1: Conectar con GitHub (Recomendada)
1. Sube este repositorio a tu cuenta de GitHub:
   ```bash
   git add .
   git commit -m "feat: preparar repositorio y suite de apps bíblicas para Vercel"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/cronologia.git
   git push -u origin main
   ```
2. Entra en tu panel de [Vercel](https://vercel.com/new).
3. Haz clic en **"Add New Project"** e importa el repositorio de GitHub.
4. En **Framework Preset**, selecciona **Other** (o déjalo automático). No requiere ningún *Build Command* ni *Output Directory*.
5. Haz clic en **Deploy**. ¡Listo en menos de 1 minuto!

### Opción 2: Usando Vercel CLI
Si tienes instalada la herramienta de Vercel en tu terminal:
```bash
# Iniciar sesión en Vercel (si no lo has hecho)
npx vercel login

# Desplegar directamente
npx vercel

# Para producción directa:
npx vercel --prod
```

---

## 💻 Ejecución y Pruebas en Local

Puedes probar la web localmente de dos formas sencillas:

### Con Node / npm:
```bash
npm run dev
# Abrirá un servidor local (por ejemplo en http://localhost:3000)
```

### Sin Node (abriendo directamente en el navegador):
Abre directamente `index.html` en tu navegador favorito (Chrome, Safari, Firefox, Edge).

---

## 📁 Estructura del Repositorio

```text
├── index.html            # Portal y catálogo de Apps Bíblicas (Landing Page)
├── favicon.svg           # Favicon vectorial oficial (manuscrito bíblico de estudio)
├── cronologia/
│   ├── index.html        # Aplicación completa de la Tabla Cronológica Bíblica
│   └── favicon.svg       # Favicon de la app
├── atlas/
│   ├── index.html        # Aplicación interactiva de Atlas y Geografía Bíblica
│   └── favicon.svg       # Favicon de la app
├── medidas/
│   ├── index.html        # Aplicación interactiva de Pesas, Medidas y Monedas
│   └── favicon.svg       # Favicon de la app
├── vercel.json           # Configuración de URLs limpias, redirecciones y seguridad para Vercel
├── package.json          # Metadatos del proyecto y script de desarrollo local
├── .agents/skills/       # Skills especializadas para desarrollo y agentes de IA
│   ├── wol-perspicacia-sources/ # Regla estricta de fuentes de wol.jw.org y Perspicacia
│   └── bibleapps-app-design/    # Estándar obligatorio de UI (ancho 1200px, formato de header)
├── .gitignore            # Archivos temporales y de sistema ignorados por git
└── README.md             # Esta documentación
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
