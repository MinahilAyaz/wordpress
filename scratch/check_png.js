const fs = require('fs');

// Read first few chunks or header of PNG to see dimensions
function getPngDimensions(filePath) {
    const fd = fs.openSync(filePath, 'r');
    const buffer = Buffer.alloc(24);
    fs.readSync(fd, buffer, 0, 24, 0);
    fs.closeSync(fd);
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    return { width, height };
}

console.log("Black T-Shirt with Red Strength Club Design.png:", getPngDimensions("nesports-pro-store/assets/images/clothing/Black T-Shirt with Red Strength Club Design.png"));
console.log("Red Pro Coach Iron Tee Back Print.png:", getPngDimensions("nesports-pro-store/assets/images/clothing/Red Pro Coach Iron Tee Back Print.png"));
