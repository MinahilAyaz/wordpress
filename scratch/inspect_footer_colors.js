const sharp = require('sharp');

async function inspectColors() {
  const { data, info } = await sharp('scratch/extracted_footor_logo.jpg')
    .raw()
    .toBuffer({ resolveWithObject: true });
  
  // Sample pixels around the emblem
  const colorMap = {};
  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i], g = data[i+1], b = data[i+2];
    // quantize to 16
    const qr = Math.round(r / 16) * 16;
    const qg = Math.round(g / 16) * 16;
    const qb = Math.round(b / 16) * 16;
    const key = `${qr},${qg},${qb}`;
    colorMap[key] = (colorMap[key] || 0) + 1;
  }

  const sorted = Object.entries(colorMap).sort((a,b) => b[1] - a[1]);
  console.log('Top 20 quantized colors in extracted_footor_logo.jpg:');
  sorted.slice(0, 20).forEach(([c, count]) => console.log(' ', c, ':', count));
}

inspectColors().catch(console.error);
