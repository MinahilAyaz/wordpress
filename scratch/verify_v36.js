const https = require('https');

https.get('https://www.nesports3.com/', (res) => {
    let html = '';
    res.on('data', chunk => html += chunk);
    res.on('end', () => {
        console.log('HTTP Status:', res.statusCode);
        console.log('1. Live has is-on-dark white text rule:', html.includes('.hb-header.is-on-dark .hb-nav .hb-menu > li > a'));
        console.log('2. Live has is-on-light dark text rule:', html.includes('.hb-header.is-on-light .hb-nav .hb-menu > li > a'));
        console.log('3. Live has static & fixed lockstep script:', html.includes('Math.max(0, topbarHeight - scrollY)'));
        console.log('4. Live has probePoint detection:', html.includes('probePoint <= heroBottom'));
    });
}).on('error', err => console.error(err));
