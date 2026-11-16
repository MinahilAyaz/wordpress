const sharp = require('sharp');
const path = require('path');

// Helper to create a soft realistic elliptical floor shadow
async function createFloorShadow(width, height, blurRadius = 15, opacity = 0.18) {
  // SVG ellipse gradient
  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="shadowGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#000000" stop-opacity="${opacity}"/>
        <stop offset="60%" stop-color="#000000" stop-opacity="${opacity * 0.4}"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="${width/2}" cy="${height/2}" rx="${width * 0.48}" ry="${height * 0.45}" fill="url(#shadowGrad)"/>
  </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

console.log('Floor shadow helper defined');
