const fs = require('fs');
const c = fs.readFileSync('nesports-pro-store/templates/sections/section-trustbar.php', 'utf8');
const lines = c.split('\n');
const start = lines.findIndex(l => l.includes('<div') || l.includes('<section'));
console.log(lines.slice(start, start + 15).join('\n'));
