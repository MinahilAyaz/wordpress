async function analyze() {
  const res = await fetch('https://hardbody.store/', { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  
  // Find headings
  const headings = html.match(/<(?:h1|h2|h3|h4)[^>]*>([\s\S]*?)<\/(?:h1|h2|h3|h4)>/gi) || [];
  console.log('Headings found:');
  headings.forEach(h => {
    const text = h.replace(/<[^>]+>/g, '').trim();
    if (text.length > 0 && text.length < 80) console.log('  -', text);
  });

  // Find bundle product titles and images
  const bundleMatches = html.match(/class="[^"]*product[^"]*"[\s\S]*?<\/div>/gi) || [];
  console.log('Product elements:', bundleMatches.length);
  
  // Look for bundle images specifically
  const imgMatches = html.match(/https:\/\/[^"'\s]+(?:bundle|pack)[^"'\s]*\.(?:jpg|png|webp)/gi) || [];
  console.log('Bundle image URLs sample:', imgMatches.slice(0, 10));
}
analyze();
