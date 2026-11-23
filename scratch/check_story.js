async function check() {
  const r = await fetch('https://www.nesports3.com/our-story/?v=' + Date.now());
  const html = await r.text();
  console.log('HTML length:', html.length);
  const idx = html.indexOf('hb-about-feature-img');
  console.log('hb-about-feature-img index:', idx);
  if (idx !== -1) {
    console.log(html.substring(idx - 100, idx + 200));
  }
}
check();
