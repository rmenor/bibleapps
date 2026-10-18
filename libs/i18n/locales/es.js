/**
 * BibleApps - Locale base del portal (español)
 * Ruta: /libs/i18n/locales/es.js
 * Solo index.html raíz: las apps de apps/ no se traducen.
 */
(function (global) {
  global.I18n.register('es', { name: 'Español', dir: 'ltr' }, {
    'shell': {
      'themeToggle': 'Cambiar tema'
    },
    'portal': {
      'title': 'Apps Bíblicas | Herramientas Interactivas de Estudio Bíblico',
      'metaDesc': 'Portal de aplicaciones y herramientas interactivas para el estudio histórico, cronológico y textual de la Biblia.',
      'brandAria': 'Apps Bíblicas Inicio',
      'navCatalog': 'Catálogo de Apps',
      'navMethod': 'Metodología'
    },
    'hero': {
      'kicker': 'Herramientas de Estudio Histórico y Bíblico',
      'h1': 'Explora las Escrituras con rigor, claridad e interactividad',
      'lead': 'Una colección de herramientas web modernas, rápidas y documentadas para investigar la cronología, la historia de los manuscritos, las genealogías y el contexto de la Biblia.',
      'ctaCronologia': 'Abrir Tabla Cronológica',
      'ctaAtlas': 'Abrir Atlas y Geografía'
    },
    'stats': {
      'years': 'Años de historia sincronizada',
      'modules': 'Módulos especializados en la cronología',
      'calc': 'Cálculo bíblico y cotejo con fuentes',
      'load': 'Carga instantánea sin dependencias'
    },
    'apps': {
      'title': 'Nuestras Aplicaciones',
      'sub': 'Herramientas diseñadas para el estudio personal, la enseñanza y la investigación bíblica.'
    },
    'badge': {
      'available': 'Disponible ahora',
      'wip': 'En desarrollo'
    },
    'cron': {
      'title': 'Tabla Cronológica e Histórica Bíblica',
      'desc': 'Línea temporal exhaustiva con filtros en tiempo real. Examina desde Adán y el Diluvio hasta el cautiverio en Babilonia, los imperios mundiales de Daniel y la vida de Jesús y los apóstoles. Incluye fórmulas bíblicas calculadas y comparativa frente a la cronología secular.',
      'tag1': 'Línea de tiempo',
      'tag2': 'Reyes de Judá e Israel',
      'tag3': 'Árbol de Manuscritos',
      'tag4': 'Genealogías',
      'tag5': 'Patriarcas',
      'tag6': 'Buscador en vivo',
      'tag7': 'Modo oscuro',
      'launch': 'Lanzar Aplicación Interactiva',
      'previewHeader': 'Módulos incluidos en la app',
      'previewCount': '8 Paneles',
      'p1': '<strong>Línea Temporal Global:</strong> Filtros por eventos bíblicos, libros escritos, imperios mundiales y era secular.',
      'p2': '<strong>Canon Bíblico y Manuscritos:</strong> Flujo de transmisión textual (hebreo y griego), Masorético, Rollos del Mar Muerto y versiones modernas.',
      'p3': '<strong>Reyes y Patriarcas:</strong> Cuadro comparativo de reyes de Judá vs. Israel y edades de los patriarcas antediluvianos.',
      'p4': '<strong>Jesús y los Apóstoles:</strong> Cronología del ministerio terrestre, cartas apostólicas y persecuciones del siglo I.'
    },
    'atlas': {
      'title': 'Atlas y Geografía Bíblica',
      'desc': 'Cartografía vectorial interactiva: mapas de Canaán, reparto de las 12 tribus, corte topográfico de Palestina, rutas del Éxodo, ministerio de Jesús, viajes de Pablo y calculador de distancias bíblicas. Documentado estrictamente según wol.jw.org y Perspicacia.',
      'note': 'En revisión',
      'cta': 'Abrir Atlas →'
    },
    'harmony': {
      'title': 'Armonía de los Evangelios',
      'desc': 'Comparador en columnas paralelas de los cuatro relatos evangélicos (Mateo, Marcos, Lucas y Juan) ordenados de forma sinóptica y cronológica según el ministerio de Jesús.',
      'note': 'Próxima actualización'
    },
    'medidas': {
      'title': 'Conversor de Pesas, Medidas y Monedas',
      'desc': 'Calculadora interactiva en tiempo real: codos, cañas, estadios, talentos, siclos, denarios, batos y gomeres al sistema métrico decimal. Incluye ejemplos de relatos bíblicos y estimador de esfuerzo laboral según Perspicacia y wol.jw.org.',
      'note': 'En revisión',
      'cta': 'Abrir Conversor →'
    },
    'notas': {
      'title': 'Cuaderno de Notas Bíblicas',
      'desc': 'Gestor de notas y cadenas temáticas de estudio bíblico sincronizado en la nube con Neon Serverless Postgres y soporte offline. Permite organizar citas, enlazar con wol.jw.org y clasificar por etiquetas.',
      'cta': 'Abrir Notas →'
    },
    'gene': {
      'title': 'Explorador de Genealogías',
      'badge': 'Integrado en Cronología',
      'desc': 'Consulta la línea mesiánica completa desde Adán, Set y Noé, pasando por Abrahán y David, hasta llegar a Jesucristo, con las dos líneas de Mateo y Lucas.',
      'note': 'Acceso directo',
      'cta': 'Abrir panel →'
    },
    'creacion': {
      'title': 'La Creación: Secuencia Completa',
      'desc': 'Estudio interactivo de la secuencia de los 6 días creativos de Génesis 1:1 a 2:4, su correspondencia simétrica, elementos dominantes y notas de Perspicacia y wol.jw.org.',
      'note': 'Génesis 1',
      'cta': 'Abrir Creación →'
    },
    'rigor': {
      'title': 'Metodología y Fuentes',
      'sub': 'Principios que guían el desarrollo de cada aplicación de la plataforma.',
      'f1Title': 'Fidelidad al Registro Bíblico',
      'f1Desc': 'Las fechas y secuencias se calculan a partir de los datos explícitos de edad, reinados y plazos presentes en el texto masorético y los textos canónicos.',
      'f2Title': 'Transparencia Cronológica',
      'f2Desc': 'Distinción explícita de acontecimientos confirmados, fechas calculadas por deducción textual y discrepancias frente a la cronología de historiadores seculares.',
      'f3Title': 'Rendimiento y Privacidad',
      'f3Desc': 'Sin rastreadores, sin analíticas invasivas ni dependencias pesadas. Código HTML/CSS/JS puro, ultrarrápido y preparado para funcionar en cualquier navegador.'
    },
    'footer': {
      'line1': '<strong>Apps Bíblicas</strong> — Colección abierta de herramientas interactivas de estudio bíblico.',
      'line2': 'Preparado para despliegue estático de alto rendimiento en Vercel.',
      'cronologia': 'Cronología',
      'atlas': 'Atlas Bíblico',
      'creacion': 'La Creación',
      'medidas': 'Pesas y Medidas',
      'notas': 'Cuaderno de Notas',
      'catalogo': 'Catálogo',
      'metodologia': 'Metodología'
    }
  });
})(window);
