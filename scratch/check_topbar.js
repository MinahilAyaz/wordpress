const fs = require('fs');

const h = fs.readFileSync('nesports-pro-store/templates/header-nesports.php', 'utf8');
const c = fs.readFileSync('nesports-pro-store/assets/css/nesports-frontend.css', 'utf8');

const findRules = (str, term) => {
    const lines = str.split('\n');
    lines.forEach((l, i) => {
        if (l.includes(term) && (l.includes('{') || l.includes('position') || l.includes('top:'))) {
            console.log(`${i+1}: ${l.trim()}`);
        }
    });
};

console.log('--- header-nesports.php topbar ---');
findRules(h, '.hb-topbar');

console.log('--- nesports-frontend.css topbar ---');
findRules(c, '.hb-topbar');
