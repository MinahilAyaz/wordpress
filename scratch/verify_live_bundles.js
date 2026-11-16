async function checkLive() {
  const homeRes = await fetch('https://www.nesports3.com/');
  const html = await homeRes.text();

  const bMatch = html.match(/<section[^>]*id="bundles"[\s\S]*?<\/section>/);
  if (!bMatch) {
    console.log('Bundles section not found!');
    return;
  }
  const bHtml = bMatch[0];
  console.log('=== LIVE BUNDLES VERIFICATION ===');
  console.log('1. Has SAVE 15% text:', bHtml.includes('SAVE 15%'));
  console.log('2. Has hb-bundle-badge:', bHtml.includes('hb-bundle-badge'));
  console.log('3. Has Add to cart:', bHtml.includes('Add to cart'));
  console.log('4. Has slider track:', bHtml.includes('hb-card-slider-track'));
  console.log('5. Has dots wrap:', bHtml.includes('hb-card-dots-wrap'));
  console.log('6. Has bundle-1-1.jpg:', bHtml.includes('bundles/bundle-1-1.jpg'));
  console.log('7. Has bundle-1-2.jpg:', bHtml.includes('bundles/bundle-1-2.jpg'));
  console.log('8. Has bundle-1-3.jpg:', bHtml.includes('bundles/bundle-1-3.jpg'));
  console.log('9. Has old broken hb-pair-a:', bHtml.includes('hb-pair-a'));

  // Test fetching one image
  const imgRes = await fetch('https://www.nesports3.com/wp-content/plugins/nesports-pro/assets/images/bundles/bundle-1-1.jpg');
  console.log('10. Live bundle-1-1.jpg HTTP status:', imgRes.status, 'size:', imgRes.headers.get('content-length'));
}
checkLive();
