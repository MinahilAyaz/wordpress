(async () => {
    const SITE = 'https://www.nesports3.com';
    const res = await fetch(SITE + '/?nocache=' + Date.now());
    const html = await res.text();
    const idx = html.indexOf('class="hb-clothing-track"');
    if (idx !== -1) {
        console.log(html.substring(idx, idx + 2000));
    }
})();
