const https = require('https');

https.get('https://www.nesports3.com/?nocache=' + Date.now(), (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const pills = data.match(/data-color="([^"]+)"/g);
        console.log('Pills found:', pills);
        const cards = data.match(/class="hb-color-card\b[^"]*"/g);
        console.log('Total cards found:', cards ? cards.length : 0);
        const titles = data.match(/<div class="hb-color-card-title">([^<]+)<\/div>/g);
        console.log('Sample product titles:', (titles || []).slice(0, 8));
    });
}).on('error', err => console.error(err));
