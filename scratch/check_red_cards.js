(async () => {
    const res = await fetch('https://www.nesports3.com/');
    const html = await res.text();
    
    // Find cards with data-color="red"
    const regex = /<a class="hb-color-card [^"]*" data-color="red"[\s\S]*?<\/a>/g;
    const matches = html.match(regex);
    if (matches) {
        matches.forEach((m, i) => {
            console.log(`\n--- RED CARD ${i + 1} ---`);
            const imgs = m.match(/src="([^"]+)"/g);
            console.log(imgs);
        });
    } else {
        console.log('No red cards found');
    }
})();
