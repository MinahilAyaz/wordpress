const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgDir = path.resolve('nesports-pro-store/assets/images');

// Helper to remove near-white background by border flood-fill
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

// 1. Prepare Single Product Studio Hero (1000x1000)
async function prepareSoloProduct(filePath, maxW = 750, maxH = 750) {
  const canvasSize = 1000;
  const p = path.isAbsolute(filePath) ? filePath : path.join(imgDir, filePath);
  const trimmed = await removeBgFlood(p);

  const item = await sharp(trimmed.data).resize(maxW, maxH, { fit: 'inside' }).toBuffer({ resolveWithObject: true });
  
  const shadowW = Math.round(item.info.width * 0.92);
  const shadowH = Math.max(26, Math.round(item.info.height * 0.11));
  const shadow = await sharp(generateFloorShadowSvg(shadowW, shadowH, 0.22)).png().toBuffer();

  const left = Math.round((canvasSize - item.info.width) / 2);
  const top = Math.round((canvasSize - item.info.height) / 2);
  const shadowTop = top + item.info.height - Math.round(shadowH * 0.55);
  const shadowLeft = Math.round((canvasSize - shadowW) / 2);

  return sharp({
    create: {
      width: canvasSize,
      height: canvasSize,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
  .composite([
    { input: shadow, top: shadowTop, left: shadowLeft },
    { input: item.data, top: top, left: left }
  ])
  .jpeg({ quality: 84, mozjpeg: true })
  .toBuffer();
}

// 2. Prepare Duo Bundle Stack (Both items together)
async function prepareBundleStack(file1, file2) {
  const canvasSize = 1000;
  const p1 = path.isAbsolute(file1) ? file1 : path.join(imgDir, file1);
  const p2 = path.isAbsolute(file2) ? file2 : path.join(imgDir, file2);

  const t1 = await removeBgFlood(p1);
  const t2 = await removeBgFlood(p2);

  const primItem = await sharp(t1.data).resize(510, 620, { fit: 'inside' }).toBuffer({ resolveWithObject: true });
  const secItem = await sharp(t2.data).resize(470, 540, { fit: 'inside' }).toBuffer({ resolveWithObject: true });

  const primShadowW = Math.round(primItem.info.width * 0.94);
  const primShadowH = Math.max(26, Math.round(primItem.info.height * 0.11));
  const primShadow = await sharp(generateFloorShadowSvg(primShadowW, primShadowH, 0.22)).png().toBuffer();

  const secShadowW = Math.round(secItem.info.width * 0.94);
  const secShadowH = Math.max(24, Math.round(secItem.info.height * 0.11));
  const secShadow = await sharp(generateFloorShadowSvg(secShadowW, secShadowH, 0.25)).png().toBuffer();

  const primLeft = Math.round(140 + (420 - primItem.info.width) / 2);
  const primTop = Math.round(170 + (560 - primItem.info.height) / 2);

  const secLeft = Math.round(480 + (440 - secItem.info.width) / 2);
  const secTop = Math.round(270 + (560 - secItem.info.height) / 2);

  const primShadowTop = primTop + primItem.info.height - Math.round(primShadowH * 0.55);
  const secShadowTop = secTop + secItem.info.height - Math.round(secShadowH * 0.55);

  return sharp({
    create: {
      width: canvasSize,
      height: canvasSize,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
  .composite([
    { input: primShadow, top: primShadowTop, left: primLeft + Math.round((primItem.info.width - primShadowW) / 2) },
    { input: primItem.data, top: primTop, left: primLeft },
    { input: secShadow, top: secShadowTop, left: secLeft + Math.round((secItem.info.width - secShadowW) / 2) },
    { input: secItem.data, top: secTop, left: secLeft }
  ])
  .jpeg({ quality: 84, mozjpeg: true })
  .toBuffer();
}

async function test() {
  console.log('Testing Hardbody style on Bundle 1...');
  const stack = await prepareBundleStack('A2.jpg', 'Wrist-Bandage-Black-800x800.jpg');
  fs.writeFileSync('scratch/hb_b1_stack.jpg', stack);
  console.log('Stack created: hb_b1_stack.jpg');

  const p1 = await prepareSoloProduct('A2.jpg');
  fs.writeFileSync('scratch/hb_b1_p1.jpg', p1);
  console.log('P1 created: hb_b1_p1.jpg');

  const p2 = await prepareSoloProduct('Wrist-Bandage-Black-800x800.jpg');
  fs.writeFileSync('scratch/hb_b1_p2.jpg', p2);
  console.log('P2 created: hb_b1_p2.jpg');
}

test().catch(console.error);
