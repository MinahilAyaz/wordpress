const fs = require('fs');
const stat = fs.statSync('header_logo.svg');
console.log('header_logo.svg mtime:', stat.mtime);
