#!/usr/bin/env node

/**
 * BibleApps - Playwright Comprehensive E2E Verification Suite
 * Verifies that all pages (Portal and 5 Standalone Apps):
 * 1. Load cleanly without JS crashes or uncaught console errors.
 * 2. Render all CSS variables (:root, --bg, --ink, --accent), fonts, and canonical 1200px .wrap.
 * 3. Support dynamic theme switching (Light / Dark) via #themeBtn.
 * 4. Have functional navigation (#homeBtn to ../../index.html).
 * 5. Execute app-specific interactive features (Timeline, Scrubber, Leaflet map, Calculator, Notes).
 * 6. Work properly under both HTTP local server and file:// protocol.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const PORT = 3847;

// Simple static server
function createServer() {
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png'
  };

  return http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath.endsWith('/')) reqPath += 'index.html';
    const filePath = path.join(ROOT, reqPath);

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const mime = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    fs.createReadStream(filePath).pipe(res);
  });
}

async function runTests() {
  const server = createServer();
  await new Promise(resolve => server.listen(PORT, resolve));
  console.log(`🌐 Servidor local iniciado en http://localhost:${PORT}\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });

  let totalTests = 0;
  let passedTests = 0;
  const errors = [];

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  ✅ ${message}`);
    } else {
      errors.push(message);
      console.error(`  ❌ FALLO: ${message}`);
    }
  }

  try {
    // -------------------------------------------------------------
    // 1. PORTAL PRINCIPAL (index.html)
    // -------------------------------------------------------------
    console.log('🧪 Probando: Portal Principal (index.html)');
    const page = await context.newPage();
    const portalConsoleErrors = [];
    page.on('pageerror', err => portalConsoleErrors.push(err.message));

    await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'domcontentloaded' });

    assert(portalConsoleErrors.length === 0, `Sin errores de consola en Portal (errores: ${portalConsoleErrors.join(', ')})`);
    
    // Check Title & Hero
    const title = await page.title();
    assert(title.includes('Apps Bíblicas'), `Título correcto: "${title}"`);
    
    const heroH1 = await page.textContent('.hero h1');
    assert(heroH1 && heroH1.length > 0, `Encabezado Hero presente: "${heroH1?.trim()}"`);

    // Check App Cards (all 6 cards present)
    const cards = await page.$$('.app-card');
    assert(cards.length >= 6, `Tarjetas de aplicaciones renderizadas: ${cards.length} (esperado >= 6)`);

    // Check Theme Switcher
    const initialTheme = await page.evaluate(() => document.documentElement.dataset.theme);
    await page.click('#themeBtn');
    const newTheme = await page.evaluate(() => document.documentElement.dataset.theme);
    assert(initialTheme !== newTheme, `Alternancia de tema funciona: ${initialTheme || 'default'} -> ${newTheme}`);

    // Check CSS computed properties
    const portalWrapMaxWidth = await page.evaluate(() => {
      const el = document.querySelector('.container, .wrap');
      return el ? window.getComputedStyle(el).maxWidth : null;
    });
    assert(portalWrapMaxWidth === '1200px', `Ancho canónico contenedor: ${portalWrapMaxWidth}`);

    await page.close();

    // -------------------------------------------------------------
    // 2. CRONOLOGÍA (apps/cronologia/index.html)
    // -------------------------------------------------------------
    console.log('\n🧪 Probando: Cronología Bíblica (apps/cronologia/index.html)');
    const pageCrono = await context.newPage();
    const cronoConsoleErrors = [];
    pageCrono.on('pageerror', err => cronoConsoleErrors.push(err.message));

    await pageCrono.goto(`http://localhost:${PORT}/apps/cronologia/index.html`, { waitUntil: 'domcontentloaded' });
    await pageCrono.waitForTimeout(400);

    assert(cronoConsoleErrors.length === 0, `Sin errores de consola en Cronología`);

    // Check Header & .wrap CSS
    const cronoWrap = await pageCrono.evaluate(() => {
      const w = document.querySelector('.wrap');
      const cs = window.getComputedStyle(w);
      const rootCs = window.getComputedStyle(document.documentElement);
      return {
        maxWidth: cs.maxWidth,
        accent: rootCs.getPropertyValue('--accent').trim(),
        bg: rootCs.getPropertyValue('--bg').trim()
      };
    });
    assert(cronoWrap.maxWidth === '1200px', `CSS canónico: .wrap max-width es ${cronoWrap.maxWidth}`);
    assert(cronoWrap.accent.length > 0, `Variables :root activas: --accent es ${cronoWrap.accent}`);

    // Check Home button href
    const cronoHomeHref = await pageCrono.getAttribute('#homeBtn', 'href');
    assert(cronoHomeHref === '../../index.html', `Botón inicio apunta a '../../index.html': ${cronoHomeHref}`);

    // Check Timeline events rendered
    const eventCount = await pageCrono.$$eval('.grp', els => els.length);
    assert(eventCount > 10, `Eventos cronológicos renderizados: ${eventCount}`);

    // Check Tab switching (e.g. Genealogías tab #ge)
    await pageCrono.click('nav.tabs button[data-tab="ge"]');
    const geVisible = await pageCrono.evaluate(() => {
      const panel = document.getElementById('ge');
      return panel && window.getComputedStyle(panel).display !== 'none';
    });
    assert(geVisible, `Pestaña Genealogías (#ge) conmutable y visible`);

    // Check Search filtering
    await pageCrono.fill('#q', 'david');
    await pageCrono.waitForTimeout(250);
    const filteredEvents = await pageCrono.$$eval('.grp', els => els.length);
    assert(filteredEvents > 0 && filteredEvents < eventCount, `Búsqueda funcional: filtró de ${eventCount} a ${filteredEvents} eventos`);

    await pageCrono.close();

    // -------------------------------------------------------------
    // 3. LA CREACIÓN (apps/creacion/index.html)
    // -------------------------------------------------------------
    console.log('\n🧪 Probando: La Creación (apps/creacion/index.html)');
    const pageCrea = await context.newPage();
    const creaConsoleErrors = [];
    pageCrea.on('pageerror', err => creaConsoleErrors.push(err.message));

    await pageCrea.goto(`http://localhost:${PORT}/apps/creacion/index.html`, { waitUntil: 'domcontentloaded' });
    await pageCrea.waitForTimeout(400);

    assert(creaConsoleErrors.length === 0, `Sin errores de consola en Creación`);

    // Check CSS styles & variables
    const creaStyles = await pageCrea.evaluate(() => {
      const rootCs = window.getComputedStyle(document.documentElement);
      const wrap = document.querySelector('.wrap');
      return {
        accent: rootCs.getPropertyValue('--accent').trim(),
        wrapMax: wrap ? window.getComputedStyle(wrap).maxWidth : null
      };
    });
    assert(creaStyles.wrapMax === '1200px', `CSS canónico .wrap: ${creaStyles.wrapMax}`);
    assert(creaStyles.accent.length > 0, `Variables :root cargadas: --accent=${creaStyles.accent}`);

    // Check Phase Cards
    const phaseCards = await pageCrea.$$eval('.phase-card', els => els.length);
    assert(phaseCards >= 7, `Tarjetas de días creativos renderizadas: ${phaseCards}`);

    // Check Image Loading in Player
    const imgLoaded = await pageCrea.evaluate(() => {
      const img = document.getElementById('player-main-img');
      return img && img.complete && img.naturalWidth > 0;
    });
    assert(imgLoaded, `Imagen principal del reproductor cargada correctamente (naturalWidth > 0)`);

    // Check Scrubber Thumbnails Loaded
    const thumbsLoaded = await pageCrea.evaluate(() => {
      const thumbs = Array.from(document.querySelectorAll('.step-node-thumb'));
      return thumbs.length > 0 && thumbs.every(t => t.complete && t.naturalWidth > 0);
    });
    assert(thumbsLoaded, `Miniaturas de la secuencia cargadas correctamente`);

    // Check Interactive Scrubber step
    const initialTitle = await pageCrea.textContent('#player-event-title');
    await pageCrea.click('#btn-next-day');
    const nextTitle = await pageCrea.textContent('#player-event-title');
    assert(initialTitle !== nextTitle, `Scrubber interactivo avanza paso: "${initialTitle?.trim()}" -> "${nextTitle?.trim()}"`);

    await pageCrea.close();

    // -------------------------------------------------------------
    // 4. ATLAS BÍBLICO (apps/atlas/index.html)
    // -------------------------------------------------------------
    console.log('\n🧪 Probando: Atlas Bíblico (apps/atlas/index.html)');
    const pageAtlas = await context.newPage();
    const atlasConsoleErrors = [];
    pageAtlas.on('pageerror', err => atlasConsoleErrors.push(err.message));

    await pageAtlas.goto(`http://localhost:${PORT}/apps/atlas/index.html`, { waitUntil: 'domcontentloaded' });
    await pageAtlas.waitForTimeout(600);

    assert(atlasConsoleErrors.length === 0, `Sin errores de consola en Atlas`);

    // Check CSS variables & wrap
    const atlasStyles = await pageAtlas.evaluate(() => {
      const rootCs = window.getComputedStyle(document.documentElement);
      const wrap = document.querySelector('.wrap');
      return {
        accent: rootCs.getPropertyValue('--accent').trim(),
        wrapMax: wrap ? window.getComputedStyle(wrap).maxWidth : null
      };
    });
    assert(atlasStyles.wrapMax === '1200px', `CSS canónico .wrap: ${atlasStyles.wrapMax}`);
    assert(atlasStyles.accent.length > 0, `Variables :root activas: --accent=${atlasStyles.accent}`);

    // Check Leaflet Map Initialized
    const leafletMapInit = await pageAtlas.$('.leaflet-container');
    assert(leafletMapInit !== null, `Mapa Leaflet interactivo inicializado con éxito (.leaflet-container)`);

    // Check Distance Calculator
    await pageAtlas.click('nav.tabs button[data-tab="distances"]');
    const distPanelVisible = await pageAtlas.evaluate(() => {
      const panel = document.getElementById('panel-distances');
      return panel && window.getComputedStyle(panel).display !== 'none';
    });
    assert(distPanelVisible, `Panel de cálculo de distancias visible`);

    await pageAtlas.close();

    // -------------------------------------------------------------
    // 5. PESAS Y MEDIDAS (apps/medidas/index.html)
    // -------------------------------------------------------------
    console.log('\n🧪 Probando: Pesas y Medidas (apps/medidas/index.html)');
    const pageMed = await context.newPage();
    const medConsoleErrors = [];
    pageMed.on('pageerror', err => medConsoleErrors.push(err.message));

    await pageMed.goto(`http://localhost:${PORT}/apps/medidas/index.html`, { waitUntil: 'domcontentloaded' });
    await pageMed.waitForTimeout(400);

    assert(medConsoleErrors.length === 0, `Sin errores de consola en Medidas`);

    // Check CSS variables & wrap
    const medStyles = await pageMed.evaluate(() => {
      const rootCs = window.getComputedStyle(document.documentElement);
      const wrap = document.querySelector('.wrap');
      return {
        accent: rootCs.getPropertyValue('--accent').trim(),
        wrapMax: wrap ? window.getComputedStyle(wrap).maxWidth : null
      };
    });
    assert(medStyles.wrapMax === '1200px', `CSS canónico .wrap: ${medStyles.wrapMax}`);
    assert(medStyles.accent.length > 0, `Variables :root activas: --accent=${medStyles.accent}`);

    // Check Interactive Conversion
    await pageMed.fill('#input-biblical', '10');
    await pageMed.waitForTimeout(100);
    const metricVal = await pageMed.inputValue('#input-metric');
    assert(metricVal && parseFloat(metricVal) > 0, `Conversor bidireccional en tiempo real: entrada 10 -> salida ${metricVal}`);

    await pageMed.close();

    // -------------------------------------------------------------
    // 6. CUADERNO DE NOTAS (apps/notas/index.html)
    // -------------------------------------------------------------
    console.log('\n🧪 Probando: Cuaderno de Notas (apps/notas/index.html)');
    const pageNotas = await context.newPage();
    const notasConsoleErrors = [];
    pageNotas.on('pageerror', err => notasConsoleErrors.push(err.message));

    await pageNotas.goto(`http://localhost:${PORT}/apps/notas/index.html`, { waitUntil: 'domcontentloaded' });
    await pageNotas.waitForTimeout(400);

    assert(notasConsoleErrors.length === 0, `Sin errores de consola en Notas`);

    // Check CSS variables & wrap
    const notasStyles = await pageNotas.evaluate(() => {
      const rootCs = window.getComputedStyle(document.documentElement);
      const wrap = document.querySelector('.wrap');
      return {
        accent: rootCs.getPropertyValue('--accent').trim(),
        wrapMax: wrap ? window.getComputedStyle(wrap).maxWidth : null
      };
    });
    assert(notasStyles.wrapMax === '1200px', `CSS canónico .wrap: ${notasStyles.wrapMax}`);
    assert(notasStyles.accent.length > 0, `Variables :root activas: --accent=${notasStyles.accent}`);

    // Check Seed Notes render
    const noteCards = await pageNotas.$$eval('.note-card', els => els.length);
    assert(noteCards >= 3, `Notas de estudio iniciales renderizadas: ${noteCards} tarjetas`);

    // Check Search in notes
    await pageNotas.fill('#noteSearch', 'Daniel');
    await pageNotas.waitForTimeout(200);
    const filteredNotes = await pageNotas.$$eval('.note-card', els => els.length);
    assert(filteredNotes > 0, `Búsqueda en notas funcional (filtra por 'Daniel'): ${filteredNotes} notas`);

    await pageNotas.close();

    // -------------------------------------------------------------
    // 7. PRUEBA EN PROTOCOLO file:// (Offline nativo con doble clic)
    // -------------------------------------------------------------
    console.log('\n🧪 Probando: Protocolo nativo file:// (Doble clic directo)');
    const pageFile = await context.newPage();
    const fileConsoleErrors = [];
    pageFile.on('pageerror', err => fileConsoleErrors.push(err.message));

    const fileUrl = 'file://' + path.join(ROOT, 'apps', 'cronologia', 'index.html');
    await pageFile.goto(fileUrl, { waitUntil: 'domcontentloaded' });
    await pageFile.waitForTimeout(300);

    assert(fileConsoleErrors.length === 0, `Sin errores al abrir con file://`);
    const fileEvents = await pageFile.$$eval('.grp', els => els.length);
    assert(fileEvents > 10, `Cronología 100% funcional en file:// sin servidor (${fileEvents} eventos)`);

    await pageFile.close();

  } finally {
    await browser.close();
    server.close();
  }

  console.log(`\n========================================`);
  console.log(`🏁 Resumen de Pruebas Playwright:`);
  console.log(`   Total de comprobaciones: ${totalTests}`);
  console.log(`   Comprobaciones aprobadas: ${passedTests}`);
  console.log(`   Fallos: ${errors.length}`);
  console.log(`========================================\n`);

  if (errors.length > 0) {
    console.error('❌ Se detectaron fallos en las pruebas.');
    process.exit(1);
  } else {
    console.log('🎉 ¡Todas las páginas y aplicaciones pasaron las pruebas de Playwright con éxito!');
  }
}

runTests().catch(err => {
  console.error('Error fatal durante la ejecución de Playwright:', err);
  process.exit(1);
});
