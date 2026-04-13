import { I18nLoader } from '../core/i18n.js';
import { ThemeManager } from '../core/theme.js';

let dictionary = {};
let currentTemplate = null;

async function init() {
    const lang = I18nLoader.applyLayoutDirection();
    dictionary = await I18nLoader.loadDictionary(lang);
    
    translateDom();
    ThemeManager.bindToggleSwitch('theme-toggle', dictionary);
    
    // Get template ID from URL
    const params = new URLSearchParams(window.location.search);
    const templateId = params.get('id');
    
    if (templateId) {
        await loadTemplateData(templateId);
    }
    
    setupForm();
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
            
            // Pre-fill defaults from template
            if (currentTemplate.thumbnail) {
                document.getElementById('p-bg').value = window.location.origin + currentTemplate.thumbnail;
            }
            if (currentTemplate.color) {
                document.getElementById('p-color').value = currentTemplate.color;
            }
            if (currentTemplate.rules && currentTemplate.rules.qrVisible === false) {
                document.getElementById('p-qr').value = 'false';
            }
            
            // Trigger initial preview
            updatePreview();
        }
    } catch(e) { console.error("Failed to load template", e); }
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

function setupForm() {
    const form = document.getElementById('personal-customize-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        generateUrl();
    });

    // Auto-preview on input change
    form.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('change', updatePreview);
    });
}

function getFormParams() {
    const title = document.getElementById('p-title').value;
    const name = document.getElementById('p-name').value;
    const date = document.getElementById('p-date').value;
    const msg = document.getElementById('p-msg').value;
    const photo = document.getElementById('p-photo').value;
    const bg = document.getElementById('p-bg').value;
    const logo = document.getElementById('p-logo').value;
    const color = document.getElementById('p-color').value;
    const cta = document.getElementById('p-cta').value;
    const link = document.getElementById('p-link').value;
    const video = document.getElementById('p-video').value;
    const textColor = document.getElementById('p-text-color').value;
    const numColor = document.getElementById('p-num-color').value;
    const font = document.getElementById('p-font').value;
    const qr = document.getElementById('p-qr').value;
    const titleSize = document.getElementById('p-title-size').value;
    const numSize = document.getElementById('p-num-size').value;
    const templateId = document.getElementById('p-template-id').value;

    const params = new URLSearchParams();
    if (title) params.set('title', title);
    if (name) params.set('name', name);
    if (date) params.set('date', date);
    if (msg) params.set('msg', msg);
    if (photo) params.set('photo', photo);
    if (bg) params.set('bg', bg);
    if (logo) params.set('logo', logo);
    if (color && color !== '#7C3AED') params.set('color', color);
    if (cta) params.set('cta', cta);
    if (link) params.set('link', link);
    if (video) params.set('video', video);
    if (textColor && textColor !== '#FFFFFF') params.set('textColor', textColor);
    if (numColor && numColor !== '#7C3AED') params.set('numColor', numColor);
    if (font) params.set('font', font);
    if (qr === 'false') params.set('qr', 'false');
    if (titleSize && titleSize !== '8') params.set('titleSize', titleSize);
    if (numSize && numSize !== '12') params.set('numSize', numSize);
    if (templateId) params.set('template', templateId);

    return params;
}

function generateUrl() {
    const params = getFormParams();
    const lang = I18nLoader.applyLayoutDirection();
    const finalUrl = `${window.location.origin}/${lang}/live/?${params.toString()}`;

    const resultSection = document.getElementById('result-section');
    const urlBox = document.getElementById('generated-url');
    
    resultSection.style.display = 'block';
    urlBox.textContent = finalUrl;
    
    // Smooth scroll to results
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

function updatePreview() {
    const params = getFormParams();
    if (!params.get('title')) params.set('title', 'Preview');

    const lang = I18nLoader.applyLayoutDirection();
    const previewUrl = `${window.location.origin}/${lang}/live/?${params.toString()}`;

    const previewContainer = document.getElementById('personal-preview-container');
    const iframe = document.getElementById('preview-iframe');
    
    previewContainer.style.display = 'block';
    iframe.src = previewUrl;
}

document.addEventListener('DOMContentLoaded', init);

// Copy to clipboard
document.getElementById('btn-copy')?.addEventListener('click', () => {
    const url = document.getElementById('generated-url').textContent;
    navigator.clipboard.writeText(url).then(() => {
        const btn = document.getElementById('btn-copy');
        const oldText = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = oldText, 2000);
    });
});
