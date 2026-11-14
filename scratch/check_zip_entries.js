const fs = require('fs');
const zlib = require('zlib');
// Read zip local file headers
const buf = fs.readFileSync('nesports-pro.zip');
let i = 0;
const filenames = [];
while (i < buf.length - 4) {
    if (buf.readUInt32LE(i) === 0x04034b50) { // Local file header signature
        const fnLen = buf.readUInt16LE(i + 26);
        const extraLen = buf.readUInt16LE(i + 28);
        const fn = buf.toString('utf8', i + 30, i + 30 + fnLen);
        filenames.push(fn);
        i += 30 + fnLen + extraLen;
    } else {
        i++;
    }
    if (filenames.length >= 20) break;
}
console.log('Sample filenames in zip:', filenames);
