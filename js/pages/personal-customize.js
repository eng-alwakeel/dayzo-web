import { I18nLoader } from '../core/i18n.js';
import { ThemeManager } from '../core/theme.js';

let dictionary = {};
let lang = 'en';
let currentTemplate = null;
let generateAndShow;

const IFRAME_W = 800;
const IFRAME_H = 450;

async function init() {
    lang = I18nLoader.applyLayoutDirection();
    dictionary = await I18nLoader.loadDictionary(lang);

    translateDom();
    ThemeManager.bindToggleSwitch('theme-toggle', dictionary);

    const params = new URLSearchParams(window.location.search);
    const templateId = params.get('id');
    if (templateId) {
        await loadTemplateData(templateId);
    }

    setupForm();
    scalePreviewIframe();
    window.addEventListener('resize', scalePreviewIframe);
}

function scalePreviewIframe() {
    const wrap = document.getElementById('preview-wrap');
    const iframe = document.getElementById('preview-iframe');
    if (!wrap || !iframe) return;
    const scale = wrap.clientWidth / IFRAME_W;
    iframe.style.transform = `scale(${scale})`;
    wrap.style.height = `${Math.round(IFRAME_H * scale)}px`;
}

async function loadTemplateData(id) {
    try {
        const req = await fetch('/data/personal_templates.json');
        const templates = await req.json();
        currentTemplate = templates.find(t => t.id === id);

        if (currentTemplate) {
            document.getElementById('p-template-id').value = id;
            const name = I18nLoader.getSafeVal(currentTemplate.name_key, dictionary) || id;
            document.getElementById('template-info-text').textContent = name;

            if (currentTemplate.thumbnail) {
                document.getElementById('p-bg').value = window.location.origin + currentTemplate.thumbnail;
            }
            if (currentTemplate.color) {
                document.getElementById('p-color').value = currentTemplate.color;
                document.getElementById('p-num-color').value = currentTemplate.color;
            }
            if (currentTemplate.rules && currentTemplate.rules.qrVisible === false) {
                document.getElementById('p-qr').value = 'false';
            }
        }
    } catch(e) { console.error("Failed to load template", e); }
}

function getFormParams() {
    const gv = id => document.getElementById(id)?.value?.trim() ?? '';
    const params = new URLSearchParams();
    const title = gv('p-title');
    const name = gv('p-name');
    const date = gv('p-date');
    const msg = gv('p-msg');
    const photo = gv('p-photo');
    const bg = gv('p-bg');
    const logo = gv('p-logo');
    const color = gv('p-color');
    const cta = gv('p-cta');
    const link = gv('p-link');
    const video = gv('p-video');
    const textColor = gv('p-text-color');
    const numColor = gv('p-num-color');
    const font = gv('p-font');
    const qr = gv('p-qr');
    const titleSize = gv('p-title-size');
    const numSize = gv('p-num-size');
    const templateId = gv('p-template-id');

    if (title) params.set('title', title);
    if (name) params.set('name', name);
    if (date) {
        try { params.set('date', new Date(date).toISOString()); }
        catch(e) { params.set('date', date); }
    }
    if (msg) params.set('msg', msg);
    if (photo) params.set('photo', photo);
    if (bg) params.set('bg', bg);
    if (logo) params.set('logo', logo);
    if (color) params.set('color', color);
    if (cta) params.set('cta', cta);
    if (link) params.set('link', link);
    if (video) params.set('video', video);
    if (textColor) params.set('textColor', textColor);
    if (numColor) params.set('numColor', numColor);
    if (font) params.set('font', font);
    if (qr === 'false') params.set('qr', 'false');
    if (titleSize && titleSize !== '8') params.set('titleSize', titleSize);
    if (numSize && numSize !== '12') params.set('numSize', numSize);
    if (templateId) params.set('template', templateId);

    return params;
}

function getLiveUrl() {
    return `${window.location.origin}/${lang}/live/?${getFormParams().toString()}`;
}

function sendPreviewMessage() {
    const iframe = document.getElementById('preview-iframe');
    if (!iframe?.contentWindow) return;
    const gv = id => document.getElementById(id)?.value?.trim() ?? '';
    iframe.contentWindow.postMessage({
        type: 'DAYZO_PREVIEW',
        title: gv('p-title') || 'Preview',
        color: gv('p-color') || '#7C3AED',
        textColor: gv('p-text-color') || '#FFFFFF',
        numColor: gv('p-num-color') || '#7C3AED',
        font: gv('p-font'),
        bg: gv('p-bg'),
        logo: gv('p-logo'),
        gradient: (!gv('p-bg') && currentTemplate?.previewGradient) ? currentTemplate.previewGradient : null,
    }, window.location.origin);
}

function setupForm() {
    const form = document.getElementById('personal-customize-form');
    const generatedUrlEl = document.getElementById('generated-url');
    const resultSection = document.getElementById('result-section');
    const btnPreview = document.getElementById('btn-preview');
    const btnCopy = document.getElementById('btn-copy');
    const btnTv = document.getElementById('btn-tv');

    // Structural fields that require full iframe reload
    const structuralIds = ['p-date', 'p-bg', 'p-template-id', 'p-photo', 'p-name', 'p-msg', 'p-cta', 'p-link', 'p-video', 'p-qr', 'p-title-size', 'p-num-size'];

    generateAndShow = () => {
        const finalUrl = getLiveUrl();
        if (generatedUrlEl) generatedUrlEl.textContent = finalUrl;
        if (resultSection) resultSection.classList.add('active');
        if (btnTv) btnTv.href = finalUrl.replace(`/${lang}/live/`, `/${lang}/tv/`);

        const placeholder = document.getElementById('preview-placeholder');
        const iframe = document.getElementById('preview-iframe');
        if (!iframe) return finalUrl;

        if (iframe.dataset.lastUrl !== finalUrl) {
            if (placeholder) placeholder.style.display = 'none';
            iframe.style.display = 'block';
            iframe.src = finalUrl;
            iframe.dataset.lastUrl = finalUrl;
            iframe.onload = () => {
                setTimeout(sendPreviewMessage, 300);
                scalePreviewIframe();
            };
        } else {
            sendPreviewMessage();
        }
        return finalUrl;
    };

    // Auto-trigger preview on structural field changes
    structuralIds.forEach(id => {
        document.getElementById(id)?.addEventListener('change', () => {
            setTimeout(() => generateAndShow(), 100);
        });
    });

    let debounceTimer;
    form.addEventListener('input', (evt) => {
        const isStructural = structuralIds.includes(evt.target?.id);
        clearTimeout(debounceTimer);
        if (isStructural) {
            debounceTimer = setTimeout(() => generateAndShow(), 200);
        } else {
            debounceTimer = setTimeout(() => sendPreviewMessage(), 150);
        }
    });

    form.addEventListener('change', (evt) => {
        const isStructural = structuralIds.includes(evt.target?.id);
        if (!isStructural) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => sendPreviewMessage(), 100);
        }
    });

    btnPreview?.addEventListener('click', () => {
        const url = generateAndShow();
        window.open(url, '_blank');
    });

    btnCopy?.addEventListener('click', () => {
        generateAndShow();
        const url = getLiveUrl();
        navigator.clipboard.writeText(url).then(() => {
            const old = btnCopy.textContent;
            btnCopy.textContent = '✓ Copied!';
            setTimeout(() => btnCopy.textContent = old, 2000);
        });
    });

    // Trigger initial preview once template data is ready
    generateAndShow();
}

function translateDom() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const val = I18nLoader.getSafeVal(key, dictionary);
        if (val) {
            if (el.tagName === 'INPUT' && el.type === 'text') el.placeholder = val;
            else el.textContent = val;
        }
    });
}

document.addEventListener('DOMContentLoaded', init);
