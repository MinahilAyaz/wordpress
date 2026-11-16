const sharp = require('sharp');
const fs = require('fs');

async function testFooterOnDark() {
  // 1. Exact uploaded logo on dark #111111 background
  const exactDark = await sharp({
    create: {
      width: 300,
      height: 300,
      channels: 4,
      background: '#111111'
    }
  })
  .composite([{
    input: await sharp('scratch/footer_logo_exact_1200.png').resize(150, 150).toBuffer(),
    gravity: 'center'
  }])
  .png()
  .toFile('scratch/preview_footer_exact_on_dark.png');

  // 2. White-contrast (Red 'N' + White 'E') on dark #111111 background
  const contrastDark = await sharp({
    create: {
      width: 300,
      height: 300,
      channels: 4,
      background: '#111111'
    }
  })
  .composite([{
    input: await sharp('scratch/footer_logo_white_contrast_1200.png').resize(150, 150).toBuffer(),
    gravity: 'center'
  }])
  .png()
  .toFile('scratch/preview_footer_contrast_on_dark.png');

  // 3. Exact logo on white disc on dark background
  const whiteDisc = Buffer.from(
    '<svg width="150" height="150"><circle cx="75" cy="75" r="74" fill="#ffffff" /></svg>'
  );
  const discDark = await sharp({
    create: {
      width: 300,
      height: 300,
      channels: 4,
      background: '#111111'
    }
  })
  .composite([
    { input: whiteDisc, gravity: 'center' },
    { input: await sharp('scratch/footer_logo_exact_1200.png').resize(140, 140).toBuffer(), gravity: 'center' }
  ])
  .png()
  .toFile('scratch/preview_footer_disc_on_dark.png');

  console.log('Generated all 3 previews on dark background!');
}

testFooterOnDark();
