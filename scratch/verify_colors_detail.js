const https = require('https');

https.get('https://www.nesports3.com/?nocache=' + Date.now(), (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log('=== LIVE VERIFICATION ===');
        
        // 1. Check pills
        const pills = data.match(/<button[^>]*class="hb-color-pill[^"]*"[^>]*>([\s\S]*?)<\/button>/g) || [];
        const pillNames = pills.map(p => p.replace(/<[^>]+>/g, '').trim());
        console.log('Available Color Pills:', pillNames);
        console.log('Is NAVY removed?:', !pillNames.includes('NAVY'));

        // 2. Check cards in each color
        ['red', 'black', 'blue', 'green', 'grey', 'gold'].forEach(col => {
            const re = new RegExp('<a[^>]*class="hb-color-card[^"]*"[^>]*data-color="' + col + '"[\\s\\S]*?<h3 class="hb-color-card-title">([^<]+)<\\/h3>', 'g');
            let m;
            const items = [];
            while ((m = re.exec(data)) !== null) {
                items.push(m[1]);
            }
            console.log(`\nColor [${col.toUpperCase()}] (${items.length} items):`);
            items.forEach(it => console.log('  * ' + it));
        });
    });
}).on('error', err => console.error(err));
