const sharp = require('sharp');

async function testSTL() {
  const stats = await sharp('C:\\Users\\abdul\\Desktop\\wordpress\\nesports-pro-store\\assets\\images\\clothing\\Shop-The-Look-1.jpg').stats();
  console.log('Shop-The-Look-1 channels min/max:');
  stats.channels.forEach((c, i) => console.log(`Ch ${i}: min=${c.min}, max=${c.max}, mean=${c.mean.toFixed(1)}, stdev=${c.stdev.toFixed(1)}`));
}
testSTL();
