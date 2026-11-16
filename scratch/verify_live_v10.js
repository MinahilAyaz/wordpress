async function verify() {
  const homeRes = await fetch('https://www.nesports3.com/');
  const html = await homeRes.text();

  console.log('--- Clothing Checks ---');
  console.log('Has hb-clothing-carousel-controls:', html.includes('hb-clothing-carousel-controls'));
  console.log('Has hb-clothing-prev:', html.includes('hb-clothing-prev'));
  console.log('Has hb-clothing-next:', html.includes('hb-clothing-next'));

  console.log('\n--- Bundles Checks ---');
  console.log('Bundles section present:', html.includes('hb-bundles-section'));
  console.log('Bundles has slider track:', html.includes('hb-bundles-section') && html.includes('hb-card-slider-track'));
  console.log('Bundles has dots wrap:', html.includes('hb-bundles-section') && html.includes('hb-card-dots-wrap'));
  console.log('Bundles has Add to cart button:', html.includes('hb-card-quick-add'));

  console.log('\n--- Image Checks ---');
  const imgRes = await fetch('https://www.nesports3.com/wp-content/plugins/nesports-pro/assets/images/clothing/cat-strength-club.jpg');
  console.log('cat-strength-club.jpg status:', imgRes.status, 'size:', imgRes.headers.get('content-length'));
}
verify();
