const fs = require('fs');

const h = fs.readFileSync('nesports-pro-store/templates/header-nesports.php', 'utf8');
const c = fs.readFileSync('nesports-pro-store/assets/css/nesports-frontend.css', 'utf8');

console.log('--- CHECK V36 ---');
console.log('1. header has is-on-dark white rule:', h.includes('.hb-header.is-on-dark .hb-nav .hb-menu > li > a') && h.includes('color: #ffffff !important'));
console.log('2. header has is-on-light dark rule:', h.includes('.hb-header.is-on-light .hb-nav .hb-menu > li > a') && h.includes('color: #111111 !important'));
console.log('3. CSS rogue white override removed:', !c.includes('.hb-header .hb-cart-total-text,\r\n.hb-header .hb-icon-btn') && !c.includes('.hb-header .hb-cart-total-text,\n.hb-header .hb-icon-btn'));
console.log('4. CSS rogue white logo removed:', !c.includes('.hb-logo .hb-logo-letters {\r\n    fill: #FFFFFF !important;') && !c.includes('.hb-logo .hb-logo-letters {\n    fill: #FFFFFF !important;'));
console.log('5. header has rock-solid tracking script:', h.includes('Math.max(0, topbarHeight - scrollY)'));
