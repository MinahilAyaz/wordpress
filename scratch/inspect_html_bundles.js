const https = require('https');

https.get('https://www.nesports3.com/', (res) => {
    let html = '';
    res.on('data', chunk => html += chunk);
    res.on('end', () => {
        const bunIdx = html.indexOf('id="bundles"');
        console.log('bunIdx:', bunIdx);
        if (bunIdx !== -1) {
            console.log('=== 1000 CHARS BEFORE #bundles ===');
            console.log(html.substring(Math.max(0, bunIdx - 1000), bunIdx));
            console.log('=== 500 CHARS AFTER #bundles ===');
            console.log(html.substring(bunIdx, bunIdx + 500));
        }
    });
});
