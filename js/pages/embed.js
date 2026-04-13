import { I18nLoader } from '../core/i18n.js';
import { CountdownEngine } from '../core/countdown.js';
import { ThemeManager } from '../core/theme.js';

let dictionary = {};
let lang = 'en';

async function init() {
    lang = I18nLoader.applyLayoutDirection();
    dictionary = await I18nLoader.loadDictionary(lang);
    translateStaticDom();
    hydrateFromQuery();
    // Default theme initialized safely inside ThemeManager
}

async function hydrateFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const title = params.get('title') || dictionary.ui?.events || 'Countdown';
    const dateStr = params.get('date');
    const color = params.get('color');
    const templateSlug = params.get('template');
    
    document.getElementById('embed-title').textContent = title;

    if (color) {
        document.documentElement.style.setProperty('--color-primary', color);
    }

    // Embed-specific templating rules
    if (templateSlug) {
        try {
            const tempsReq = await fetch('/data/templates.json');
            const templates = await tempsReq.json();
            const tmpl = templates.find(t => t.id === templateSlug);
            
            if (tmpl) {
                if (tmpl.color && !color) {
                    document.documentElement.style.setProperty('--color-primary', tmpl.color);
                }
                if (tmpl.bgUrl) {
                    const extBg = document.getElementById('embed-bg');
                    extBg.style.backgroundImage = `url('${tmpl.bgUrl}')`;
                    extBg.style.display = 'block';
                }
            }
        } catch(e) { console.error("Could not fetch template data", e); }
    }

    if (!dateStr) return;

    const elWrap = document.getElementById('embed-countdown-wrap');
    const elFinished = document.getElementById('embed-finished');

    const elDays = document.getElementById('embed-days');
    const elHours = document.getElementById('embed-hours');
    const elMins = document.getElementById('embed-minutes');
    const elSecs = document.getElementById('embed-seconds');
    
    const engine = new CountdownEngine(dateStr, (state) => {
        if (state.isFinished) {
            elWrap.style.display = 'none';
            elFinished.style.display = 'block';
            return;
        }

        const pad = n => n.toString().padStart(2, '0');
        elDays.textContent = pad(state.days);
        elHours.textContent = pad(state.hours);
        elMins.textContent = pad(state.minutes);
        elSecs.textContent = pad(state.seconds);
    });
    engine.start();
}

function translateStaticDom() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const keys = key.split('.');
        let val = dictionary;
        for (const k of keys) {
            val = val ? val[k] : null;
        }
        if (val) el.textContent = val;
    });
}

document.addEventListener('DOMContentLoaded', init);
