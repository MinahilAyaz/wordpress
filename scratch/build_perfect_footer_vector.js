const sharp = require('sharp');
const potrace = require('potrace');
const fs = require('fs');

async function buildPerfectFooterVector() {
  const meta = await sharp('scratch/extracted_footor_logo.jpg').metadata();
  console.log('Original footer JPG:', meta.width, 'x', meta.height);

  const scale = 8;
  const targetW = meta.width * scale;
  const targetH = meta.height * scale;

  const { data, info } = await sharp('scratch/extracted_footor_logo.jpg')
    .resize(targetW, targetH, { kernel: 'lanczos3' })
    .raw()
    .toBuffer({ resolveWithObject: true });

  console.log('Upscaled footer buffer:', info.width, 'x', info.height);

  const redMask = Buffer.alloc(info.width * info.height);
  const whiteMask = Buffer.alloc(info.width * info.height);

  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i], g = data[i+1], b = data[i+2];
    const pIdx = i / info.channels;

    // Red: high R, low G, low B
    if (r > 120 && (r - g) > 40 && (r - b) > 40) {
      redMask[pIdx] = 0; // foreground
      whiteMask[pIdx] = 255;
    }
    // Dark / Black / Ring elements in original (which are white in the footer on dark theme):
    // In extracted_footor_logo.jpg, the letters "E" and the circle border are black or dark on white background!
    else if (r < 90 && g < 90 && b < 90) {
      whiteMask[pIdx] = 0; // foreground (rendered as white on dark footer)
      redMask[pIdx] = 255;
    } else {
      redMask[pIdx] = 255;
      whiteMask[pIdx] = 255;
    }
  }

  // Smooth with 1.5px blur and threshold
  const cleanRedMask = await sharp(redMask, { raw: { width: info.width, height: info.height, channels: 1 } })
    .blur(1.8)
    .threshold(128)
    .png()
    .toBuffer();

  const cleanWhiteMask = await sharp(whiteMask, { raw: { width: info.width, height: info.height, channels: 1 } })
    .blur(1.8)
    .threshold(128)
    .png()
    .toBuffer();

  fs.writeFileSync('scratch/footer_clean_red_mask.png', cleanRedMask);
  fs.writeFileSync('scratch/footer_clean_white_mask.png', cleanWhiteMask);

  function traceP(buffer, color) {
    return new Promise((resolve, reject) => {
      potrace.trace(buffer, {
        color: color,
        turnPolicy: potrace.Potrace.TURNPOLICY_MINORITY,
        turdSize: 15,
        optCurve: true,
        alphaMax: 0.6,
        optTolerance: 0.1
      }, (err, svg) => {
        if (err) return reject(err);
        resolve(svg);
      });
    });
  }

  console.log('Tracing red and white paths...');
  const redSvg = await traceP(cleanRedMask, '#e11d48');
  const whiteSvg = await traceP(cleanWhiteMask, '#ffffff');

  function extractPath(content) {
    const m = content.match(/<path[^>]+d="([^">]+)"/);
    return m ? m[1] : '';
  }

  const pathRed = extractPath(redSvg);
  const pathWhite = extractPath(whiteSvg);

  // Find tight bounding box of the combined paths
  const testSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${info.width} ${info.height}" width="${info.width}" height="${info.height}"><path fill="#e11d48" d="${pathRed}"/><path fill="#ffffff" d="${pathWhite}"/></svg>`;
  const rendered = await sharp(Buffer.from(testSvg)).raw().toBuffer({ resolveWithObject: true });

  let minX = info.width, maxX = 0, minY = info.height, maxY = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * rendered.info.channels;
      if (rendered.data[idx + 3] > 20) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const p = 12;
  const vbX = Math.max(0, minX - p);
  const vbY = Math.max(0, minY - p);
  const vbW = (maxX - minX) + p * 2;
  const vbH = (maxY - minY) + p * 2;

  const perfectFooterSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vbX} ${vbY} ${vbW} ${vbH}" width="${vbW}" height="${vbH}" shape-rendering="geometricPrecision" text-rendering="geometricPrecision">
  <g id="nesports3-footer-logo-vector">
    <path fill="#e11d48" d="${pathRed}" />
    <path fill="#ffffff" d="${pathWhite}" />
  </g>
</svg>
`;

  fs.writeFileSync('scratch/footer-logo-perfect.svg', perfectFooterSvg);
  console.log('Saved scratch/footer-logo-perfect.svg with tight viewBox:', `${vbX} ${vbY} ${vbW} ${vbH}`);
}

buildPerfectFooterVector().catch(console.error);
