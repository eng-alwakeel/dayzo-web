const fs = require('fs');
const path = require('path');

const langs = ["en", "es", "pt", "fr", "de", "ar", "hi", "id", "zh"];
const baseDir = process.cwd();

const DateUtils = {
    getNextFixedOccurrence(month, day) {
        const now = new Date();
        const currentYear = now.getFullYear();
        let target = new Date(currentYear, month - 1, day);
        if (target.getTime() < now.getTime()) {
            target = new Date(currentYear + 1, month - 1, day);
        }
        return target.toISOString();
    },
    resolveVariableRule(rule, fallbackDates, year) {
        if (!fallbackDates) return null;
        let targetIso = fallbackDates[year];
        const now = Date.now();
        if (targetIso && new Date(targetIso).getTime() < now) {
            const nextYear = (parseInt(year) + 1).toString();
            if (fallbackDates[nextYear]) {
                targetIso = fallbackDates[nextYear];
            }
        }
        return targetIso || null;
    },
    getNextDayOfWeek(targetDayOfWeek) {
        const now = new Date();
        let currentDay = now.getDay();
        let daysUntil = (targetDayOfWeek - currentDay + 7) % 7;
        if (daysUntil === 0) daysUntil = 7;
        const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntil);
        return targetDate.toISOString();
    },
    getYearStart(yearOffset) {
        return new Date(yearOffset, 0, 1).toISOString();
    }
};

// Load global datasets
const globalEvents = JSON.parse(fs.readFileSync(path.join(baseDir, 'content', 'events_global.json'), 'utf8'));
const variableEvents = JSON.parse(fs.readFileSync(path.join(baseDir, 'content', 'events_variable.json'), 'utf8'));
const localEvents = JSON.parse(fs.readFileSync(path.join(baseDir, 'content', 'events_local.json'), 'utf8'));
const seasonsEvents = fs.existsSync(path.join(baseDir, 'content', 'events_seasons.json')) ? JSON.parse(fs.readFileSync(path.join(baseDir, 'content', 'events_seasons.json'), 'utf8')) : [];
const yearsEvents = fs.existsSync(path.join(baseDir, 'content', 'events_years.json')) ? JSON.parse(fs.readFileSync(path.join(baseDir, 'content', 'events_years.json'), 'utf8')) : [];
const daysEvents = fs.existsSync(path.join(baseDir, 'content', 'events_days.json')) ? JSON.parse(fs.readFileSync(path.join(baseDir, 'content', 'events_days.json'), 'utf8')) : [];

// Combine and deduplicate
const allConfigs = [...globalEvents, ...variableEvents, ...localEvents, ...seasonsEvents, ...yearsEvents, ...daysEvents];
const allEvents = Array.from(new Map(allConfigs.map(item => [item.slug, item])).values());

// Load event-specific translations
const eventTranslations = JSON.parse(fs.readFileSync(path.join(baseDir, 'content', 'events_translations.json'), 'utf8'));

// Load translations
const dictionaries = {};
langs.forEach(lang => {
    try {
        dictionaries[lang] = JSON.parse(fs.readFileSync(path.join(baseDir, 'i18n', `${lang}.json`), 'utf8'));
    } catch {
        dictionaries[lang] = {};
    }
});
const enDict = dictionaries['en'];

function getVal(dict, keyStr) {
    const keys = keyStr.split('.');
    let val = dict;
    for (const k of keys) {
        val = val ? val[k] : null;
    }
    return val;
}

const template = (lang, eventConfig) => {
    // Generate Target Date
    let targetDate = '';
    if (eventConfig.type === 'variable' && eventConfig.dates) {
        const now = new Date();
        const year = now.getFullYear().toString();
        const nextYear = (now.getFullYear() + 1).toString();
        
        targetDate = eventConfig.dates[year];
        if (!targetDate || new Date(targetDate) < now) {
            targetDate = eventConfig.dates[nextYear];
        }
    } else if (eventConfig.month && eventConfig.day && eventConfig.type !== 'year') {
        targetDate = DateUtils.getNextFixedOccurrence(eventConfig.month, eventConfig.day);
    } else if (eventConfig.rule) {
        targetDate = DateUtils.resolveVariableRule(eventConfig.rule, eventConfig.fallback_dates, new Date().getFullYear().toString());
    } else if (eventConfig.type === 'year' && eventConfig.year_offset) {
        targetDate = DateUtils.getYearStart(eventConfig.year_offset);
    } else if (eventConfig.type === 'day' && eventConfig.day_of_week !== undefined) {
        targetDate = DateUtils.getNextDayOfWeek(eventConfig.day_of_week);
    }

    const dict = dictionaries[lang] || {};
    const eventName = getVal(dict, eventConfig.name_key) || getVal(enDict, eventConfig.name_key) || eventConfig.name || eventConfig.slug;
    
    // Formatting date
    // Use ar-u-nu-arab to ensure Eastern Arabic numerals (٠, ١, ٢...) for Arabic locale
    const displayLocale = lang === 'ar' ? 'ar-u-nu-arab' : lang;
    const formattedDate = new Date(targetDate).toLocaleDateString(displayLocale, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const diffMs = new Date(targetDate).getTime() - Date.now();
    const initialDaysValue = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    const initialDays = initialDaysValue.toLocaleString(displayLocale);

    // Inject replacements helper
    const inject = (str) => {
        if (!str) return '';
        return str
            .replace(/{event}/g, eventName)
            .replace(/{date}/g, formattedDate)
            .replace(/{days}/g, initialDays);
    };

    // Build Hreflang Tags
    let hreflangTags = langs.map(l => {
        return `<link rel="alternate" hreflang="${l}" href="https://dayzo.com/${l}/how-many-days-until-${eventConfig.slug}/">`;
    }).join('\n    ');
    hreflangTags += `\n    <link rel="alternate" hreflang="x-default" href="https://dayzo.com/en/how-many-days-until-${eventConfig.slug}/">`;
    const canonical = `<link rel="canonical" href="https://dayzo.com/${lang}/how-many-days-until-${eventConfig.slug}/">`;

    // Event-specific override logic
    const evTrans = eventTranslations[eventConfig.slug]?.[lang] || eventTranslations[eventConfig.slug]?.['en'] || {};
    const seoDict = dict.seo || enDict.seo || {};

    let titleStr = inject(evTrans.title) || (inject(seoDict.h1) + (getVal(dict, 'ui.meta_suffix') || ' - Dayzo'));
    let h1Str = inject(evTrans.title ? evTrans.title.split(' - ')[0] : seoDict.h1);
    let qaStr = inject(evTrans.quick_answer || seoDict.quick_answer);
    let metaDesc = inject(evTrans.description || seoDict.desc_default) || `Countdown to ${eventName}.`;
    
    // FAQ Generation
    const faqData = evTrans.faq || [
        { question: seoDict.faq_1_q, answer: seoDict.faq_1_a },
        { question: seoDict.faq_2_q, answer: seoDict.faq_2_a }
    ];
    const faqHtml = faqData.map(f => `
        <div class="faq-item">
            <h3 class="faq-question">${inject(f.question)}</h3>
            <p class="faq-answer">${inject(f.answer)}</p>
        </div>
    `).join('');

    // Enriched content blocks
    const contentSummary = inject(evTrans.summary);
    const contentHistory = inject(evTrans.history);
    const contentWhy = inject(evTrans.why_people_search);

    // Build related events HTML
    const nowMs = Date.now();
    const sortedUpcoming = [...allEvents].map(e => {
        let tDate = '';
        if (e.month && e.day && e.type !== 'year') tDate = DateUtils.getNextFixedOccurrence(e.month, e.day);
        else if (e.rule) tDate = DateUtils.resolveVariableRule(e.rule, e.fallback_dates, new Date(nowMs).getFullYear().toString());
        else if (e.type === 'year' && e.year_offset) tDate = DateUtils.getYearStart(e.year_offset);
        else if (e.type === 'day' && e.day_of_week !== undefined) tDate = DateUtils.getNextDayOfWeek(e.day_of_week);
        return { ...e, targetTime: tDate ? new Date(tDate).getTime() : 0 };
    }).filter(e => e.targetTime > nowMs).sort((a, b) => a.targetTime - b.targetTime);
    
    let related = sortedUpcoming.filter(e => e.slug !== eventConfig.slug && e.type === eventConfig.type).slice(0, 4);
    if (related.length < 4) {
        const fill = sortedUpcoming.filter(e => e.slug !== eventConfig.slug && !related.find(r => r.slug === e.slug)).slice(0, 4 - related.length);
        related = [...related, ...fill];
    }
    
    const relatedHtml = related.map(rel => {
        const rName = getVal(dict, rel.name_key) || getVal(enDict, rel.name_key) || rel.slug;
        return `
            <div class="event-card">
                <h3 class="card-title">${rName}</h3>
                <a href="/${lang}/how-many-days-until-${rel.slug}/" class="btn btn-secondary">${getVal(dict, 'ui.view_event') || 'View'}</a>
            </div>
        `;
    }).join('');

    return `<!DOCTYPE html>
<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${titleStr}</title>
    <meta name="description" content="${metaDesc}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://dayzo.com/${lang}/how-many-days-until-${eventConfig.slug}/">
    <meta property="og:title" content="${titleStr}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:site_name" content="Dayzo">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${titleStr}">
    <meta name="twitter:description" content="${metaDesc}">
    <meta name="twitter:image" content="https://dayzo.com/images/og-preview.png">
    <meta property="og:image" content="https://dayzo.com/images/og-preview.png">
    <meta name="robots" content="index, follow">
    ${canonical}
    ${hreflangTags}
    <script type="application/ld+json">${JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Event",
        "name": eventName,
        "startDate": targetDate,
        "url": `https://dayzo.com/${lang}/how-many-days-until-${eventConfig.slug}/`,
        "description": metaDesc,
        "organizer": { "@type": "Organization", "name": "Dayzo", "url": "https://dayzo.com/" }
    })}</script>
    <link rel="stylesheet" href="/css/variables.css">
    <link rel="stylesheet" href="/css/base.css">
    ${lang === 'ar' ? '<link rel="stylesheet" href="/css/rtl.css">' : ''}
    <link rel="stylesheet" href="/css/seo-page.css">
    <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.0/build/qrcode.min.js"></script>
    <script type="module" src="/js/core/theme.js"></script>
    <script type="module" src="/js/core/lang-switcher.js"></script>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX" crossorigin="anonymous"></script>
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
        <header class="seo-header">
            <h1 id="seo-h1" class="seo-h1">${h1Str}</h1>
            <div class="next-occurrence" id="next-occurrence-text">${inject(seoDict.next_occurrence)}</div>
        </header>

        <section class="countdown-hero">
            <div class="countdown-segment">
                <span class="countdown-value" id="cd-days">${initialDays}</span>
                <span class="countdown-label" data-i18n="ui.days">${getVal(dict, 'ui.days') || 'Days'}</span>
            </div>
            <div class="countdown-segment">
                <span class="countdown-value" id="cd-hours">00</span>
                <span class="countdown-label" data-i18n="ui.hours">${getVal(dict, 'ui.hours') || 'Hours'}</span>
            </div>
            <div class="countdown-segment">
                <span class="countdown-value" id="cd-minutes">00</span>
                <span class="countdown-label" data-i18n="ui.minutes">${getVal(dict, 'ui.minutes') || 'Minutes'}</span>
            </div>
            <div class="countdown-segment">
                <span class="countdown-value" id="cd-seconds">00</span>
                <span class="countdown-label" data-i18n="ui.seconds">${getVal(dict, 'ui.seconds') || 'Seconds'}</span>
            </div>
        </section>

        <div class="ad-unit">
          <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-XXXXXXXXXX" data-ad-slot="XXXXXXXXXX" data-ad-format="auto" data-full-width-responsive="true"></ins>
          <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

        <div class="quick-answer">
            <p id="quick-answer-text">${qaStr}</p>
        </div>

        <div class="hero-actions">
            <a href="/${lang}/tv/?title=${encodeURIComponent(eventName)}&date=${encodeURIComponent(targetDate)}" id="tv-mode-btn" class="btn btn-secondary" data-i18n="ui.tv_mode">📺 ${getVal(dict, 'ui.tv_mode') || 'TV Mode'}</a>
            <a href="/${lang}/live/?title=${encodeURIComponent(eventName)}&date=${encodeURIComponent(targetDate)}" id="live-mode-btn" class="btn btn-secondary" style="margin-left: 8px;" data-i18n="ui.live_mode">🎉 ${getVal(dict, 'ui.live_mode') || 'Live Mode'}</a>
        </div>

        <p id="event-desc" class="event-description">${metaDesc}</p>

        <section class="enriched-content">
            <div class="content-block">
                <h2 class="section-title" data-i18n="ui.about_event">${getVal(dict, 'ui.about_event') || 'About the Event'}</h2>
                <div id="content-summary" class="content-text">${contentSummary || metaDesc}</div>
            </div>
            ${contentHistory ? `
            <div class="content-block">
                <h2 class="section-title" data-i18n="ui.event_history">${getVal(dict, 'ui.event_history') || 'History and Context'}</h2>
                <div id="content-history" class="content-text">${contentHistory}</div>
            </div>` : ''}
            ${contentWhy ? `
            <div class="content-block">
                <h2 class="section-title" data-i18n="ui.why_search">${getVal(dict, 'ui.why_search') || 'Why People Search'}</h2>
                <div id="content-why" class="content-text">${contentWhy}</div>
            </div>` : ''}
        </section>

        <div class="ad-unit">
          <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-XXXXXXXXXX" data-ad-slot="XXXXXXXXXX" data-ad-format="auto" data-full-width-responsive="true"></ins>
          <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

        <section class="share-embed-section">
            <h2 class="section-title" data-i18n="ui.share">${getVal(dict, 'ui.share') || 'Share'}</h2>
            <div class="share-row">
                <input type="text" readonly class="share-input" id="share-input-url" value="https://dayzo.com/${lang}/how-many-days-until-${eventConfig.slug}/" onclick="this.select()">
                <button class="btn btn-primary" id="btn-copy-url" data-i18n="ui.copy">${getVal(dict, 'ui.copy') || 'Copy'}</button>
            </div>
            <div style="margin-top: 16px; display: flex; align-items: center; gap: 16px;">
                <div id="qrcode-container" style="background: white; padding: 8px; border-radius: 8px; display: inline-block;"></div>
                <div style="font-size: 0.85rem; opacity: 0.8;">
                    <strong data-i18n="ui.qr_placeholder">${getVal(dict, 'ui.qr_placeholder') || 'Scan to view'}</strong><br>
                    <span data-i18n="ui.qr_desc">${getVal(dict, 'ui.qr_desc') || 'Works on mobile devices.'}</span>
                </div>
            </div>
            <h2 class="section-title" style="margin-top: 24px;" data-i18n="ui.embed">${getVal(dict, 'ui.embed') || 'Embed'}</h2>
            <div class="share-row">
                <input type="text" id="embed-code-input" readonly class="share-input" value='<iframe src="https://dayzo.com/${lang}/embed?title=${encodeURIComponent(eventName)}&date=${encodeURIComponent(targetDate)}" width="300" height="150" style="border:none; border-radius:8px;" allowfullscreen></iframe>' style="font-family: monospace; font-size: 0.8rem;" onclick="this.select()">
                <button class="btn btn-secondary" onclick="navigator.clipboard.writeText(document.getElementById('embed-code-input').value)" data-i18n="ui.copy">${getVal(dict, 'ui.copy') || 'Copy'}</button>
            </div>
        </section>

        <section class="faq-section">
            <h2 class="section-title" data-i18n="ui.faq_title">${getVal(dict, 'ui.faq_title') || 'FAQ'}</h2>
            ${faqHtml}
        </section>

        <section class="related-countdowns" id="related">
            <h2 class="section-title" data-i18n="ui.related_countdowns">${getVal(dict, 'ui.related_countdowns') || 'Related'}</h2>
            <div id="related-events-grid" class="events-grid">${relatedHtml}</div>
        </section>

        <section class="create-cta-section">
            <div class="create-cta-card">
                <h2 data-i18n="ui.create_your_own">${getVal(dict, 'ui.create_your_own') || 'Create your own'}</h2>
                <p data-i18n="ui.create_desc">${getVal(dict, 'ui.create_desc') || 'Start now.'}</p>
                <a href="/${lang}/create-live" class="btn btn-primary" data-i18n="ui.create_cta">${getVal(dict, 'ui.create_cta') || 'Go'}</a>
            </div>
        </section>
    </main>
    <script type="module" src="/js/pages/seo-page.js"></script>
</body>
</html>`;
};

langs.forEach(lang => {
    allEvents.forEach(evt => {
        const routePath = path.join(baseDir, lang, `how-many-days-until-${evt.slug}`);
        if (!fs.existsSync(routePath)) {
            fs.mkdirSync(routePath, { recursive: true });
        }
        
        fs.writeFileSync(path.join(routePath, 'index.html'), template(lang, evt));
    });
});
console.log(`Generated ${langs.length * allEvents.length} distinct SEO pages statically.`);
