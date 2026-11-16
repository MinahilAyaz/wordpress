const https = require('https');

https.get('https://www.nesports3.com/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('HTML Length:', data.length);
    
    // Check logos in HTML
    const imgMatches = data.match(/<img[^>]+(logo|nesports)[^>]+>/gi) || [];
    console.log('Logo img tags:', imgMatches);

    // Check Clothing section
    const clothingSection = data.indexOf('Clothing');
    console.log('Clothing index:', clothingSection);
    if (clothingSection !== -1) {
      console.log('Clothing snippet:', data.substring(clothingSection, clothingSection + 1500));
    }

    // Check Bundles section
    const bundlesSection = data.indexOf('Bundles');
    console.log('Bundles index:', bundlesSection);
    if (bundlesSection !== -1) {
      console.log('Bundles snippet:', data.substring(bundlesSection, bundlesSection + 1500));
    }

    // Check Shop by Color section
    const colorSection = data.indexOf('Shop by Color');
    console.log('Shop by Color index:', colorSection);
    if (colorSection !== -1) {
      console.log('Shop by Color snippet:', data.substring(colorSection, colorSection + 1500));
    }
  });
}).on('error', err => console.error(err));
