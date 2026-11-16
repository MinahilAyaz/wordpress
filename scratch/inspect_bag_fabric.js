const sharp = require('sharp');
const path = require('path');
const dir = 'C:\\Users\\abdul\\Desktop\\wordpress\\nesports-pro-store\\assets\\images';

async function inspectBagFabric() {
  const meta = await sharp(path.join(dir, 'Gym-Bag-scaled.jpg')).metadata();
  console.log('Gym-Bag-scaled size:', meta.width, meta.height);
  // Sample upper fabric
  const upper = await sharp(path.join(dir, 'Gym-Bag-scaled.jpg'))
    .extract({ left: Math.floor(meta.width * 0.5), top: Math.floor(meta.height * 0.3), width: 50, height: 50 })
    .stats();
  console.log('Upper fabric RGB:', upper.channels.map(c => Math.round(c.mean)));

  const meta8 = await sharp(path.join(dir, 'Gym-Bag-8-800x800.jpg')).metadata();
  const upper8 = await sharp(path.join(dir, 'Gym-Bag-8-800x800.jpg'))
    .extract({ left: Math.floor(meta8.width * 0.5), top: Math.floor(meta8.height * 0.3), width: 50, height: 50 })
    .stats();
  console.log('Gym-Bag-8 upper fabric RGB:', upper8.channels.map(c => Math.round(c.mean)));

  const meta1 = await sharp(path.join(dir, 'Gym-Bag-1-800x800.jpg')).metadata();
  const upper1 = await sharp(path.join(dir, 'Gym-Bag-1-800x800.jpg'))
    .extract({ left: Math.floor(meta1.width * 0.5), top: Math.floor(meta1.height * 0.3), width: 50, height: 50 })
    .stats();
  console.log('Gym-Bag-1 upper fabric RGB:', upper1.channels.map(c => Math.round(c.mean)));
}
inspectBagFabric();
