const sharp = require('sharp');

async function analyze() {
  const f1 = await sharp('scratch/extracted_footer_logo.png').raw().toBuffer({ resolveWithObject: true });
  console.log('Footer logo info:', f1.info);
  
  // Find colors in footer logo
  const colors = {};
  for (let i = 0; i < f1.data.length; i += 4) {
    const a = f1.data[i + 3];
    if (a > 50) {
      const r = Math.round(f1.data[i] / 30) * 30;
      const g = Math.round(f1.data[i + 1] / 30) * 30;
      const b = Math.round(f1.data[i + 2] / 30) * 30;
      const key = `${r},${g},${b}`;
      colors[key] = (colors[key] || 0) + 1;
    }
  }
  console.log('Top colors in footer logo:', Object.entries(colors).sort((a,b) => b[1] - a[1]).slice(0, 10));

  const f2 = await sharp('nesports-pro-store/assets/images/logo-1.png').raw().toBuffer({ resolveWithObject: true });
  console.log('Header logo-1 info:', f2.info);
  const colors2 = {};
  for (let i = 0; i < f2.data.length; i += 4) {
    const a = f2.data[i + 3];
    if (a > 50) {
      const r = Math.round(f2.data[i] / 30) * 30;
      const g = Math.round(f2.data[i + 1] / 30) * 30;
      const b = Math.round(f2.data[i + 2] / 30) * 30;
      const key = `${r},${g},${b}`;
      colors2[key] = (colors2[key] || 0) + 1;
    }
  }
  console.log('Top colors in header logo:', Object.entries(colors2).sort((a,b) => b[1] - a[1]).slice(0, 10));
}

analyze();
