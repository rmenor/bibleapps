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

### 2. 🗺️ Atlas y Geografía Bíblica — **[Próximamente]**
Mapas interactivos con las fronteras del antiguo Oriente Medio, rutas del Éxodo y viajes apostólicos.

### 3. 📜 Armonía de los Evangelios — **[Próximamente]**
Cotejo paralelo y sinóptico de Mateo, Marcos, Lucas y Juan en orden cronológico.

### 4. ⚖️ Conversor de Pesas, Medidas y Monedas — **[Próximamente]**
Calculadora de conversión de codos, talentos, siclos y medidas bíblicas a estándares métricos.

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
├── cronologia/
│   └── index.html        # Aplicación completa de la Tabla Cronológica Bíblica
├── cronologia.html       # Copia directa de compatibilidad para rutas planas
├── orginal.html          # Archivo fuente original preservado
├── vercel.json           # Configuración de URLs limpias, redirecciones y seguridad para Vercel
├── package.json          # Metadatos del proyecto y script de desarrollo local
├── .gitignore            # Archivos temporales y de sistema ignorados por git
└── README.md             # Esta documentación
```

---

## ⚖️ Licencia y Atribución
Las referencias bíblicas e históricas han sido cotejadas con fuentes documentales como *«Perspicacia para comprender las Escrituras»* y ediciones académicas de textos antiguos. Código abierto bajo licencia MIT.
