const https = require('https');

https.get('https://www.nesports3.com/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const colorSectionIdx = data.indexOf('Shop by Color');
    if (colorSectionIdx !== -1) {
      const chunk = data.substring(colorSectionIdx, colorSectionIdx + 12000);
      console.log('Chunk length:', chunk.length);
      // Let's see article tags or items inside this chunk
      const articles = chunk.match(/<article[\s\S]*?<\/article>/gi) || [];
      console.log('Article count in color section:', articles.length);
      articles.forEach((a, i) => {
        const titleMatch = a.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
        const dataColor = a.match(/data-color="([^"]+)"/i);
        const imgs = (a.match(/src="([^"]+)"/gi) || []).map(s => s.replace('src="', '').replace('"', ''));
        console.log(`Product ${i+1}:`, titleMatch ? titleMatch[1].trim() : 'Unknown', '| Color:', dataColor ? dataColor[1] : 'none', '| Imgs:', imgs.length, imgs);
      });
    }
  });
}).on('error', err => console.error(err));
