const https = require('https');

https.get('https://hardbody.store/collections/anime-collection', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
}, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        // Find JS files
        const matches = data.match(/src="([^"]*\.js[^"]*)"/g);
        console.log(matches);
    });
});
