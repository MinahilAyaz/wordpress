async function run() {
  const res = await fetch('https://hardbody.store/', { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  const idx = html.indexOf('Hardbody Bundles');
  const endIdx = html.indexOf('Clothing', idx);
  const bundleSectionHtml = html.substring(idx, endIdx !== -1 ? endIdx : idx + 25000);
  
  // Find all images in this bundle section
  const imgs = [];
  const imgRegex = /<img[^>]+src="([^">]+)"[^>]*alt="([^">]*)"/gi;
  let m;
  while ((m = imgRegex.exec(bundleSectionHtml)) !== null) {
    imgs.push({ src: m[1], alt: m[2] });
  }
  console.log('Total bundle images:', imgs.length);
  imgs.forEach((img, i) => {
    console.log(i + ':', img.alt, '->', img.src.split('?')[0]);
  });
}
run();
