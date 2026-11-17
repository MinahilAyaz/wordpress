const fs = require('fs');

const h = fs.readFileSync('nesports-pro-store/templates/header-nesports.php', 'utf8');
const lines = h.split('\n');
console.log('Lines 20-75 in header-nesports.php:');
console.log(lines.slice(20, 75).join('\n'));
