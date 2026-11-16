const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function analyze() {
  const dir = 'C:\\Users\\abdul\\Desktop\\wordpress\\nesports-pro-store\\assets\\images\\clothing';
  const files = [
    'Anime-1.jpg',
    'Anime-2.jpg',
    'Shop-The-Look-1.jpg',
    'model-pro-coach-green-sq.jpg',
    'Black NE3Sports Strength Club T-Shirt.png',
    'Black NE3Sports Strength Club T-Shirt (1).png',
    'Lift-The-World-T-Shirt-Black-1.jpg',
    'Strength-Club-Blue-Model-Front.jpg',
    'hoodie-pro-coach-front.jpg'
  ];

  for (const f of files) {
    const full = path.join(dir, f);
    if (!fs.existsSync(full)) {
      console.log(f, 'not found');
      continue;
    }
    const meta = await sharp(full).metadata();
    const stats = await sharp(full).stats();
    console.log(`\n=== ${f} ===`);
    console.log(`Dimensions: ${meta.width}x${meta.height}, channels: ${meta.channels}`);
    console.log(`Mean color: R:${Math.round(stats.channels[0].mean)} G:${Math.round(stats.channels[1].mean)} B:${Math.round(stats.channels[2].mean)}`);
  }
}
analyze();
