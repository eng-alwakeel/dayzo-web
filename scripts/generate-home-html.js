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

const template = (lang) => {
    const dict = JSON.parse(fs.readFileSync(path.join(baseDir, `i18n`, `${lang}.json`), 'utf-8'));
    let hreflangTags = langs.map(l => {
        return `<link rel="alternate" hreflang="${l}" href="https://dayzo.com/${l}/">`;
    }).join('\n    ');
    hreflangTags += `\n    <link rel="alternate" hreflang="x-default" href="https://dayzo.com/en/">`;

    const metaDesc = getVal(dict, 'ui.homepage_meta_desc') || 'Live countdown timers for holidays, events, and personal milestones.';
    const ogTitle = getVal(dict, 'ui.homepage_og_title') || 'Dayzo – Live Countdown Timers';
    const jsonLd = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": "https://dayzo.com/#website",
                "url": "https://dayzo.com/",
                "name": "Dayzo",
                "description": metaDesc,
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": { "@type": "EntryPoint", "urlTemplate": `https://dayzo.com/${lang}/?q={search_term_string}` },
                    "query-input": "required name=search_term_string"
                },
                "inLanguage": lang
            },
            {
                "@type": "Organization",
                "@id": "https://dayzo.com/#organization",
                "name": "Dayzo",
                "url": "https://dayzo.com/",
                "logo": { "@type": "ImageObject", "url": "https://dayzo.com/images/og-preview.png" }
            }
        ]
    });

    return `<!DOCTYPE html>
<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-i18n="ui.upcoming_events">${getVal(dict, 'ui.upcoming_events') || 'Dayzo'}</title>
    <meta name="description" content="${metaDesc}">
    <meta name="robots" content="index, follow">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://dayzo.com/${lang}/">
    <meta property="og:title" content="${ogTitle}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:image" content="https://dayzo.com/images/og-preview.png">
    <meta property="og:site_name" content="Dayzo">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${ogTitle}">
    <meta name="twitter:description" content="${metaDesc}">
    <meta name="twitter:image" content="https://dayzo.com/images/og-preview.png">
    <link rel="canonical" href="https://dayzo.com/${lang}/">
    ${hreflangTags}
    <script type="application/ld+json">${jsonLd}</script>
    <link rel="stylesheet" href="/css/variables.css">
    <link rel="stylesheet" href="/css/base.css">
    ${lang === 'ar' ? '<link rel="stylesheet" href="/css/rtl.css">' : ''}
    <link rel="stylesheet" href="/css/homepage.css">
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
    

    <main class="container" id="app-root">
        <!-- Hero Section -->
        <section class="hero-section">
            <h1 class="local-clock" id="base-clock">--:--:--</h1>
            <div class="search-container">
                <input type="text" id="event-search-input" class="search-input" placeholder="${getVal(dict, 'ui.search_placeholder') || 'Search events...'}" data-i18n="ui.search_placeholder">
                <div id="search-results-grid" class="events-grid" style="margin-top: 24px;"></div>
            </div>
        </section>

        <!-- Upcoming Events -->
        <section class="section" id="upcoming">
            <h2 class="section-title" data-i18n="ui.upcoming_events">${getVal(dict, 'ui.upcoming_events') || 'Upcoming Events'}</h2>
            <div id="upcoming-events-grid" class="events-grid">
                <!-- Injected via JS -->
            </div>
        </section>

        <!-- Trending -->
        <section class="section" id="trending">
            <h2 class="section-title" data-i18n="ui.trending_events">${getVal(dict, 'ui.trending_events') || 'Trending'}</h2>
            <div id="trending-events-grid" class="events-grid">
                <!-- Injected via JS -->
            </div>
        </section>

        <!-- Popular locally (Placeholder for specific logic later) -->
        <section class="section" id="local">
            <h2 class="section-title" data-i18n="ui.popular_in_country">${getVal(dict, 'ui.popular_in_country') || 'Popular in your region'}</h2>
            <div id="local-events-grid" class="events-grid">
                <!-- Injected via JS -->
            </div>
        </section>

        <div class="create-banner">
            <h2 class="section-title" data-i18n="ui.create_your_own">${getVal(dict, 'ui.create_your_own') || 'Create your own countdown'}</h2>
            <a href="/${lang}/create-live" class="btn btn-primary" data-i18n="ui.create_cta">${getVal(dict, 'ui.create_cta') || 'Get Started'}</a>
        </div>

        <!-- Personal Event Templates -->
        <section class="section" id="personal-templates">
            <h2 class="section-title" data-i18n="ui.personal_templates_title">${getVal(dict, 'ui.personal_templates_title') || 'Personal Event Templates'}</h2>
            <p class="section-desc" data-i18n="ui.personal_templates_desc">${getVal(dict, 'ui.personal_templates_desc') || 'Choose a beautiful template for your personal celebration.'}</p>
            <div id="personal-templates-grid" class="events-grid">
                <!-- Injected via JS -->
            </div>
        </section>
    </main>
    
    <script type="module" src="/js/pages/homepage.js"></script>
</body>
</html>`;
};

langs.forEach(lang => {
    const dirPath = path.join(baseDir, lang);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
    const filePath = path.join(dirPath, 'index.html');
    fs.writeFileSync(filePath, template(lang));
    console.log(`Updated ${filePath}`);
});

// Also generate the root index.html (Language Router)
const rootIndexPath = path.join(baseDir, 'index.html');
const routerTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dayzo - Countdown to Any Event</title>
    <script>
        (function() {
            const supported = ${JSON.stringify(langs)};
            const navLang = navigator.language.slice(0,2);
            const redirectLang = supported.includes(navLang) ? navLang : 'en';
            window.location.replace('/' + redirectLang + '/');
        })();
    </script>
</head>
<body>
    <noscript>
        <h1>Dayzo</h1>
        <ul>
            ${langs.map(l => `<li><a href="/${l}/">${l.toUpperCase()}</a></li>`).join('\n            ')}
        </ul>
    </noscript>
</body>
</html>`;

fs.writeFileSync(rootIndexPath, routerTemplate);
console.log(`Updated root ${rootIndexPath}`);
