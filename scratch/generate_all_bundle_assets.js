const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgDir = path.resolve('nesports-pro-store/assets/images');
const outDir = path.resolve('nesports-pro-store/assets/images/bundles');
const brainDir = path.resolve('C:/Users/abdul/.gemini/antigravity/brain/818c7688-cf50-49cd-94b6-702cb73a4218');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. Helper to remove near-white background by border flood-fill
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

// 2. Generate soft radial contact shadow SVG
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

// 3. Composite 2 products into a luxury studio duo shot
async function composeStudioPair(file1, file2, options = {}) {
  const canvasSize = 1000;
  const p1 = path.isAbsolute(file1) ? file1 : path.join(imgDir, file1);
  const p2 = path.isAbsolute(file2) ? file2 : path.join(imgDir, file2);

  const t1 = await removeBgFlood(p1, options.threshold || 235);
  const t2 = await removeBgFlood(p2, options.threshold || 235);

  const isSwap = options.swap || false;
  const primTrim = isSwap ? t2 : t1;
  const secTrim = isSwap ? t1 : t2;

  const primMaxW = options.primW || 500;
  const primMaxH = options.primH || 620;
  const secMaxW = options.secW || 480;
  const secMaxH = options.secH || 540;

  const primItem = await sharp(primTrim.data).resize(primMaxW, primMaxH, { fit: 'inside' }).toBuffer({ resolveWithObject: true });
  const secItem = await sharp(secTrim.data).resize(secMaxW, secMaxH, { fit: 'inside' }).toBuffer({ resolveWithObject: true });

  const primShadowW = Math.round(primItem.info.width * 0.95);
  const primShadowH = Math.max(28, Math.round(primItem.info.height * 0.12));
  const primShadow = await sharp(generateFloorShadowSvg(primShadowW, primShadowH, 0.24)).png().toBuffer();

  const secShadowW = Math.round(secItem.info.width * 0.95);
  const secShadowH = Math.max(26, Math.round(secItem.info.height * 0.12));
  const secShadow = await sharp(generateFloorShadowSvg(secShadowW, secShadowH, 0.28)).png().toBuffer();

  // Positions on 1000x1000 canvas:
  // Primary slightly left & higher, secondary slightly right & lower
  const primLeft = Math.round(140 + (420 - primItem.info.width) / 2);
  const primTop = Math.round(160 + (580 - primItem.info.height) / 2);

  const secLeft = Math.round(480 + (440 - secItem.info.width) / 2);
  const secTop = Math.round(260 + (580 - secItem.info.height) / 2);

  const primShadowTop = primTop + primItem.info.height - Math.round(primShadowH * 0.55);
  const secShadowTop = secTop + secItem.info.height - Math.round(secShadowH * 0.55);

  const composites = [
    { input: primShadow, top: primShadowTop, left: primLeft + Math.round((primItem.info.width - primShadowW) / 2) },
    { input: primItem.data, top: primTop, left: primLeft },
    { input: secShadow, top: secShadowTop, left: secLeft + Math.round((secItem.info.width - secShadowW) / 2) },
    { input: secItem.data, top: secTop, left: secLeft }
  ];

  return sharp({
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
}

// 4. Prepare Square Model Photo for Slide 1
async function prepareModelSlide(srcPath, destPath, options = {}) {
  const p = path.isAbsolute(srcPath) ? srcPath : path.join(imgDir, srcPath);
  const meta = await sharp(p).metadata();

  const size = 1000;
  let pipeline = sharp(p);

  if (options.modColor === 'blue') {
    // Hue shift towards blue if needed
    pipeline = pipeline.modulate({ hue: 200 });
  }

  await pipeline
    .resize(size, size, { fit: 'cover', position: options.position || 'center' })
    .jpeg({ quality: 92, chromaSubsampling: '4:4:4' })
    .toFile(destPath);
}

// 5. Bundle Definitions
const bundleDefs = [
  // 1. Pull Day Pack (Blue)
  {
    idx: 1,
    model: path.join(brainDir, 'bundle_lifting_pack_blue_1794826800910.jpg'),
    s2: ['A2.jpg', 'Wrist-Bandage-Black-800x800.jpg'],
    s3: ['A3-1-800x800.jpg', 'Wrist-Bandage-1-800x800.jpg', { swap: true }]
  },
  // 2. Heavy Lifter Pack (Black)
  {
    idx: 2,
    model: path.join(brainDir, 'bundle_heavy_lifter_pack_black_1794826836025.jpg'),
    s2: ['1-800x800.jpg', 'Wrist-Bandage-Black-800x800.jpg'],
    s3: ['2-800x800.jpg', 'Wrist-Bandage-1-800x800.jpg', { swap: true }]
  },
  // 3. Pro Powerlifting Pack
  {
    idx: 3,
    model: path.join(brainDir, 'bundle_pro_powerlifting_pack_1794826863583.jpg'),
    s2: ['DSC_0167-scaled-1.jpg', '1-800x800.jpg'],
    s3: ['DSC_0166-scaled-1.jpg', '2-800x800.jpg', { swap: true }]
  },
  // 4. Grip & Wrist Armor Pack
  {
    idx: 4,
    model: path.join(imgDir, 'hero-lifting-straps.png'),
    s2: ['WhatsApp-Image-2024-07-08-at-19.20.29_ba3cfe08-800x800.jpg', 'Wrist-Bandage-Black-800x800.jpg'],
    s3: ['WhatsApp-Image-2024-07-08-at-19.20.29_13856fb5-Copy-800x800.jpg', 'Wrist-Bandage-1-800x800.jpg', { swap: true }]
  },
  // 5. Deadlift & Dip Belt Pack
  {
    idx: 5,
    model: path.join(imgDir, 'belt-crimson-red-model-800x800.jpg'),
    s2: ['Dip-Belt-800x800.jpg', '2-red-800x800.jpg'],
    s3: ['Dip-Belt-1-800x800.jpg', 'A8-800x800.jpg', { swap: true }]
  },
  // 6. Red Edition Squat Pack
  {
    idx: 6,
    model: path.join(brainDir, 'photo_6_red_squat_pack_1794826836557.jpg'),
    s2: ['2-red-800x800.jpg', 'Knee-Wrap-800x800.jpg'],
    s3: ['A8-800x800.jpg', 'Knee-wrap-1-800x800.jpg', { swap: true }]
  },
  // 7. Leg Day Pack (Blue)
  {
    idx: 7,
    model: path.join(brainDir, 'photo_6_red_squat_pack_1794826836557.jpg'),
    modelOpts: { modColor: 'blue' },
    s2: ['WhatsApp-Image-2024-07-08-at-19.20.29_ba3cfe08-800x800.jpg', 'Knee-Wrap-9-800x800.jpg'],
    s3: ['WhatsApp-Image-2024-07-08-at-19.20.29_13856fb5-Copy-800x800.jpg', 'Kne-wrap-4-800x800.jpg', { swap: true }]
  },
  // 8. Competition Knee & Belt Pack
  {
    idx: 8,
    model: path.join(imgDir, 'hero-knee-wrap.png'),
    s2: ['WhatsApp-Image-2024-07-08-at-19.21.32_c020a8d1.jpg', 'Knee-Wrap-800x800.jpg'],
    s3: ['WhatsApp-Image-2024-07-08-at-19.21.33_efbbace4.jpg', 'Knee-wrap-1-800x800.jpg', { swap: true }]
  },
  // 9. Heavy Duty Joint Support Pack
  {
    idx: 9,
    model: path.join(imgDir, 'hero-slide-knee-wraps.jpg'),
    s2: ['Knee-Wrap-800x800.jpg', 'Knee-Wrap-9-800x800.jpg'],
    s3: ['Knee-wrap-1-800x800.jpg', 'Kne-wrap-4-800x800.jpg', { swap: true }]
  },
  // 10. Squat Pad & Knee Wrap Pack
  {
    idx: 10,
    model: path.join(imgDir, 'hero-slide-knee-wraps.jpg'),
    s2: ['Barbell-Pad-5-scaled.jpg', 'Knee-Wrap-800x800.jpg'],
    s3: ['DSC_0179-Copy-scaled-1.jpg', 'Knee-wrap-1-800x800.jpg', { swap: true }]
  },
  // 11. Gym Carry Pack (Gray)
  {
    idx: 11,
    model: path.join(brainDir, 'photo_11_gym_carry_pack_gray_1794826795975.jpg'),
    s2: ['Gym-Bag-9-800x800.jpg', 'Wrist-Bandage-Black-800x800.jpg'],
    s3: ['Gym-Bag-1-2-800x800.jpg', 'Wrist-Bandage-1-800x800.jpg', { swap: true }]
  },
  // 12. Speed & Strength Pack
  {
    idx: 12,
    model: path.join(brainDir, 'photo_12_speed_strength_pack_blue_1794826815793.jpg'),
    s2: ['1-1-2-800x800.jpg', 'Gym-Bag-8-800x800.jpg'],
    s3: ['2-1-2-800x800.jpg', 'Gym-Bag-1-800x800.jpg', { swap: true }]
  },
  // 13. Speed Reflex Pro Pack
  {
    idx: 13,
    model: path.join(brainDir, 'photo_13_speed_reflex_pro_pack_gray_1794826849333.jpg'),
    s2: ['1-1-1-800x800.jpg', 'Gym-Bag-9-800x800.jpg'],
    s3: ['2-1-1-800x800.jpg', 'Gym-Bag-1-2-800x800.jpg', { swap: true }]
  },
  // 14. Athlete Conditioning Pack
  {
    idx: 14,
    model: path.join(imgDir, 'hero-speed-ball.png'),
    s2: ['1-1-800x800.jpg', 'Gym-Bag-8-800x800.jpg'],
    s3: ['2-1-800x800.jpg', 'Gym-Bag-1-800x800.jpg', { swap: true }]
  },
  // 15. Glute & Carry Essentials Pack
  {
    idx: 15,
    model: path.join(imgDir, 'clothing/trousers-lifter-sweatpants.jpg'),
    s2: ['Ankle-Strap-Cable-pull-scaled.jpg', 'Gym-Bag-scaled.jpg'],
    s3: ['Ankle-Strap-Cable-pull-1-scaled.jpg', 'Gym-Bag-1-scaled.jpg', { swap: true }]
  }
];

async function run() {
  console.log('Starting master generation for 15 bundles (45 images)...');
  for (const b of bundleDefs) {
    const idx = b.idx;
    console.log(`Processing Bundle ${idx}...`);

    // 1. Slide 1 (Model wearing gear)
    const out1 = path.join(outDir, `bundle-${idx}-1.jpg`);
    await prepareModelSlide(b.model, out1, b.modelOpts || {});
    console.log(`  -> Saved bundle-${idx}-1.jpg (Model)`);

    // 2. Slide 2 (Studio Pair)
    const out2 = path.join(outDir, `bundle-${idx}-2.jpg`);
    const buf2 = await composeStudioPair(b.s2[0], b.s2[1], b.s2[2] || {});
    fs.writeFileSync(out2, buf2);
    console.log(`  -> Saved bundle-${idx}-2.jpg (Studio Pair)`);

    // 3. Slide 3 (Alternate Studio Pair)
    const out3 = path.join(outDir, `bundle-${idx}-3.jpg`);
    const buf3 = await composeStudioPair(b.s3[0], b.s3[1], b.s3[2] || {});
    fs.writeFileSync(out3, buf3);
    console.log(`  -> Saved bundle-${idx}-3.jpg (Alternate Studio Pair)`);
  }
  console.log('ALL 45 BUNDLE IMAGES GENERATED SUCCESSFULLY!');
}

run().catch(err => {
  console.error('Error generating bundle images:', err);
  process.exit(1);
});
