const fs = require('fs');
const c = fs.readFileSync('nesports-pro-store/assets/css/nesports-frontend.css', 'utf8');
const lines = c.split('\n');
console.log(lines.slice(380, 440).join('\n'));
