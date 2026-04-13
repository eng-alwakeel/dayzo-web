import { I18nLoader } from '../core/i18n.js';
import { DateUtils } from '../core/date-utils.js';
import { CountdownEngine } from '../core/countdown.js';
import { ThemeManager } from '../core/theme.js';

let dictionary = {};
let lang = 'en';
let currentEvent = null;

async function init() {
    lang = I18nLoader.applyLayoutDirection();
    dictionary = await I18nLoader.loadDictionary(lang);
    
    // Parse Slug from location. Example: /en/how-many-days-until-christmas/
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1];
    
    // Safety check
    if (!lastPart || !lastPart.startsWith('how-many-days-until-')) {
        window.location.replace(`/${lang}/`);
        return;
    }

    const slug = lastPart.replace('how-many-days-until-', '');

    await loadEventData(slug);
    translateStaticDom();
    ThemeManager.bindToggleSwitch('theme-toggle', dictionary);
}

async function loadEventData(slug) {
    try {
        const [globalReq, variableReq, localReq, seasonsReq, yearsReq, daysReq] = await Promise.all([
            fetch('/content/events_global.json').catch(() => null),
            fetch('/content/events_variable.json').catch(() => null),
            fetch('/content/events_local.json').catch(() => null),
            fetch('/content/events_seasons.json').catch(() => null),
            fetch('/content/events_years.json').catch(() => null),
            fetch('/content/events_days.json').catch(() => null)
        ]);

        const global = globalReq ? await globalReq.json() : [];
        const variable = variableReq ? await variableReq.json() : [];
        const local = localReq ? await localReq.json() : [];
        const seasons = seasonsReq ? await seasonsReq.json() : [];
        const years = yearsReq ? await yearsReq.json() : [];
        const days = daysReq ? await daysReq.json() : [];

        // Load event-specific translations
        const transReq = await fetch('/content/events_translations.json').catch(() => null);
        const eventTranslations = transReq ? await transReq.json() : {};

        // Find the event
        let eventConfig = global.find(e => e.slug === slug) 
                       || variable.find(e => e.slug === slug) 
                       || local.find(e => e.slug === slug)
                       || seasons.find(e => e.slug === slug)
                       || years.find(e => e.slug === slug)
                       || days.find(e => e.slug === slug);
        
        if (eventConfig) {
            if (eventConfig.month && eventConfig.day && eventConfig.type !== 'year') {
                eventConfig.targetDate = DateUtils.getNextFixedOccurrence(eventConfig.month, eventConfig.day);
            } else if (eventConfig.rule) {
                eventConfig.targetDate = DateUtils.resolveVariableRule(eventConfig.rule, eventConfig.fallback_dates, new Date().getFullYear().toString());
            } else if (eventConfig.type === 'year' && eventConfig.year_offset) {
                eventConfig.targetDate = DateUtils.getYearStart(eventConfig.year_offset);
            } else if (eventConfig.type === 'day' && eventConfig.day_of_week !== undefined) {
                eventConfig.targetDate = DateUtils.getNextDayOfWeek(eventConfig.day_of_week);
            }
        }

        if (!eventConfig || !eventConfig.targetDate) {
            // Not found
            window.location.replace(`/${lang}/`);
            return;
        }

        currentEvent = eventConfig;
        
        // Setup text replacements
        const nameKeys = eventConfig.name_key.split('.');
        const eventName = dictionary[nameKeys[0]]?.[nameKeys[1]] || eventConfig.slug;
        const formattedDate = new Date(eventConfig.targetDate).toLocaleDateString(lang, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
        
        // Basic calculations for initial snapshot filling (Quick Answer)
        const diffMs = new Date(eventConfig.targetDate).getTime() - Date.now();
        const initialDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

        const eventTrans = eventTranslations[slug]?.[lang] || eventTranslations[slug]?.['en'];

        fillTemplateStrings(eventName, formattedDate, initialDays, eventTrans);
        startEngine(eventConfig.targetDate);

        // Set up embed code snippet
        const embedInput = document.getElementById('embed-code-input');
        if (embedInput) {
            const embedUrl = `${window.location.origin}/${lang}/embed?title=${encodeURIComponent(eventName)}&date=${encodeURIComponent(eventConfig.targetDate)}`;
            embedInput.value = `<iframe src="${embedUrl}" width="300" height="150" style="border:none; border-radius:8px;" allowfullscreen></iframe>`;
        }
        
        // Update TV & Live buttons
        const tvBtn = document.getElementById('tv-mode-btn');
        const liveBtn = document.getElementById('live-mode-btn');
        if (tvBtn) tvBtn.href = `/${lang}/tv/?title=${encodeURIComponent(eventName)}&date=${encodeURIComponent(eventConfig.targetDate)}`;
        if (liveBtn) liveBtn.href = `/${lang}/live/?title=${encodeURIComponent(eventName)}&date=${encodeURIComponent(eventConfig.targetDate)}`;

        // QR Code & Share Setup
        setupSharingFlows();

    } catch (e) {
        console.error("Failed to load event data", e);
    }
}

function fillTemplateStrings(eventName, formattedDate, initialDays, eventTrans) {
    // Helper to replace {vars} in a string
    const inject = (str, replacements) => {
        if (!str) return '';
        let res = str;
        for (const [k, v] of Object.entries(replacements)) {
            res = res.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
        }
        return res;
    };

    const dict = dictionary.seo || {};
    const replacements = { event: eventName, date: formattedDate, days: initialDays };

    // Inject DOM text helper
    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el && text) el.textContent = text;
    };

    if (eventTrans) {
        document.title = inject(eventTrans.title, replacements);
        setText('seo-h1', inject(eventTrans.title, replacements).split(' - ')[0]);
        setText('quick-answer-text', inject(eventTrans.quick_answer, replacements));
        setText('next-occurrence-text', inject(dict.next_occurrence || '', replacements));
        setText('event-desc', inject(eventTrans.description, replacements));
        
        // FAQ
        if (eventTrans.faq) {
            setText('faq-1-q', inject(eventTrans.faq[0]?.question, replacements));
            setText('faq-1-a', inject(eventTrans.faq[0]?.answer, replacements));
            setText('faq-2-q', inject(eventTrans.faq[1]?.question, replacements));
            setText('faq-2-a', inject(eventTrans.faq[1]?.answer, replacements));
        }
    } else {
        document.title = inject(dict.h1 || '', replacements) + ' - Dayzo';
        setText('seo-h1', inject(dict.h1 || '', replacements));
        setText('quick-answer-text', inject(dict.quick_answer || '', replacements));
        setText('next-occurrence-text', inject(dict.next_occurrence || '', replacements));
        setText('event-desc', inject(dict.desc_default || '', replacements));
        
        // FAQ fallback to template strings
        setText('faq-1-q', inject(dict.faq_1_q || '', replacements));
        setText('faq-1-a', inject(dict.faq_1_a || '', replacements));
        setText('faq-2-q', inject(dict.faq_2_q || '', replacements));
        setText('faq-2-a', inject(dict.faq_2_a || '', replacements));
    }
    
    // Inject LD-JSON structural metadata
    injectStructuredData(eventName, formattedDate, initialDays);
}

function injectStructuredData(eventName, formattedDate, initialDays) {
    // FAQ Schema
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": document.getElementById('faq-1-q')?.textContent || '',
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": document.getElementById('faq-1-a')?.textContent || ''
                }
            },
            {
                "@type": "Question",
                "name": document.getElementById('faq-2-q')?.textContent || '',
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": document.getElementById('faq-2-a')?.textContent || ''
                }
            }
        ]
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);
}


function startEngine(targetDateIso) {
    const elDays = document.getElementById('cd-days');
    const elHours = document.getElementById('cd-hours');
    const elMins = document.getElementById('cd-minutes');
    const elSecs = document.getElementById('cd-seconds');
    
    const pad = n => n.toString().padStart(2, '0');

    const engine = new CountdownEngine(targetDateIso, (state) => {
        if (state.isFinished) return;
        
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
        if (val) {
            if (el.tagName === 'INPUT' && el.type === 'text') {
                el.placeholder = val;
            } else {
                el.textContent = val;
            }
        }
    });
}

function setupSharingFlows() {
    const urlInput = document.getElementById('share-input-url');
    const copyBtn = document.getElementById('btn-copy-url');
    const shareBtn = document.getElementById('btn-native-share');
    const qrContainer = document.getElementById('qrcode-container');

    if (!urlInput) return;
    const url = urlInput.value;

    // 1. Copy Link Logic
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(url).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(() => copyBtn.textContent = originalText, 2000);
            });
        });
    }

    // 2. Web Share API Logic
    if (navigator.share && shareBtn) {
        shareBtn.style.display = 'inline-block';
        shareBtn.addEventListener('click', () => {
            navigator.share({
                title: document.title,
                url: url
            }).catch(console.error);
        });
    }

    // 3. Generate QR Code
    if (qrContainer && typeof window.QRCode !== 'undefined') {
        qrContainer.innerHTML = '';
        
    const canvas = document.createElement('canvas');
    qrContainer.appendChild(canvas);
    window.QRCode.toCanvas(canvas, url, { width: 96, margin: 0, color: { dark: '#000000', light: '#ffffff' } }, (err) => {
        if (err) console.error(err);
    });

    }
}

document.addEventListener('DOMContentLoaded', init);
