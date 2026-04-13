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

const templateCustom = (lang) => {
    const dict = JSON.parse(fs.readFileSync(path.join(baseDir, 'i18n', `${lang}.json`), 'utf-8'));
    let hreflangTags = langs.map(l => {
        return `<link rel="alternate" hreflang="${l}" href="https://dayzo.com/${l}/personal-customize/">`;
    }).join('\n    ');
    hreflangTags += `\n    <link rel="alternate" hreflang="x-default" href="https://dayzo.com/en/personal-customize/">`;

    return `<!DOCTYPE html>
<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${(getVal(dict, 'personal_custom.header') || 'Customize') + (getVal(dict, 'ui.meta_suffix') || ' - Dayzo')}</title>
    <link rel="canonical" href="https://dayzo.com/${lang}/personal-customize/">
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
            <h1 class="section-title" data-i18n="personal_custom.header">${getVal(dict, 'personal_custom.header') || 'Customize Your Celebration'}</h1>
            <p class="description-text" id="template-info-text">--</p>
            
            <form id="personal-customize-form">
                <input type="hidden" id="p-template-id">
                
                <div class="form-group">
                    <label class="form-label" data-i18n="personal_custom.title_label">${getVal(dict, 'personal_custom.title_label') || 'Event Title'}</label>
                    <input type="text" id="p-title" class="form-input" placeholder="e.g. Happy Birthday Sarah">
                </div>

                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" data-i18n="personal_custom.name_label">${getVal(dict, 'personal_custom.name_label') || 'Person Name'}</label>
                        <input type="text" id="p-name" class="form-input" placeholder="e.g. Sarah">
                    </div>
                    <div class="form-group">
                        <label class="form-label" data-i18n="personal_custom.date_label">${getVal(dict, 'personal_custom.date_label') || 'Event Date & Time'}</label>
                        <input type="datetime-local" id="p-date" class="form-input" required>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label" data-i18n="personal_custom.message_label">${getVal(dict, 'personal_custom.message_label') || 'Message'}</label>
                    <textarea id="p-msg" class="form-input" rows="3" style="resize: vertical;"></textarea>
                </div>

                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" data-i18n="personal_custom.photo_label">${getVal(dict, 'personal_custom.photo_label') || 'Photo URL'}</label>
                        <input type="url" id="p-photo" class="form-input" placeholder="https://...">
                    </div>
                    <div class="form-group">
                        <label class="form-label" data-i18n="personal_custom.bg_label">${getVal(dict, 'personal_custom.bg_label') || 'Background URL'}</label>
                        <input type="url" id="p-bg" class="form-input" placeholder="https://...">
                    </div>
                </div>

                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" data-i18n="ui.form_logo">${getVal(dict, 'ui.form_logo') || 'Logo URL'}</label>
                        <input type="url" id="p-logo" class="form-input" placeholder="https://...">
                    </div>
                    <div class="form-group">
                        <label class="form-label" data-i18n="ui.form_color">${getVal(dict, 'ui.form_color') || 'Accent Color'}</label>
                        <input type="color" id="p-color" class="form-input" value="#7C3AED">
                    </div>
                </div>

                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" data-i18n="ui.form_cta_text">${getVal(dict, 'ui.form_cta_text') || 'CTA Text'}</label>
                        <input type="text" id="p-cta" class="form-input" placeholder="Buy Tickets">
                    </div>
                    <div class="form-group">
                        <label class="form-label" data-i18n="ui.form_link">${getVal(dict, 'ui.form_link') || 'Link URL'}</label>
                        <input type="url" id="p-link" class="form-input" placeholder="https://...">
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label" data-i18n="ui.form_video">${getVal(dict, 'ui.form_video') || 'Video URL'}</label>
                    <input type="url" id="p-video" class="form-input" placeholder="https://youtube.com/...">
                </div>

                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" data-i18n="ui.form_text_color">${getVal(dict, 'ui.form_text_color') || 'Text Color'}</label>
                        <input type="color" id="p-text-color" class="form-input" value="#FFFFFF">
                    </div>
                    <div class="form-group">
                        <label class="form-label" data-i18n="ui.form_num_color">${getVal(dict, 'ui.form_num_color') || 'Numbers Color'}</label>
                        <input type="color" id="p-num-color" class="form-input" value="#7C3AED">
                    </div>
                </div>

                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" data-i18n="ui.form_font_family">${getVal(dict, 'ui.form_font_family') || 'Font Family'}</label>
                        <select id="p-font" class="form-input">
                            <option value="var(--font-family-sans)" data-i18n="ui.font_modern">Modern</option>
                            <option value="var(--font-family-serif)" data-i18n="ui.font_classic">Classic</option>
                            <option value="'Tajawal', sans-serif" data-i18n="ui.font_arabic">Arabic</option>
                            <option value="'Courier New', monospace" data-i18n="ui.font_digital">Digital</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label" data-i18n="ui.form_show_qr">${getVal(dict, 'ui.form_show_qr') || 'Show QR'}</label>
                        <select id="p-qr" class="form-input">
                            <option value="true" data-i18n="ui.yes" selected>Yes</option>
                            <option value="false" data-i18n="ui.no">No</option>
                        </select>
                    </div>
                </div>

                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label" data-i18n="ui.form_title_size">${getVal(dict, 'ui.form_title_size') || 'Title Size'}</label>
                        <input type="number" id="p-title-size" class="form-input" value="8" min="1" max="20">
                    </div>
                    <div class="form-group">
                        <label class="form-label" data-i18n="ui.form_num_size">${getVal(dict, 'ui.form_num_size') || 'Numbers Size'}</label>
                        <input type="number" id="p-num-size" class="form-input" value="12" min="1" max="30">
                    </div>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn btn-primary btn-full" data-i18n="personal_custom.btn_generate">${getVal(dict, 'personal_custom.btn_generate') || 'Generate My Page'}</button>
                </div>
            </form>

            <div class="preview-card" style="margin-top: 32px; padding: 24px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-color); display: none;" id="personal-preview-container">
                <h3 style="margin-bottom: 16px; font-size: 1rem; opacity: 0.7; text-transform: uppercase;" data-i18n="personal_custom.preview_title">${getVal(dict, 'personal_custom.preview_title') || 'Template Preview'}</h3>
                <iframe id="preview-iframe" style="width: 100%; height: 500px; border: none; border-radius: var(--radius-md); background: #000;"></iframe>
            </div>

             <div class="result-section" id="result-section" style="margin-top: 40px; border-top: 1px solid var(--border-color); padding-top: 32px; display: none;">
                <div class="generated-url-box" id="generated-url"></div>
                <button id="btn-copy" class="btn btn-secondary btn-full" style="margin-top: 16px;" data-i18n="ui.copy">Copy Link</button>
            </div>
        </div>
    </main>
    <script type="module" src="/js/pages/personal-customize.js"></script>
</body>
</html>`;
};

langs.forEach(lang => {
    const dir = path.join(baseDir, lang, 'personal-customize');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, 'index.html');
    fs.writeFileSync(filePath, templateCustom(lang));
    console.log(`Updated ${filePath}`);
});
