(async () => {
    const res = await fetch('https://www.nesports3.com/product-category/elbow-wrap/?nocache=' + Date.now());
    const html = await res.text();
    const imgs = [...html.matchAll(/<img[^>]*src="([^"]*assets\/images\/[^"]+)"/g)].map(m => m[1]);
    console.log("Images on elbow-wrap page:", imgs);
})();
