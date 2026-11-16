const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function removeBgFlood(imagePath, threshold = 238) {
  const { data, info } = await sharp(imagePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = 4;
  const visited = new Uint8Array(width * height);
  const queue = [];

  function isBg(idx) {
    const r = data[idx * 4];
    const g = data[idx * 4 + 1];
    const b = data[idx * 4 + 2];
    // If all channels are bright (near white)
    return r >= threshold && g >= threshold && b >= threshold;
  }

  // Seed with border pixels
  for (let x = 0; x < width; x++) {
    queue.push(0 * width + x); // top
    queue.push((height - 1) * width + x); // bottom
  }
  for (let y = 0; y < height; y++) {
    queue.push(y * width + 0); // left
    queue.push(y * width + (width - 1)); // right
  }

  let head = 0;
  while (head < queue.length) {
    const curr = queue[head++];
    if (visited[curr]) continue;
    visited[curr] = 1;

    if (isBg(curr)) {
      data[curr * 4 + 3] = 0; // set alpha to 0

      const x = curr % width;
      const y = Math.floor(curr / width);

      if (x > 0 && !visited[curr - 1]) queue.push(curr - 1);
      if (x < width - 1 && !visited[curr + 1]) queue.push(curr + 1);
      if (y > 0 && !visited[curr - width]) queue.push(curr - width);
      if (y < height - 1 && !visited[curr + width]) queue.push(curr + width);
    }
  }

  // Create clean sharp buffer and trim
  const cleanBuffer = await sharp(data, {
    raw: { width, height, channels: 4 }
  }).png().toBuffer();

  const trimmed = await sharp(cleanBuffer).trim().toBuffer({ resolveWithObject: true }).catch(() => {
    return { data: cleanBuffer, info };
  });

  return trimmed;
}

async function test() {
  const imgDir = path.resolve('nesports-pro-store/assets/images');
  console.log('Testing background removal on A2.jpg and Wrist-Bandage-Black-800x800.jpg...');
  const t1 = await removeBgFlood(path.join(imgDir, 'A2.jpg'), 235);
  console.log('T1 trimmed size:', t1.info.width, 'x', t1.info.height);
  const t2 = await removeBgFlood(path.join(imgDir, 'Wrist-Bandage-Black-800x800.jpg'), 235);
  console.log('T2 trimmed size:', t2.info.width, 'x', t2.info.height);

  // Composite on 1200x1200 canvas
  const canvasSize = 1200;
  const s1W = 550;
  const s2W = 550;

  const item1 = await sharp(t1.data).resize(s1W, 800, { fit: 'inside' }).toBuffer({ resolveWithObject: true });
  const item2 = await sharp(t2.data).resize(s2W, 800, { fit: 'inside' }).toBuffer({ resolveWithObject: true });

  const comp = await sharp({
    create: {
      width: canvasSize,
      height: canvasSize,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
  .composite([
    { input: item1.data, top: Math.round((canvasSize - item1.info.height) / 2), left: 100 },
    { input: item2.data, top: Math.round((canvasSize - item2.info.height) / 2), left: 550 }
  ])
  .jpeg({ quality: 92 })
  .toFile('scratch/test_bundle_1.jpg');

  console.log('Saved scratch/test_bundle_1.jpg');
}

test().catch(console.error);
