const sharp = require('sharp');
const path = require('path');
const dir = 'C:\\Users\\abdul\\Desktop\\wordpress\\nesports-pro-store\\assets\\images';

async function checkBags() {
  const bags = [
    'Gym-Bag-scaled.jpg',
    'Gym-Bag-1-800x800.jpg',
    'Gym-Bag-1-scaled.jpg',
    'Gym-Bag-2-scaled.jpg',
    'Gym-Bag-3-scaled.jpg',
    'Gym-Bag-4-scaled.jpg',
    'Gym-bag-5-scaled.jpg',
    'Gym-Bag-8-800x800.jpg',
    'Gym-Bag-9-800x800.jpg',
    'Gym-Bag-1-2-800x800.jpg'
  ];

  for (const b of bags) {
    const meta = await sharp(path.join(dir, b)).metadata();
    const center = await sharp(path.join(dir, b))
      .extract({ left: Math.floor(meta.width * 0.4), top: Math.floor(meta.height * 0.4), width: 100, height: 100 })
      .stats();
    console.log(`${b}: center RGB = [${center.channels.map(c => Math.round(c.mean)).join(', ')}]`);
  }
}
checkBags();
