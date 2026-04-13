/**
 * Core Initialization for Language handling
 */
export const I18nLoader = {
    async loadDictionary(lang) {
        try {
            const res = await fetch(`/i18n/${lang}.json`);
            if (!res.ok) throw new Error('Missing Lang');
            this.currentDict = await res.json();
            return this.currentDict;
        } catch (e) {
            console.error(`Failed to load ${lang}, falling back to 'en'.`);
            const fallback = await (await fetch('/i18n/en.json')).json();
            this.currentDict = fallback;
            return fallback;
        }
    },

    getSafeVal(key, dictionary) {
        const dict = dictionary || this.currentDict;
        if (!dict || !key) return null;
        const keys = key.split('.');
        let val = dict;
        for (const k of keys) {
            val = val ? val[k] : null;
        }
        if (!val) {
            console.warn(`[i18n] Missing key: ${key}`);
        }
        return val;
    },

    applyLayoutDirection() {
        const pathSegments = window.location.pathname.split('/');
        const lang = pathSegments[1] || 'en';

        if (lang === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.documentElement.lang = 'ar';
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.lang = lang;
        }
        return lang;
    }
};
