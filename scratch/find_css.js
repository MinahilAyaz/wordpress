(async () => {
    const res = await fetch('https://www.nesports3.com/?nocache=' + Date.now());
    const html = await res.text();
    const idx = html.indexOf('nesports-frontend.css');
    console.log("Index of nesports-frontend.css:", idx);
    if (idx !== -1) {
        console.log(html.substring(idx - 50, idx + 100));
    }
})();
