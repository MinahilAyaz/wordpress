const sharp = require('sharp');
const path = require('path');
const dir = 'C:\\Users\\abdul\\Desktop\\wordpress\\nesports-pro-store\\assets\\images';

async function samplePoints() {
  const meta = await sharp(path.join(dir, 'Gym-Bag-scaled.jpg')).metadata();
  console.log('Size:', meta.width, meta.height);
  const coords = [
    [100, 100],
    [500, 500],
    [1280, 1280],
    [1280, 500],
    [1280, 2000],
    [2000, 2000]
  ];
  for (const [x, y] of coords) {
    const s = await sharp(path.join(dir, 'Gym-Bag-scaled.jpg')).extract({ left: x, top: y, width: 10, height: 10 }).stats();
    console.log(`(${x}, ${y}) => [${s.channels.map(c => Math.round(c.mean)).join(', ')}]`);
  }
}
samplePoints();
