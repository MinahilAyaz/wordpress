const sharp = require('sharp');
const path = require('path');

async function testColorShift() {
  const src = 'C:\\Users\\abdul\\Desktop\\wordpress\\nesports-pro-store\\assets\\images\\clothing\\Strength-Club-Blue-Model-Front.jpg';
  const out = 'C:\\Users\\abdul\\Desktop\\wordpress\\scratch\\test_sc_black.jpg';

  // Apply modulate or threshold to darken blue shirt to black
  await sharp(src)
    .modulate({
      brightness: 0.75,
      saturation: 0.2
    })
    .toFile(out);

  console.log('Saved test_sc_black.jpg');
}
testColorShift();
