(async () => {
    const res = await fetch('https://www.nesports3.com/?nocache=' + Date.now());
    const html = await res.text();
    const m = html.match(/class="[^"]*hb-collections[^"]*"[\s\S]*?<\/section>/);
    if (m) {
        console.log("MATCHED SECTION:");
        console.log(m[0].substring(0, 1000));
    } else {
        console.log("Looking for categories or top seller:");
        const idx = html.indexOf("Top Seller");
        if (idx !== -1) {
            console.log(html.substring(idx - 100, idx + 800));
        } else {
            console.log("Neither found!");
        }
    }
})();
