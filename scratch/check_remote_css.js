(async () => {
    const url = 'https://www.nesports3.com/wp-content/plugins/nesports-pro/assets/css/nesports-frontend.css?ver=1.0.11';
    const res = await fetch(url);
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Length:", text.length);
    console.log("Contains hb-category-track:", text.includes('hb-category-track'));
    console.log("Contains hb-top-sellers-section:", text.includes('hb-top-sellers-section'));
    console.log("Contains Top Sellers Carousel:", text.includes('TOP SELLERS CAROUSEL'));
})();
