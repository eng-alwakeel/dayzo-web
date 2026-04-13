/**
 * Minimal Confetti Wrapper leveraging standard CDN confetti
 */
export const Confetti = {
    fire() {
        if (!window.confetti) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
            script.onload = () => window.confetti({ zIndex: 9999, particleCount: 150, spread: 80, origin: { y: 0.6 }});
            document.head.appendChild(script);
        } else {
            window.confetti({ zIndex: 9999, particleCount: 150, spread: 80, origin: { y: 0.6 }});
        }
    }
}
