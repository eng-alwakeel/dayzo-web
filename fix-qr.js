const fs = require('fs');

const filesToFix = [
    'scripts/generate-seo-html.js',
    'scripts/generate-live-html.js',
    'scripts/generate-tv-html.js'
];
filesToFix.forEach(f => {
    let html = fs.readFileSync(f, 'utf8');
    html = html.replace(/https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/qrcodejs\/1\.0\.0\/qrcode\.min\.js/g, 'https://cdn.jsdelivr.net/npm/qrcode@1.5.0/build/qrcode.min.js');
    fs.writeFileSync(f, html);
});

let seoPage = fs.readFileSync('js/pages/seo-page.js', 'utf8');
seoPage = seoPage.replace(/new window\.QRCode\(qrContainer, \{[\s\S]*?correctLevel : window\.QRCode\.CorrectLevel\.L\n\s*\}\);/g, `
    const canvas = document.createElement('canvas');
    qrContainer.appendChild(canvas);
    window.QRCode.toCanvas(canvas, url, { width: 96, margin: 0, color: { dark: '#000000', light: '#ffffff' } }, (err) => {
        if (err) console.error(err);
    });
`);
fs.writeFileSync('js/pages/seo-page.js', seoPage);

let liveJs = fs.readFileSync('js/pages/live.js', 'utf8');
liveJs = liveJs.replace(/new window\.QRCode\(document\.getElementById\('qr-container-el'\), \{[\s\S]*?correctLevel : window\.QRCode\.CorrectLevel\.L\n\s*\}\);/g, `
    const canvas = document.createElement('canvas');
    document.getElementById('qr-container-el').appendChild(canvas);
    window.QRCode.toCanvas(canvas, window.location.href, { width: 80, margin: 0, color: { dark: '#000000', light: '#ffffff' } });
`);
fs.writeFileSync('js/pages/live.js', liveJs);

let tvJs = fs.readFileSync('js/pages/tv.js', 'utf8');
tvJs = tvJs.replace(/new window\.QRCode\(document\.getElementById\('tv-qr-container-el'\), \{[\s\S]*?correctLevel : window\.QRCode\.CorrectLevel\.L\n\s*\}\);/g, `
    const canvas = document.createElement('canvas');
    document.getElementById('tv-qr-container-el').appendChild(canvas);
    window.QRCode.toCanvas(canvas, window.location.href, { width: 150, margin: 0, color: { dark: '#000000', light: '#ffffff' } });
`);
fs.writeFileSync('js/pages/tv.js', tvJs);

console.log('Fixed QR Code implementation');
