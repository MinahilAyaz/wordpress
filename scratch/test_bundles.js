async function test() {
  const res = await fetch('https://www.nesports3.com/');
  const html = await res.text();
  const bMatch = html.match(/<section[^>]*id="bundles"[\s\S]*?<\/section>/);
  if (bMatch) {
    console.log('Inside Bundles section:');
    console.log('Has hb-card-quick-add:', bMatch[0].includes('hb-card-quick-add'));
    console.log('Has Add to cart text:', bMatch[0].includes('Add to cart'));
    console.log('Has hb-card-slider-track:', bMatch[0].includes('hb-card-slider-track'));
    console.log('Has hb-card-dots-wrap:', bMatch[0].includes('hb-card-dots-wrap'));
    // Count how many cards
    const cards = bMatch[0].match(/<article class="hb-card"/g);
    console.log('Total cards in bundles:', cards ? cards.length : 0);
  }
}
test();
