const sharp = require('sharp');

(async () => {
  const { data, info } = await sharp('scratch/user_logo_zoom.png').raw().toBuffer({ resolveWithObject: true });
  let minX = info.width, maxX = 0, minY = info.height, maxY = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * info.channels;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      // if not white / background
      if (r < 240 || g < 240 || b < 240) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  console.log(`Logo bounding box in user screenshot: x [${minX}, ${maxX}] (${maxX - minX}px wide), y [${minY}, ${maxY}] (${maxY - minY}px high)`);
})();
