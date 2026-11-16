const https = require('https');
https.get('https://www.nesports3.com/', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const idx = data.indexOf('id="hb-color-track"');
        const blackIdx = data.indexOf('data-color="black"', idx);
        const redHtml = data.substring(idx, blackIdx);
        
        console.log('--- RED CATEGORY LIVE AUDIT ---');
        const cards = redHtml.split('class="hb-color-card');
        console.log('Total cards in RED:', cards.length - 1);
        
        cards.slice(1).forEach((c, i) => {
            const title = (c.match(/<h3 class="hb-color-card-title">([^<]+)<\/h3>/) || [])[1];
            const imgs = c.match(/src="([^"]+)"/g) || [];
            console.log(`\nCard ${i + 1}: ${title}`);
            imgs.forEach((img, j) => {
                console.log(`  Slide ${j + 1}: ${img.replace('src="', '').replace('"', '')}`);
            });
        });
    });
});
