const https = require('https');

https.get('https://www.nesports3.com/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const cards = data.match(/<a[^>]+class="[^"]*hb-color-card[^"]*"[\s\S]*?<\/a>/gi) || [];
    console.log('Total hb-color-card count:', cards.length);
    cards.forEach((c, idx) => {
      const colorMatch = c.match(/data-color="([^"]+)"/i);
      const titleMatch = c.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
      const imgs = (c.match(/src="([^"]+)"/gi) || []).map(s => s.replace('src="', '').replace('"', '').split('/').pop());
      console.log(`${idx+1}. [${colorMatch ? colorMatch[1] : '?'}] ${titleMatch ? titleMatch[1].trim() : 'No title'} =>`, imgs);
    });
  });
}).on('error', err => console.error(err));
