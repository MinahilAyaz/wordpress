const sharp = require('sharp');

async function findEmblem() {
  const { data, info } = await sharp('scratch/extracted_footor_logo.jpg')
    .raw()
    .toBuffer({ resolveWithObject: true });
  
  // Find non-black pixels (or non-white pixels if on white)
  let minX = info.width, maxX = 0, minY = info.height, maxY = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * info.channels;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      // If it has strong red color (the N) or white color (the E)
      if ((r > 130 && r - g > 40) || (r > 180 && g > 180 && b > 180)) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  console.log('Emblem bounds in extracted_footor_logo.jpg:', { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY });

  // Crop to emblem with a small margin
  const pad = 10;
  const cropLeft = Math.max(0, minX - pad);
  const cropTop = Math.max(0, minY - pad);
  const cropW = Math.min(info.width - cropLeft, (maxX - minX) + pad * 2);
  const cropH = Math.min(info.height - cropTop, (maxY - minY) + pad * 2);

  await sharp('scratch/extracted_footor_logo.jpg')
    .extract({ left: cropLeft, top: cropTop, width: cropW, height: cropH })
    .png()
    .toFile('scratch/footer_emblem_cropped.png');
  console.log('Saved scratch/footer_emblem_cropped.png:', cropW, 'x', cropH);
}

findEmblem().catch(console.error);
