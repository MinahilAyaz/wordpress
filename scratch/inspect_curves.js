const fs = require('fs');
const s = fs.readFileSync('header_logo.svg', 'utf8');

// Check coordinate precision
console.log('Sample dRed:', s.slice(s.indexOf('d="M') + 3, s.indexOf('d="M') + 300));
