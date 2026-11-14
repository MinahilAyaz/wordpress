const https = require('https');

function get(url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        });
    });
}

async function verify() {
    const homeHtml = await get('https://www.nesports3.com/?nocache=' + Date.now());
    console.log('--- Home Page Check ---');
    console.log('Has RED EDITION:', homeHtml.includes('RED EDITION'));
    console.log('Has Shop-The-Look (model):', homeHtml.includes('Shop-The-Look'));
    console.log('Has link to product:', homeHtml.includes('/product/strength-club-oversized-t-shirt/'));

    const catHtml = await get('https://www.nesports3.com/product-category/clothing/?nocache=' + Date.now());
    console.log('--- Category Page Check ---');
    console.log('Has No products found:', catHtml.includes('No products found'));
    console.log('Has Strength Club Oversized:', catHtml.includes('Strength Club Oversized'));
    console.log('Has Lift The World:', catHtml.includes('Lift The World Signature'));
    console.log('Has Anime Heavyweight:', catHtml.includes('Anime Heavyweight'));
    console.log('Has CLOTHING pill:', catHtml.includes('>CLOTHING<'));
}

verify();
