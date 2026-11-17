const https = require('https');

https.get('https://www.nesports3.com/', (res) => {
    let html = '';
    res.on('data', chunk => html += chunk);
    res.on('end', () => {
        console.log('HTTP Status:', res.statusCode);
        console.log('1. Topbar is fixed in live HTML:', html.includes('.hb-topbar') && html.includes('position: fixed !important;'));
        console.log('2. Header is fixed below topbar (top: 36px):', html.includes('top: 36px !important;'));
        console.log('3. Live has is-on-dark white text rule:', html.includes('.hb-header.is-on-dark .hb-nav .hb-menu > li > a'));
        console.log('4. Live has is-on-light dark text rule:', html.includes('.hb-header.is-on-light .hb-nav .hb-menu > li > a'));
        console.log('5. Live has probeY detection:', html.includes('probeY = 36 + ((header.offsetHeight || 60) / 2)'));
    });
}).on('error', err => console.error(err));
