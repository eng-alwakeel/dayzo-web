const fs = require('fs');
const path = require('path');
const https = require('https');

const baseDir = process.cwd();
const contentPath = path.join(baseDir, 'content', 'events_content.json');

// Helper to fetch from Wikipedia
function fetchWikipediaSummary(title) {
    return new Promise((resolve, reject) => {
        const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const json = JSON.parse(data);
                        resolve(json.extract);
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    reject(new Error(`Status: ${res.statusCode}`));
                }
            });
        }).on('error', reject);
    });
}

async function enrich() {
    console.log('🔍 Enriching event content...');
    
    let localContent = {};
    if (fs.existsSync(contentPath)) {
        localContent = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
    }

    const datasets = [
        'events_global.json',
        'events_variable.json',
        'events_local.json',
        'events_seasons.json',
        'events_years.json',
        'events_days.json'
    ];

    const allSlugs = [];
    datasets.forEach(file => {
        const p = path.join(baseDir, 'content', file);
        if (fs.existsSync(p)) {
            const data = JSON.parse(fs.readFileSync(p, 'utf8'));
            data.forEach(e => allSlugs.push({ slug: e.slug, name_key: e.name_key }));
        }
    });

    let updated = false;

    for (const item of allSlugs) {
        if (!localContent[item.slug]) {
            console.log(`Fetching Wikipedia for: ${item.slug}`);
            try {
                // Try Wikipedia with slug first, then clean it up
                const wikiTitle = item.slug.replace(/-/g, '_');
                const summary = await fetchWikipediaSummary(wikiTitle);
                
                localContent[item.slug] = {
                    summary: summary,
                    history: "", // Will be filled by AI or manual later
                    why_people_search: `People search for the ${item.slug.replace(/-/g, ' ')} countdown to track exactly how much time remains until this event begins, helping with planning and anticipation.`
                };
                updated = true;
                console.log(`✅ Found Wikipedia summary for ${item.slug}`);
            } catch (e) {
                console.log(`❌ No Wikipedia for ${item.slug}, assigning AI fallback placeholder`);
                // Level 3 - AI Fallback (In a real system, we'd hit an LLM API here. 
                // For this implementation, we provide a structured AI-style fallback)
                localContent[item.slug] = {
                  summary: `The ${item.slug.replace(/-/g, ' ')} is a highly anticipated event that recurringly brings community and interest. It represents a significant marker in the calendar for many people worldwide.`,
                  history: `The historical context of ${item.slug.replace(/-/g, ' ')} is rooted in cultural, religious, or seasonal traditions that have evolved over many generations.`,
                  why_people_search: `People search for a countdown to ${item.slug.replace(/-/g, ' ')} because it is a time-sensitive occurrence. Having a live timer helps in managing schedules, preparing celebrations, and building excitement as the date approaches.`
                };
                updated = true;
            }
        }
    }

    if (updated) {
        fs.writeFileSync(contentPath, JSON.stringify(localContent, null, 2));
        console.log('✅ Content enrichment complete.');
    } else {
        console.log('✨ All content is already enriched.');
    }
}

enrich();
