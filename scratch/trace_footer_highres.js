const sharp = require('sharp');
const potrace = require('potrace');
const fs = require('fs');

async function buildHighResFooterVector() {
  // 1. Upscale extracted_footer_logo.png to 1450 x 1450
  const upscaled = await sharp('scratch/extracted_footer_logo.png')
    .resize(1450, 1450, { kernel: 'lanczos3' })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = upscaled.info.width;
  const height = upscaled.info.height;
  const data = upscaled.data;

  const redMask = Buffer.alloc(width * height);
  const whiteMask = Buffer.alloc(width * height);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
    const pIdx = i / 4;

    if (a < 40) {
      redMask[pIdx] = 255;
      whiteMask[pIdx] = 255;
      continue;
    }

    // Red: dominant red
    if (r > 120 && (r - g) > 30 && (r - b) > 30) {
      redMask[pIdx] = 0; // foreground
      whiteMask[pIdx] = 255;
    }
    // White: bright neutral
    else if (r > 160 && g > 160 && b > 160) {
      whiteMask[pIdx] = 0; // foreground
      redMask[pIdx] = 255;
    } else {
      redMask[pIdx] = 255;
      whiteMask[pIdx] = 255;
    }
  }

  await sharp(redMask, { raw: { width, height, channels: 1 } })
    .png().toFile('scratch/footer_hr_red_mask.png');
  await sharp(whiteMask, { raw: { width, height, channels: 1 } })
    .png().toFile('scratch/footer_hr_white_mask.png');

  console.log('Saved 1450x1450 masks.');

  function traceP(maskPath, color) {
    return new Promise((resolve, reject) => {
      potrace.trace(maskPath, {
        color: color,
        turnPolicy: potrace.Potrace.TURNPOLICY_MINORITY,
        turdSize: 8,
        optCurve: true,
        alphaMax: 1,
        optTolerance: 0.15
      }, (err, svg) => {
        if (err) return reject(err);
        resolve(svg);
      });
    });
  }

  const redSvg = await traceP('scratch/footer_hr_red_mask.png', '#e11d48');
  const whiteSvg = await traceP('scratch/footer_hr_white_mask.png', '#ffffff');

  function extractPath(content) {
    const m = content.match(/<path[^>]+d="([^">]+)"/);
    return m ? m[1] : '';
  }

  const pathRed = extractPath(redSvg);
  const pathWhite = extractPath(whiteSvg);

  const finalFooterSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1450 1450" width="1450" height="1450">
  <g id="nesports3-footer-circle-logo">
    <path fill="#e11d48" d="${pathRed}" />
    <path fill="#ffffff" d="${pathWhite}" />
  </g>
</svg>
`;

  fs.writeFileSync('scratch/footer-logo-crisp.svg', finalFooterSvg);
  console.log('Saved scratch/footer-logo-crisp.svg!');
}

buildHighResFooterVector().catch(console.error);
