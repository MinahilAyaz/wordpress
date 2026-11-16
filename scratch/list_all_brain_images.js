const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\abdul\\.gemini\\antigravity\\brain\\818c7688-cf50-49cd-94b6-702cb73a4218';
const files = fs.readdirSync(dir).filter(f => /\.(jpg|png|jpeg)$/i.test(f));
console.log('Count:', files.length);
files.sort().forEach(f => {
  const stat = fs.statSync(path.join(dir, f));
  console.log(`${f} (${stat.size} bytes)`);
});
