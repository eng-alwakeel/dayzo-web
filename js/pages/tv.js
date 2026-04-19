import { I18nLoader } from '../core/i18n.js';
import { CountdownEngine } from '../core/countdown.js';
import { Confetti } from '../core/confetti.js';
import { ThemeManager } from '../core/theme.js';

let dictionary = {};
let lang = 'en';

async function init() {
    lang = I18nLoader.applyLayoutDirection();
    dictionary = await I18nLoader.loadDictionary(lang);
    translateStaticDom();
    await hydrateFromQuery();
    loadQr();
    ThemeManager.bindToggleSwitch('theme-toggle', dictionary);
}

async function hydrateFromQuery() {
    const params = new URLSearchParams(window.location.search);
    
    const title = params.get('title') || dictionary.ui?.events || 'Countdown';
    const dateStr = params.get('date');
    let bgUrl = params.get('bg');
    const logoUrl = params.get('logo');
    let color = params.get('color') || '#6C4CF1';
    let textColor = params.get('textColor');
    let numColor = params.get('numColor');
    let font = params.get('font');
    let titleSize = params.get('titleSize');
    let numSize = params.get('numSize');
    let showQr = params.get('qr') !== 'false';
    const templateSlug = params.get('template');

    // Fetch and check templates first
    if (templateSlug) {
        try {
            const [tReq, pReq] = await Promise.all([
                fetch('/data/templates.json').catch(() => null),
                fetch('/data/personal_templates.json').catch(() => null)
            ]);
            let templates = tReq ? await tReq.json() : [];
            let personal = pReq ? await pReq.json() : [];
            const allTemplates = [...templates, ...personal];
            const tmpl = allTemplates.find(t => t.id === templateSlug);
            
            if (tmpl) {
                if (tmpl.color && !params.get('color')) color = tmpl.color;
                if ((tmpl.bgUrl || tmpl.thumbnail) && !params.get('bg')) bgUrl = tmpl.bgUrl || tmpl.thumbnail;
                if (tmpl.textColor && !params.get('textColor')) textColor = tmpl.textColor;
                if (tmpl.numColor && !params.get('numColor')) numColor = tmpl.numColor;
                if (tmpl.font && !params.get('font')) font = tmpl.font;
                if (tmpl.previewGradient && !bgUrl) {
                    const bgEl = document.getElementById('tv-bg');
                    if (bgEl) bgEl.style.background = tmpl.previewGradient;
                }
                if (tmpl.rules && tmpl.rules.qrVisible === false) {
                    showQr = false;
                }
            }
        } catch(e) { console.error("Could not fetch template data", e); }
    }

    document.title = `${title} - Dayzo TV`;
    document.getElementById('tv-title').textContent = title;
    document.documentElement.style.setProperty('--color-primary', color);
    if (textColor) document.documentElement.style.setProperty('--color-text', textColor);
    if (numColor) document.documentElement.style.setProperty('--color-numbers', numColor);
    if (font) document.documentElement.style.setProperty('--font-family-sans', font);
    if (titleSize) document.documentElement.style.setProperty('--font-size-title-tv', `${titleSize}vh`);
    if (numSize) document.documentElement.style.setProperty('--font-size-num-tv', `${numSize}vh`);

    if (!showQr) {
        const qrBox = document.querySelector('.tv-qr-region');
        if (qrBox) qrBox.style.display = 'none';
    }

    if (bgUrl) {
        document.getElementById('tv-bg').style.backgroundImage = `url('${bgUrl}')`;
    }

    if (logoUrl) {
        const logoImg = document.getElementById('tv-logo');
        logoImg.src = logoUrl;
        logoImg.style.display = 'block';
    }

    if (!dateStr) return;
    
    const elWrap = document.getElementById('tv-countdown-wrap');
    const elFinished = document.getElementById('tv-finished-text');
    const elFinal10 = document.getElementById('tv-final-10');
    const elFinalNum = document.getElementById('tv-final-num');

    const elDays = document.getElementById('tv-days');
    const elHours = document.getElementById('tv-hours');
    const elMins = document.getElementById('tv-minutes');
    const elSecs = document.getElementById('tv-seconds');
    
    const engine = new CountdownEngine(dateStr, (state) => {
        const totalSecsLeft = (new Date(dateStr).getTime() - Date.now()) / 1000;
        
        if (state.isFinished || totalSecsLeft <= 0) {
            elWrap.style.display = 'none';
            elFinal10.style.display = 'none';
            elFinished.style.display = 'block';
            if (elFinished.getAttribute('data-fired') !== 'true') {
                Confetti.fire();
                elFinished.setAttribute('data-fired', 'true');
            }
            return;
        }

        // Final 10 seconds mode
        if (totalSecsLeft <= 10.5 && totalSecsLeft > 0) {
            elWrap.style.display = 'none';
            elFinal10.style.display = 'flex';
            const num = Math.ceil(totalSecsLeft);
            elFinalNum.textContent = num;
            if (!elFinalNum.classList.contains('tv-pulse')) {
                elFinalNum.classList.add('tv-pulse');
            }
        } else {
            // Normal mode
            elWrap.style.display = 'flex';
            elFinal10.style.display = 'none';
            const pad = n => n.toString().padStart(2, '0');
            elDays.textContent = pad(state.days);
            elHours.textContent = pad(state.hours);
            elMins.textContent = pad(state.minutes);
            elSecs.textContent = pad(state.seconds);
        }
    });
    engine.start();
}

function loadQr() {
    const qrCanvas = document.getElementById('tv-qr-canvas');
    if (!qrCanvas || typeof window.QRCode === 'undefined') return;
    
    window.QRCode.toCanvas(qrCanvas, window.location.href, { 
        width: 120, 
        margin: 0, 
        color: { dark: '#000000', light: '#ffffff' } 
    }, (err) => {
        if (err) console.error("QR Error", err);
    });
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
