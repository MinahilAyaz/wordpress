const fs = require('fs');
const h = fs.readFileSync('nesports-pro-store/templates/header-nesports.php', 'utf8');
const lines = h.split('\n');
console.log(lines.slice(250, 290).join('\n'));
