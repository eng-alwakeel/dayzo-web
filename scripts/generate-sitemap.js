const fs = require('fs');
const path = require('path');

const langs = ["en", "es", "pt", "fr", "de", "ar", "hi", "id", "zh"];
const baseDir = process.cwd();

// Load datasets
const globalEvents = JSON.parse(fs.readFileSync(path.join(baseDir, 'content', 'events_global.json'), 'utf8'));
const variableEvents = JSON.parse(fs.readFileSync(path.join(baseDir, 'content', 'events_variable.json'), 'utf8'));
const localEvents = JSON.parse(fs.readFileSync(path.join(baseDir, 'content', 'events_local.json'), 'utf8'));
const seasonsEvents = fs.existsSync(path.join(baseDir, 'content', 'events_seasons.json')) ? JSON.parse(fs.readFileSync(path.join(baseDir, 'content', 'events_seasons.json'), 'utf8')) : [];
const yearsEvents = fs.existsSync(path.join(baseDir, 'content', 'events_years.json')) ? JSON.parse(fs.readFileSync(path.join(baseDir, 'content', 'events_years.json'), 'utf8')) : [];
const daysEvents = fs.existsSync(path.join(baseDir, 'content', 'events_days.json')) ? JSON.parse(fs.readFileSync(path.join(baseDir, 'content', 'events_days.json'), 'utf8')) : [];

const allConfigs = [...globalEvents, ...variableEvents, ...localEvents, ...seasonsEvents, ...yearsEvents, ...daysEvents];
// Deduplicate
const allEvents = Array.from(new Map(allConfigs.map(item => [item.slug, item])).values());

const today = new Date().toISOString().split('T')[0];
const baseUrl = 'https://dayzo.com';

let sitemapStr = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

// Homepage
langs.forEach(lang => {
    sitemapStr += `  <url>\n    <loc>${baseUrl}/${lang}/</loc>\n`;
    sitemapStr += `    <lastmod>${today}</lastmod>\n`;
    langs.forEach(l => {
        sitemapStr += `    <xhtml:link rel="alternate" hreflang="${l}" href="${baseUrl}/${l}/" />\n`;
    });
    sitemapStr += `    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en/" />\n`;
    sitemapStr += `  </url>\n`;
});

// Event Pages
allEvents.forEach(evt => {
    langs.forEach(lang => {
        const url = `${baseUrl}/${lang}/how-many-days-until-${evt.slug}/`;
        sitemapStr += `  <url>\n    <loc>${url}</loc>\n`;
        sitemapStr += `    <lastmod>${today}</lastmod>\n`;
        // Hreflang logic
        langs.forEach(l => {
            sitemapStr += `    <xhtml:link rel="alternate" hreflang="${l}" href="${baseUrl}/${l}/how-many-days-until-${evt.slug}/" />\n`;
        });
        sitemapStr += `    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en/how-many-days-until-${evt.slug}/" />\n`;
        sitemapStr += `  </url>\n`;
    });
});

sitemapStr += `</urlset>`;

const outputPath = path.join(baseDir, 'sitemap.xml');
fs.writeFileSync(outputPath, sitemapStr);
console.log(`Generated sitemap.xml with ${langs.length + (langs.length * allEvents.length)} URLs`);
