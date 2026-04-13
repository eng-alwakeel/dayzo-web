const fs = require('fs');
const path = require('path');

const langs = ["en", "es", "pt", "fr", "de", "ar", "hi", "id", "zh"];
const baseDir = process.cwd();

function getVal(dict, keyStr) {
    const keys = keyStr.split('.');
    let val = dict;
    for (const k of keys) {
        val = val ? val[k] : null;
    }
    return val;
}

// HTML FOR LIVE MODE
const templateLive = (lang) => {
    const dict = JSON.parse(fs.readFileSync(path.join(baseDir, 'i18n', `${lang}.json`), 'utf-8'));
    let hreflangTags = langs.map(l => {
        return `<link rel="alternate" hreflang="${l}" href="https://dayzo.com/${l}/live/">`;
    }).join('\n    ');
    hreflangTags += `\n    <link rel="alternate" hreflang="x-default" href="https://dayzo.com/en/live/">`;

    return `<!DOCTYPE html>
<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${(getVal(dict, 'ui.live_mode') || 'Live Mode') + (getVal(dict, 'ui.meta_suffix') || ' - Dayzo')}</title>
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://dayzo.com/${lang}/live/">
    <meta property="og:title" content="Dayzo Live">
    <meta property="og:description" content="Generate and share your own live countdowns beautifully.">
    <link rel="canonical" href="https://dayzo.com/${lang}/live/">
    ${hreflangTags}
    <link rel="stylesheet" href="/css/variables.css">
    <link rel="stylesheet" href="/css/base.css">
    ${lang === 'ar' ? '<link rel="stylesheet" href="/css/rtl.css">' : ''}
    <link rel="stylesheet" href="/css/live.css">
    <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.0/build/qrcode.min.js"></script>
    <script type="module" src="/js/core/theme.js"></script>
    <script type="module" src="/js/core/lang-switcher.js"></script>
</head>
<body class="mode-live">
    <div class="live-background" id="live-bg"></div>
    <div class="live-overlay"></div>
    <div class="live-container">
        <header class="live-header">
            <div class="live-brand">Dayzo <span>LIVE</span></div>
        </header>
        <main class="live-content">
            <h1 class="live-title" id="live-title" data-i18n="ui.loading">${getVal(dict, 'ui.loading') || 'Loading...'}</h1>
            <div class="live-countdown-wrap" id="live-countdown-wrap">
                <div class="live-segment"><span class="live-num" id="live-days">00</span><span class="live-label" data-i18n="ui.days">${getVal(dict, 'ui.days') || 'Days'}</span></div>
                <div class="live-segment"><span class="live-num" id="live-hours">00</span><span class="live-label" data-i18n="ui.hours">${getVal(dict, 'ui.hours') || 'Hours'}</span></div>
                <div class="live-segment"><span class="live-num" id="live-minutes">00</span><span class="live-label" data-i18n="ui.minutes">${getVal(dict, 'ui.minutes') || 'Minutes'}</span></div>
                <div class="live-segment"><span class="live-num" id="live-seconds">00</span><span class="live-label" data-i18n="ui.seconds">${getVal(dict, 'ui.seconds') || 'Seconds'}</span></div>
            </div>
            <div class="live-final-10" id="live-final-10" style="display:none;">
                <span class="live-final-num" id="live-final-num">10</span>
            </div>
            <div class="live-finished-text" id="live-finished-text" style="display:none;" data-i18n="ui.its_live">${getVal(dict, 'ui.its_live') || "It's Live"}</div>
            <a href="#" class="btn btn-primary" id="live-cta-btn" style="display:none; margin-top:24px; font-size:1.25rem;">CTA</a>
            <div id="live-video" class="live-video-embed" style="display:none;"></div>
        </main>
        <footer class="live-footer">
            <div class="live-actions">
                <a href="/${lang}/create-live" class="btn btn-secondary" data-i18n="ui.create_live">${getVal(dict, 'ui.create_live') || 'Create Live'}</a>
                <a href="#" id="live-to-tv-btn" class="btn btn-secondary" data-i18n="ui.tv_mode">📺 ${getVal(dict, 'ui.tv_mode') || 'TV Mode'}</a>
            </div>
             <div class="live-qr-box">
                <canvas id="live-qr-canvas" width="60" height="60"></canvas>
                <div class="live-qr-label">
                  <span data-i18n="ui.qr_placeholder">${getVal(dict, 'ui.qr_placeholder') || 'Scan for Mobile'}</span>
                </div>
            </div>
        </footer>
    </div>
    <script type="module" src="/js/pages/live.js"></script>
</body>
</html>`;
};

// HTML FOR CREATE LIVE
const templateCreate = (lang) => {
    const dict = JSON.parse(fs.readFileSync(path.join(baseDir, 'i18n', `${lang}.json`), 'utf-8'));
    let hreflangTags = langs.map(l => {
        return `<link rel="alternate" hreflang="${l}" href="https://dayzo.com/${l}/create-live/">`;
    }).join('\n    ');
    hreflangTags += `\n    <link rel="alternate" hreflang="x-default" href="https://dayzo.com/en/create-live/">`;

    return `<!DOCTYPE html>
<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${(getVal(dict, 'ui.create_live') || 'Create Live') + (getVal(dict, 'ui.meta_suffix') || ' - Dayzo')}</title>
    <link rel="canonical" href="https://dayzo.com/${lang}/create-live/">
    ${hreflangTags}
    <link rel="stylesheet" href="/css/variables.css">
    <link rel="stylesheet" href="/css/base.css">
    ${lang === 'ar' ? '<link rel="stylesheet" href="/css/rtl.css">' : ''}
    <link rel="stylesheet" href="/css/create-live.css">
    <script type="module" src="/js/core/theme.js"></script>
    <script type="module" src="/js/core/lang-switcher.js"></script>
</head>
<body>
    <header class="brand-header">
        <a href="/${lang}/" class="brand-logo">Dayzo</a>
        <div class="header-actions">
            <select id="lang-switcher" class="lang-switcher"></select>
            <button id="theme-toggle" class="theme-toggle-btn">☀️ / 🌙</button>
        </div>
    </header>
    <main class="container">
        <div class="create-form-container">
            <h1 class="section-title" data-i18n="ui.form_header">${getVal(dict, 'ui.form_header') || 'Generate Live Countdown'}</h1>
            <form id="create-live-form">
                <div class="form-group">
                    <label class="form-label" data-i18n="ui.form_title">${getVal(dict, 'ui.form_title') || 'Event Title'}</label>
                    <input type="text" id="c-title" class="form-input" placeholder="${getVal(dict, 'ui.placeholder_event') || 'e.g. Apple Keynote'}" data-i18n="ui.placeholder_event">
                </div>
                <div class="form-group">
                    <label class="form-label" data-i18n="ui.form_template">${getVal(dict, 'ui.form_template') || 'Template'}</label>
                    <select id="c-template" class="form-input" style="appearance: auto;">
                        <option value="" data-i18n="ui.base_template">${getVal(dict, 'ui.base_template') || 'Base (No Template)'}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label" data-i18n="ui.form_date">${getVal(dict, 'ui.form_date') || 'Date & Time'}</label>
                    <input type="datetime-local" id="c-date" class="form-input" required>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" data-i18n="ui.form_text_color">${getVal(dict, 'ui.form_text_color') || 'Text Color'}</label>
                        <input type="color" id="c-text-color" class="form-input" value="#FFFFFF" style="padding:4px; height:48px;">
                    </div>
                    <div class="form-group">
                        <label class="form-label" data-i18n="ui.form_num_color">${getVal(dict, 'ui.form_num_color') || 'Numbers Color'}</label>
                        <input type="color" id="c-num-color" class="form-input" value="#FFFFFF" style="padding:4px; height:48px;">
                    </div>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" data-i18n="ui.form_font_family">${getVal(dict, 'ui.form_font_family') || 'Font Family'}</label>
                        <select id="c-font" class="form-input" style="appearance: auto;">
                            <option value="var(--font-family-sans)" data-i18n="ui.font_modern">${getVal(dict, 'ui.font_modern') || 'Modern (Sans)'}</option>
                            <option value="'Tajawal', sans-serif" data-i18n="ui.font_arabic">${getVal(dict, 'ui.font_arabic') || 'Arabic (Tajawal)'}</option>
                            <option value="'Georgia', serif" data-i18n="ui.font_classic">${getVal(dict, 'ui.font_classic') || 'Classic (Serif)'}</option>
                            <option value="'Courier New', monospace" data-i18n="ui.font_digital">${getVal(dict, 'ui.font_digital') || 'Digital (Mono)'}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label" data-i18n="ui.form_show_qr">${getVal(dict, 'ui.form_show_qr') || 'Show QR'}</label>
                        <select id="c-qr" class="form-input" style="appearance: auto;">
                            <option value="true" data-i18n="ui.yes">${getVal(dict, 'ui.yes') || 'Yes'}</option>
                            <option value="false" data-i18n="ui.no">${getVal(dict, 'ui.no') || 'No'}</option>
                        </select>
                    </div>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" data-i18n="ui.form_title_size">${getVal(dict, 'ui.form_title_size') || 'Title Size'}</label>
                        <input type="number" id="c-title-size" class="form-input" placeholder="5" min="1" max="20" step="0.5">
                    </div>
                    <div class="form-group">
                        <label class="form-label" data-i18n="ui.form_num_size">${getVal(dict, 'ui.form_num_size') || 'Numbers Size'}</label>
                        <input type="number" id="c-num-size" class="form-input" placeholder="12" min="5" max="40" step="0.5">
                    </div>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" data-i18n="ui.form_color">${getVal(dict, 'ui.form_color') || 'Accent Color'}</label>
                        <input type="color" id="c-color" class="form-input" value="#7C3AED" style="padding:4px; height:48px;">
                    </div>
                     <div class="form-group">
                        <label class="form-label" data-i18n="ui.form_logo">${getVal(dict, 'ui.form_logo') || 'Logo URL'}</label>
                        <input type="url" id="c-logo" class="form-input" placeholder="https://...">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label" data-i18n="ui.form_bg">${getVal(dict, 'ui.form_bg') || 'Background Image'}</label>
                    <input type="url" id="c-bg" class="form-input" placeholder="https://...">
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" data-i18n="ui.form_cta_text">${getVal(dict, 'ui.form_cta_text') || 'CTA Text'}</label>
                        <input type="text" id="c-cta" class="form-input" placeholder="${getVal(dict, 'ui.placeholder_cta') || 'Join Stream'}" data-i18n="ui.placeholder_cta">
                    </div>
                     <div class="form-group">
                        <label class="form-label" data-i18n="ui.form_link">${getVal(dict, 'ui.form_link') || 'CTA Link'}</label>
                        <input type="url" id="c-link" class="form-input" placeholder="https://...">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label" data-i18n="ui.form_video">${getVal(dict, 'ui.form_video') || 'Video URL'}</label>
                    <input type="url" id="c-video" class="form-input" placeholder="${getVal(dict, 'ui.placeholder_video') || 'YouTube URL'}" data-i18n="ui.placeholder_video">
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-primary" id="btn-preview" data-i18n="ui.btn_preview_live">${getVal(dict, 'ui.btn_preview_live') || 'Preview'}</button>
                    <button type="button" class="btn btn-secondary" id="btn-copy" data-i18n="ui.btn_copy_link">${getVal(dict, 'ui.btn_copy_link') || 'Copy Link'}</button>
                </div>
            </form>
            <div class="preview-card" style="margin-top: 32px; padding: 24px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-color); display: none;" id="live-preview-container">
                <h3 style="margin-bottom: 16px; font-size: 1rem; opacity: 0.7; text-transform: uppercase;" data-i18n="ui.live_preview">${getVal(dict, 'ui.live_preview') || 'Live Preview'}</h3>
                <iframe id="preview-iframe" style="width: 100%; height: 400px; border: none; border-radius: var(--radius-md); background: #000;"></iframe>
            </div>
            <div class="result-section" id="result-section">
                <div class="generated-url-box" id="generated-url"></div>
            </div>
        </div>
    </main>
    <script type="module" src="/js/pages/create-live.js"></script>
</body>
</html>`;
};

langs.forEach(lang => {
    const liveDir = path.join(baseDir, lang, 'live');
    if (!fs.existsSync(liveDir)) fs.mkdirSync(liveDir, { recursive: true });
    const livePath = path.join(liveDir, 'index.html');
    fs.writeFileSync(livePath, templateLive(lang));
    console.log(`Updated ${livePath}`);

    const createDir = path.join(baseDir, lang, 'create-live');
    if (!fs.existsSync(createDir)) fs.mkdirSync(createDir, { recursive: true });
    const createPath = path.join(createDir, 'index.html');
    fs.writeFileSync(createPath, templateCreate(lang));
    console.log(`Updated ${createPath}`);
});
