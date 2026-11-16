const fs = require('fs');
const content = fs.readFileSync('nesports-pro-store/templates/header-nesports.php', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(95, 145).map((l, i) => `${i + 96}: ${l}`).join('\n'));
