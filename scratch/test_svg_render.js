const sharp = require('sharp');
const fs = require('fs');

async function testRender() {
  const hSvg = fs.readFileSync('scratch/header-logo.svg');
  const hTrimmed = await sharp(hSvg).trim().png().toBuffer({ resolveWithObject: true });
  console.log('Header SVG trimmed bounding box:', hTrimmed.info.width, 'x', hTrimmed.info.height);
  fs.writeFileSync('scratch/test_header_vector_render.png', hTrimmed.data);

  const fSvg = fs.readFileSync('scratch/footer-logo-vector.svg');
  const fTrimmed = await sharp(fSvg).trim().png().toBuffer({ resolveWithObject: true });
  console.log('Footer SVG trimmed bounding box:', fTrimmed.info.width, 'x', fTrimmed.info.height);
  fs.writeFileSync('scratch/test_footer_vector_render.png', fTrimmed.data);
}

testRender().catch(console.error);
