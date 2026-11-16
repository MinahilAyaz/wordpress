const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function extractTransparentShirt(filePath) {
  const { data, info } = await sharp(filePath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r > 230 && g > 230 && b > 230) {
      data[i + 3] = 0;
    } else if (r > 200 && g > 200 && b > 200) {
      const diff = Math.max(r, g, b) - 200;
      data[i + 3] = Math.max(0, Math.min(255, Math.round(255 - (diff / 30) * 255)));
    }
  }
  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 }
  }).png().toBuffer();
}

async function buildAllHovers() {
  const dir = 'C:\\Users\\abdul\\Desktop\\wordpress\\nesports-pro-store\\assets\\images\\clothing';
  const W = 896;
  const H = 1200;

  // Helper to create gym background from base model image
  async function makeGymBg(baseImgName) {
    return await sharp(path.join(dir, baseImgName))
      .resize(W, H, { fit: 'cover' })
      .blur(16)
      .modulate({ brightness: 0.55, saturation: 0.75 })
      .toBuffer();
  }

  // 1. STRENGTH CLUB
  console.log('1. STRENGTH CLUB...');
  const scBg = await makeGymBg('model-strength-club-back.jpg');
  const scShirtPng = await extractTransparentShirt(path.join(dir, 'norm-strength-club-black-front.jpg'));
  const scShirtResized = await sharp(scShirtPng).resize(700, 700, { fit: 'inside' }).toBuffer();
  // Get dimensions of resized shirt
  const scMeta = await sharp(scShirtResized).metadata();
  const scLeft = Math.round((W - scMeta.width) / 2);
  const scTop = Math.round((H - scMeta.height) / 2) - 30;

  await sharp(scBg)
    .composite([{ input: scShirtResized, left: scLeft, top: scTop }])
    .jpeg({ quality: 92 })
    .toFile(path.join(dir, 'model-strength-club-hover.jpg'));

  // 2. LIFT THE WORLD
  console.log('2. LIFT THE WORLD...');
  const ltwBg = await makeGymBg('model-lift-the-world-back.jpg');
  const ltwShirtPng = await extractTransparentShirt(path.join(dir, 'norm-lift-the-world-black.jpg'));
  const ltwShirtResized = await sharp(ltwShirtPng).resize(700, 700, { fit: 'inside' }).toBuffer();
  const ltwMeta = await sharp(ltwShirtResized).metadata();
  const ltwLeft = Math.round((W - ltwMeta.width) / 2);
  const ltwTop = Math.round((H - ltwMeta.height) / 2) - 30;

  await sharp(ltwBg)
    .composite([{ input: ltwShirtResized, left: ltwLeft, top: ltwTop }])
    .jpeg({ quality: 92 })
    .toFile(path.join(dir, 'model-lift-the-world-hover.jpg'));

  // 3. ANIME
  console.log('3. ANIME...');
  const animeBg = await makeGymBg('model-anime-back.jpg');
  const animeShirtPng = await extractTransparentShirt(path.join(dir, 'cat-anime.jpg'));
  const animeShirtResized = await sharp(animeShirtPng).resize(700, 700, { fit: 'inside' }).toBuffer();
  const animeMeta = await sharp(animeShirtResized).metadata();
  const animeLeft = Math.round((W - animeMeta.width) / 2);
  const animeTop = Math.round((H - animeMeta.height) / 2) - 30;

  await sharp(animeBg)
    .composite([{ input: animeShirtResized, left: animeLeft, top: animeTop }])
    .jpeg({ quality: 92 })
    .toFile(path.join(dir, 'model-anime-hover.jpg'));

  // 4. SON OF THE WEST
  console.log('4. SON OF THE WEST...');
  const sotwBg = await makeGymBg('model-son-of-the-west-back.jpg');
  const sotwShirtPng = await extractTransparentShirt(path.join(dir, 'cat-son-of-the-west.jpg'));
  const sotwShirtResized = await sharp(sotwShirtPng).resize(700, 700, { fit: 'inside' }).toBuffer();
  const sotwMeta = await sharp(sotwShirtResized).metadata();
  const sotwLeft = Math.round((W - sotwMeta.width) / 2);
  const sotwTop = Math.round((H - sotwMeta.height) / 2) - 30;

  await sharp(sotwBg)
    .composite([{ input: sotwShirtResized, left: sotwLeft, top: sotwTop }])
    .jpeg({ quality: 92 })
    .toFile(path.join(dir, 'model-son-of-the-west-hover.jpg'));

  // 5. PRO COACH
  console.log('5. PRO COACH...');
  const pcBg = await makeGymBg('model-pro-coach-back.jpg');
  const pcShirtPng = await extractTransparentShirt(path.join(dir, 'norm-pro-coach-green-front.jpg'));
  const pcShirtResized = await sharp(pcShirtPng).resize(700, 700, { fit: 'inside' }).toBuffer();
  const pcMeta = await sharp(pcShirtResized).metadata();
  const pcLeft = Math.round((W - pcMeta.width) / 2);
  const pcTop = Math.round((H - pcMeta.height) / 2) - 30;

  await sharp(pcBg)
    .composite([{ input: pcShirtResized, left: pcLeft, top: pcTop }])
    .jpeg({ quality: 92 })
    .toFile(path.join(dir, 'model-pro-coach-hover.jpg'));

  // 6. HOODIE (use hoodie-pro-coach-front.jpg)
  console.log('6. HOODIE...');
  await sharp(path.join(dir, 'hoodie-pro-coach-front.jpg'))
    .resize(W, H, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 92 })
    .toFile(path.join(dir, 'model-hoodie-hover.jpg'));

  // 7. TROUSERS
  console.log('7. TROUSERS...');
  await sharp(path.join(dir, 'trousers-lifter-sweatpants.jpg'))
    .flop()
    .resize(W, H, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 92 })
    .toFile(path.join(dir, 'model-trousers-hover.jpg'));

  console.log('ALL 7 HOVER IMAGES BUILT SUCCESSFULLY!');
}

buildAllHovers().catch(console.error);
