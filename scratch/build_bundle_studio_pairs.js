const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgDir = path.resolve('nesports-pro-store/assets/images');
const outDir = path.resolve('nesports-pro-store/assets/images/bundles');

// Helper to remove white/near-white background by border flood-fill
async function removeBgFlood(imagePath, threshold = 236) {
  const { data, info } = await sharp(imagePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const visited = new Uint8Array(width * height);
  const queue = [];

  function isBg(idx) {
    const r = data[idx * 4];
    const g = data[idx * 4 + 1];
    const b = data[idx * 4 + 2];
    return r >= threshold && g >= threshold && b >= threshold;
  }

  // Seed with borders
  for (let x = 0; x < width; x++) {
    queue.push(0 * width + x);
    queue.push((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    queue.push(y * width + 0);
    queue.push(y * width + (width - 1));
  }

  let head = 0;
  while (head < queue.length) {
    const curr = queue[head++];
    if (visited[curr]) continue;
    visited[curr] = 1;

    if (isBg(curr)) {
      data[curr * 4 + 3] = 0;

      const x = curr % width;
      const y = Math.floor(curr / width);

      if (x > 0 && !visited[curr - 1]) queue.push(curr - 1);
      if (x < width - 1 && !visited[curr + 1]) queue.push(curr + 1);
      if (y > 0 && !visited[curr - width]) queue.push(curr - width);
      if (y < height - 1 && !visited[curr + width]) queue.push(curr + width);
    }
  }

  const cleanBuffer = await sharp(data, {
    raw: { width, height, channels: 4 }
  }).png().toBuffer();

  const trimmed = await sharp(cleanBuffer).trim().toBuffer({ resolveWithObject: true }).catch(() => {
    return { data: cleanBuffer, info };
  });

  return trimmed;
}

// Generate realistic radial contact floor shadow
function generateFloorShadowSvg(width, height, opacity = 0.22) {
  return Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="shadowG" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#000000" stop-opacity="${opacity}"/>
          <stop offset="45%" stop-color="#000000" stop-opacity="${opacity * 0.5}"/>
          <stop offset="85%" stop-color="#000000" stop-opacity="${opacity * 0.1}"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="${width/2}" cy="${height/2}" rx="${width * 0.46}" ry="${height * 0.44}" fill="url(#shadowG)"/>
    </svg>
  `);
}

async function createStudioPair(file1, file2, options = {}) {
  const canvasSize = 1000;
  const p1 = path.join(imgDir, file1);
  const p2 = path.join(imgDir, file2);

  const t1 = await removeBgFlood(p1);
  const t2 = await removeBgFlood(p2);

  // Layout logic:
  // Item 1 (primary): 500 - 580 px max
  // Item 2 (secondary): 440 - 520 px max
  const isSwap = options.swap || false;
  const primTrim = isSwap ? t2 : t1;
  const secTrim = isSwap ? t1 : t2;

  const primMaxW = options.primW || 520;
  const primMaxH = options.primH || 650;
  const secMaxW = options.secW || 460;
  const secMaxH = options.secH || 550;

  const primItem = await sharp(primTrim.data).resize(primMaxW, primMaxH, { fit: 'inside' }).toBuffer({ resolveWithObject: true });
  const secItem = await sharp(secTrim.data).resize(secMaxW, secMaxH, { fit: 'inside' }).toBuffer({ resolveWithObject: true });

  // Shadows
  const primShadowW = Math.round(primItem.info.width * 0.95);
  const primShadowH = Math.max(30, Math.round(primItem.info.height * 0.12));
  const primShadow = await sharp(generateFloorShadowSvg(primShadowW, primShadowH, 0.25)).png().toBuffer();

  const secShadowW = Math.round(secItem.info.width * 0.95);
  const secShadowH = Math.max(26, Math.round(secItem.info.height * 0.12));
  const secShadow = await sharp(generateFloorShadowSvg(secShadowW, secShadowH, 0.28)).png().toBuffer();

  // Positions on canvas (1000 x 1000)
  // Let's create an overlapping, balanced studio display:
  // Primary slightly left & higher, Secondary slightly right & lower (foreground)
  const primLeft = options.primLeft !== undefined ? options.primLeft : Math.round(150 + (450 - primItem.info.width) / 2);
  const primTop = options.primTop !== undefined ? options.primTop : Math.round(150 + (600 - primItem.info.height) / 2);

  const secLeft = options.secLeft !== undefined ? options.secLeft : Math.round(480 + (450 - secItem.info.width) / 2);
  const secTop = options.secTop !== undefined ? options.secTop : Math.round(250 + (600 - secItem.info.height) / 2);

  const primShadowTop = primTop + primItem.info.height - Math.round(primShadowH * 0.6);
  const secShadowTop = secTop + secItem.info.height - Math.round(secShadowH * 0.6);

  const composites = [
    { input: primShadow, top: primShadowTop, left: primLeft + Math.round((primItem.info.width - primShadowW) / 2) },
    { input: primItem.data, top: primTop, left: primLeft },
    { input: secShadow, top: secShadowTop, left: secLeft + Math.round((secItem.info.width - secShadowW) / 2) },
    { input: secItem.data, top: secTop, left: secLeft }
  ];

  const finalImg = await sharp({
    create: {
      width: canvasSize,
      height: canvasSize,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
  .composite(composites)
  .jpeg({ quality: 93, chromaSubsampling: '4:4:4' })
  .toBuffer();

  return finalImg;
}

module.exports = { createStudioPair, removeBgFlood };
