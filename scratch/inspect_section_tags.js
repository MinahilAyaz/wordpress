const https = require('https');

https.get('https://www.nesports3.com/', (res) => {
    let html = '';
    res.on('data', chunk => html += chunk);
    res.on('end', () => {
        // Let's inspect the exact classes of #top-sellers and #bundles in the HTML
        const topSellersMatch = html.match(/<section[^>]*id="top-sellers"[^>]*>/);
        const bundlesMatch = html.match(/<section[^>]*id="bundles"[^>]*>/);
        console.log('top-sellers tag:', topSellersMatch ? topSellersMatch[0] : 'not found');
        console.log('bundles tag:', bundlesMatch ? bundlesMatch[0] : 'not found');
    });
}).on('error', err => console.error(err));
