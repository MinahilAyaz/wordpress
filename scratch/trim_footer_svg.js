const sharp = require('sharp');
const fs = require('fs');

async function trimFooterSvg() {
  const svg = fs.readFileSync('scratch/footer-logo-crisp.svg', 'utf8');
  
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

  console.log('Original Footer bounds:', { minX, maxX, minY, maxY, w: maxX - minX, h: maxY - minY });

  // Add small padding
  const p = 10;
  const vbMinX = Math.max(0, minX - p);
  const vbMinY = Math.max(0, minY - p);
  const vbW = (maxX - minX) + p * 2;
  const vbH = (maxY - minY) + p * 2;

  const mRed = svg.match(/<path fill="#e11d48" d="([^"]+)"/);
  const mWhite = svg.match(/<path fill="#ffffff" d="([^"]+)"/);

  const trimmedSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vbMinX} ${vbMinY} ${vbW} ${vbH}" width="${vbW}" height="${vbH}">
  <g id="nesports3-footer-circle-logo">
    <path fill="#e11d48" d="${mRed[1]}" />
    <path fill="#ffffff" d="${mWhite[1]}" />
  </g>
</svg>
`;

  fs.writeFileSync('scratch/footer-logo-trimmed.svg', trimmedSvg);
  console.log('Saved scratch/footer-logo-trimmed.svg with viewBox:', `${vbMinX} ${vbMinY} ${vbW} ${vbH}`);
}

trimFooterSvg().catch(console.error);
