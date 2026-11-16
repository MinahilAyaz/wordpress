const https = require('https');

https.get('https://www.nesports3.com/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('=== LOGOS ===');
    const headerLogo = data.match(/<a[^>]+class="[^"]*hb-logo[^"]*"[^>]*>[\s\S]*?<\/a>/i);
    console.log('Header logo:', headerLogo ? headerLogo[0] : 'Not found');
    const footerLogo = data.match(/<div[^>]+class="[^"]*hb-footer-logo[^"]*"[^>]*>[\s\S]*?<\/div>/i);
    console.log('Footer logo:', footerLogo ? footerLogo[0] : 'Not found');

    console.log('\n=== CLOTHING SECTION ===');
    const clothingMatch = data.match(/<section[^>]+class="[^"]*hb-clothing[^"]*"[^>]*>[\s\S]*?<\/section>/i);
    if (clothingMatch) {
      console.log('Clothing section cards:');
      const cards = clothingMatch[0].match(/<a[^>]+class="[^"]*hb-clothing-card[^"]*"[\s\S]*?<\/a>/gi) || [];
      cards.forEach((c, i) => console.log(`Card ${i+1}:`, c.substring(0, 250).replace(/\s+/g, ' ')));
    } else {
      console.log('hb-clothing section not matched as section tag, searching div...');
      const clothingDiv = data.match(/<div[^>]+class="[^"]*hb-clothing-track[^"]*"[\s\S]*?<\/div>\s*<\/div>/i);
      console.log('Clothing track:', clothingDiv ? clothingDiv[0].substring(0, 500) : 'Not found');
    }

    console.log('\n=== SHOP BY COLOR RED TAB ===');
    // Find RED category products
    const redProducts = data.match(/data-color="red"[\s\S]*?<\/div>\s*<\/div>/i);
    // Or let's see how colors are rendered
    const colorItems = data.match(/<article[^>]+class="[^"]*hb-color-card[^"]*"[^>]*data-color="red"[\s\S]*?<\/article>/gi) || [];
    console.log('RED cards count:', colorItems.length);
    colorItems.forEach((item, idx) => {
      const title = item.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
      const imgs = item.match(/src="([^"]+)"/gi);
      console.log(`RED Item ${idx+1}:`, title ? title[1].trim() : 'No title', imgs);
    });

    console.log('\n=== BUNDLES SECTION ===');
    const bundleItems = data.match(/<article[^>]+class="[^"]*hb-card[^"]*"[^>]*data-cat="[^"]*"[\s\S]*?<\/article>/gi) || [];
    console.log('Bundle cards count:', bundleItems.length);
    bundleItems.slice(0, 3).forEach((item, idx) => {
      const title = item.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
      const imgs = item.match(/src="([^"]+)"/gi);
      console.log(`Bundle ${idx+1}:`, title ? title[1].trim() : 'No title', imgs);
    });
  });
}).on('error', err => console.error(err));
