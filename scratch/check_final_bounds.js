const sharp = require('sharp');

(async () => {
  const { data, info } = await sharp('scratch/final_2048_render.png').raw().toBuffer({ resolveWithObject: true });
  let minX = info.width, maxX = 0, minY = info.height, maxY = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const a = data[(y * info.width + x) * 4 + 3];
      if (a > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  console.log(`Rendered 2048x682 bounds: x [${minX}, ${maxX}] (${maxX - minX}px), y [${minY}, ${maxY}] (${maxY - minY}px)`);
})();
