const https = require('https');

https.get('https://hardbody.store/cdn/shop/t/126/assets/theme.js?v=34276904915898298641793238066', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const idx = data.indexOf('class SecondaryMedia');
        if (idx !== -1) {
            console.log(data.substring(idx, idx + 2500));
        }
    });
});
