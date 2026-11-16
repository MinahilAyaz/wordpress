const sharp = require('sharp');
const path = require('path');
const dir = 'C:\\Users\\abdul\\Desktop\\wordpress\\nesports-pro-store\\assets\\images';

async function checkMoreBags() {
  const bags = ['Gym-Bag-1-scaled.jpg', 'Gym-Bag-2-scaled.jpg', 'Gym-Bag-3-scaled.jpg', 'Gym-Bag-4-scaled.jpg', 'Gym-bag-5-scaled.jpg'];
  for (const b of bags) {
    const { data, info } = await sharp(path.join(dir, b)).raw().toBuffer({ resolveWithObject: true });
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
    console.log(`${b}: object color RGB = [${avgR}, ${avgG}, ${avgB}] (count=${count})`);
  }
}
checkMoreBags();
