const fs = require('fs');

const h = fs.readFileSync('nesports-pro-store/templates/header-nesports.php', 'utf8');
const c = fs.readFileSync('nesports-pro-store/assets/css/nesports-frontend.css', 'utf8');

// Look for .is-on-light rules
console.log('--- is-on-light in header ---');
h.split('\n').forEach((l, i) => {
    if (l.includes('is-on-light') || l.includes('is-on-dark')) {
        console.log(`${i+1}: ${l.trim()}`);
    }
});

console.log('--- is-on-light in CSS ---');
c.split('\n').forEach((l, i) => {
    if (l.includes('is-on-light') || l.includes('is-on-dark')) {
        console.log(`${i+1}: ${l.trim()}`);
    }
});
