const https = require('https');

https.get('https://hardbody.store/cdn/shop/t/126/assets/theme.js?v=34276904915898298641793238066', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const idx = data.indexOf('secondary-media');
        if (idx !== -1) {
            console.log(data.substring(idx - 100, idx + 1500));
        } else {
            console.log('secondary-media not found, searching selected-index');
            const idx2 = data.indexOf('selected-index');
            console.log(data.substring(idx2 - 100, idx2 + 1500));
        }
    });
});
