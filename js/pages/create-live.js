import { I18nLoader } from '../core/i18n.js';
import { ThemeManager } from '../core/theme.js';

let dictionary = {};
let lang = 'en';
let generateAndShow;
let templateData = [];
const IFRAME_W = 800;
const IFRAME_H = 450;

async function init() {
    lang = I18nLoader.applyLayoutDirection();
    dictionary = await I18nLoader.loadDictionary(lang);
    translateStaticDom();
    setupForm();
    await fetchAndRenderTemplates();
    ThemeManager.bindToggleSwitch('theme-toggle', dictionary);
    initDefaultPreview();
    scalePreviewIframe();
    window.addEventListener('resize', scalePreviewIframe);
}

function scalePreviewIframe() {
    const wrap = document.querySelector('.preview-iframe-wrap');
    const iframe = document.getElementById('preview-iframe');
    if (!wrap || !iframe) return;
    const scale = wrap.clientWidth / IFRAME_W;
    iframe.style.transform = `scale(${scale})`;
    wrap.style.height = `${Math.round(IFRAME_H * scale)}px`;
}

function initDefaultPreview() {
    const dateInput = document.getElementById('c-date');
    if (dateInput && !dateInput.value) {
        const future = new Date();
        future.setDate(future.getDate() + 30);
        const pad = n => n.toString().padStart(2, '0');
        dateInput.value = `${future.getFullYear()}-${pad(future.getMonth()+1)}-${pad(future.getDate())}T12:00`;
    }
    if (generateAndShow) generateAndShow();
}

async function fetchAndRenderTemplates() {
    try {
        const req = await fetch('/data/templates.json');
        templateData = await req.json();
        const select = document.getElementById('c-template');
        if (!select) return;
        templateData.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.id;
            const nameKeys = t.name_key.split('.');
            let val = dictionary;
            for (const k of nameKeys) { val = val ? val[k] : null; }
            opt.textContent = (t.icon ? t.icon + ' ' : '') + (val || t.id);
            select.appendChild(opt);
        });
    } catch(e) { console.error("Failed to load templates", e); }
}

function getTemplateById(id) {
    return templateData.find(t => t.id === id) || null;
}

function setupForm() {
    const btnPreview = document.getElementById('btn-preview');
    const btnCopy = document.getElementById('btn-copy');
    const resultBox = document.getElementById('result-section');
    const generatedUrlObj = document.getElementById('generated-url');

    const getV = id => document.getElementById(id)?.value?.trim() ?? '';

    const getUrl = () => {
        const params = new URLSearchParams();
        const title = getV('c-title');
        const template = getV('c-template');
        const date = getV('c-date');
        const bg = getV('c-bg');
        const logo = getV('c-logo');
        const color = getV('c-color');
        const textColor = getV('c-text-color');
        const numColor = getV('c-num-color');
        const font = getV('c-font');
        const qr = getV('c-qr');
        const titleSize = getV('c-title-size');
        const numSize = getV('c-num-size');
        const cta = getV('c-cta');
        const link = getV('c-link');
        const video = getV('c-video');
        if (title) params.append('title', title);
        if (template) params.append('template', template);
        if (date) {
            try { params.append('date', new Date(date).toISOString()); }
            catch(e) { params.append('date', date); }
        }
        if (bg) params.append('bg', bg);
        if (logo) params.append('logo', logo);
        if (color) params.append('color', color);
        if (textColor) params.append('textColor', textColor);
        if (numColor) params.append('numColor', numColor);
        if (font) params.append('font', font);
        if (qr === 'false') params.append('qr', 'false');
        if (titleSize) params.append('titleSize', titleSize);
        if (numSize) params.append('numSize', numSize);
        if (cta) params.append('cta', cta);
        if (link) params.append('link', link);
        if (video) params.append('video', video);
        return `${window.location.origin}/${lang}/live?${params.toString()}`;
    };

    // Send instant style updates to already-loaded iframe via postMessage
    const sendPreviewMessage = () => {
        const iframe = document.getElementById('preview-iframe');
        if (!iframe?.contentWindow) return;
        const templateId = getV('c-template');
        const tmpl = getTemplateById(templateId);
        const bgVal = getV('c-bg');
        const logoVal = getV('c-logo');
        iframe.contentWindow.postMessage({
            type: 'DAYZO_PREVIEW',
            title: getV('c-title') || 'Countdown',
            color: getV('c-color') || '#6C4CF1',
            textColor: getV('c-text-color') || '#FFFFFF',
            numColor: getV('c-num-color') || '#FFFFFF',
            font: getV('c-font'),
            bg: bgVal,
            logo: logoVal,
            gradient: (!bgVal && tmpl?.previewGradient) ? tmpl.previewGradient : null,
        }, window.location.origin);
    };

    generateAndShow = (e) => {
        if (e) e.preventDefault();
        const finalUrl = getUrl();
        if (generatedUrlObj) generatedUrlObj.textContent = finalUrl;
        if (resultBox) resultBox.classList.add('active');

        const placeholder = document.getElementById('preview-placeholder');
        const iframe = document.getElementById('preview-iframe');
        if (!iframe) return finalUrl;

        if (iframe.dataset.lastUrl !== finalUrl) {
            // Reload iframe only when URL changes
            if (placeholder) placeholder.style.display = 'none';
            iframe.style.display = 'block';
            iframe.src = finalUrl;
            iframe.dataset.lastUrl = finalUrl;
            // After load, apply postMessage for extra style sync
            iframe.onload = () => {
                setTimeout(sendPreviewMessage, 300);
                scalePreviewIframe();
            };
        } else {
            // URL same → just push style updates
            sendPreviewMessage();
        }
        return finalUrl;
    };

    const form = document.getElementById('create-live-form');

    // Structural changes (date/template/bg/logo) → full reload
    const structuralIds = ['c-date', 'c-template', 'c-bg', 'c-logo'];
    structuralIds.forEach(id => {
        document.getElementById(id)?.addEventListener('change', () => {
            setTimeout(() => generateAndShow(), 100);
        });
    });

    // Visual changes → instant postMessage, no reload
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

    btnPreview?.addEventListener('click', (e) => {
        const url = generateAndShow(e);
        window.open(url, '_blank');
    });

    btnCopy?.addEventListener('click', (e) => {
        const url = generateAndShow(e);
        navigator.clipboard.writeText(url).then(() => {
            const old = btnCopy.textContent;
            btnCopy.textContent = '✓ Copied!';
            setTimeout(() => btnCopy.textContent = old, 2000);
        });
    });
}

function translateStaticDom() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const keys = key.split('.');
        let val = dictionary;
        for (const k of keys) { val = val ? val[k] : null; }
        if (val) {
            if (el.tagName === 'INPUT') el.placeholder = val;
            else el.textContent = val;
        }
    });
}

document.addEventListener('DOMContentLoaded', init);
