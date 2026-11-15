(async () => {
    const res = await fetch('https://www.nesports3.com');
    const data = await res.text();
    const match = data.match(/<div class="hb-card-slider-track">[\s\S]*?<\/div>\s*<\/div>/);
    if (match) {
        console.log(match[0]);
    }
})();
