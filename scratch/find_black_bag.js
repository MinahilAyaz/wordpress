const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function findBlackBag() {
  const dir = 'C:\\Users\\abdul\\Desktop\\wordpress\\nesports-pro-store\\assets\\images';
  const files = fs.readdirSync(dir).filter(f => /bag/i.test(f));
  for (const f of files) {
    const meta = await sharp(path.join(dir, f)).metadata();
    // sample 5 points across the middle of the bag
    const p1 = await sharp(path.join(dir, f)).extract({ left: Math.floor(meta.width*0.5), top: Math.floor(meta.height*0.5), width: 10, height: 10 }).stats();
    console.log(`${f} [${meta.width}x${meta.height}] center: R:${Math.round(p1.channels[0].mean)} G:${Math.round(p1.channels[1].mean)} B:${Math.round(p1.channels[2].mean)}`);
  }
}
findBlackBag();
