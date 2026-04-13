export const LangSwitcher = {
    langs: ["en", "es", "pt", "fr", "de", "ar", "hi", "id", "zh"],
    langNames: {
        "en": "English", "es": "Español", "pt": "Português",
        "fr": "Français", "de": "Deutsch", "ar": "العربية",
        "hi": "हिन्दी", "id": "Bahasa Indonesia", "zh": "中文"
    },
    
    init() {
        const select = document.getElementById('lang-switcher');
        if (!select) return;

        // Current lang from html
        const currentLang = document.documentElement.lang || 'en';
        
        // Populate
        this.langs.forEach(l => {
            const opt = document.createElement('option');
            opt.value = l;
            opt.textContent = this.langNames[l];
            if (l === currentLang) opt.selected = true;
            select.appendChild(opt);
        });

        // Event listener
        select.addEventListener('change', (e) => {
            const newLang = e.target.value;
            if (newLang === currentLang) return;
            
            // Rewrite URL:
            // /en/how-many-days-until-christmas/ -> /ar/how-many-days-until-christmas/
            const pathParts = window.location.pathname.split('/').filter(Boolean);
            if (pathParts.length > 0 && this.langs.includes(pathParts[0])) {
                pathParts[0] = newLang; // swap lang
            } else {
                pathParts.unshift(newLang); // prepend if not present
            }
            
            let query = window.location.search;
            let hash = window.location.hash;
            
            window.location.href = '/' + pathParts.join('/') + (pathParts.length > 0 ? '/' : '') + query + hash;
        });
    }
};

document.addEventListener('DOMContentLoaded', () => LangSwitcher.init());
