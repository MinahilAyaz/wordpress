const https = require('https');

https.get('https://www.nesports3.com/', (res) => {
    let html = '';
    res.on('data', chunk => html += chunk);
    res.on('end', () => {
        console.log('HTTP Status:', res.statusCode);
        console.log('1. Header has #111111 text rule:', html.includes('color: #111111 !important'));
        console.log('2. Logo letters has #080808:', html.includes('fill="#080808"'));
        console.log('3. Logo red has #F00012:', html.includes('fill="#F00012"'));
        console.log('4. Bundles has prev arrow:', html.includes('id="hb-bundles-prev"'));
        console.log('5. Bundles has next arrow:', html.includes('id="hb-bundles-next"'));
        console.log('6. Bundles has 1-row track:', html.includes('id="hb-bundles-track"'));
        console.log('7. Bundles has carousel wrap:', html.includes('hb-bundles-carousel-wrap'));
    });
}).on('error', err => {
    console.error('Error fetching live site:', err.message);
});
