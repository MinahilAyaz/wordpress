const sharp = require('sharp');
const fs = require('fs');

async function trimHeaderPerfect() {
  const svg = fs.readFileSync('scratch/header-logo-perfect.svg', 'utf8');
  const rendered = await sharp(Buffer.from(svg)).raw().toBuffer({ resolveWithObject: true });

  let minX = rendered.info.width, maxX = 0, minY = rendered.info.height, maxY = 0;
  for (let y = 0; y < rendered.info.height; y++) {
    for (let x = 0; x < rendered.info.width; x++) {
      const idx = (y * rendered.info.width + x) * rendered.info.channels;
      if (rendered.data[idx + 3] > 20) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const p = 16;
  const vbX = Math.max(0, minX - p);
  const vbY = Math.max(0, minY - p);
  const vbW = (maxX - minX) + p * 2;
  const vbH = (maxY - minY) + p * 2;

  const mRed = svg.match(/<path fill="#e11d48" d="([^"]+)"/);
  const mBlack = svg.match(/<path fill="#111111" d="([^"]+)"/);

  const tightHeaderSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vbX} ${vbY} ${vbW} ${vbH}" width="${vbW}" height="${vbH}" shape-rendering="geometricPrecision" text-rendering="geometricPrecision">
  <g id="nesports3-header-vector">
    <path fill="#e11d48" d="${mRed[1]}" />
    <path fill="#111111" d="${mBlack[1]}" />
  </g>
</svg>
`;

  fs.writeFileSync('scratch/header-logo-perfect.svg', tightHeaderSvg);
  console.log('Saved scratch/header-logo-perfect.svg with tight viewBox:', `${vbX} ${vbY} ${vbW} ${vbH}`);
}

trimHeaderPerfect().catch(console.error);
