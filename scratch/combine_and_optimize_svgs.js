const fs = require('fs');

function extractPath(svgContent) {
  const m = svgContent.match(/<path[^>]+d="([^">]+)"/);
  return m ? m[1] : '';
}

// 1. Header Logo
const headerRed = fs.readFileSync('scratch/header_red.svg', 'utf8');
const headerBlack = fs.readFileSync('scratch/header_black.svg', 'utf8');

const pathRed = extractPath(headerRed);
const pathBlack = extractPath(headerBlack);

console.log('Header Red path length:', pathRed.length);
console.log('Header Black path length:', pathBlack.length);

const unifiedHeaderSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 284" width="800" height="284">
  <g id="nesports3-header-logo">
    <path fill="#e11d48" d="${pathRed}" />
    <path fill="#111111" d="${pathBlack}" />
  </g>
</svg>
`;

fs.writeFileSync('scratch/header-logo.svg', unifiedHeaderSvg);
console.log('Saved scratch/header-logo.svg');

// 2. Footer Logo
const footerRed = fs.readFileSync('scratch/footer_red.svg', 'utf8');
const footerWhite = fs.readFileSync('scratch/footer_white.svg', 'utf8');

const pathFRed = extractPath(footerRed);
const pathFWhite = extractPath(footerWhite);

console.log('Footer Red path length:', pathFRed.length);
console.log('Footer White path length:', pathFWhite.length);

const unifiedFooterSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 458 407" width="458" height="407">
  <g id="nesports3-footer-logo">
    <path fill="#e11d48" d="${pathFRed}" />
    <path fill="#ffffff" d="${pathFWhite}" />
  </g>
</svg>
`;

fs.writeFileSync('scratch/footer-logo-vector.svg', unifiedFooterSvg);
console.log('Saved scratch/footer-logo-vector.svg');
