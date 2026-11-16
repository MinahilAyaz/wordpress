const sharp = require('sharp');
const fs = require('fs');

async function analyze() {
  const img = sharp('C:/Users/abdul/.gemini/antigravity/brain/818c7688-cf50-49cd-94b6-702cb73a4218/.user_uploaded/media_1794852416552_40c8ab87.png');
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  
  const colors = {};
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i+3];
    if (a < 50) continue;
    const r = Math.round(data[i] / 15) * 15;
    const g = Math.round(data[i+1] / 15) * 15;
    const b = Math.round(data[i+2] / 15) * 15;
    const key = r + ',' + g + ',' + b;
    colors[key] = (colors[key] || 0) + 1;
  }
  const sorted = Object.entries(colors).sort((a,b) => b[1] - a[1]);
  console.log('Top colors in footer logo:');
  sorted.slice(0, 10).forEach(([c, cnt]) => console.log(c, 'count:', cnt));
}
analyze();
