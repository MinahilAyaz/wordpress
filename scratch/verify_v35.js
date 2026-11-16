const https = require('https');

https.get('https://www.nesports3.com/', (res) => {
    let html = '';
    res.on('data', chunk => html += chunk);
    res.on('end', () => {
        console.log('HTTP Status:', res.statusCode);
        console.log('1. Has is-on-dark in header markup:', html.includes('is-on-dark'));
        console.log('2. Has is-on-dark white text rule:', html.includes('.hb-header.is-on-dark .hb-nav .hb-menu > li > a'));
        console.log('3. Has is-on-light dark text rule:', html.includes('.hb-header.is-on-light .hb-nav .hb-menu > li > a'));
        console.log('4. Has is-on-dark white logo letters:', html.includes('.hb-header.is-on-dark .hb-logo .hb-logo-letters'));
        console.log('5. Has is-on-light black logo letters:', html.includes('.hb-header.is-on-light .hb-logo .hb-logo-letters'));
        console.log('6. Has adaptive script:', html.includes('hb-header-adaptive-script'));
    });
}).on('error', err => {
    console.error('Error fetching live site:', err.message);
});
