const sharp = require('sharp');
const fs = require('fs');

async function trimHeaderSvg() {
  const svg = fs.readFileSync('scratch/header-logo.svg', 'utf8');
  
  // Render at 1:1 and find bounding box of non-transparent pixels
  const { data, info } = await sharp(Buffer.from(svg))
    .raw()
    .toBuffer({ resolveWithObject: true });

  let minX = info.width, maxX = 0, minY = info.height, maxY = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * info.channels;
      const a = data[idx + 3];
      if (a > 20) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log('Original Header bounds:', { minX, maxX, minY, maxY, w: maxX - minX, h: maxY - minY });

  // Add small 6px padding
  const p = 6;
  const vbMinX = Math.max(0, minX - p);
  const vbMinY = Math.max(0, minY - p);
  const vbW = (maxX - minX) + p * 2;
  const vbH = (maxY - minY) + p * 2;

  // Extract pathRed and pathBlack from scratch/header-logo.svg
  const mRed = svg.match(/<path fill="#e11d48" d="([^"]+)"/);
  const mBlack = svg.match(/<path fill="#111111" d="([^"]+)"/);

  const trimmedSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vbMinX} ${vbMinY} ${vbW} ${vbH}" width="${vbW}" height="${vbH}">
  <g id="nesports3-header-logo">
    <path fill="#e11d48" d="${mRed[1]}" />
    <path fill="#111111" d="${mBlack[1]}" />
  </g>
</svg>
`;

  fs.writeFileSync('scratch/header-logo-trimmed.svg', trimmedSvg);
  console.log('Saved scratch/header-logo-trimmed.svg with viewBox:', `${vbMinX} ${vbMinY} ${vbW} ${vbH}`);
}

trimHeaderSvg().catch(console.error);
