async function main() {
  const r = await fetch('https://www.nesports3.com/our-story/');
  const html = await r.text();
  const re = /<img[^>]+src=["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(html)) !== null) console.log(m[1]);
}
main();
