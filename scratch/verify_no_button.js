const fetch = globalThis.fetch;

(async () => {
  const res = await fetch('https://www.nesports3.com/?nocache=' + Date.now());
  const html = await res.text();
  console.log('Contains <button id="hb-auth-icon-trigger":', html.includes('id="hb-auth-icon-trigger"'));
  console.log('Contains <aside class="hb-side-drawer":', html.includes('<aside class="hb-side-drawer"'));
  console.log('Contains <aside id="hb-side-drawer":', html.includes('id="hb-side-drawer"'));
  console.log('Contains fa-regular fa-user in header:', html.includes('fa-regular fa-user'));
})();
