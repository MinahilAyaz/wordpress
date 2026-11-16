const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function createHoverImages() {
  const dir = 'C:\\Users\\abdul\\Desktop\\wordpress\\nesports-pro-store\\assets\\images\\clothing';
  const outDir = dir;

  console.log('Building hover images...');

  // 1. STRENGTH CLUB HOVER
  // Base: gym setting with lifter front view in black heavyweight tee
  // We can use a 896x1200 frame with gym background and the black Strength Club front
  const scBackMeta = await sharp(path.join(dir, 'model-strength-club-back.jpg')).metadata();
  // Create an aesthetic dark gym environment from scBack (mirrored/defocused) with front shirt
  const scGymBg = await sharp(path.join(dir, 'model-strength-club-back.jpg'))
    .flop() // horizontally flip background so pose is different angle
    .blur(12)
    .modulate({ brightness: 0.65, saturation: 0.85 })
    .toBuffer();

  const scFrontShirt = await sharp(path.join(dir, 'norm-strength-club-black-front.jpg'))
    .resize(740, 740, { fit: 'inside' })
    .toBuffer();

  await sharp(scGymBg)
    .composite([
      { input: scFrontShirt, top: 260, left: 78, blend: 'over' }
    ])
    .jpeg({ quality: 90 })
    .toFile(path.join(outDir, 'model-strength-club-hover.jpg'));
  console.log('Created model-strength-club-hover.jpg');

  // 2. LIFT THE WORLD HOVER
  const ltwGymBg = await sharp(path.join(dir, 'model-lift-the-world-back.jpg'))
    .flop()
    .blur(12)
    .modulate({ brightness: 0.65, saturation: 0.85 })
    .toBuffer();

  // Front shirt for lift the world black
  const ltwFrontShirt = await sharp(path.join(dir, 'norm-lift-the-world-black.jpg'))
    .resize(740, 740, { fit: 'inside' })
    .toBuffer();

  await sharp(ltwGymBg)
    .composite([
      { input: ltwFrontShirt, top: 260, left: 78, blend: 'over' }
    ])
    .jpeg({ quality: 90 })
    .toFile(path.join(outDir, 'model-lift-the-world-hover.jpg'));
  console.log('Created model-lift-the-world-hover.jpg');

  // 3. ANIME HOVER
  const animeGymBg = await sharp(path.join(dir, 'model-anime-back.jpg'))
    .flop()
    .blur(12)
    .modulate({ brightness: 0.65, saturation: 0.85 })
    .toBuffer();

  const animeFrontShirt = await sharp(path.join(dir, 'cat-anime.jpg'))
    .resize(740, 740, { fit: 'inside' })
    .toBuffer();

  await sharp(animeGymBg)
    .composite([
      { input: animeFrontShirt, top: 260, left: 78, blend: 'over' }
    ])
    .jpeg({ quality: 90 })
    .toFile(path.join(outDir, 'model-anime-hover.jpg'));
  console.log('Created model-anime-hover.jpg');

  // 4. SON OF THE WEST HOVER
  const sotwGymBg = await sharp(path.join(dir, 'model-son-of-the-west-back.jpg'))
    .flop()
    .blur(12)
    .modulate({ brightness: 0.65, saturation: 0.85 })
    .toBuffer();

  const sotwFrontShirt = await sharp(path.join(dir, 'cat-son-of-the-west.jpg'))
    .resize(740, 740, { fit: 'inside' })
    .toBuffer();

  await sharp(sotwGymBg)
    .composite([
      { input: sotwFrontShirt, top: 260, left: 78, blend: 'over' }
    ])
    .jpeg({ quality: 90 })
    .toFile(path.join(outDir, 'model-son-of-the-west-hover.jpg'));
  console.log('Created model-son-of-the-west-hover.jpg');

  // 5. PRO COACH HOVER
  const pcGymBg = await sharp(path.join(dir, 'model-pro-coach-back.jpg'))
    .flop()
    .blur(12)
    .modulate({ brightness: 0.65, saturation: 0.85 })
    .toBuffer();

  const pcFrontShirt = await sharp(path.join(dir, 'norm-pro-coach-green-front.jpg'))
    .resize(740, 740, { fit: 'inside' })
    .toBuffer();

  await sharp(pcGymBg)
    .composite([
      { input: pcFrontShirt, top: 260, left: 78, blend: 'over' }
    ])
    .jpeg({ quality: 90 })
    .toFile(path.join(outDir, 'model-pro-coach-hover.jpg'));
  console.log('Created model-pro-coach-hover.jpg');

  // 6. HOODIE HOVER (we already have hoodie-pro-coach-front.jpg, let's normalize to 896x1200)
  const hoodieFront = await sharp(path.join(dir, 'hoodie-pro-coach-front.jpg'))
    .resize(896, 1200, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 90 })
    .toFile(path.join(outDir, 'model-hoodie-hover.jpg'));
  console.log('Created model-hoodie-hover.jpg');

  // 7. TROUSERS HOVER
  const trousersFront = await sharp(path.join(dir, 'trousers-lifter-sweatpants.jpg'))
    .flop()
    .resize(896, 1200, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 90 })
    .toFile(path.join(outDir, 'model-trousers-hover.jpg'));
  console.log('Created model-trousers-hover.jpg');
}

createHoverImages().catch(console.error);
