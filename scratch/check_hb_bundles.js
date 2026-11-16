async function checkHB() {
  const res = await fetch('https://hardbody.store/');
  const html = await res.text();
  // Find cards in Power Stacks or Top Sellers
  const cardMatches = html.match(/<div[^>]*class="[^"]*card[^"]*"[\s\S]*?<\/div>/g) || [];
  console.log('Card matches:', cardMatches.length);
  // Find image URLs
  const imgMatches = html.match(/https:\/\/cdn\.shopify\.com\/s\/files\/[^"'\s]+/g) || [];
  const unique = [...new Set(imgMatches)].filter(u => u.includes('/products/'));
  console.log('Sample product images from Hardbody:');
  unique.slice(0, 10).forEach(u => console.log(u));
}
checkHB();
