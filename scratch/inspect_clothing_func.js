const fs = require('fs');

const h = fs.readFileSync('nesports-pro-store/includes/helpers.php', 'utf8');
const lines = h.split('\n');
const start = lines.findIndex(l => l.includes('function nesports_clothing'));
console.log(lines.slice(start, start + 45).join('\n'));
