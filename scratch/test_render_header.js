const sharp = require('sharp');
const fs = require('fs');

async function testRenderHeader() {
  const svg = fs.readFileSync('scratch/header-logo.svg');
  const rendered = await sharp(svg)
    .resize(1600, 568)
    .png()
    .toBuffer();

  const finalComp = await sharp({
    create: {
      width: 1600,
      height: 568,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
  .composite([{ input: rendered, top: 0, left: 0 }])
  .png()
  .toFile('scratch/test_header_rendered_preview.png');

  console.log('Saved scratch/test_header_rendered_preview.png');
}

testRenderHeader().catch(console.error);
