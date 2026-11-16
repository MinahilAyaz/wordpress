const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function testCrop() {
  const dir = 'C:\\Users\\abdul\\Desktop\\wordpress\\nesports-pro-store\\assets\\images\\clothing';
  
  // Let's examine model-pro-coach-green-sq.jpg
  const proCoach = path.join(dir, 'model-pro-coach-green-sq.jpg');
  if (fs.existsSync(proCoach)) {
    const meta = await sharp(proCoach).metadata();
    console.log('model-pro-coach-green-sq:', meta.width, meta.height);
  }

  // Let's examine Strength-Club-Blue-Model-Front.jpg
  const scFront = path.join(dir, 'Strength-Club-Blue-Model-Front.jpg');
  if (fs.existsSync(scFront)) {
    const meta = await sharp(scFront).metadata();
    console.log('Strength-Club-Blue-Model-Front:', meta.width, meta.height);
  }

  // Let's examine Anime-1.jpg
  const a1 = path.join(dir, 'Anime-1.jpg');
  if (fs.existsSync(a1)) {
    const meta = await sharp(a1).metadata();
    console.log('Anime-1:', meta.width, meta.height);
  }

  // Let's examine Shop-The-Look-1.jpg
  const stl = path.join(dir, 'Shop-The-Look-1.jpg');
  if (fs.existsSync(stl)) {
    const meta = await sharp(stl).metadata();
    console.log('Shop-The-Look-1:', meta.width, meta.height);
  }
}
testCrop();
