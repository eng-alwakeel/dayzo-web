import { I18nLoader } from '../core/i18n.js';
import { DateUtils } from '../core/date-utils.js';
import { CountdownEngine } from '../core/countdown.js';
import { ThemeManager } from '../core/theme.js';

let dictionary = {};
let allEventsCache = [];
let trendingSlugs = [];
let localSlugs = [];
let personalTemplatesCache = [];
let activeCountdowns = []; 

async function init() {
    const lang = I18nLoader.applyLayoutDirection();
    dictionary = await I18nLoader.loadDictionary(lang);
    
    translateDom();
    startLocalClock();
    
    // Load datasets
    await loadData();
    await loadPersonalTemplates();
    
    renderSections(lang);
    renderPersonalTemplates(lang);
    setupSearch(lang);
    ThemeManager.bindToggleSwitch('theme-toggle', dictionary);
}

function translateDom() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const val = I18nLoader.getSafeVal(key, dictionary);
        if (val) {
            if (el.tagName === 'INPUT' && el.type === 'text') {
                el.placeholder = val;
            } else {
                el.textContent = val;
            }
        }
    });
}

function startLocalClock() {
    const target = document.getElementById('base-clock');
    if (!target) return;
    
    const update = () => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
        // Split "AM 07:13:00" or "07:13:00 AM" depending on locale
        const parts = timeStr.split(' ');
        if (parts.length === 2) {
            const isAmPmFirst = isNaN(parseInt(parts[0]));
            if (isAmPmFirst) {
                target.innerHTML = `<span class="clock-ampm">${parts[0]}</span> ${parts[1]}`;
            } else {
                target.innerHTML = `${parts[0]} <span class="clock-ampm">${parts[1]}</span>`;
            }
        } else {
            target.textContent = timeStr;
        }
    };
    update();
    setInterval(update, 1000);
}

async function loadData() {
    try {
        const [globalReq, variableReq, localReq, trendingReq, countryReq, seasonsReq, yearsReq, daysReq] = await Promise.all([
            fetch('/content/events_global.json').catch(() => null),
            fetch('/content/events_variable.json').catch(() => null),
            fetch('/content/events_local.json').catch(() => null),
            fetch('/data/trending.json').catch(() => null),
            fetch('/content/events_by_country.json').catch(() => null),
            fetch('/content/events_seasons.json').catch(() => null),
            fetch('/content/events_years.json').catch(() => null),
            fetch('/content/events_days.json').catch(() => null)
        ]);

        const global = globalReq ? await globalReq.json() : [];
        const variable = variableReq ? await variableReq.json() : [];
        const local = localReq ? await localReq.json() : [];
        trendingSlugs = trendingReq ? await trendingReq.json() : [];
        const countryMap = countryReq ? await countryReq.json() : {};
        const seasons = seasonsReq ? await seasonsReq.json() : [];
        const years = yearsReq ? await yearsReq.json() : [];
        const days = daysReq ? await daysReq.json() : [];

        // Detect user country from IANA timezone
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
        const TZ_COUNTRY = {
            "Africa/Cairo":"EG","Africa/Lagos":"NG","Africa/Johannesburg":"ZA","Africa/Nairobi":"KE","Africa/Accra":"GH","Africa/Casablanca":"MA","Africa/Tunis":"TN","Africa/Algiers":"DZ",
            "America/New_York":"US","America/Chicago":"US","America/Denver":"US","America/Los_Angeles":"US","America/Phoenix":"US","America/Anchorage":"US","America/Honolulu":"US",
            "America/Toronto":"CA","America/Vancouver":"CA","America/Montreal":"CA","America/Edmonton":"CA","America/Winnipeg":"CA",
            "America/Sao_Paulo":"BR","America/Manaus":"BR","America/Fortaleza":"BR","America/Recife":"BR",
            "America/Mexico_City":"MX","America/Monterrey":"MX","America/Tijuana":"MX",
            "America/Argentina/Buenos_Aires":"AR","America/Argentina/Cordoba":"AR",
            "America/Bogota":"CO","America/Lima":"PE","America/Santiago":"CL","America/Caracas":"VE",
            "America/Havana":"CU","America/Santo_Domingo":"DO",
            "Asia/Riyadh":"SA","Asia/Dubai":"AE","Asia/Qatar":"QA","Asia/Kuwait":"KW","Asia/Bahrain":"BH","Asia/Muscat":"OM","Asia/Aden":"YE",
            "Asia/Baghdad":"IQ","Asia/Beirut":"LB","Asia/Damascus":"SY","Asia/Amman":"JO",

            "Asia/Kolkata":"IN","Asia/Calcutta":"IN",
            "Asia/Jakarta":"ID","Asia/Makassar":"ID","Asia/Jayapura":"ID",
            "Asia/Tokyo":"JP",
            "Asia/Shanghai":"CN","Asia/Hong_Kong":"HK","Asia/Macau":"MO","Asia/Urumqi":"CN",
            "Asia/Seoul":"KR",
            "Asia/Bangkok":"TH",
            "Asia/Ho_Chi_Minh":"VN","Asia/Hanoi":"VN",
            "Asia/Karachi":"PK",
            "Asia/Dhaka":"BD",
            "Asia/Manila":"PH",
            "Asia/Kuala_Lumpur":"MY","Asia/Kuching":"MY",
            "Asia/Singapore":"SG",
            "Asia/Tehran":"IR",
            "Asia/Istanbul":"TR",
            "Asia/Jerusalem":"IL","Asia/Tel_Aviv":"IL",
            "Asia/Colombo":"LK","Asia/Kathmandu":"NP",
            "Asia/Rangoon":"MM","Asia/Yangon":"MM",
            "Asia/Tashkent":"UZ","Asia/Almaty":"KZ",
            "Australia/Sydney":"AU","Australia/Melbourne":"AU","Australia/Brisbane":"AU","Australia/Perth":"AU","Australia/Adelaide":"AU",
            "Pacific/Auckland":"NZ","Pacific/Chatham":"NZ",
            "Europe/London":"GB","Europe/Dublin":"IE",
            "Europe/Paris":"FR",
            "Europe/Berlin":"DE","Europe/Vienna":"AT","Europe/Zurich":"CH",
            "Europe/Madrid":"ES",
            "Europe/Rome":"IT",
            "Europe/Lisbon":"PT",
            "Europe/Amsterdam":"NL","Europe/Brussels":"BE",
            "Europe/Warsaw":"PL","Europe/Prague":"CZ","Europe/Budapest":"HU","Europe/Bratislava":"SK",
            "Europe/Moscow":"RU","Europe/Kaliningrad":"RU","Europe/Samara":"RU","Asia/Yekaterinburg":"RU",
            "Europe/Stockholm":"SE","Europe/Oslo":"NO","Europe/Copenhagen":"DK","Europe/Helsinki":"FI",
            "Europe/Athens":"GR","Europe/Bucharest":"RO","Europe/Sofia":"BG",
            "Europe/Kiev":"UA","Europe/Kyiv":"UA",
        };
        const userCountry = TZ_COUNTRY[tz] || "ZZ";

        // Collect slugs for local events based on country map
        if (countryMap[userCountry]) {
            localSlugs = countryMap[userCountry];
        } else if (countryMap["ZZ"]) {
            localSlugs = countryMap["ZZ"]; // Fallback generic
        }

        // Normalize Fixed vs Variable and combine
        const normalizeFixed = (arr) => arr.map(e => ({
            ...e,
            targetDate: DateUtils.getNextFixedOccurrence(e.month, e.day)
        }));

        const normalizeVariable = (arr) => arr.map(e => ({
            ...e,
            targetDate: DateUtils.resolveVariableRule(e.rule, e.fallback_dates, new Date().getFullYear().toString())
        }));

        // Variable items might be mixed in local too
        const fixedLocal = local.filter(e => e.month);
        const varLocal = local.filter(e => e.rule);

        // Normalize specific types
        const normalizeYears = (arr) => arr.map(e => ({
            ...e,
            targetDate: DateUtils.getYearStart(e.year_offset)
        }));

        const normalizeDays = (arr) => arr.map(e => ({
            ...e,
            targetDate: DateUtils.getNextDayOfWeek(e.day_of_week)
        }));

        allEventsCache = [
            ...normalizeFixed(global), 
            ...normalizeVariable(variable),
            ...normalizeFixed(fixedLocal),
            ...normalizeVariable(varLocal),
            ...normalizeFixed(seasons),
            ...normalizeYears(years),
            ...normalizeDays(days)
        ].filter(e => e.targetDate);

    } catch (e) {
        console.error("Failed to load events", e);
    }
}


async function loadPersonalTemplates() {
    try {
        const req = await fetch('/data/personal_templates.json').catch(() => null);
        if (req) personalTemplatesCache = await req.json();
    } catch(e) { console.error("Failed to load personal templates", e); }
}

function renderEventCards(containerId, events, lang) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = ''; // clear

    events.forEach(event => {
        const nameKeys = event.name_key.split('.');
        const name = dictionary[nameKeys[0]]?.[nameKeys[1]] || event.slug;
        
        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
            <div>
                <h3 class="card-title">${name}</h3>
                <div class="card-date">${new Date(event.targetDate).toLocaleDateString(lang, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</div>
            </div>
            <div class="card-countdown" id="cd-${event.slug}">00:00:00</div>
            <div>
                <a href="/${lang}/how-many-days-until-${event.slug}/" class="btn">${dictionary.ui?.view_event || 'View'}</a>
            </div>
        `;
        container.appendChild(card);

        // Start countdown engine
        const cdNode = card.querySelector('.card-countdown');
        const engine = new CountdownEngine(event.targetDate, (state) => {
            if (state.isFinished) {
                cdNode.textContent = '00:00:00';
                return;
            }
            // Format 00:00:00:00
            cdNode.textContent = `${pad(state.days)}:${pad(state.hours)}:${pad(state.minutes)}:${pad(state.seconds)}`;
        });
        engine.start();
        activeCountdowns.push(engine);
    });
}

function pad(num) {
    return num.toString().padStart(2, '0');
}

function renderSections(lang) {
    // 1. Upcoming - 5 closest future events
    const closest = [...allEventsCache]
        .filter(e => !DateUtils.isPast(e.targetDate))
        .sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate))
        .slice(0, 5);
    renderEventCards('upcoming-events-grid', closest, lang);

    // 2. Trending
    if (!trendingSlugs || trendingSlugs.length === 0) {
        trendingSlugs = [...allEventsCache]
            .filter(e => !DateUtils.isPast(e.targetDate) && (e.type === 'holiday' || e.type === 'season'))
            .sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate))
            .slice(0, 5)
            .map(e => e.slug);
    }
    const trending = allEventsCache.filter(e => trendingSlugs.includes(e.slug));
    renderEventCards('trending-events-grid', trending, lang);

    // 3. Popular Locally
    const localEvents = allEventsCache.filter(e => localSlugs.includes(e.slug));
    if (localEvents.length > 0) {
        renderEventCards('local-events-grid', localEvents, lang);
    } else {
        const localSection = document.getElementById('local');
        if (localSection) localSection.style.display = 'none';
    }
}

function renderPersonalTemplates(lang) {
    const container = document.getElementById('personal-templates-grid');
    if (!container || personalTemplatesCache.length === 0) return;

    container.innerHTML = '';
    personalTemplatesCache.forEach(t => {
        const title = I18nLoader.getSafeVal(t.name_key, dictionary) || t.id;
        const desc = I18nLoader.getSafeVal(t.desc_key, dictionary) || '';

        const card = document.createElement('div');
        card.className = 'template-card personal-card';
        card.innerHTML = `
            <div class="template-thumb">
                <img src="${t.thumbnail}" alt="${title}" loading="lazy">
                <div class="template-overlay">
                    <button class="btn btn-preview" data-t-id="${t.id}">${dictionary.ui?.btn_preview || 'Preview'}</button>
                </div>
            </div>
            <div class="template-info">
                <h3 class="template-name">${title}</h3>
                <p class="template-desc">${desc}</p>
                <div class="template-actions">
                    <a href="/${lang}/personal-customize?id=${t.id}" class="btn btn-primary btn-full">${dictionary.ui?.btn_customize || 'Customize'}</a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}


function setupSearch(lang) {
    const input = document.getElementById('event-search-input');
    const container = document.getElementById('search-results-grid');
    if (!input || !container) return;

    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) {
            container.innerHTML = '';
            return;
        }

        const matches = allEventsCache.filter(ev => {
            const nameKeys = ev.name_key.split('.');
            const name = dictionary[nameKeys[0]]?.[nameKeys[1]] || '';
            return name.toLowerCase().includes(query) || ev.slug.replace(/-/g, ' ').includes(query);
        }).slice(0, 5);

        renderEventCards('search-results-grid', matches, lang);
    });
}

document.addEventListener('DOMContentLoaded', init);
