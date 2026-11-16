const fs = require('fs');

const data = fs.readFileSync("nesports-pro-store/assets/images/clothing/Black T-Shirt with Red Strength Club Design.png");
// In PNG, IHDR color type is at byte 25
const colorType = data[25];
console.log("Color type:", colorType); // 6 = RGBA (alpha channel present)
