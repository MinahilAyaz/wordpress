const fetch = globalThis.fetch;

(async () => {
  const hSvg = await fetch('https://www.nesports3.com/wp-content/plugins/nesports-pro/assets/images/logo-1.svg?v=' + Date.now());
  const hPng = await fetch('https://www.nesports3.com/wp-content/plugins/nesports-pro/assets/images/logo-1.png?v=' + Date.now());
  const fSvg = await fetch('https://www.nesports3.com/wp-content/plugins/nesports-pro/assets/images/footer-logo.svg?v=' + Date.now());
  const fPng = await fetch('https://www.nesports3.com/wp-content/plugins/nesports-pro/assets/images/footer-logo.png?v=' + Date.now());

  console.log('Header logo SVG status:', hSvg.status, 'size:', (await hSvg.text()).length);
  console.log('Header logo PNG status:', hPng.status, 'size:', (await hPng.arrayBuffer()).byteLength);
  console.log('Footer logo SVG status:', fSvg.status, 'size:', (await fSvg.text()).length);
  console.log('Footer logo PNG status:', fPng.status, 'size:', (await fPng.arrayBuffer()).byteLength);
})();
