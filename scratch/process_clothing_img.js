const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function process() {
  const src = 'nesports-pro-store/assets/images/clothing/Strength-Club-White-Flat.jpg';
  const img = sharp(src);
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });

  const bgR = data[0], bgG = data[1], bgB = data[2];
  const rgba = Buffer.alloc(info.width * info.height * 4);

  for (let i = 0; i < info.width * info.height; i++) {
    const r = data[i * 3];
    const g = data[i * 3 + 1];
    const b = data[i * 3 + 2];
    
    const dist = Math.sqrt(
      Math.pow(r - bgR, 2) + 
      Math.pow(g - bgG, 2) + 
      Math.pow(b - bgB, 2)
    );

    rgba[i * 4] = r;
    rgba[i * 4 + 1] = g;
    rgba[i * 4 + 2] = b;

    if (dist < 18) {
      rgba[i * 4 + 3] = 0;
    } else if (dist < 35) {
      rgba[i * 4 + 3] = Math.round(((dist - 18) / 17) * 255);
    } else {
      rgba[i * 4 + 3] = 255;
    }
  }

  const transparentShirt = await sharp(rgba, {
    raw: { width: info.width, height: info.height, channels: 4 }
  })
  .extract({ left: 43, top: 246, width: 813, height: 712 })
  .resize(979, 857)
  .png()
  .toBuffer();

  const outDest = 'nesports-pro-store/assets/images/clothing/cat-strength-club.jpg';
  await sharp({
    create: {
      width: 1200,
      height: 1500,
      channels: 3,
      background: { r: 247, g: 247, b: 247 }
    }
  })
  .composite([
    {
      input: transparentShirt,
      left: 110,
      top: 160
    }
  ])
  .jpeg({ quality: 96 })
  .toFile(outDest);

  console.log('Successfully regenerated cat-strength-club.jpg');
}

process().catch(err => {
  console.error(err);
  process.exit(1);
});
