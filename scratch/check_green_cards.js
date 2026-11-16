(async () => {
    const res = await fetch('https://www.nesports3.com/');
    const html = await res.text();
    
    // Find cards with data-color="green"
    const regex = /<a class="hb-color-card [^"]*" data-color="green"[\s\S]*?<\/a>/g;
    const matches = html.match(regex);
    if (matches) {
        matches.forEach((m, i) => {
            console.log(`\n--- GREEN CARD ${i + 1} ---`);
            const imgs = m.match(/src="([^"]+)"/g);
            console.log(imgs);
        });
    } else {
        console.log('No green cards found');
    }
})();
