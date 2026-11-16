const sharp = require('sharp');
const path = require('path');

async function testTransparency() {
  const dir = 'C:\\Users\\abdul\\Desktop\\wordpress\\nesports-pro-store\\assets\\images\\clothing';
  const src = path.join(dir, 'norm-strength-club-black-front.jpg');

  // Load raw pixels
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  
  // Set alpha = 0 for near-white pixels
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r > 235 && g > 235 && b > 235) {
      data[i + 3] = 0; // transparent
    } else if (r > 215 && g > 215 && b > 215) {
      // Soft edge feathering
      const diff = Math.max(r, g, b) - 215;
      data[i + 3] = Math.max(0, Math.min(255, Math.round(255 - (diff / 20) * 255)));
    }
  }

  const transBuffer = await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  }).png().toBuffer();

  console.log('Created transparent shirt buffer, length:', transBuffer.length);
}
testTransparency();
