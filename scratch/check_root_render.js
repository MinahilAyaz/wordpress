const sharp = require('sharp');

(async () => {
  const m = await sharp('scratch/render_root_header_logo.png').metadata();
  console.log('render_root_header_logo dimensions:', m.width, 'x', m.height);
})();
