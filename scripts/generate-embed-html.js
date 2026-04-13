const fs = require('fs');
const path = require('path');

const langs = ["en", "es", "pt", "fr", "de", "ar", "hi", "id", "zh"];
const baseDir = process.cwd();

const templateEmbed = (lang) => {
    let hreflangTags = langs.map(l => {
        return `<link rel="alternate" hreflang="${l}" href="https://dayzo.com/${l}/embed/">`;
    }).join('\n    ');
    hreflangTags += `\n    <link rel="alternate" hreflang="x-default" href="https://dayzo.com/en/embed/">`;

    return `<!DOCTYPE html>
<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dayzo Embed</title>
    <link rel="canonical" href="https://dayzo.com/${lang}/embed/">
    ${hreflangTags}
    <link rel="stylesheet" href="/css/variables.css">
    <link rel="stylesheet" href="/css/base.css">
    ${lang === 'ar' ? '<link rel="stylesheet" href="/css/rtl.css">' : ''}
    <link rel="stylesheet" href="/css/embed.css">
    <script type="module" src="/js/core/theme.js"></script>
</head>
<body class="mode-embed">
    <div class="embed-container">
        <div class="embed-background-img" id="embed-bg" style="display:none;"></div>
        <div class="embed-content">
            <h1 class="embed-title" id="embed-title">Loading...</h1>
            
            <div class="embed-countdown-wrap" id="embed-countdown-wrap">
                <div class="embed-segment"><span class="embed-num" id="embed-days">00</span><span class="embed-label" data-i18n="ui.days">Days</span></div>
                <div class="embed-segment"><span class="embed-num" id="embed-hours">00</span><span class="embed-label" data-i18n="ui.hours">Hrs</span></div>
                <div class="embed-segment"><span class="embed-num" id="embed-minutes">00</span><span class="embed-label" data-i18n="ui.minutes">Mins</span></div>
                <div class="embed-segment"><span class="embed-num" id="embed-seconds">00</span><span class="embed-label" data-i18n="ui.seconds">Secs</span></div>
            </div>

            <div id="embed-finished" class="embed-finished" style="display:none;" data-i18n="ui.its_live">It's Live</div>
        </div>
        
        <footer class="embed-footer">
            <a href="/${lang}/" target="_blank" class="embed-brand">Dayzo <span>PRO</span></a>
        </footer>
    </div>
    
    <script type="module" src="/js/pages/embed.js"></script>
</body>
</html>`;
};

langs.forEach(lang => {
    const targetDir = path.join(baseDir, lang, 'embed');
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    const targetPath = path.join(targetDir, 'index.html');
    fs.writeFileSync(targetPath, templateEmbed(lang));
    console.log(`Updated ${targetPath}`);
});
