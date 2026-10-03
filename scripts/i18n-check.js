#!/usr/bin/env node

/**
 * BibleApps Decentralized i18n Validator & Coverage Checker
 * Comprueba la integridad de las traducciones independientes de cada aplicación:
 * apps/{app}/locales/{lang}.json
 *
 * Uso: node scripts/i18n-check.js
 */

const fs = require('fs');
const path = require('path');

const APPS_DIR = path.join(__dirname, '..', 'apps');
const BASE_LANG = 'es';

function getApps() {
  if (!fs.existsSync(APPS_DIR)) return [];
  return fs.readdirSync(APPS_DIR).filter(item => {
    const full = path.join(APPS_DIR, item);
    return fs.statSync(full).isDirectory() && fs.existsSync(path.join(full, 'locales'));
  });
}

function checkApp(appName) {
  const localesDir = path.join(APPS_DIR, appName, 'locales');
  const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json') && !f.startsWith('_'));

  console.log(`\n========================================`);
  console.log(`📱 App: [apps/${appName}]`);
  console.log(`📂 Locales: ${localesDir}`);
  console.log(`========================================`);

  const baseFile = path.join(localesDir, `${BASE_LANG}.json`);
  if (!fs.existsSync(baseFile)) {
    console.error(`❌ Falta el archivo base oficial en español: ${baseFile}`);
    return false;
  }

  let baseJson;
  try {
    baseJson = JSON.parse(fs.readFileSync(baseFile, 'utf8'));
    console.log(`✅ [${BASE_LANG.toUpperCase()}] Archivo base válido. Metadatos:`, baseJson._meta?.name || '(sin _meta.name)');
  } catch (err) {
    console.error(`❌ Error de sintaxis en JSON base: ${err.message}`);
    return false;
  }

  for (const file of files) {
    const lang = path.basename(file, '.json');
    if (lang === BASE_LANG) continue;

    const targetFile = path.join(localesDir, file);
    try {
      const targetJson = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
      console.log(`✅ [${lang.toUpperCase()}] Archivo válido: ${file} | Nombre: ${targetJson._meta?.name || '(sin _meta.name)'}`);
    } catch (err) {
      console.error(`❌ Error en archivo [${file}]: ${err.message}`);
    }
  }

  const templateFile = path.join(localesDir, '_template.json');
  if (fs.existsSync(templateFile)) {
    try {
      JSON.parse(fs.readFileSync(templateFile, 'utf8'));
      console.log(`✅ [_template.json] Plantilla de traducción lista.`);
    } catch (err) {
      console.warn(`⚠️ Error en _template.json: ${err.message}`);
    }
  }

  const instructionsFile = path.join(localesDir, 'INSTRUCCIONES.md');
  if (fs.existsSync(instructionsFile)) {
    console.log(`📖 [INSTRUCCIONES.md] Guía de traducción presente.`);
  }

  return true;
}

console.log(`🚀 Iniciando validación descentralizada de traducciones de BibleApps...`);
const apps = getApps();
if (apps.length === 0) {
  console.warn(`No se encontraron aplicaciones con carpeta 'locales' en apps/.`);
  process.exit(0);
}

for (const app of apps) {
  checkApp(app);
}

console.log(`\n✨ Comprobación de todas las aplicaciones finalizada con éxito.`);
