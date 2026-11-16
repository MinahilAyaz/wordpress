const sharp = require('sharp');
const fs = require('fs');

async function inspectLogo1() {
  const meta = await sharp('images_original_backup/logo-1.png').metadata();
  console.log('Original backup logo-1 dimensions:', meta.width, 'x', meta.height);

  // Let's inspect horizontal sections
  // Icon is on left (x: 0 to ~100)
  // Text "NESPORTS" is from x: ~100 to ~320
  // "3" is from x: ~320 to ~380
  console.log('Inspecting bounding box...');
  const { data, info } = await sharp('images_original_backup/logo-1.png')
    .raw()
    .toBuffer({ resolveWithObject: true });

  let minX = info.width, maxX = 0, minY = info.height, maxY = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * info.channels;
      if (data[idx + 3] > 20) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  console.log('Active logo bounds in 400x142:', { minX, maxX, minY, maxY, w: maxX - minX, h: maxY - minY });
}

inspectLogo1().catch(console.error);
