const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Dayzo Static Site Generation...');

const scripts = [
    'generate-home-html.js',
    'generate-seo-html.js',
    'generate-live-html.js',
    'generate-tv-html.js',
    'generate-embed-html.js',
    'generate-personal-customize.js',
    'generate-sitemap.js'
];

scripts.forEach(script => {
    console.log(`\n--- Running ${script} ---`);
    try {
        const output = execSync(`"${process.execPath}" scripts/${script}`, { encoding: 'utf8' });
        console.log(output);
    } catch (error) {
        console.error(`❌ Error running ${script}:`);
        console.error(error.stdout || error.message);
        process.exit(1);
    }
});

console.log('\n✅ All pages generated successfully!');
