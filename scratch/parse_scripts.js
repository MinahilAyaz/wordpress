const fs = require('fs');
const html = fs.readFileSync('scratch/full_elementor_4400.html', 'utf8');

const regex = /<script[^>]+src=["']([^"']+)["']/gi;
let m;
const list = [];
while ((m = regex.exec(html)) !== null) {
    list.push(m[1]);
}
console.log('Total external scripts:', list.length);
console.log('Elementor scripts:', list.filter(s => s.includes('elementor')));

// Also check Elementor config object
const configIdx = html.indexOf('ElementorConfig');
if (configIdx !== -1) {
    console.log('ElementorConfig found at index:', configIdx);
    console.log(html.substring(configIdx, configIdx + 400));
} else {
    console.log('ElementorConfig not found directly');
}
