const https = require('https');

https.get('https://hardbody.store/collections/anime-collection', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
}, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const idx = data.indexOf('product-card__carousel');
        if (idx !== -1) {
            console.log(data.substring(idx, idx + 2500));
        }
    });
});
