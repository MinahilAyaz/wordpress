const https = require('https');

https.get('https://www.nesports3.com', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const hasTopSellers = data.includes('id="top-sellers"');
        const hasTrack = data.includes('hb-card-slider-track');
        const hasDots = data.includes('hb-card-dots');
        const countDots = (data.match(/class="hb-card-dot/g) || []).length;
        console.log('Top Sellers section exists:', hasTopSellers);
        console.log('hb-card-slider-track exists:', hasTrack);
        console.log('hb-card-dots exists:', hasDots);
        console.log('Total dot indicators on page:', countDots);
        
        // Find first card inside #top-sellers
        const topSellersIdx = data.indexOf('id="top-sellers"');
        if (topSellersIdx !== -1) {
            const snippet = data.substring(topSellersIdx, topSellersIdx + 3000);
            const cardSnippet = snippet.match(/<div class="hb-category-media[\s\S]*?<\/div>\s*<\/div>/);
            if (cardSnippet) {
                console.log('\n--- Card Media Snippet ---');
                console.log(cardSnippet[0]);
            }
        }
    });
});
