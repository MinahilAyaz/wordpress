const https = require('https');

https.get('https://www.nesports3.com/', (res) => {
    let html = '';
    res.on('data', chunk => html += chunk);
    res.on('end', () => {
        console.log('Live HTML length:', html.length);
        console.log('Has #hb-hero:', html.includes('id="hb-hero"') || html.includes('class="hb-hero"'));
        console.log('Has .hb-hero:', html.includes('class="hb-hero'));
        console.log('Has .hb-trustbar:', html.includes('class="hb-trustbar'));
        console.log('Has .hb-static-banner:', html.includes('class="hb-static-banner'));
        console.log('Has #top-sellers:', html.includes('id="top-sellers"'));
        console.log('Has #bundles:', html.includes('id="bundles"'));
        console.log('Has #clothing:', html.includes('id="clothing"'));
        
        // Find all <section tags
        const sections = html.match(/<section[^>]*>/g) || [];
        console.log('All sections on live site:');
        sections.forEach(s => console.log('  ', s));
    });
}).on('error', err => console.error(err));
