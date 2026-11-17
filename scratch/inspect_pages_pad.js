const fs = require('fs');

const c = fs.readFileSync('nesports-pro-store/assets/css/nesports-frontend.css', 'utf8');
const lines = c.split('\n');
lines.forEach((l, i) => {
    if (l.includes('.hb-product-page') || l.includes('.hb-category-page') || l.includes('padding-top: 1') || l.includes('padding-top: 9') || l.includes('padding-top: 8')) {
        console.log(`${i+1}: ${l.trim()}`);
    }
});
