const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgDir = path.resolve(__dirname, '../nesports-pro-store/assets/images/');
const outDir = path.resolve(__dirname, '../nesports-pro-store/assets/images/bundles/');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const defs = [
  ['Pull Day Pack (Blue)', 'lifting-strap-padded-blue', 'wrist-bandages-45-cm-wrist-black-2'],
  ['Heavy Lifter Pack (Black)', 'lifting-straps-with-extra-padded-black', 'wrist-bandages-45-cm-wrist-black-2'],
  ['Pro Powerlifting Pack', 'pro-leather-weightlifting-lever-belt-10mm', 'lifting-straps-with-extra-padded-black'],
  ['Grip & Wrist Armor Pack', 'lifting-straps-padded-blue-2', 'wrist-bandages-45-cm-wrist-black-2'],
  ['Deadlift & Dip Belt Pack', 'quick-release-lever-power-belt', 'lifting-strap-padded-red'],
  ['Red Edition Squat Pack', 'lifting-strap-padded-red', 'knee-wrap'],
  ['Leg Day Pack (Blue)', 'lifting-straps-padded-blue-2', 'knee-wrap-copy'],
  ['Competition Knee & Belt Pack', 'competition-weightlifting-belt-13mm-black', 'knee-wrap'],
  ['Heavy Duty Joint Support Pack', 'heavy-duty-neoprene-elbow-wraps', 'knee-wrap-copy'],
  ['Squat Pad & Knee Wrap Pack', 'barbell-pad-black', 'knee-wrap'],
  ['Gym Carry Pack (Gray)', 'water-proof-gym-bag-gray', 'wrist-bandages-45-cm-wrist-black-2'],
  ['Speed & Strength Pack', 'speed-ball-set-maya-hide-leather-red-black', 'water-proof-gym-bag-blue'],
  ['Speed Reflex Pro Pack', 'speed-ball-set-maya-hide-leather-2', 'water-proof-gym-bag-gray'],
  ['Athlete Conditioning Pack', 'speed-ball-set-maya-hide-leather', 'water-proof-gym-bag-blue'],
  ['Glute & Carry Essentials Pack', 'ankle-strap-black', 'water-proof-gym-bag-black']
];

const content = fs.readFileSync(path.resolve(__dirname, '../nesports-pro-store/includes/helpers.php'), 'utf8');
const pLines = content.split('\n');
const slugMap = {};
pLines.forEach(l => {
  const m = l.match(/'slug'\s*=>\s*'([^']+)'[\s\S]*?'main'\s*=>\s*'([^']+)'[\s\S]*?'hover'\s*=>\s*'([^']+)'/);
  if (m) {
    slugMap[m[1]] = { main: m[2], hover: m[3] };
  }
});

async function composeDuo(file1, file2, destFile, swap = false) {
  const p1 = path.join(imgDir, swap ? file2 : file1);
  const p2 = path.join(imgDir, swap ? file1 : file2);

  // Trim borders to true product bounding box
  let trimmed1 = await sharp(p1).trim({ threshold: 25 }).toBuffer({ resolveWithObject: true }).catch(async () => {
    return sharp(p1).toBuffer({ resolveWithObject: true });
  });
  let trimmed2 = await sharp(p2).trim({ threshold: 25 }).toBuffer({ resolveWithObject: true }).catch(async () => {
    return sharp(p2).toBuffer({ resolveWithObject: true });
  });

  const canvasSize = 900;
  const maxItemW = 410;
  const maxItemH = 680;

  const item1 = await sharp(trimmed1.data)
    .resize(maxItemW, maxItemH, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .toBuffer({ resolveWithObject: true });

  const item2 = await sharp(trimmed2.data)
    .resize(maxItemW, maxItemH, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .toBuffer({ resolveWithObject: true });

  const gap = 24;
  const totalW = item1.info.width + gap + item2.info.width;
  const startX = Math.max(20, Math.round((canvasSize - totalW) / 2));

  const left1 = startX;
  const top1 = Math.round((canvasSize - item1.info.height) / 2);

  const left2 = startX + item1.info.width + gap;
  const top2 = Math.round((canvasSize - item2.info.height) / 2);

  await sharp({
    create: {
      width: canvasSize,
      height: canvasSize,
      channels: 3,
      background: { r: 255, g: 255, b: 255 }
    }
  })
  .composite([
    { input: item1.data, left: left1, top: top1 },
    { input: item2.data, left: left2, top: top2 }
  ])
  .jpeg({ quality: 92 })
  .toFile(destFile);
}

async function run() {
  console.log('Generating 3 professional duo images for each of the 15 bundles...');
  for (let idx = 0; idx < defs.length; idx++) {
    const [name, s1, s2] = defs[idx];
    const bNum = idx + 1;
    const i1 = slugMap[s1];
    const i2 = slugMap[s2];

    const out1 = path.join(outDir, `bundle-${bNum}-1.jpg`);
    const out2 = path.join(outDir, `bundle-${bNum}-2.jpg`);
    const out3 = path.join(outDir, `bundle-${bNum}-3.jpg`);

    // Angle 1: Primary Main + Secondary Main
    await composeDuo(i1.main, i2.main, out1, false);
    // Angle 2: Primary Hover + Secondary Main (or reverse swap)
    await composeDuo(i1.hover || i1.main, i2.main, out2, false);
    // Angle 3: Primary Main + Secondary Hover (swapped positions for fresh perspective)
    await composeDuo(i2.hover || i2.main, i1.main, out3, false);

    console.log(`Bundle ${bNum} (${name}) generated:`, `bundle-${bNum}-1.jpg, bundle-${bNum}-2.jpg, bundle-${bNum}-3.jpg`);
  }
  console.log('ALL BUNDLE IMAGES GENERATED SUCCESSFULLY!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
