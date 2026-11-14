const https = require('https');

https.get('https://www.nesports3.com/?nocache=' + Date.now(), res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const matches = [...data.matchAll(/class="hb-clothing-card-img"[^>]*src="([^"]+)"/g)];
        matches.forEach(m => console.log('SRC:', m[1]));
    });
});
