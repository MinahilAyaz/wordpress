const fs = require('fs');
const path = require('path');

function scanDir(dir, results = []) {
  try {
    const list = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of list) {
      const full = path.join(dir, item.name);
      if (item.isDirectory()) {
        scanDir(full, results);
      } else if (/\.(jpg|png|jpeg)$/i.test(item.name)) {
        try {
          const sz = fs.statSync(full).size;
          results.push({ name: item.name, path: full, size: sz });
        } catch (e) {}
      }
    }
  } catch (e) {}
  return results;
}

const baseDir = 'C:\\Users\\abdul\\.gemini\\antigravity\\brain';
const all = scanDir(baseDir);
console.log('Total images found in brain:', all.length);
const modelImgs = all.filter(f => /model|front|side|pose/i.test(f.name));
console.log('Model/Front/Side images:', modelImgs.length);
modelImgs.forEach(m => console.log(m.name, m.path, m.size));
