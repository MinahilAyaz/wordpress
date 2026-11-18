const fs = require('fs');

const d = fs.readFileSync('nesports-pro-store/includes/data.php', 'utf8');
const lines = d.split('\n');
console.log('Lines referencing DSC or categories:');
lines.forEach((l, i) => {
    if (l.includes('DSC_') || l.includes('function nesports_collections') || l.includes('function nesports_categories')) {
        console.log(`${i+1}: ${l.trim()}`);
    }
});
