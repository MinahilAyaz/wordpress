const fs = require('fs');
const lines = fs.readFileSync('nesports-pro-store/includes/helpers.php', 'utf8').split('\n');
lines[1096] = "                        'Ankle-Strap-Cable-pull-3-scaled.jpg',";
lines[1097] = "                        'Ankle-Strap-Cable-pull-5-scaled.jpg',";
fs.writeFileSync('nesports-pro-store/includes/helpers.php', lines.join('\n'), 'utf8');
console.log('Replaced line 1096 and 1097!');
