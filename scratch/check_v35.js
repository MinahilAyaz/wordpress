const fs = require('fs');

const h = fs.readFileSync('nesports-pro-store/templates/header-nesports.php', 'utf8');
const c = fs.readFileSync('nesports-pro-store/assets/css/nesports-frontend.css', 'utf8');

console.log('--- CHECK V35 LOCAL ---');
console.log('1. Header has is-on-dark white rule:', h.includes('.hb-header.is-on-dark .hb-nav .hb-menu > li > a') && h.includes('color: #ffffff !important'));
console.log('2. Header has is-on-light dark rule:', h.includes('.hb-header.is-on-light .hb-nav .hb-menu > li > a') && h.includes('color: #111111 !important'));
console.log('3. Logo letters white on dark:', h.includes('.hb-header.is-on-dark .hb-logo .hb-logo-letters') && h.includes('fill: #ffffff !important'));
console.log('4. Logo letters black on light:', h.includes('.hb-header.is-on-light .hb-logo .hb-logo-letters') && h.includes('fill: #080808 !important'));
console.log('5. Header has adaptive script:', h.includes('hb-header-adaptive-script'));
console.log('6. CSS has V35 overrides:', c.includes('V35 ENFORCED RULES'));
