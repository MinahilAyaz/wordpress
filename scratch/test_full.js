const sharp = require('sharp');

async function testFull() {
  const stats = await sharp('C:\\Users\\abdul\\Desktop\\wordpress\\nesports-pro-store\\assets\\images\\clothing\\Strength-Club-Blue-Model-Front.jpg').stats();
  console.log('Channels min/max:');
  stats.channels.forEach((c, i) => console.log(`Ch ${i}: min=${c.min}, max=${c.max}, mean=${c.mean.toFixed(1)}, stdev=${c.stdev.toFixed(1)}`));
}
testFull();
