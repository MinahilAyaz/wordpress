const sharp = require('sharp');
const path = require('path');
const dir = 'C:\\Users\\abdul\\Desktop\\wordpress\\nesports-pro-store\\assets\\images';

async function testBagColors() {
  const meta = await sharp(path.join(dir, 'Gym-Bag-scaled.jpg')).metadata();
  console.log('Gym-Bag-scaled metadata:', meta.width, meta.height);

  // Sample corner (background)
  const bg = await sharp(path.join(dir, 'Gym-Bag-scaled.jpg')).extract({ left: 10, top: 10, width: 20, height: 20 }).stats();
  console.log('Background RGB:', bg.channels.map(c => Math.round(c.mean)));

  // Sample bag body (middle)
  const body = await sharp(path.join(dir, 'Gym-Bag-scaled.jpg')).extract({ left: Math.round(meta.width * 0.5), top: Math.round(meta.height * 0.55), width: 50, height: 50 }).stats();
  console.log('Body RGB:', body.channels.map(c => Math.round(c.mean)));
}
testBagColors();
