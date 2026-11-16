const sharp = require('sharp');

async function sliceLogo() {
  // Icon is roughly left ~120px
  await sharp('images_original_backup/logo-1.png')
    .extract({ left: 6, top: 4, width: 114, height: 133 })
    .png()
    .toFile('scratch/logo_slice_icon.png');

  // Text is roughly x 120 to 391
  await sharp('images_original_backup/logo-1.png')
    .extract({ left: 120, top: 20, width: 271, height: 110 })
    .png()
    .toFile('scratch/logo_slice_text.png');

  console.log('Sliced logo into icon and text');
}

sliceLogo().catch(console.error);
