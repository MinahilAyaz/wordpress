const fs = require('fs');
const h = fs.readFileSync('nesports-pro-store/templates/header-nesports.php', 'utf8');
const lines = h.split('\n');
const idx = lines.findIndex(l => l.includes('hb-main-header'));
console.log(lines.slice(idx - 2, idx + 5).join('\n'));
