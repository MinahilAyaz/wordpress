const fs = require('fs');
const s = fs.readFileSync('scratch/header-logo-perfect.svg', 'utf8');
const fills = s.match(/fill="[^"]+"/g) || [];
console.log('Fills found:', [...new Set(fills)]);
