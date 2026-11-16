const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const dir = 'C:\\Users\\abdul\\Desktop\\wordpress\\nesports-pro-store\\assets\\images';

async function checkAllBagsVariance() {
  const bags = fs.readdirSync(dir).filter(f => /bag/i.test(f));
  for (const b of bags) {
    const stats = await sharp(path.join(dir, b)).stats();
    console.log(`${b}: stdev = [${stats.channels.map(c => c.stdev.toFixed(1)).join(', ')}]`);
  }
}
checkAllBagsVariance();
