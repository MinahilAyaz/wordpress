const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function checkDetails() {
  const dir = 'C:\\Users\\abdul\\Desktop\\wordpress\\nesports-pro-store\\assets\\images\\clothing';
  const list = [
    'model-strength-club-back.jpg',
    'model-lift-the-world-back.jpg',
    'model-anime-back.jpg',
    'model-son-of-the-west-back.jpg',
    'model-pro-coach-back.jpg',
    'hoodie-pro-coach-back.jpg',
    'hoodie-pro-coach-front.jpg',
    'trousers-lifter-sweatpants.jpg',
    'model-pro-coach-green-sq.jpg',
    'Anime-1.jpg',
    'Anime-2.jpg',
    'Shop-The-Look-1.jpg',
    'Strength-Club-Blue-Model-Front.jpg',
    'Strength-Club-Red-Model-Front.jpg',
    'Strength-Club-White-Model-Front.jpg'
  ];

  for (const f of list) {
    const full = path.join(dir, f);
    if (fs.existsSync(full)) {
      const stat = fs.statSync(full);
      console.log(`${f}: ${stat.size} bytes`);
    }
  }
}
checkDetails();
