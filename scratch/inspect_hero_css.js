const fs = require('fs');
const c = fs.readFileSync('nesports-pro-store/assets/css/nesports-frontend.css', 'utf8');
const lines = c.split('\n');
lines.forEach((l, i) => {
    if (l.includes('.hb-hero ') && (l.includes('height') || l.includes('min-height'))) {
        console.log(`${i+1}: ${l.trim()}`);
    }
});
