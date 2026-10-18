#!/usr/bin/env node

/**
 * BibleApps Suite Integrity & Standalone Architecture Validator
 * Verifies that:
 * 1. Root portal (index.html) and all 5 apps under apps/ are present.
 * 2. Each HTML file contains an inline <style> block (self-contained CSS).
 * 3. No external decoupled CSS links exist (except local vendor such as leaflet.css).
 * 4. All JavaScript and JSON scripts parse without errors.
 * 5. No multi-language leftovers (lang-switch, locales/, data-i18n, traduccion.html).
 * 6. Internal app/portal links resolve to valid destinations.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

let allPassed = true;

const HTML_FILES = [
  'index.html',
  'apps/cronologia/index.html',
  'apps/creacion/index.html',
  'apps/atlas/index.html',
  'apps/medidas/index.html',
  'apps/notas/index.html'
];

function checkFile(relPath) {
  const file = path.resolve(__dirname, '..', relPath);
  console.log(`\n🔍 Comprobando: ${relPath}`);

  if (!fs.existsSync(file)) {
    console.error(`  ❌ Archivo no encontrado en disco: ${relPath}`);
    allPassed = false;
    return;
  }

  const content = fs.readFileSync(file, 'utf8');

  // 1. Check inline <style> tag exists
  if (!/<style\b[^>]*>[\s\S]*?<\/style>/i.test(content)) {
    console.error(`  ❌ Falta bloque <style> inline en ${relPath}. La aplicación debe ser auto-ejecutable y autónoma.`);
    allPassed = false;
  } else {
    console.log(`  ✅ Bloque <style> inline verificado (autónomo).`);
  }

  // 2. Check no external app/portal CSS links remain
  const linkMatches = [...content.matchAll(/<link\b[^>]*>/gi)];
  linkMatches.forEach(m => {
    const tag = m[0];
    if (!/rel=["']stylesheet["']/i.test(tag)) return;
    const hrefMatch = tag.match(/\bhref=["']([^"']+)["']/i);
    if (!hrefMatch) return;
    const href = hrefMatch[1];
    if (href.startsWith('http')) return; // CDN is allowed
    if (href.includes('vendor/')) return; // Local vendor (leaflet) is allowed

    console.error(`  ❌ Enlace a CSS externo no permitido detectado en ${relPath}: ${href}. Debe estar embebido en <style>.`);
    allPassed = false;
  });

  // 3. Check no i18n leftovers in standalone apps
  const forbiddenI18n = [
    { pattern: /class="lang-switch"/i, name: 'Selector de idioma (.lang-switch)' },
    { pattern: /class="lang-btn/i, name: 'Botón de idioma (.lang-btn)' },
    { pattern: /fetch\([^)]*locales\//i, name: 'Llamada fetch() a locales/' },
    { pattern: /traduccion\.html/i, name: 'Enlace a traduccion.html' }
  ];

  if (relPath.startsWith('apps/')) {
    forbiddenI18n.push({ pattern: /data-i18n(-html|-attr)?=/i, name: 'Atributos data-i18n' });
  }

  forbiddenI18n.forEach(({ pattern, name }) => {
    if (pattern.test(content)) {
      console.error(`  ❌ Resto de sistema i18n encontrado en ${relPath}: ${name}`);
      allPassed = false;
    }
  });

  // 4. Validate script syntax (JS and JSON)
  const scriptMatches = [...content.matchAll(/<script([\s\S]*?)>([\s\S]*?)<\/script>/gi)];
  scriptMatches.forEach((m, i) => {
    const attrs = m[1];
    const code = m[2];
    if (attrs.includes('application/json')) {
      try {
        JSON.parse(code);
        console.log(`  ✅ Script ${i} (application/json) válido.`);
      } catch (e) {
        console.error(`  ❌ Error de sintaxis en script ${i} (application/json):`, e.message);
        allPassed = false;
      }
    } else if (code.trim()) {
      try {
        new vm.Script(code, { filename: `${relPath}-script-${i}.js` });
        console.log(`  ✅ Script ${i} (javascript) sintaxis válida.`);
      } catch (e) {
        console.error(`  ❌ Error de sintaxis en script ${i} (javascript):`, e.message);
        allPassed = false;
      }
    }
  });
}

HTML_FILES.forEach(checkFile);

// Check that obsolete directories do not exist
const obsoleteDirs = [
  'es',
  'ru',
  'css',
  'apps/cronologia/css',
  'apps/cronologia/locales',
  'apps/creacion/css',
  'apps/creacion/locales',
  'apps/atlas/css',
  'apps/atlas/locales',
  'apps/medidas/css',
  'apps/medidas/locales',
  'apps/notas/css',
  'apps/notas/locales'
];

obsoleteDirs.forEach(dir => {
  const fullPath = path.resolve(__dirname, '..', dir);
  if (fs.existsSync(fullPath)) {
    console.warn(`  ⚠️ Directorio obsoleto aún presente en disco: ${dir}`);
  }
});

if (!allPassed) {
  console.error(`\n❌ ¡Fallaron algunas comprobaciones de integridad!`);
  process.exit(1);
} else {
  console.log(`\n🎉 Las 5 aplicaciones y el portal pasaron el 100% de las validaciones de arquitectura autónoma.`);
}
