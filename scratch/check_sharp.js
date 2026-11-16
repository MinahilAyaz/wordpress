const fs = require('fs');

// We can check pixel data or inspect with sharp if available, or write a tiny PPM/BMP or check pixel values
// Let's see what npm packages are available
console.log('sharp:', fs.existsSync('node_modules/sharp'));
