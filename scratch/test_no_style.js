async function test() {
  const homeRes = await fetch('https://www.nesports3.com/');
  const html = await homeRes.text();
  const bMatch = html.match(/<section[^>]*id="bundles"[\s\S]*?<\/section>/);
  const bHtml = bMatch[0];
  const noStyle = bHtml.replace(/<style[\s\S]*?<\/style>/, '');
  console.log('In DOM outside style:');
  console.log('Has hb-bundle-badge span:', noStyle.includes('hb-bundle-badge'));
  console.log('Has Add to cart button/text:', noStyle.includes('Add to cart'));
  console.log('Has quick-add:', noStyle.includes('quick-add'));
}
test();
