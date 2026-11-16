const fs = require('fs');
const path = require('path');
const https = require('https');

const clothingDir = path.join(__dirname, '../nesports-pro-store/assets/images/clothing');
if (fs.existsSync(clothingDir)) {
  const files = fs.readdirSync(clothingDir);
  console.log('Clothing files in repository:', files);
  files.forEach(f => {
    const stat = fs.statSync(path.join(clothingDir, f));
    console.log(f, stat.size, 'bytes');
  });
} else {
  console.log('clothingDir does not exist:', clothingDir);
}
