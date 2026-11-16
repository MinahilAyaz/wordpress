const sharp = require('sharp');
const potrace = require('potrace');
const fs = require('fs');

async function traceLogo() {
  const input = 'C:/Users/abdul/.gemini/antigravity/brain/818c7688-cf50-49cd-94b6-702cb73a4218/.user_uploaded/media_1794852411104_f27de6d5.png';
  
  // 1. Trim transparency
  const trimmed = await sharp(input).trim().toBuffer({ resolveWithObject: true });
  console.log('Trimmed:', trimmed.info);

  // 2. We want to place it inside 2048 x 682
  // Let's compute scale: height = 600, width fits with margin
  const targetH = 580;
  const targetW = Math.round((trimmed.info.width / trimmed.info.height) * targetH);
  console.log(`Target size: ${targetW} x ${targetH}`);

  const resized = await sharp(trimmed.data)
    .resize(targetW, targetH, { kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();

  // Create 2048x682 canvas with centered resized image
  const padLeft = Math.round((2048 - targetW) / 2);
  const padTop = Math.round((682 - targetH) / 2);

  const canvas = await sharp({
    create: {
      width: 2048,
      height: 682,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
  .composite([{
    input: resized,
    left: padLeft,
    top: padTop
  }])
  .raw()
  .toBuffer({ resolveWithObject: true });

  const { data, info } = canvas;
  console.log('Canvas:', info);

  // Separate masks for RED and BLACK
  const redMask = Buffer.alloc(info.width * info.height);
  const blackMask = Buffer.alloc(info.width * info.height);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
    const pIdx = i / 4;

    if (a < 60) {
      redMask[pIdx] = 255;   // background (white in potrace mask)
      blackMask[pIdx] = 255;
      continue;
    }

    // Red: r high, g low, b low
    if (r > 130 && (r - g) > 50 && (r - b) > 50) {
      redMask[pIdx] = 0;     // foreground (black in potrace mask)
      blackMask[pIdx] = 255;
    } else if (r < 90 && g < 90 && b < 90) {
      // Black letters
      blackMask[pIdx] = 0;
      redMask[pIdx] = 255;
    } else {
      redMask[pIdx] = 255;
      blackMask[pIdx] = 255;
    }
  }

  await sharp(redMask, { raw: { width: 2048, height: 682, channels: 1 } })
    .png().toFile('scratch/mask_red_2048.png');
  await sharp(blackMask, { raw: { width: 2048, height: 682, channels: 1 } })
    .png().toFile('scratch/mask_black_2048.png');

  function traceP(maskPath) {
    return new Promise((resolve, reject) => {
      potrace.trace(maskPath, {
        turdSize: 4,
        alphaMax: 1.0,
        optCurve: true,
        optTolerance: 0.2
      }, (err, svg) => {
        if (err) return reject(err);
        resolve(svg);
      });
    });
  }

  const redSvg = await traceP('scratch/mask_red_2048.png');
  const blackSvg = await traceP('scratch/mask_black_2048.png');

  // Extract path 'd' attributes
  const redPathMatch = redSvg.match(/d="([^"]+)"/g) || [];
  const blackPathMatch = blackSvg.match(/d="([^"]+)"/g) || [];

  console.log(`Extracted ${redPathMatch.length} red paths and ${blackPathMatch.length} black paths`);

  const redPathsStr = redPathMatch.map(p => `    <path ${p} />`).join('\n');
  const blackPathsStr = blackPathMatch.map(p => `    <path ${p} />`).join('\n');

  const finalSvg = `<svg xmlns="http://www.w3.org/2000/svg"
     width="2048"
     height="682"
     viewBox="0 0 2048 682">

  <title>NESPORTS3 Sports Logo</title>

  <!-- RED RUNNER AND SPORTS LETTERS -->
  <g fill="#F00012" fill-rule="evenodd">
${redPathsStr}
  </g>

  <!-- BLACK LETTERS -->
  <g fill="#080808" fill-rule="evenodd">
${blackPathsStr}
  </g>
</svg>`;

  fs.writeFileSync('nesports-pro-store/assets/images/logo-1.svg', finalSvg, 'utf8');
  fs.writeFileSync('nesports-pro-store/assets/images/header-logo.svg', finalSvg, 'utf8');
  console.log('Successfully generated pure vector logo-1.svg and header-logo.svg (2048x682)');

  // Also generate 2048x682 PNG for retina / fallback
  await sharp(Buffer.from(finalSvg))
    .png({ compressionLevel: 9 })
    .toFile('nesports-pro-store/assets/images/logo-1.png');
  await sharp(Buffer.from(finalSvg))
    .png({ compressionLevel: 9 })
    .toFile('nesports-pro-store/assets/images/header-logo.png');
  console.log('Successfully generated high-res logo-1.png and header-logo.png');
}

traceLogo().catch(console.error);
