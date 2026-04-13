const fs = require('fs');
const path = require('path');

const scriptsToUpdate = [
    'scripts/generate-home-html.js',
    'scripts/generate-embed-html.js'
];

scriptsToUpdate.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/const langs = \[.*?\];/, 'const langs = ["en", "ar"];');
    
    const headerStr = `
    <header class="brand-header">
        <a href="/\${lang}/" class="brand-logo">Dayzo</a>
        <div class="header-actions">
            <select id="lang-switcher" class="lang-switcher"></select>
            <button id="theme-toggle" class="theme-toggle-btn">☀️ / 🌙</button>
        </div>
    </header>
    `;

    content = content.replace(/<header class="container brand-header">[\s\S]*?<\/header>/g, headerStr);
    fs.writeFileSync(file, content);
});

// Enforce text colors and buttons in base.css
const baseCssPath = 'css/base.css';
let baseCss = fs.readFileSync(baseCssPath, 'utf8');
if(!baseCss.includes('Global Button Styles Override')) {
    baseCss += `

/* Global Button Styles Override */
.btn {
  display: inline-block;
  font-family: inherit;
  font-weight: 600;
  text-align: center;
  border-radius: var(--radius-md);
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  text-decoration: none;
}
.btn-primary {
  background-color: var(--color-primary);
  color: #FFFFFF !important;
}
.btn-primary:hover {
  background-color: var(--color-primary-hover);
}
.btn-secondary {
  background-color: var(--bg-input);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}
.btn-secondary:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* Ensure body forces brand text color */
body {
  color: var(--text-primary) !important;
}
`;
    fs.writeFileSync(baseCssPath, baseCss);
}

console.log('Update 2 script executed.');
