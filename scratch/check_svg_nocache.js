(async () => {
    const res = await fetch('https://www.nesports3.com/wp-content/plugins/nesports-pro/assets/images/header-logo.svg?nocache=' + Date.now());
    const text = await res.text();
    console.log('header-logo.svg fresh status:', res.status, 'size:', text.length);
    console.log('contains hb-logo-letters:', text.includes('hb-logo-letters'));
})();
