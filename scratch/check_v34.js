const fs = require('fs');

const h = fs.readFileSync('nesports-pro-store/templates/header-nesports.php', 'utf8');
const c = fs.readFileSync('nesports-pro-store/assets/css/nesports-frontend.css', 'utf8');

console.log('--- CHECK V34 LOCAL ---');
console.log('header-nesports.php has transparent background:', h.includes('background: transparent !important;'));
console.log('nesports-frontend.css has transparent background:', c.includes('background: transparent !important;'));
console.log('header-nesports.php has black text:', h.includes('color: #111111 !important;'));
console.log('header-nesports.php has crisp logo letters:', h.includes('fill="#080808"'));
