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
    hydrateFromQuery();
    loadQr();
    setupAutoTvMode();
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
    const cta = params.get('cta');
    const link = params.get('link');
    const video = params.get('video');
    const templateSlug = params.get('template');
    
    // Personal fields
    const personalName = params.get('name');
    const message = params.get('msg');
    const photoUrl = params.get('photo');

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
                
                // Template specific behavior
                if (tmpl.rules && tmpl.rules.qrVisible === false) {
                    showQr = false;
                }
            }
        } catch(e) { console.error("Could not fetch template data", e); }
    }

    document.title = `${title} - Dayzo Live`;
    document.getElementById('live-title').textContent = title;
    document.documentElement.style.setProperty('--color-primary', color);
    if (textColor) document.documentElement.style.setProperty('--color-text', textColor);
    if (numColor) document.documentElement.style.setProperty('--color-numbers', numColor);
    if (font) document.documentElement.style.setProperty('--font-family-sans', font);
    if (titleSize) document.documentElement.style.setProperty('--font-size-title', `${titleSize}vh`);
    if (numSize) document.documentElement.style.setProperty('--font-size-num', `${numSize}vh`);

    if (!showQr) {
        const qrBox = document.querySelector('.live-qr-box');
        if (qrBox) qrBox.style.display = 'none';
    }

    // Update TV Mode button
    const tvBtn = document.getElementById('live-to-tv-btn');
    if (tvBtn) {
        tvBtn.href = `/${lang}/tv/?${params.toString()}`;
    }

    if (bgUrl) {
        document.getElementById('live-bg').style.backgroundImage = `url('${bgUrl}')`;
    }

    if (logoUrl) {
        const logoImg = document.getElementById('live-logo');
        logoImg.src = logoUrl;
        logoImg.style.display = 'block';
    }

    if (cta && link) {
        const ctaBtn = document.getElementById('live-cta-btn');
        ctaBtn.textContent = cta;
        ctaBtn.href = link;
        ctaBtn.style.display = 'inline-block';
    }

    if (video) {
        // Very basic iframe logic for demo, usually requires strict sanitization
        const videoEmbed = document.getElementById('live-video');
        videoEmbed.innerHTML = `<iframe width="560" height="315" src="${video}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
        videoEmbed.style.display = 'block';
    }

    // Personal content injection
    if (personalName || message || photoUrl) {
        let personalContainer = document.getElementById('personal-content');
        if (!personalContainer) {
            personalContainer = document.createElement('div');
            personalContainer.id = 'personal-content';
            personalContainer.className = 'personal-content-box';
            document.querySelector('.live-content').appendChild(personalContainer);
        }
        
        personalContainer.innerHTML = `
            ${personalName ? `<h2 class="personal-name">${personalName}</h2>` : ''}
            ${photoUrl ? `<div class="personal-photo"><img src="${photoUrl}" alt="${personalName || ''}"></div>` : ''}
            ${message ? `<p class="personal-message">${message}</p>` : ''}
        `;
    }

    if (!dateStr) return; // Halt if no date
    
    // Engine mapping
    const elWrap = document.getElementById('live-countdown-wrap');
    const elFinished = document.getElementById('live-finished-text');
    const elFinal10 = document.getElementById('live-final-10');
    const elFinalNum = document.getElementById('live-final-num');

    const elDays = document.getElementById('live-days');
    const elHours = document.getElementById('live-hours');
    const elMins = document.getElementById('live-minutes');
    const elSecs = document.getElementById('live-seconds');
    
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
            if (!elFinalNum.classList.contains('pulse')) {
                elFinalNum.classList.add('pulse');
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
    const qrCanvas = document.getElementById('live-qr-canvas');
    if (!qrCanvas || typeof window.QRCode === 'undefined') return;
    
    window.QRCode.toCanvas(qrCanvas, window.location.href, { 
        width: 80, 
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
        if (val) {
            if (el.tagName === 'INPUT' && el.type === 'text') el.placeholder = val;
            else el.textContent = val;
        }
    });
}

function setupAutoTvMode() {
    // Landscape on mobile/tablet triggers auto TV mode
    // Using max-height as a proxy for landscape orientation on a small device
    // Alternatively, rely on orientation media feature
    const mediaQuery = window.matchMedia("(max-width: 1024px) and (max-height: 500px) and (orientation: landscape)");

    const handleOrientationChange = (e) => {
        if (e.matches) {
            document.body.classList.add('tv-mode');
        } else {
            document.body.classList.remove('tv-mode');
        }
    };

    // Initial check
    handleOrientationChange(mediaQuery);
    // Listen for changes
    mediaQuery.addEventListener('change', handleOrientationChange);
}

document.addEventListener('DOMContentLoaded', init);
