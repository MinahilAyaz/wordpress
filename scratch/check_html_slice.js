const https = require('https');

https.get('https://www.nesports3.com/', (res) => {
    let html = '';
    res.on('data', chunk => html += chunk);
    res.on('end', () => {
        const cIdx = html.indexOf('id="collections"');
        console.log('--- Context of #collections ---');
        console.log(html.substring(cIdx, Math.min(html.length, cIdx + 1200)));
    });
});
