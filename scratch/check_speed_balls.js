const sharp = require('sharp');
const path = require('path');
const dir = 'C:\\Users\\abdul\\Desktop\\wordpress\\nesports-pro-store\\assets\\images';

async function checkSpeedBalls() {
  const balls = ['1-1-800x800.jpg', '1-1-1-800x800.jpg', '1-1-2-800x800.jpg', 'hero-speed-ball.png'];
  for (const b of balls) {
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
    console.log(`${b}: object color RGB = [${avgR}, ${avgG}, ${avgB}]`);
  }
}
checkSpeedBalls();
