const https = require('https');

https.get('https://www.nesports3.com/', (res) => {
    let html = '';
    res.on('data', chunk => html += chunk);
    res.on('end', () => {
        const cIdx = html.indexOf('id="collections"');
        const bIdx = html.indexOf('id="bundles"');
        const colHtml = html.substring(cIdx, bIdx);

        console.log('Collections HTML found, length:', colHtml.length);
        
        const categories = [
            'LEVER BELTS',
            'LIFTING STRAPS',
            'KNEE WRAPS',
            'WRIST WRAPS',
            'ELBOW WRAPS',
            'DIP BELTS',
            'GYM BAGS',
            'SPEED BALLS',
            'BARBELL PADS',
            'ANKLE STRAPS',
            'OVERSIZED TEES',
            'HOODIES'
        ];
        
        categories.forEach(cat => {
            const hasCat = colHtml.includes(cat);
            console.log(cat, hasCat ? 'FOUND' : 'NOT FOUND');
        });

        const images = [
            '1-800x800.jpg',
            'Knee-Wrap-800x800.jpg',
            'speed-ball-red-1.jpg',
            'Dip-Belt-800x800.jpg',
            'Ankle-Strap-Cable-pull-scaled.jpg',
            'clothing/Lift-The-World-T-Shirt-Black-1.jpg',
            'clothing/hoodie-kaizen-anime-front.jpg'
        ];

        images.forEach(img => {
            const hasImg = colHtml.includes(img) || colHtml.includes(encodeURIComponent(img));
            console.log(img, hasImg ? 'IMAGE PRESENT' : 'IMAGE MISSING');
        });
        
        const hasHeroModelStraps = colHtml.includes('hero-slide-lifting-straps.jpg');
        const hasHeroModelKnee = colHtml.includes('hero-slide-knee-wraps.jpg');
        const hasHeroModelSpeed = colHtml.includes('hero-slide-speed-ball.jpg');
        console.log('Old duplicate gym model images completely removed:', {
            hasHeroModelStraps,
            hasHeroModelKnee,
            hasHeroModelSpeed
        });
    });
});
