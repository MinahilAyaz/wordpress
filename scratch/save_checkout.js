const fs = require('fs');

(async () => {
    const res = await fetch('https://www.nesports3.com/checkout/');
    const html = await res.text();
    fs.writeFileSync('scratch/checkout_page.html', html, 'utf8');
    console.log('Saved checkout_page.html, size:', html.length);
})();
