async function run() {
  const res = await fetch('https://www.nesports3.com/');
  const html = await res.text();
  const headerLogoMatch = html.match(/<a class="hb-logo"[^>]*>[\s\S]*?<\/a>/);
  console.log('Header logo element:\n', headerLogoMatch ? headerLogoMatch[0] : 'Not found');
  const footerLogoMatch = html.match(/<div class="hb-footer-logo">[\s\S]*?<\/div>/);
  console.log('Footer logo element:\n', footerLogoMatch ? footerLogoMatch[0] : 'Not found');
}
run();
