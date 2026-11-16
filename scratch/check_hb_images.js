async function check() {
  const res = await fetch('https://hardbody.store/');
  const html = await res.text();
  const m = html.match(/https:\/\/[^"'\s]+\.(?:jpg|webp|png|jpeg)/gi) || [];
  const unique = [...new Set(m)];
  console.log('Total images found on Hardbody:', unique.length);
  unique.slice(0, 25).forEach(u => console.log(u));
}
check();
