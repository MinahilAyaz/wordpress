const fs = require('fs');
const files = [
  'Black T-Shirt with Red Strength Club Design.png',
  'Strength-Club-Red-Flat.jpg',
  'Strength-Club-Red-Front.jpg',
  'Strength-Club-Red-Model.jpg',
  'Strength-Club-Red-Detail.jpg',
  'Strength-Club-Red-Lower.jpg',
  'Strength-Club-Red-Model-Front.jpg'
];
for (const f of files) {
  const p = 'nesports-pro-store/assets/images/clothing/' + f;
  if (fs.existsSync(p)) {
    console.log(f, fs.statSync(p).size, 'bytes');
  } else {
    console.log(f, 'NOT FOUND');
  }
}
