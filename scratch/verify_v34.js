const https = require('https');

https.get('https://www.nesports3.com/', (res) => {
    let html = '';
    res.on('data', chunk => html += chunk);
    res.on('end', () => {
        console.log('HTTP Status:', res.statusCode);
        console.log('Header has background: transparent !important:', html.includes('background: transparent !important;'));
        console.log('Header has backdrop-filter: blur(12px):', html.includes('backdrop-filter: blur(12px)'));
        console.log('Header has color: #111111 !important:', html.includes('color: #111111 !important'));
        console.log('Logo letters has fill="#080808":', html.includes('fill="#080808"'));
    });
}).on('error', err => {
    console.error('Error fetching live site:', err.message);
});
