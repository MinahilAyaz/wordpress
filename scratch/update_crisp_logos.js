const fs = require('fs');
const path = require('path');

// 1. Header logo
const logo1Png = fs.readFileSync('nesports-pro-store/assets/images/logo-1.png');
const logo1B64 = logo1Png.toString('base64');
const logo1Svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 2400 845" width="2400" height="845">
  <image href="data:image/png;base64,${logo1B64}" width="2400" height="845" preserveAspectRatio="xMidYMid meet" style="image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;" />
</svg>`;

fs.writeFileSync('nesports-pro-store/assets/images/logo-1.svg', logo1Svg, 'utf8');
fs.writeFileSync('nesports-pro-store/assets/images/header-logo.svg', logo1Svg, 'utf8');
console.log('Updated logo-1.svg and header-logo.svg');

// 2. Footer logo
const footerPng = fs.readFileSync('nesports-pro-store/assets/images/footer-logo.png');
const footerB64 = footerPng.toString('base64');
const footerSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1200 1200" width="1200" height="1200">
  <image href="data:image/png;base64,${footerB64}" width="1200" height="1200" preserveAspectRatio="xMidYMid meet" style="image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;" />
</svg>`;

fs.writeFileSync('nesports-pro-store/assets/images/footer-logo.svg', footerSvg, 'utf8');
console.log('Updated footer-logo.svg');
