async function check() {
  const res = await fetch('https://hardbody.store/');
  const html = await res.text();
  const m = html.match(/(?:\/|https:)?\/\/cdn\.shopify\.com\/[^"'\s?]+/gi) || [];
  const unique = [...new Set(m)];
  console.log('Total Shopify images found:', unique.length);
  unique.slice(0, 15).forEach(u => console.log(u));
}
check();
