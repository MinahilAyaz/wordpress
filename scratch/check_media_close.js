const fs = require('fs');
const content = fs.readFileSync('nesports-pro-store/templates/header-nesports.php', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(180, 225).map((l, i) => `${i + 181}: ${l}`).join('\n'));
