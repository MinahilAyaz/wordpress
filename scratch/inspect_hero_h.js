const fs = require('fs');
const c = fs.readFileSync('nesports-pro-store/templates/sections/section-hero.php', 'utf8');
const lines = c.split('\n');
console.log(lines.slice(0, 45).join('\n'));
