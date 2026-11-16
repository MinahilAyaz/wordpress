(async () => {
    const res = await fetch('https://www.nesports3.com/?cache_bust=' + Date.now());
    const html = await res.text();
    console.log('HTTP status:', res.status);
    console.log('Contains hb-header--static:', html.includes('hb-header--static'));
    console.log('Contains NESPORTS3 Sports Logo:', html.includes('NESPORTS3 Sports Logo'));
    console.log('Contains fill="#F00012":', html.includes('fill="#F00012"'));
    console.log('Contains fill="#080808":', html.includes('fill="#080808"'));
    console.log('Contains viewBox="0 0 2048 682":', html.includes('viewBox="0 0 2048 682"'));
    
    // Check asset fetch
    const svgRes = await fetch('https://www.nesports3.com/wp-content/plugins/nesports-pro/assets/images/header-logo.svg');
    console.log('header-logo.svg HTTP status:', svgRes.status, 'size:', (await svgRes.text()).length);
})();
