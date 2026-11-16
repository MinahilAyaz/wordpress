const sharp = require('sharp');

async function testSC() {
  const meta = await sharp('C:\\Users\\abdul\\Desktop\\wordpress\\nesports-pro-store\\assets\\images\\clothing\\Strength-Club-Blue-Model-Front.jpg').metadata();
  console.log('Blue front dimensions:', meta.width, meta.height);

  // Let's sample a few regions:
  // Top (face/head)
  const top = await sharp('C:\\Users\\abdul\\Desktop\\wordpress\\nesports-pro-store\\assets\\images\\clothing\\Strength-Club-Blue-Model-Front.jpg')
    .extract({ left: Math.floor(meta.width * 0.45), top: Math.floor(meta.height * 0.1), width: 50, height: 50 })
    .stats();
  // Chest (shirt)
  const chest = await sharp('C:\\Users\\abdul\\Desktop\\wordpress\\nesports-pro-store\\assets\\images\\clothing\\Strength-Club-Blue-Model-Front.jpg')
    .extract({ left: Math.floor(meta.width * 0.45), top: Math.floor(meta.height * 0.45), width: 50, height: 50 })
    .stats();

  console.log('Top (head) RGB:', top.channels.map(c => Math.round(c.mean)));
  console.log('Chest (shirt) RGB:', chest.channels.map(c => Math.round(c.mean)));
}
testSC();
