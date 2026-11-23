const https = require('https');

https.get('https://www.nesports3.com/our-story/', res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const bodyClassMatch = data.match(/<body[^>]*class=["']([^"']*)["']/i);
        console.log('Body classes:', bodyClassMatch ? bodyClassMatch[1] : 'not found');
        
        const mainMatch = data.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
        if (mainMatch) {
            console.log('Main content length:', mainMatch[0].length);
            console.log('Main content snippet:', mainMatch[0].substring(0, 500));
        }

        const imgs = data.match(/<img[^>]+>/gi) || [];
        console.log('Found images:');
        imgs.forEach(img => {
            if (img.includes('about') || img.includes('WhatsApp') || img.includes('logo') || img.includes('media') || img.includes('uploads')) {
                console.log('  -', img);
            }
        });
    });
});
