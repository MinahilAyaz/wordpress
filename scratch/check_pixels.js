const fs = require('fs');

// We have scratch/footer_logo_transparent.png
console.log('footer_logo_transparent.png size:', fs.statSync('scratch/footer_logo_transparent.png').size);
