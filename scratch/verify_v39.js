const https = require('https');

https.get('https://www.nesports3.com/', (res) => {
    let html = '';
    res.on('data', chunk => html += chunk);
    res.on('end', () => {
        const has5CardsRule = html.includes('calc((100% - 64px) / 5)');
        console.log('Live HTML has 5 cards calc rule:', has5CardsRule);
        const cardMatches = html.match(/class="hb-collection-card"/g) || [];
        console.log('Total collection cards on page:', cardMatches.length);
    });
});
