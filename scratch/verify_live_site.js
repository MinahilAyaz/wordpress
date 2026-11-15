const https = require('https');

https.get('https://www.nesports3.com/?nocache=' + Date.now(), (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const matches = data.match(/assets\/images\/clothing\/[^"'\s>]+/g) || [];
        const unique = Array.from(new Set(matches));
        console.log('Unique clothing image URLs found (' + unique.length + '):');
        unique.forEach(u => console.log(' - ' + decodeURIComponent(u)));
    });
});
