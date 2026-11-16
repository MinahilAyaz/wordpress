const sharp = require('sharp');
const potrace = require('potrace');
const fs = require('fs');

async function testSupersampledTrace() {
  // 1. 10x supersampling with lanczos3
  const upscaled = await sharp('images_original_backup/logo-1.png')
    .resize(4000, 1420, { kernel: 'lanczos3' })
    // Apply contrast / threshold to make edges razor clean (no gray anti-aliased fuzz)
    .threshold(128)
    .png()
    .toBuffer();

  fs.writeFileSync('scratch/logo_10x_thresholded.png', upscaled);
  console.log('Saved 10x thresholded image (4000x1420)');

  // 2. Separate Red vs Black
  const { data, info } = await sharp('images_original_backup/logo-1.png')
    .resize(4000, 1420, { kernel: 'lanczos3' })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const redMask = Buffer.alloc(info.width * info.height);
  const blackMask = Buffer.alloc(info.width * info.height);

  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
    const pIdx = i / info.channels;

    if (a < 50) {
      redMask[pIdx] = 255;
      blackMask[pIdx] = 255;
      continue;
    }

    // Red: r dominant
    if (r > 130 && (r - g) > 50 && (r - b) > 50) {
      redMask[pIdx] = 0;
      blackMask[pIdx] = 255;
    } else if (r < 110 && g < 110 && b < 110) {
      blackMask[pIdx] = 0;
      redMask[pIdx] = 255;
    } else {
      redMask[pIdx] = 255;
      blackMask[pIdx] = 255;
    }
  }

  // Smooth mask slightly with small 1px blur then threshold to remove single-pixel staircasing
  const cleanRedMask = await sharp(redMask, { raw: { width: info.width, height: info.height, channels: 1 } })
    .blur(1.5)
    .threshold(128)
    .png()
    .toBuffer();

  const cleanBlackMask = await sharp(blackMask, { raw: { width: info.width, height: info.height, channels: 1 } })
    .blur(1.5)
    .threshold(128)
    .png()
    .toBuffer();

  fs.writeFileSync('scratch/clean_red_mask.png', cleanRedMask);
  fs.writeFileSync('scratch/clean_black_mask.png', cleanBlackMask);

  function traceP(buffer, color) {
    return new Promise((resolve, reject) => {
      potrace.trace(buffer, {
        color: color,
        turnPolicy: potrace.Potrace.TURNPOLICY_MINORITY,
        turdSize: 10,
        optCurve: true,
        alphaMax: 0.5,    // sharp corners on letters!
        optTolerance: 0.1 // tight line fitting
      }, (err, svg) => {
        if (err) return reject(err);
        resolve(svg);
      });
    });
  }

  const redSvg = await traceP(cleanRedMask, '#e11d48');
  const blackSvg = await traceP(cleanBlackMask, '#111111');

  function extractPath(content) {
    const m = content.match(/<path[^>]+d="([^">]+)"/);
    return m ? m[1] : '';
  }

  const pathRed = extractPath(redSvg);
  const pathBlack = extractPath(blackSvg);

  const perfectSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4000 1420" width="4000" height="1420" shape-rendering="geometricPrecision" text-rendering="geometricPrecision">
  <g id="nesports3-header-vector">
    <path fill="#e11d48" d="${pathRed}" />
    <path fill="#111111" d="${pathBlack}" />
  </g>
</svg>
`;

  fs.writeFileSync('scratch/header-logo-perfect.svg', perfectSvg);
  console.log('Saved scratch/header-logo-perfect.svg!');
}

testSupersampledTrace().catch(console.error);
