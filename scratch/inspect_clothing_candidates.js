const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function inspectImages() {
  const dir = 'C:\\Users\\abdul\\Desktop\\wordpress\\nesports-pro-store\\assets\\images\\clothing';
  const files = [
    'model-strength-club-back.jpg',
    'model-lift-the-world-back.jpg',
    'model-anime-back.jpg',
    'model-son-of-the-west-back.jpg',
    'model-pro-coach-back.jpg',
    'hoodie-pro-coach-back.jpg',
    'hoodie-pro-coach-front.jpg',
    'trousers-lifter-sweatpants.jpg',
    'model-pro-coach-green-sq.jpg',
    'model-lift-the-world-red-sq.jpg',
    'Anime-1.jpg',
    'Anime-2.jpg',
    'Anime-6.jpg',
    'Anime_7f0fadc8-522d-45ac-b9e6-8208133f1390.jpg',
    'Shop-The-Look-1.jpg',
    'cat-strength-club.jpg',
    'cat-lift-the-world.jpg',
    'cat-anime.jpg',
    'cat-son-of-the-west.jpg',
    'cat-pro-coach.jpg'
  ];

  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.existsSync(full)) {
      try {
        const meta = await sharp(full).metadata();
        console.log(`${f}: ${meta.width}x${meta.height}, format: ${meta.format}`);
      } catch (e) {
        console.log(`${f}: error reading metadata`);
      }
    } else {
      console.log(`${f}: DOES NOT EXIST`);
    }
  }
}

inspectImages();
