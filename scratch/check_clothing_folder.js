const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function checkOrigin() {
  const dir = 'C:\\Users\\abdul\\Desktop\\wordpress\\clothing';
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (!fs.statSync(full).isFile()) continue;
    const meta = await sharp(full).metadata();
    console.log(`${f}: ${meta.width}x${meta.height}, ${meta.format}, ${fs.statSync(full).size} bytes`);
  }
}
checkOrigin();
