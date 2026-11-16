const fs = require('fs');
const h = fs.readFileSync('nesports-pro-store/templates/header-nesports.php', 'utf8');
const lines = h.split('\n');
const idx = lines.findIndex(l => l.includes('<div class="hb-topbar">'));
console.log(lines.slice(idx, idx + 35).join('\n'));
