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

const templateTv = (lang) => {
    const dict = JSON.parse(fs.readFileSync(path.join(baseDir, `i18n`, `${lang}.json`), 'utf-8'));
    let hreflangTags = langs.map(l => {
        return `<link rel="alternate" hreflang="${l}" href="https://dayzo.com/${l}/tv/">`;
    }).join('\n    ');
    hreflangTags += `\n    <link rel="alternate" hreflang="x-default" href="https://dayzo.com/en/tv/">`;

    return `<!DOCTYPE html>
<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dayzo TV</title>
    
    <!-- Open Graph / Social -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://dayzo.com/${lang}/tv/">
    <meta property="og:title" content="Dayzo TV Display">
    <meta property="og:description" content="Cast your countdown perfectly on any large screen or TV.">
    <meta property="og:image" content="https://dayzo.com/img/social-preview.png">
    
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Dayzo TV Display">
    <meta name="twitter:description" content="Cast your countdown perfectly on any large screen or TV.">
    
    <link rel="canonical" href="https://dayzo.com/${lang}/tv/">
    ${hreflangTags}
    <link rel="stylesheet" href="/css/variables.css">
    <link rel="stylesheet" href="/css/base.css">
    ${lang === 'ar' ? '<link rel="stylesheet" href="/css/rtl.css">' : ''}
    <link rel="stylesheet" href="/css/tv.css">
    
    <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.0/build/qrcode.min.js"></script>
    <script type="module" src="/js/core/theme.js"></script>
</head>
<body class="mode-tv">
    <div class="tv-background" id="tv-bg"></div>
    <div class="tv-overlay"></div>
    
    <div class="tv-container">
        <header class="tv-branding">
            <div class="tv-brand-logo">Dayzo <span>LIVE</span></div>
        </header>

        <main class="tv-content">
            <h1 class="tv-title" id="tv-title">Loading...</h1>
            
            <div class="tv-countdown-wrap" id="tv-countdown-wrap">
                <div class="tv-segment"><span class="tv-num" id="tv-days">00</span><span class="tv-label" data-i18n="ui.days">${getVal(dict, 'ui.days') || 'Days'}</span></div>
                <div class="tv-segment"><span class="tv-num" id="tv-hours">00</span><span class="tv-label" data-i18n="ui.hours">${getVal(dict, 'ui.hours') || 'Hours'}</span></div>
                <div class="tv-segment"><span class="tv-num" id="tv-minutes">00</span><span class="tv-label" data-i18n="ui.minutes">${getVal(dict, 'ui.minutes') || 'Minutes'}</span></div>
                <div class="tv-segment"><span class="tv-num" id="tv-seconds">00</span><span class="tv-label" data-i18n="ui.seconds">${getVal(dict, 'ui.seconds') || 'Seconds'}</span></div>
            </div>

            <div class="tv-final-10" id="tv-final-10" style="display:none;">
                <span class="tv-final-num" id="tv-final-num">10</span>
            </div>

            <div class="tv-finished-text" id="tv-finished-text" style="display:none;" data-i18n="ui.its_live">${getVal(dict, 'ui.its_live') || "It's Live"}</div>
        </main>

        <footer class="tv-footer"></footer>
    </div>
    
    <!-- Hidden theme toggle just in case -->
    <button id="theme-toggle-hidden" style="display:none;"></button>
    
    <script type="module" src="/js/pages/tv.js"></script>
</body>
</html>`;
};

langs.forEach(lang => {
    // Ensure directory exists
    const tvDir = path.join(baseDir, lang, 'tv');
    if (!fs.existsSync(tvDir)) {
        fs.mkdirSync(tvDir, { recursive: true });
    }

    const tvPath = path.join(tvDir, 'index.html');
    fs.writeFileSync(tvPath, templateTv(lang));
    console.log(`Updated ${tvPath}`);
});
