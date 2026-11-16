const sharp = require('sharp');
const fs = require('fs');

async function checkLetterColors() {
  const { data, info } = await sharp('C:/Users/abdul/.gemini/antigravity/brain/818c7688-cf50-49cd-94b6-702cb73a4218/.user_uploaded/media_1794852411104_f27de6d5.png')
    .raw().toBuffer({ resolveWithObject: true });

  // Sample across horizontal line y = 50 (middle of text)
  // info.width = 275, info.height = 99
  const y = 50;
  for (let x = 80; x < info.width; x += 15) {
    const idx = (y * info.width + x) * 4;
    const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
    if (a > 100) {
      const isRed = r > 150 && g < 50;
      const isBlack = r < 50 && g < 50 && b < 50;
      console.log(`x=${x}: RGBA(${r},${g},${b},${a}) -> ${isRed ? 'RED' : isBlack ? 'BLACK' : 'OTHER'}`);
    }
  }
}

checkLetterColors();
