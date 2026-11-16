const fs = require('fs');
const svg = fs.readFileSync('nesports-pro-store/assets/images/header-logo.svg', 'utf8');
console.log('SVG viewBox:', svg.match(/viewBox="[^"]+"/));
console.log('SVG width:', svg.match(/width="[^"]+"/));
console.log('SVG height:', svg.match(/height="[^"]+"/));
