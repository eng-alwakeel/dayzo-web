/**
 * Dayzo Light/Dark Theme Manager
 * Supports Light, Dark, and Auto (System Preference) modes.
 */
export const ThemeManager = {
    init() {
        const savedTheme = localStorage.getItem('dayzo_theme');
        if (savedTheme) {
            this.setTheme(savedTheme);
        } else {
            // Default to 'auto' logic handled primarily by CSS media queries,
            // but we explicitly sync the data-theme attribute for component logic.
            this.syncWithSystem();
        }

        // Listen for system preference changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('dayzo_theme')) {
                this.syncWithSystem();
            }
        });
    },

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('dayzo_theme', theme);
        
        // Update body class for specific logic if needed
        document.body.classList.remove('theme-light', 'theme-dark');
        document.body.classList.add(`theme-${theme}`);
    },

    syncWithSystem() {
        const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    },

    toggle() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        this.setTheme(next);
        return next;
    },

    bindToggleSwitch(buttonId, dictionary = null) {
        const btn = document.getElementById(buttonId);
        if (!btn) return;
        
        const updateIcon = (theme) => {
            const ui = (dictionary && dictionary.ui) ? dictionary.ui : {};
            const isDark = theme === 'dark';
            
            // Icon logic: Show Sun if current is Dark (to switch to Light), Moon otherwise.
            const label = isDark ? (ui.light_mode || 'Light Mode') : (ui.dark_mode || 'Dark Mode');
            const emoji = isDark ? '☀️' : '🌙';
            
            btn.innerHTML = `<span style="margin-right:8px">${emoji}</span> ${label}`;
        };

        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        updateIcon(currentTheme);

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const newTheme = this.toggle();
            updateIcon(newTheme);
        });
    }
};

// Immediate execution to prevent FOUC
if (typeof window !== 'undefined') {
    ThemeManager.init();
}
