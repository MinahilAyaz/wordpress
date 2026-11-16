const SITE = 'https://www.nesports3.com';

fetch(SITE).then(r => r.text()).then(html => {
  const cards = html.match(/<a class="hb-clothing-card"[\s\S]*?<\/a>/g);
  console.log('Total clothing cards on live:', cards ? cards.length : 0);
  if (cards) {
    cards.forEach((c, i) => {
      const primary = c.match(/hb-img-primary"[^>]*src="([^"]+)"/);
      const hover = c.match(/hb-img-hover"[^>]*src="([^"]+)"/);
      const label = c.match(/hb-clothing-card-label">\s*([^<&]+)/);
      console.log(`Card ${i+1} [${label ? label[1].trim() : ''}]: Primary=${primary ? primary[1].split('/').pop() : ''} | Hover=${hover ? hover[1].split('/').pop() : ''}`);
    });
  }
});
