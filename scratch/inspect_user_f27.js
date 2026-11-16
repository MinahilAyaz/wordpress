const sharp = require('sharp');

(async () => {
  const { data, info } = await sharp('C:/Users/abdul/.gemini/antigravity/brain/818c7688-cf50-49cd-94b6-702cb73a4218/.user_uploaded/media_1794852411104_f27de6d5.png')
    .raw()
    .toBuffer({ resolveWithObject: true });
  
  const colors = {};
  for (let i = 0; i < data.length; i += 4) {
    if (data[i+3] > 20) {
      const key = `${data[i]},${data[i+1]},${data[i+2]}`;
      colors[key] = (colors[key] || 0) + 1;
    }
  }
  const sorted = Object.entries(colors).sort((a,b) => b[1] - a[1]).slice(0, 10);
  console.log('Top non-transparent colors in user uploaded logo:', sorted);
})();
