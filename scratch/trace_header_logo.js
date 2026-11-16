const sharp = require('sharp');
const potrace = require('potrace');
const fs = require('fs');

async function traceHeader() {
  const { data, info } = await sharp('nesports-pro-store/assets/images/logo-1.png')
    .raw()
    .toBuffer({ resolveWithObject: true });
  console.log('Header logo info:', info);

  const redMask = Buffer.alloc(info.width * info.height);
  const blackMask = Buffer.alloc(info.width * info.height);

  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
    const pIdx = i / info.channels;

    if (a < 30) {
      redMask[pIdx] = 255;
      blackMask[pIdx] = 255;
      continue;
    }

    // Red: r > 150 && (r - g) > 60 && (r - b) > 60
    if (r > 150 && (r - g) > 60 && (r - b) > 60) {
      redMask[pIdx] = 0; // foreground
      blackMask[pIdx] = 255;
    } 
    // Black: r < 100 && g < 100 && b < 100
    else if (r < 100 && g < 100 && b < 100) {
      blackMask[pIdx] = 0; // foreground
      redMask[pIdx] = 255;
    } else {
      redMask[pIdx] = 255;
      blackMask[pIdx] = 255;
    }
  }

  await sharp(redMask, { raw: { width: info.width, height: info.height, channels: 1 } })
    .png().toFile('scratch/header_mask_red.png');
  await sharp(blackMask, { raw: { width: info.width, height: info.height, channels: 1 } })
    .png().toFile('scratch/header_mask_black.png');
  console.log('Saved header masks');

  // Potrace trace
  function traceP(maskPath, color) {
    return new Promise((resolve, reject) => {
      potrace.trace(maskPath, {
        color: color,
        turnPolicy: potrace.Potrace.TURNPOLICY_MINORITY,
        turdSize: 3,
        optCurve: true,
        alphaMax: 1,
        optTolerance: 0.15
      }, (err, svg) => {
        if (err) return reject(err);
        resolve(svg);
      });
    });
  }

  const redSvg = await traceP('scratch/header_mask_red.png', '#e11d48');
  fs.writeFileSync('scratch/header_red.svg', redSvg);

  const blackSvg = await traceP('scratch/header_mask_black.png', '#111111');
  fs.writeFileSync('scratch/header_black.svg', blackSvg);
  console.log('Traced header red & black SVGs');
}

traceHeader().catch(console.error);
