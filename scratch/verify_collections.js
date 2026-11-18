const https = require('https');

https.get('https://www.nesports3.com/', (res) => {
    console.log('Status code:', res.statusCode);
    let html = '';
    res.on('data', chunk => html += chunk);
    res.on('end', () => {
        console.log('Total HTML length:', html.length);
        
        const colIdx = html.indexOf('id="collections"');
        const bunIdx = html.indexOf('id="bundles"');
        console.log('Index of #collections:', colIdx);
        console.log('Index of #bundles:', bunIdx);
        
        if (colIdx !== -1 && bunIdx !== -1 && colIdx < bunIdx) {
            console.log('VERIFICATION SUCCESS: #collections is placed right before #bundles!');
        } else {
            console.log('PLACEMENT ISSUE: colIdx=', colIdx, 'bunIdx=', bunIdx);
        }
        
        const hasHeader = html.includes('hb-collections-carousel-title');
        const hasPrev = html.includes('id="hb-collections-carousel-prev"');
        const hasNext = html.includes('id="hb-collections-carousel-next"');
        console.log('Has Collections Title & Controls:', { hasHeader, hasPrev, hasNext });

        const cards = html.match(/class="hb-collection-card"/g) || [];
        console.log('Collections cards count:', cards.length);

        const categoriesFound = [
            'LEVER BELTS',
            'LIFTING STRAPS',
            'KNEE WRAPS',
            'WRIST WRAPS',
            'ELBOW WRAPS',
            'GYM BAGS',
            'SPEED BALLS',
            'BARBELL PADS'
        ].filter(cat => html.includes(cat));
        console.log('Found categories in Collections:', categoriesFound);

        // Verify header and topbar still present
        const hasTopbar = html.includes('hb-topbar');
        const hasMainHeader = html.includes('hb-main-header');
        console.log('Header & Topbar intact:', { hasTopbar, hasMainHeader });
    });
}).on('error', (e) => {
    console.error('Error fetching site:', e);
});
