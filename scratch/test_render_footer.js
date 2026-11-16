const sharp = require('sharp');
const fs = require('fs');

async function testRenderFooter() {
  const svg = fs.readFileSync('scratch/footer-logo-crisp.svg');
  const rendered = await sharp(svg)
    .resize(800, 800)
    .png()
    .toBuffer();

  const finalComp = await sharp({
    create: {
      width: 800,
      height: 800,
      channels: 4,
      background: { r: 17, g: 17, b: 17, alpha: 1 } // footer dark background
    }
  })
  .composite([{ input: rendered, top: 0, left: 0 }])
  .png()
  .toFile('scratch/test_footer_rendered_preview.png');

  console.log('Saved scratch/test_footer_rendered_preview.png');
}

testRenderFooter().catch(console.error);
