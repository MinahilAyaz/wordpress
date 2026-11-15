const fs = require('fs');
(async () => {
    const SITE = 'https://www.nesports3.com';
    const res = await fetch(SITE + '/?nocache=' + Date.now());
    const html = await res.text();
    const regex = /<span class="hb-clothing-card-label">\s*([^<]+)/g;
    let match;
    const cards = [];
    while ((match = regex.exec(html)) !== null) {
        cards.push(match[1].trim());
    }
    console.log('Live Clothing Cards:', cards);
})();
