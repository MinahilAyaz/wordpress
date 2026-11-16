const fs = require('fs');

// Check JPEG dimensions from SOF marker
function getJpgDimensions(filePath) {
    const data = fs.readFileSync(filePath);
    let offset = 2;
    while (offset < data.length) {
        if (data[offset] === 0xFF && (data[offset + 1] >= 0xC0 && data[offset + 1] <= 0xC3)) {
            const height = data.readUInt16BE(offset + 5);
            const width = data.readUInt16BE(offset + 7);
            return { width, height };
        }
        offset += 2 + data.readUInt16BE(offset + 2);
    }
    return null;
}

console.log("Strength-Club-Red-Flat.jpg:", getJpgDimensions("nesports-pro-store/assets/images/clothing/Strength-Club-Red-Flat.jpg"));
console.log("Strength-Club-Red-Front.jpg:", getJpgDimensions("nesports-pro-store/assets/images/clothing/Strength-Club-Red-Front.jpg"));
console.log("Strength-Club-Red-Model.jpg:", getJpgDimensions("nesports-pro-store/assets/images/clothing/Strength-Club-Red-Model.jpg"));
