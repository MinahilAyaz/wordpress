const fetch = globalThis.fetch;

(async () => {
  const res = await fetch('https://www.nesports3.com/?nocache=' + Date.now());
  const html = await res.text();
  let idx = 0;
  while ((idx = html.indexOf('hb-auth-icon-trigger', idx)) !== -1) {
    console.log('Match at', idx, ':\n', html.substring(Math.max(0, idx - 80), idx + 120));
    idx += 'hb-auth-icon-trigger'.length;
  }
})();
