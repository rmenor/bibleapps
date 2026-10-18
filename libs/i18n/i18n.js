/**
 * BibleApps - Motor i18n del portal (index.html raíz)
 * Ruta: /libs/i18n/i18n.js
 *
 * Solo el portal se traduce; las apps de apps/ siguen en español por diseño
 * (sin capas de traducción ni selector de idioma).
 *
 * Uso en index.html:
 *
 *   <script src="libs/i18n/i18n.js"></script>
 *   <script src="libs/i18n/locales/es.js"></script>
 *   <script src="libs/i18n/locales/ru.js"></script>
 *   <script>
 *     I18n.init({ basePath: 'libs/i18n/locales/', available: ['es', 'ru'] });
 *   </script>
 *
 * Al init el motor:
 *   1. Detecta el idioma (?lang= > localStorage > navegador > es) y carga por
 *      <script> locales/<código>.js si falta.
 *   2. Monta el pill de idioma (.lang-switch) junto a .themebtn.
 *   3. Traduce los elementos con data-i18n="clave" y los re-traduce en cada
 *      cambio de idioma:
 *        data-i18n-html        -> innerHTML (texto con etiquetas)
 *        data-i18n-attr="x"    -> escribe en el atributo x (aria-label, title,
 *                                 content en <meta>, placeholder...)
 *
 * Orden de resolución de una clave:
 *   locale activa -> fallback (es) -> datos inline (setAppTranslations) -> la clave
 *
 * Soporta protocolo file://: no usa fetch ni módulos ES.
 */
(function (global) {
  'use strict';

  var LS_KEY = 'bibleapps_lang';
  var FALLBACK = 'es';
  var STYLE_ID = 'bibleapps-i18n-styles';

  /* Estilos del selector de idioma (pill "ES | RU") y de su contenedor de
     esquina, para cabeceras de app (absolutas) y de portal (en flujo). */
  var UI_CSS =
    '.corner-controls{position:absolute;right:16px;top:14px;display:flex;align-items:center;gap:8px;z-index:25}' +
    '.corner-controls .themebtn{position:static;right:auto;top:auto}' +
    '.lang-switch{background:var(--surface);border:1px solid var(--line);border-radius:999px;padding:2px;display:inline-flex;gap:2px}' +
    '.lang-switch button{background:transparent;border:0;color:var(--muted);font:700 11.5px var(--sans);letter-spacing:.05em;padding:4px 10px;border-radius:999px;cursor:pointer;transition:background .15s,color .15s}' +
    '.lang-switch button:hover{color:var(--accent)}' +
    '.lang-switch button[aria-pressed="true"]{background:var(--accent);color:#fff}' +
    ':root[data-theme="dark"] .lang-switch button[aria-pressed="true"]{color:#0f141c}' +
    '@media (prefers-color-scheme: dark){:root:not([data-theme="light"]) .lang-switch button[aria-pressed="true"]{color:#0f141c}}' +
    '@media (max-width:760px){.corner-controls{top:10px}}' +
    '@media print{.corner-controls,.lang-switch{display:none!important}}';

  var _registered = {};   // código -> { meta, dict }
  var _fallbackDict = null;
  var _appDict = null;
  var _listeners = [];
  var _basePath = './locales/';
  var _available = null;
  var _mountEl = null;

  function get(obj, path) {
    if (!obj) return undefined;
    var parts = path.split('.');
    var cur = obj;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null) return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  }

  function interpolate(str, params) {
    if (!params) return str;
    return String(str).replace(/\{(\w+)\}/g, function (m, k) {
      return params.hasOwnProperty(k) ? params[k] : m;
    });
  }

  function normalize(code) {
    if (!code) return null;
    var tag = String(code).toLowerCase();
    if (tag.slice(0, 2) === 'ru') return 'ru';
    if (tag.slice(0, 2) === 'es') return 'es';
    return tag.split('-')[0];
  }

  function resolve(dict, key, params) {
    var val = get(dict, key);
    if (val == null || typeof val === 'object') return undefined;
    return interpolate(val, params);
  }

  function ensureStyles() {
    if (global.document.getElementById(STYLE_ID)) return;
    var st = global.document.createElement('style');
    st.id = STYLE_ID;
    st.textContent = UI_CSS;
    global.document.head.appendChild(st);
  }

  function renderSwitch() {
    if (!_mountEl) return;
    _mountEl.className = 'lang-switch';
    _mountEl.setAttribute('role', 'group');
    _mountEl.innerHTML = '';
    I18n.available().forEach(function (lang) {
      var b = global.document.createElement('button');
      b.type = 'button';
      b.textContent = String(lang.code).toUpperCase();
      b.setAttribute('aria-label', lang.name);
      if (lang.code === I18n.current) b.setAttribute('aria-pressed', 'true');
      b.addEventListener('click', function () {
        I18n.setLanguage(lang.code);
      });
      _mountEl.appendChild(b);
    });
  }

  var I18n = {
    /** Idioma activo (código corto, p. ej. 'ru') */
    current: null,

    /** Registra una locale. Lo invocan los archivos locales/<código>.js */
    register: function (code, meta, dict) {
      _registered[code] = { meta: meta || {}, dict: dict || {} };
      if (code === FALLBACK) _fallbackDict = dict || {};
      return I18n;
    },

    /** Diccionario inline de la página, último recurso tras las locales */
    setAppTranslations: function (dict) {
      _appDict = dict;
      return I18n;
    },

    isLoaded: function (code) {
      return !!_registered[code];
    },

    /** Idiomas disponibles: [{ code, name, dir }] */
    available: function () {
      var codes = (_available && _available.every(function (c) { return _registered[c]; }))
        ? _available
        : Object.keys(_registered);
      return codes.map(function (code) {
        var entry = _registered[code] || { meta: {} };
        return { code: code, name: entry.meta.name || code, dir: entry.meta.dir || 'ltr' };
      });
    },

    /**
     * Inicializa el motor. opts:
     *   { basePath, available, fallback, translations, mount, autoMount, translateDom }
     */
    init: function (opts) {
      opts = opts || {};
      _basePath = (opts.basePath || _basePath).replace(/\/?$/, '/');
      if (opts.available) _available = opts.available.slice();
      if (opts.fallback) FALLBACK = opts.fallback;
      if (opts.translations) _appDict = opts.translations;

      var stored = null;
      try { stored = global.localStorage.getItem(LS_KEY); } catch (e) { /* noop */ }

      var target = normalize(
        new URLSearchParams(global.location.search).get('lang') ||
        stored ||
        (global.navigator && global.navigator.language)
      );

      if (opts.available && opts.available.indexOf(target) === -1) {
        target = opts.available[0];
      }

      if (opts.autoMount !== false) I18n.mountButton(opts.mount);

      var ready = I18n.use(target);

      if (opts.translateDom !== false) {
        I18n.onChange(function () { I18n.applyToDom(); });
        return ready.then(function () {
          I18n.applyToDom();
          return I18n;
        });
      }
      return ready;
    },

    /** Carga (por <script> si hace falta) y activa un idioma */
    use: function (code) {
      var target = normalize(code) || FALLBACK;
      if (!_registered[target]) {
        var s = global.document.createElement('script');
        s.src = _basePath + target + '.js';
        var loaded = new Promise(function (res, rej) {
          s.onload = res;
          s.onerror = function () { rej(new Error('i18n: no se pudo cargar ' + s.src)); };
        });
        global.document.head.appendChild(s);
        return loaded.then(function () {
          if (!_registered[target]) return I18n.use(FALLBACK);
          I18n._activate(target);
        });
      }
      I18n._activate(target);
      return Promise.resolve(I18n);
    },

    /** Cambia de idioma (lo recuerda en localStorage) */
    setLanguage: function (code) {
      try { global.localStorage.setItem(LS_KEY, normalize(code)); } catch (e) { /* noop */ }
      return I18n.use(code);
    },

    /** Traduce una clave anidada por puntos, con {params} opcionales */
    t: function (key, params) {
      var val = resolve(_registered[I18n.current] && _registered[I18n.current].dict, key, params);
      if (val === undefined && I18n.current !== FALLBACK) {
        val = resolve(_registered[FALLBACK] && _registered[FALLBACK].dict, key, params);
      }
      if (val === undefined) val = resolve(_fallbackDict, key, params);
      if (val === undefined) val = resolve(_appDict, key, params);
      return val === undefined ? key : val;
    },

    /** Callback en cada cambio de idioma */
    onChange: function (fn) {
      _listeners.push(fn);
    },

    /**
     * Monta el pill ES | RU junto a .themebtn e inyecta sus estilos.
     * Sin argumento: si .themebtn está en un contenedor de controles
     * (.nav-actions del portal o .corner-controls) se inserta a su lado; si es
     * un botón flotante de cabecera de app se crea antes el .corner-controls.
     * Con mountEl se usa ese elemento como contenedor.
     */
    mountButton: function (mountEl) {
      var el = null;
      var explicit = typeof mountEl === 'string' || (mountEl && mountEl.nodeType);
      if (explicit) {
        el = typeof mountEl === 'string'
          ? global.document.querySelector(mountEl)
          : mountEl;
      } else {
        var themeBtn = global.document.querySelector('.themebtn');
        if (themeBtn && themeBtn.parentElement) {
          var parent = themeBtn.parentElement;
          if (parent.classList.contains('corner-controls') ||
              parent.classList.contains('nav-actions')) {
            el = global.document.createElement('div');
            parent.insertBefore(el, themeBtn);
          } else if (global.getComputedStyle(themeBtn).position === 'absolute') {
            var wrap = global.document.createElement('div');
            wrap.className = 'corner-controls';
            parent.insertBefore(wrap, themeBtn);
            wrap.appendChild(themeBtn);
            el = global.document.createElement('div');
            wrap.insertBefore(el, wrap.firstChild);
          }
        }
      }
      if (!el) return I18n;
      ensureStyles();
      _mountEl = el;
      renderSwitch();
      I18n.onChange(renderSwitch);
      return I18n;
    },

    /** Traduce el DOM: elementos con data-i18n (ver cabecera del archivo) */
    applyToDom: function (root) {
      var scope = root && root.querySelectorAll ? root : global.document;
      var nodes = scope.querySelectorAll('[data-i18n]');
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var key = node.getAttribute('data-i18n');
        var val = I18n.t(key);
        if (val === key) continue;
        var attr = node.getAttribute('data-i18n-attr');
        if (attr) node.setAttribute(attr, val);
        else if (node.hasAttribute('data-i18n-html')) node.innerHTML = val;
        else node.textContent = val;
      }
      return I18n;
    },

    _activate: function (code) {
      I18n.current = code;
      global.document.documentElement.lang = code;
      _listeners.forEach(function (fn) { fn(code); });
      global.dispatchEvent(new global.CustomEvent('bibleapps:langchange', { detail: { lang: code } }));
    }
  };

  global.I18n = I18n;
})(window);
