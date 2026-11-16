const sharp = require('sharp');
const fs = require('fs');

async function testZoom() {
  const svg = fs.readFileSync('scratch/header-logo-perfect.svg');
  // Render at 4000 x 1420
  const png = await sharp(svg).png().toBuffer();
  fs.writeFileSync('scratch/test_zoom_render.png', png);
  console.log('Rendered 4000x1420 PNG, size:', Math.round(png.length / 1024), 'KB');
}

testZoom().catch(console.error);
