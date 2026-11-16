const sharp = require('sharp');
const path = require('path');

async function inspectPrimary() {
  const dir = 'C:\\Users\\abdul\\Desktop\\wordpress\\nesports-pro-store\\assets\\images\\clothing';
  const primaries = [
    'model-strength-club-back.jpg',
    'model-lift-the-world-back.jpg',
    'model-anime-back.jpg',
    'model-son-of-the-west-back.jpg',
    'model-pro-coach-back.jpg'
  ];

  for (const p of primaries) {
    const meta = await sharp(path.join(dir, p)).metadata();
    console.log(p, meta.width, 'x', meta.height);
  }
}
inspectPrimary();
