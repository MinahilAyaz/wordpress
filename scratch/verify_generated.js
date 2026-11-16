const sharp = require('sharp');
const path = require('path');
const dir = 'C:\\Users\\abdul\\Desktop\\wordpress\\nesports-pro-store\\assets\\images';

async function verifyGenerated() {
  const list = [
    'knee-wrap-blue-1.jpg',
    'knee-wrap-blue-2.jpg',
    'knee-wrap-blue-3.jpg',
    'barbell-pad-blue-1.jpg',
    'barbell-pad-blue-2.jpg',
    'barbell-pad-blue-3.jpg',
    'gym-bag-blue-1.jpg',
    'gym-bag-blue-2.jpg',
    'gym-bag-blue-3.jpg',
    'gym-bag-black-1.jpg',
    'gym-bag-black-2.jpg',
    'gym-bag-black-3.jpg',
    'wrist-bandage-gold-1.jpg',
    'wrist-bandage-gold-2.jpg',
    'wrist-bandage-gold-3.jpg',
    'speed-ball-gold-1.jpg',
    'speed-ball-gold-2.jpg',
    'speed-ball-gold-3.jpg'
  ];

  for (const f of list) {
    const meta = await sharp(path.join(dir, f)).metadata();
    const stats = await sharp(path.join(dir, f)).stats();
    console.log(`${f} [${meta.width}x${meta.height}] RGB: R:${Math.round(stats.channels[0].mean)} G:${Math.round(stats.channels[1].mean)} B:${Math.round(stats.channels[2].mean)}`);
  }
}
verifyGenerated();
