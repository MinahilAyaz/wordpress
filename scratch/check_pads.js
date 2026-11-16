const sharp = require('sharp');
const path = require('path');
const dir = 'C:\\Users\\abdul\\Desktop\\wordpress\\nesports-pro-store\\assets\\images';

async function checkPads() {
  const pads = [
    'DSC_0177-scaled-1.jpg',
    'DSC_0179-Copy-scaled-1.jpg',
    'Barbell-Pad-1-scaled.jpg',
    'Barbell-Pad-2-scaled.jpg',
    'Barbell-Pad-3-scaled.jpg',
    'Barbell-Pad-4-scaled.jpg',
    'Barbell-Pad-5-scaled.jpg'
  ];

  for (const p of pads) {
    try {
      const { data, info } = await sharp(path.join(dir, p)).raw().toBuffer({ resolveWithObject: true });
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
      console.log(`${p}: object color RGB = [${avgR}, ${avgG}, ${avgB}]`);
    } catch (e) {
      console.log(`${p}: error or missing`);
    }
  }
}
checkPads();
