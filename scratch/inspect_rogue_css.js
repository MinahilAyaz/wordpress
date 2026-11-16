const fs = require('fs');
const c = fs.readFileSync('nesports-pro-store/assets/css/nesports-frontend.css', 'utf8');
const lines = c.split('\n');
console.log(lines.slice(6465, 6525).join('\n'));
