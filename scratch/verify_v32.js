(async () => {
    const res = await fetch('https://www.nesports3.com/?cache_bust=' + Date.now());
    const html = await res.text();
    console.log('HTTP status:', res.status);
    console.log('Contains hb-header--fixed:', html.includes('hb-header--fixed'));
    console.log('Contains hb-logo-letters:', html.includes('hb-logo-letters'));
    console.log('Contains hb-logo-red:', html.includes('hb-logo-red'));
    console.log('Contains fill="#FFFFFF":', html.includes('fill="#FFFFFF"'));
    console.log('Contains fill="#F00012":', html.includes('fill="#F00012"'));
    
    // Check asset fetch
    const svgRes = await fetch('https://www.nesports3.com/wp-content/plugins/nesports-pro/assets/images/header-logo.svg');
    console.log('header-logo.svg HTTP status:', svgRes.status, 'size:', (await svgRes.text()).length);

    const cssRes = await fetch('https://www.nesports3.com/wp-content/plugins/nesports-pro/assets/css/nesports-frontend.css');
    const cssText = await cssRes.text();
    console.log('CSS contains TRANSPARENT FIXED HEADER ARCHITECTURE (V32):', cssText.includes('TRANSPARENT FIXED HEADER ARCHITECTURE (V32)'));

    const jsRes = await fetch('https://www.nesports3.com/wp-content/plugins/nesports-pro/assets/js/nesports-frontend.js');
    const jsText = await jsRes.text();
    console.log('JS contains Transparent Fixed Header on Scroll (V32):', jsText.includes('Transparent Fixed Header on Scroll (V32)'));
})();
