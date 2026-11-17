const fs = require('fs');

const h = fs.readFileSync('nesports-pro-store/templates/header-nesports.php', 'utf8');
const c = fs.readFileSync('nesports-pro-store/assets/css/nesports-frontend.css', 'utf8');

console.log('--- CHECK V37 LOCAL ---');
console.log('1. Topbar is fixed in header-nesports.php:', h.includes('.hb-topbar') && h.includes('position: fixed !important;'));
console.log('2. Topbar is fixed in nesports-frontend.css:', c.includes('.hb-topbar') && c.includes('position: fixed !important;'));
console.log('3. Header is fixed at top: 36px:', h.includes('top: 36px !important;') && c.includes('top: 36px !important;'));
console.log('4. Header has is-on-dark white rule:', h.includes('.hb-header.is-on-dark .hb-nav .hb-menu > li > a') && h.includes('color: #ffffff !important'));
console.log('5. Header has is-on-light dark rule:', h.includes('.hb-header.is-on-light .hb-nav .hb-menu > li > a') && h.includes('color: #111111 !important'));
console.log('6. Header has probeY detection:', h.includes('probeY = 36 + ((header.offsetHeight || 60) / 2)'));
