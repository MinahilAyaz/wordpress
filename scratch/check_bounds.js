const sharp = require('sharp');

(async () => {
  const { data, info } = await sharp('scratch/test_root_2000.png').raw().toBuffer({ resolveWithObject: true });
  let minX = info.width, maxX = 0, minY = info.height, maxY = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * info.channels;
      const a = data[idx + 3];
      if (a > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  console.log(`info: ${info.width}x${info.height}`);
  console.log(`Content bounds: x [${minX}, ${maxX}] (${maxX - minX}px), y [${minY}, ${maxY}] (${maxY - minY}px)`);
})();
