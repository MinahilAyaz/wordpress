const https = require('https');
https.get('https://www.nesports3.com/', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const idx = data.indexOf('id="hb-color-track"');
        const blackIdx = data.indexOf('data-color="black"', idx);
        console.log(data.substring(idx, blackIdx));
    });
});
