const fs = require('fs');
const c = fs.readFileSync('nesports-pro-store/assets/css/nesports-frontend.css', 'utf8');

const checkBg = (className) => {
    const reg = new RegExp('\\.' + className + '[^{]*\\{[^}]*background[^}]*\\}', 'g');
    const matches = c.match(reg) || [];
    console.log(className, matches.slice(0, 3));
};

checkBg('hb-collections-section');
checkBg('hb-bundles-section');
checkBg('hb-clothing-section');
checkBg('hb-color-section');
