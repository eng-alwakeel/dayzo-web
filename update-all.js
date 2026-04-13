const fs = require('fs');
const path = require('path');

// 1. Force languages to EN and AR only across the project
const scriptsToUpdate = [
    'scripts/generate-seo-html.js',
    'scripts/generate-live-html.js',
    'scripts/generate-tv-html.js',
    'scripts/generate-sitemap.js',
    'js/core/lang-switcher.js'
];

scriptsToUpdate.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/const langs = \[.*?\];/, 'const langs = ["en", "ar"];');
    content = content.replace(/langs: \[.*?\]/, 'langs: ["en", "ar"]');
    
    // Fix QR code CDN
    content = content.replace(/\/js\/lib\/qrcode\.min\.js/g, 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js');

    // Make ALL headers identical structurally in templates
    const headerStr = `
    <header class="brand-header">
        <a href="/\${lang}/" class="brand-logo">Dayzo</a>
        <div class="header-actions">
            <select id="lang-switcher" class="lang-switcher"></select>
            <button id="theme-toggle" class="theme-toggle-btn">☀️ / 🌙</button>
        </div>
    </header>
    `;

    // Replace <header class="container brand-header">...
    content = content.replace(/<header class="container brand-header">[\s\S]*?<\/header>/g, headerStr);
    content = content.replace(/<header class="live-header">[\s\S]*?<\/header>/g, headerStr);
    content = content.replace(/<header class="tv-header">[\s\S]*?<\/header>/g, headerStr);

    fs.writeFileSync(file, content);
});

// 2. Append base CSS for specific header layout
const baseCssPath = 'css/base.css';
let baseCss = fs.readFileSync(baseCssPath, 'utf8');
if(!baseCss.includes('Unified Brand Header')) {
    baseCss += `

/* Unified Brand Header */
.brand-header {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  padding: 16px 24px !important;
  position: sticky !important;
  top: 0 !important;
  z-index: 1000 !important;
  background-color: var(--bg-core) !important;
  border-bottom: 1px solid var(--border-color) !important;
  width: 100% !important;
}

.brand-header .brand-logo {
  font-size: 1.5rem !important;
  font-weight: 800 !important;
  color: var(--color-primary) !important;
  text-decoration: none !important;
  letter-spacing: -0.05em !important;
}

.brand-header .header-actions {
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
}

.lang-switcher, .theme-toggle-btn {
  background-color: var(--bg-input) !important;
  color: var(--text-primary) !important;
  border: 1px solid var(--border-color) !important;
  border-radius: var(--radius-sm) !important;
  padding: 6px 12px !important;
  font-size: 0.85rem !important;
  font-family: inherit !important;
  cursor: pointer !important;
  outline: none !important;
  transition: all 0.2s ease !important;
}

.lang-switcher:hover, .theme-toggle-btn:hover {
  border-color: var(--color-primary) !important;
}

body.mode-live .brand-header, body.mode-tv .brand-header {
  background-color: transparent !important;
  border-bottom: none !important;
}

body.mode-live .theme-toggle-btn, body.mode-tv .theme-toggle-btn,
body.mode-live .lang-switcher, body.mode-tv .lang-switcher {
  background-color: rgba(255,255,255,0.1) !important;
  color: white !important;
  border: none !important;
}
`;
    fs.writeFileSync(baseCssPath, baseCss);
}

// 3. Fix AR translations missing keys
const enJson = JSON.parse(fs.readFileSync('i18n/en.json', 'utf8'));
const arJson = JSON.parse(fs.readFileSync('i18n/ar.json', 'utf8'));

// Shallow merge keys for events
// If a key exists in events but not in AR, fallback to EN string (or rough translation if possible)
const missingKeys = Object.keys(enJson.events).filter(k => !arJson.events[k]);
missingKeys.forEach(k => {
    arJson.events[k] = enJson.events[k]; 
});

// Re-write
fs.writeFileSync('i18n/ar.json', JSON.stringify(arJson, null, 2));

console.log('Update script executed successfully.');
