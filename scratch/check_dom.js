async function check() {
  const homeRes = await fetch('https://www.nesports3.com/');
  const html = await homeRes.text();
  console.log('Has id hb-clothing-prev:', html.includes('id="hb-clothing-prev"'));
  console.log('Has id hb-clothing-next:', html.includes('id="hb-clothing-next"'));
  console.log('Has class hb-clothing-carousel-controls div:', html.includes('<div class="hb-clothing-carousel-controls">'));
  
  // Look at Bundles HTML
  const bundlesMatch = html.match(/<section[^>]*id="bundles"[\s\S]*?<\/section>/);
  if (bundlesMatch) {
    const bHtml = bundlesMatch[0];
    console.log('Bundles section found!');
    console.log('Bundles has hb-card-slider-track:', bHtml.includes('hb-card-slider-track'));
    console.log('Bundles has hb-card-dots-wrap:', bHtml.includes('hb-card-dots-wrap'));
    console.log('Bundles has hb-card-quick-add:', bHtml.includes('hb-card-quick-add'));
  } else {
    console.log('Bundles section not matched');
  }
}
check();
