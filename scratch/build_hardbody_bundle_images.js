const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgDir = path.resolve('nesports-pro-store/assets/images');
const outDir = path.resolve('nesports-pro-store/assets/images/bundles');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. Remove background by border flood-fill
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

// 2. Realistic radial floor shadow
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

// 3. Prepare Single Product Studio Hero (1000x1000)
async function prepareSoloProduct(filePath, maxW = 760, maxH = 760) {
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

// 4. Prepare Duo Bundle Stack (Both items together, 1000x1000)
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

// 15 Bundles definitions matching catalog slugs
const bundles = [
  // 1. Pull Day Pack (Blue)
  { idx: 1, p1: 'A2.jpg', p2: 'Wrist-Bandage-Black-800x800.jpg' },
  // 2. Heavy Lifter Pack (Black)
  { idx: 2, p1: '1-800x800.jpg', p2: 'Wrist-Bandage-Black-800x800.jpg' },
  // 3. Pro Powerlifting Pack
  { idx: 3, p1: 'DSC_0167-scaled-1.jpg', p2: '1-800x800.jpg' },
  // 4. Grip & Wrist Armor Pack
  { idx: 4, p1: 'WhatsApp-Image-2024-07-08-at-19.20.29_ba3cfe08-800x800.jpg', p2: 'Wrist-Bandage-Black-800x800.jpg' },
  // 5. Deadlift & Dip Belt Pack
  { idx: 5, p1: 'Dip-Belt-800x800.jpg', p2: '2-red-800x800.jpg' },
  // 6. Red Edition Squat Pack
  { idx: 6, p1: '2-red-800x800.jpg', p2: 'Knee-Wrap-800x800.jpg' },
  // 7. Leg Day Pack (Blue)
  { idx: 7, p1: 'WhatsApp-Image-2024-07-08-at-19.20.29_ba3cfe08-800x800.jpg', p2: 'Knee-Wrap-9-800x800.jpg' },
  // 8. Competition Knee & Belt Pack
  { idx: 8, p1: 'WhatsApp-Image-2024-07-08-at-19.21.32_c020a8d1.jpg', p2: 'Knee-Wrap-800x800.jpg' },
  // 9. Heavy Duty Joint Support Pack
  { idx: 9, p1: 'Knee-Wrap-800x800.jpg', p2: 'Knee-Wrap-9-800x800.jpg' },
  // 10. Squat Pad & Knee Wrap Pack
  { idx: 10, p1: 'Barbell-Pad-5-scaled.jpg', p2: 'Knee-Wrap-800x800.jpg' },
  // 11. Gym Carry Pack (Gray)
  { idx: 11, p1: 'Gym-Bag-9-800x800.jpg', p2: 'Wrist-Bandage-Black-800x800.jpg' },
  // 12. Speed & Strength Pack
  { idx: 12, p1: '1-1-2-800x800.jpg', p2: 'Gym-Bag-8-800x800.jpg' },
  // 13. Speed Reflex Pro Pack
  { idx: 13, p1: '1-1-1-800x800.jpg', p2: 'Gym-Bag-9-800x800.jpg' },
  // 14. Athlete Conditioning Pack
  { idx: 14, p1: '1-1-800x800.jpg', p2: 'Gym-Bag-8-800x800.jpg' },
  // 15. Glute & Carry Essentials Pack
  { idx: 15, p1: 'Ankle-Strap-Cable-pull-scaled.jpg', p2: 'Gym-Bag-scaled.jpg' }
];

async function run() {
  console.log('Generating Hardbody-style 100% Product-Only Images for 15 Bundles (45 images)...');
  for (const b of bundles) {
    console.log(`Processing Bundle ${b.idx}...`);

    // Slide 1: Bundle Stack (both items together)
    const out1 = path.join(outDir, `bundle-${b.idx}-1.jpg`);
    const buf1 = await prepareBundleStack(b.p1, b.p2);
    fs.writeFileSync(out1, buf1);
    console.log(`  -> Saved bundle-${b.idx}-1.jpg (Full Bundle Stack)`);

    // Slide 2: Product 1 Solo Hero
    const out2 = path.join(outDir, `bundle-${b.idx}-2.jpg`);
    const buf2 = await prepareSoloProduct(b.p1);
    fs.writeFileSync(out2, buf2);
    console.log(`  -> Saved bundle-${b.idx}-2.jpg (Product 1 Hero)`);

    // Slide 3: Product 2 Solo Hero
    const out3 = path.join(outDir, `bundle-${b.idx}-3.jpg`);
    const buf3 = await prepareSoloProduct(b.p2);
    fs.writeFileSync(out3, buf3);
    console.log(`  -> Saved bundle-${b.idx}-3.jpg (Product 2 Hero)`);
  }
  console.log('ALL 45 PRODUCT-ONLY BUNDLE IMAGES GENERATED SUCCESSFULLY!');
}

run().catch(err => {
  console.error('Error generating bundle images:', err);
  process.exit(1);
});
