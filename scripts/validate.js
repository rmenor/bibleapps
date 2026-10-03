#!/usr/bin/env node

/**
 * BibleApps Suite Integrity & Syntax Validator
 * Verifies that:
 * 1. All HTML files have no inline <style> in markup (CSS decoupled).
 * 2. All JavaScript and JSON scripts parse without errors.
 * 3. All local CSS stylesheets linked in <link> exist on disk.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

let allPassed = true;

function checkFile(file) {
  const content = fs.readFileSync(file, 'utf8');
  console.log(`\n🔍 Comprobando: ${file}`);

  // 1. Check no <style> tags in markup
  const markupOnly = content.replace(/<script[\s\S]*?<\/script>/gi, '');
  if (/<style[\s\S]*?>/i.test(markupOnly)) {
    console.error(`  ❌ Etiqueta <style> detectada en el marcado de ${file}. Todo el CSS debe ser externo.`);
    allPassed = false;
  } else {
    console.log(`  ✅ Sin etiquetas <style> en el marcado HTML.`);
  }

  // 2. Check scripts
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
        new vm.Script(code, { filename: `${file}-script-${i}.js` });
        console.log(`  ✅ Script ${i} (javascript) sintaxis válida.`);
      } catch (e) {
        console.error(`  ❌ Error de sintaxis en script ${i} (javascript):`, e.message);
        allPassed = false;
      }
    }
  });

  // 3. Check CSS links exist on disk
  const cssMatches = [...content.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/gi)];
  cssMatches.forEach(m => {
    let href = m[1];
    if (href.startsWith('http')) return; // CDN is fine
    const target = path.resolve(path.dirname(file), href);
    if (!fs.existsSync(target)) {
      console.error(`  ❌ Archivo CSS inexistente: ${href} (resuelto a: ${target})`);
      allPassed = false;
    } else {
      console.log(`  ✅ Archivo CSS encontrado: ${href}`);
    }
  });
}

const htmlFiles = [
  'index.html',
  'es/index.html',
  'es/traduccion.html',
  'ru/index.html',
  'ru/traduccion.html',
  'apps/medidas/index.html',
  'apps/atlas/index.html',
  'apps/cronologia/index.html'
];

for (const f of htmlFiles) {
  if (fs.existsSync(f)) {
    checkFile(f);
  } else {
    console.error(`❌ Archivo no encontrado: ${f}`);
    allPassed = false;
  }
}

if (!allPassed) {
  console.error(`\n❌ ¡Fallaron algunas comprobaciones!`);
  process.exit(1);
} else {
  console.log(`\n🎉 Todos los archivos HTML pasaron el 100% de las validaciones.`);
}
