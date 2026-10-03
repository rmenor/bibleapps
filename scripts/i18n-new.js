#!/usr/bin/env node

/**
 * BibleApps i18n Initializer para nuevos idiomas descentralizados
 * Crea el archivo {lang}.json en cada app (apps/{app}/locales/{lang}.json)
 * tomando como base apps/{app}/locales/_template.json
 *
 * Uso: node scripts/i18n-new.js --lang=fr --name="Français"
 *   o: node scripts/i18n-new.js fr "Français"
 */

const fs = require('fs');
const path = require('path');

const APPS_DIR = path.join(__dirname, '..', 'apps');

function parseArgs() {
  const args = process.argv.slice(2);
  let lang = '';
  let name = '';

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--lang=')) {
      lang = arg.split('=')[1].toLowerCase().trim();
    } else if (arg.startsWith('--name=')) {
      name = arg.split('=')[1].trim();
    } else if (!lang && !arg.startsWith('--')) {
      lang = arg.toLowerCase().trim();
    } else if (!name && !arg.startsWith('--')) {
      name = arg.trim();
    }
  }

  return { lang, name: name || lang.toUpperCase() };
}

function run() {
  const { lang, name } = parseArgs();

  if (!lang) {
    console.error('❌ Error: Debes especificar el código de idioma (ej: --lang=fr o node scripts/i18n-new.js fr)');
    process.exit(1);
  }

  const apps = fs.readdirSync(APPS_DIR).filter(item => {
    const full = path.join(APPS_DIR, item);
    return fs.statSync(full).isDirectory() && fs.existsSync(path.join(full, 'locales'));
  });

  console.log(`\n========================================`);
  console.log(`🌐 Inicializando nuevo idioma: [${lang.toUpperCase()}] (${name})`);
  console.log(`========================================`);

  for (const app of apps) {
    const localesDir = path.join(APPS_DIR, app, 'locales');
    const templateFile = path.join(localesDir, '_template.json');
    const targetFile = path.join(localesDir, `${lang}.json`);

    if (fs.existsSync(targetFile)) {
      console.log(`ℹ️ [apps/${app}] El archivo ya existe: ${targetFile}`);
      continue;
    }

    if (!fs.existsSync(templateFile)) {
      console.warn(`⚠️ [apps/${app}] No se encontró _template.json en ${localesDir}`);
      continue;
    }

    let templateJson = JSON.parse(fs.readFileSync(templateFile, 'utf8'));
    if (templateJson._meta) {
      templateJson._meta.language = lang;
      templateJson._meta.name = name;
      templateJson._meta.lastUpdated = new Date().toISOString().split('T')[0];
    }

    fs.writeFileSync(targetFile, JSON.stringify(templateJson, null, 2), 'utf8');
    console.log(`✅ [apps/${app}] Creado: ${targetFile}`);
  }

  console.log(`\n✨ Plantillas para [${lang.toUpperCase()}] inicializadas correctamente en todas las apps.`);
}

run();
