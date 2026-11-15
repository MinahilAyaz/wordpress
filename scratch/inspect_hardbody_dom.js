const fs = require('fs');
const https = require('https');

https.get('https://hardbody.store/collections/anime-collection', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
}, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        // Find html containing "arise-t-shirt"
        const idx = data.indexOf('/products/arise-t-shirt');
        if (idx !== -1) {
            console.log(data.substring(idx - 800, idx + 1200));
        }
    });
});
