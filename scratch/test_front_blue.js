const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function testFronts() {
  const dir = 'C:\\Users\\abdul\\Desktop\\wordpress\\nesports-pro-store\\assets\\images\\clothing';
  const imgPath = path.join(dir, 'Strength-Club-Blue-Model-Front.jpg');
  const meta = await sharp(imgPath).metadata();
  console.log('Strength-Club-Blue-Model-Front:', meta);

  // Let's see color stats
  const stats = await sharp(imgPath).stats();
  console.log('Stats:', stats.channels.map(c => Math.round(c.mean)));
}
testFronts();
