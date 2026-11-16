async function run() {
  const res = await fetch('https://hardbody.store/', { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  const idx = html.indexOf('Hardbody Bundles');
  if (idx !== -1) {
    console.log(html.substring(idx - 500, idx + 4000));
  } else {
    console.log('Not found');
  }
}
run();
