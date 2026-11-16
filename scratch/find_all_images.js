const fs = require('fs');
const path = require('path');

function findImages(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git') {
        findImages(fullPath, results);
      }
    } else if (/\.(jpg|jpeg|png|webp)$/i.test(entry.name)) {
      results.push({ name: entry.name, path: fullPath, size: fs.statSync(fullPath).size });
    }
  }
  return results;
}

const brainImgs = findImages('C:\\Users\\abdul\\.gemini\\antigravity\\brain\\818c7688-cf50-49cd-94b6-702cb73a4218');
console.log('Total images in brain:', brainImgs.length);

const clothingKeywords = ['anime', 'lift', 'strength', 'coach', 'west', 'model', 'shirt', 'tee', 'hoodie', 'trouser'];
const relevantBrain = brainImgs.filter(img => clothingKeywords.some(k => img.name.toLowerCase().includes(k)));
console.log('Relevant brain images:', relevantBrain.map(i => i.name));

const wpImgs = findImages('C:\\Users\\abdul\\Desktop\\wordpress');
const relevantWp = wpImgs.filter(img => clothingKeywords.some(k => img.name.toLowerCase().includes(k)));
console.log('Relevant WP images:', relevantWp.map(i => i.name));
