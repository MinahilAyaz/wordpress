const fs = require('fs');
const path = require('path');

const pngBuffer = fs.readFileSync('scratch/logo_red_white_trans.png');
const base64Png = pngBuffer.toString('base64');

const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     width="145" height="145" viewBox="0 0 145 145">
  <image width="145" height="145"
         xlink:href="data:image/png;base64,${base64Png}"/>
</svg>
`;

fs.writeFileSync('nesports-pro-store/assets/images/footer-logo.svg', svgContent, 'utf8');
console.log('Saved nesports-pro-store/assets/images/footer-logo.svg, size:', svgContent.length);
