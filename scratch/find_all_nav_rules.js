const fs = require('fs');

const h = fs.readFileSync('nesports-pro-store/templates/header-nesports.php', 'utf8');
const c = fs.readFileSync('nesports-pro-store/assets/css/nesports-frontend.css', 'utf8');

const printMatches = (text, name) => {
    console.log(`=== ${name} ===`);
    text.split('\n').forEach((line, i) => {
        if (line.includes('.hb-menu > li > a') || line.includes('.hb-menu>li>a') || line.includes('hb-cart-total-text') || line.includes('hb-logo-letters')) {
            console.log(`${i+1}: ${line.trim()}`);
        }
    });
};

printMatches(h, 'header-nesports.php');
printMatches(c, 'nesports-frontend.css');
