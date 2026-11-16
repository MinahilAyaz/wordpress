const sharp = require('sharp');
const path = require('path');
const dir = 'C:\\Users\\abdul\\Desktop\\wordpress\\nesports-pro-store\\assets\\images';

async function checkWrists() {
  const wrists = [
    'Wrist-Bandage-3.jpg',
    'Wrist-Bandage-1.jpg',
    'Wrist-Bandage-2.jpg',
    'Wrist-Bandage-1-800x800.jpg',
    'Wrist-Bandage-Black-800x800.jpg',
    'Wrist-Bandage-5-e1783863076544.jpg'
  ];

  for (const w of wrists) {
    try {
      const { data, info } = await sharp(path.join(dir, w)).raw().toBuffer({ resolveWithObject: true });
      let nonWhiteR = 0, nonWhiteG = 0, nonWhiteB = 0, count = 0;
      for (let i = 0; i < data.length; i += info.channels) {
        const r = data[i], g = data[i+1], b = data[i+2];
        if (r < 235 || g < 235 || b < 235) {
          nonWhiteR += r;
          nonWhiteG += g;
          nonWhiteB += b;
          count++;
        }
      }
      const avgR = Math.round(nonWhiteR / count);
      const avgG = Math.round(nonWhiteG / count);
      const avgB = Math.round(nonWhiteB / count);
      console.log(`${w}: object color RGB = [${avgR}, ${avgG}, ${avgB}]`);
    } catch (e) {
      console.log(`${w}: error or missing`);
    }
  }
}
checkWrists();
